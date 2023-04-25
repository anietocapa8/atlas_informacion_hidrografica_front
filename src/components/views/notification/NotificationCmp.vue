<template>
    <div id="notiCmp">
        <b-container class="container-form notification-container">
            <!-- grupo de informacion de la notifiacion -->
            <b-row class="d-flex align-items-center"> 
                <b-col cols="12" md="3" :class="{'big-text': bigTextPage}">
                    <!-- {{notification.section}} -->
                    {{$t(`route.${notification.page.page}`)}}
                </b-col>
                <b-col cols="12" md="3" :class="{'big-text': bigTextAction}">
                    {{notification.action.action}}
                </b-col>
                <b-col cols="12" md="3" :class="{'big-text': bigTextType}">
                    {{notification.user.userType.value }}
                </b-col>
                <b-col cols="12" md="3"  class="text-right"
                    :class="{'accepted-color': notification.state.id ===  notificationStates.ACCEPTED, 
                            'reject-color': notification.state.id ===  notificationStates.REJECT, 
                            'open-color': notification.state.id ===  notificationStates.OPEN, 
                            'informative-color': notification.state.id ===  notificationStates.INFORMATIVE}"
                    >
                    {{notification.state.state}}
                </b-col>
            </b-row>
            <hr>
            <b-row>
                <b-col :class="{'d-flex justify-content-end': !isNotificationCreator}">
                    <div class="name-text" :class="{'owner': isNotificationCreator}">
                        {{notification.user.firstName}} {{notification.user.lastName}} 
                    </div>
                    
                    
                    <span class="date-style">{{ notification.date | moment("DD MMM YYYY-h:mm:ss a") }}</span>

                </b-col>
            </b-row>

            <b-row>
                <b-col>

                    <b-form-textarea :value="notification.inMessage" rows="3" plaintext no-resize>
                    </b-form-textarea>

                </b-col>
            </b-row>
            
            <b-row v-if="notification.closeMessage">
                <b-col cols="12" >
                    <hr>
                    <b-row>
                        <b-col class="name-text">
                            {{$t('notification.answerSection')}}:
                        </b-col>
                    </b-row>
                    <br>
                    <b-row>
                        <b-col :class="{'d-flex justify-content-end': !isNotificationCloser}">
                            <div class="name-text" v-if="notification.userClose" :class="{'owner': isNotificationCloser}">
                                {{notification.userClose.firstName}} {{notification.userClose.lastName}} 
                            </div>
                            <span class="date-style" v-if="notification.closeDate">
                                {{ notification.closeDate | moment("DD MMM YYYY-h:mm:ss a") }}
                            </span>
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col>
                            <b-form-textarea :value="notification.closeMessage" rows="3" plaintext no-resize>
                            </b-form-textarea>  
                        </b-col>
                    </b-row>
                </b-col>
            </b-row>

            <b-row>

                <b-col class="d-flex align-items-center" cols="6" md="2">
                    <span class="comment-link msg-text" @click="redirectOrigin">
                        <i class="fas fa-eye"></i>
                        {{$t('notification.view')}}
                    </span>
                    
                </b-col>
                <!-- checkbox de leido  -->
                <b-col class="d-flex align-items-center justify-content-end" cols="6" md="5">
                    <b-form-checkbox 
                        v-if="notification.state.id !== notificationStates.OPEN && 
                            notification.state.id !== notificationStates.PROCESS && !isAdmin"
                        v-model="notification.isRead"
                        @click.native.prevent = "clickRead"
                        :value="true" 
                        :unchecked-value="false">
                        {{$t('notification.checkAsRead')}}
                    </b-form-checkbox>

                    <b-form-checkbox 
                        v-if="notification.state.id !== notificationStates.OPEN && 
                            notification.state.id !== notificationStates.PROCESS && isAdmin"
                        disabled
                        v-model="notification.isRead"
                        value="true" 
                        unchecked-value="false">
                        {{$t('notification.read')}}
                    </b-form-checkbox>
                    
                    <b-form-checkbox 
                        v-if="isAdmin && notification.state.id ===  notificationStates.INFORMATIVE 
                            && (notification.receptor && (notification.receptor.id == 1 || notification.receptor.id === currentUser.id))"
                        @click.native.prevent = "closeAndAccept"
                        v-model="closeAcceptValue">
                        {{$t('notification.acceptAndClose')}}
                    </b-form-checkbox>
                </b-col>
                <!-- buttons Options -->
                <b-col class="text-right" cols="12" md="5">
                    <b-badge pill variant="danger" v-if="notification.numOfProcess > 0">
                        {{notification.numOfProcess}}
                    </b-badge>

                    <sipsder-btn btnType="generate_process" @onClick="openModalProcess"
                        v-if="(isAdmin && showProcessBtn) || (!isAdmin && notification.numOfProcess > 0)">
                    </sipsder-btn>

                    <sipsder-btn btnType="closeContent" class="btn-margin-left"
                        @onClick="openModal"
                        v-if="(notification.state.id === notificationStates.OPEN 
                                || notification.state.id === notificationStates.PROCESS) 
                                && isAdmin">
                    </sipsder-btn>

                </b-col>
            </b-row>

        </b-container>

        <b-modal :ref="'notification' + notification.id" hideFooter :title="$t('notification.modalTitle')" v-if="isAdmin">
             <b-form @submit.prevent="closeNotification">
                 <b-row>
                     <b-col>
                         {{$t('notification.closeMsg')}}
                     </b-col>
                 </b-row>
                 <b-row>
                     <b-col>
                         <!-- Select -->
                          <b-form-group :label-cols="4"
                                label-class="font-weight-bold"
                                label="Estado"
                                :invalid-feedback="$t('util.obligatoryField')"
                                :state="fieldSelected"
                        >
                            <b-form-select :options="$t('notification.stateCloseOptions')" 
                                            v-model="closeParam.state" v-validate="{required:true}">
                                <option :value="null" disabled>{{$t('notification.selectMsg')}}</option>
                            </b-form-select>

                        </b-form-group>
                     </b-col>
                 </b-row>
                 <b-row>
                     <b-col>
                        <b-form-group
                            :invalid-feedback="errors.first('justificacion')"
                            :state="validateState(`justificacion`)"
                        >
                            <b-form-textarea 
                                            name="justificacion"
                                            :placeholder="$t('notification.placeholderModal')"
                                            :rows="3"
                                            v-model="closeParam.closeMessage"
                                            :max-rows="6"
                                            required
                                            v-validate="{required:true, max:250}"
                                            >
                            </b-form-textarea>
                        </b-form-group>
                     </b-col>
                 </b-row>
                 
                 <b-row>
                     <b-col class="d-flex justify-content-center">
                        <!-- Botones -->
                        <sipsder-btn btnType="cancel" @onClick="closeModal"></sipsder-btn>
                        <sipsder-btn btnType="closeContent" 
                            :text="$t('notification.modalTitle')"
                            type="submit"
                        ></sipsder-btn>
                     </b-col>
                 </b-row>
             </b-form>
        </b-modal>

        <b-modal v-if="notification.id" :ref="'notificationProcess' + notification.id" hideFooter :title="$t('notification.process')" size="lg">
            <b-form>
                <b-row>
                    <b-col v-if="isAdmin">
                        <b-row>
                            <b-col cols="12">
                                {{$t('notification.processModalTextAdmin')}}
                            </b-col>
                        </b-row>
                    </b-col>
                    <b-col v-else>
                        {{$t('notification.processModalText')}}
                    </b-col>
                </b-row>
                <br>
                <b-row>
                    <b-col v-if="process.length > 0">
                        <b-table responsive :fields="fieldsTable" :items="process" size="lg" class="fix-table">
                            <template slot="requestDate" slot-scope="data">

                                <div  class="d-flex justify-content-center">                                
                                    {{customDate(data.item.requestDate)}}
                                </div>

                            </template>
                            
                            <template slot="url" slot-scope="data">

                                <div  class="d-flex justify-content-center">
                                    <a :href="getLink(data.item.url)" target="_blank">
                                        {{data.item.description}}
                                    </a>
                                </div>

                            </template>

                            <template slot="processState" slot-scope="data">

                                <div  class="d-flex justify-content-center">
                                    {{data.item.processState.state}}
                                </div>

                            </template>
                        </b-table>
                    </b-col>
                    <b-col v-else>
                        {{$t('notification.emptyProcess')}}
                    </b-col>
                </b-row>
                <b-row>
                    <b-col class="d-flex justify-content-end">
                            
                        <sipsder-btn btnType="add" :text="$t('notification.addProcess')" 
                            v-if="isAdmin && (this.notification.state.id !== this.notificationStates.ACCEPTED && this.notification.state.id !== this.notificationStates.REJECT)" @onClick="redirect">
                        </sipsder-btn>
                        
                        <sipsder-btn btnType="cancel" :text="$t('notification.closeModal')" 
                            @onClick="closeModalProcess">
                        </sipsder-btn>

                    </b-col>
                </b-row>
            </b-form>
        </b-modal>

    </div>
</template>

<script>
import moment from 'moment'
import VAPI from "../../../http_common";
import { SERVICE_NAMES, HTTP_STATUS, NOTIFICATION_STATES } from '../../../sipsder_constants';
import {PERMISSIONS_TYPES} from "../../../domain_constants";

export default {
    props: {
        notification: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            closeParam: {
                closeMessage : "",
                state : null
            },
            fieldSelected : true,
            fieldsTable : [
                {
                    key: 'functionary',
                    label: this.$t('notification.tableTitles.functionary'),
                    sortable: true,
                },
                {
                    key: 'reference',
                    label: this.$t('notification.tableTitles.reference'),
                    sortable: true,
                },
                {
                    key: 'requestDate',
                    label: this.$t('notification.tableTitles.date'),
                    sortable: true,
                },
                {
                    key: 'url',
                    label: this.$t('notification.tableTitles.url'),
                    sortable: true,
                },
                {
                    key: 'processState',
                    label: this.$t('notification.tableTitles.state'),
                    sortable: true,
                }                
            ],
            closeAcceptValue : false,
            process: [],
            notificationStates : NOTIFICATION_STATES,
        }
    },
    computed: {
        bigTextPage () {
            return this.notification.page.page.length > 15;
        },
        bigTextAction () {
            return this.notification.action.action > 15;
        },
        bigTextType () {
            return this.notification.user.userType.value > 15;
        },
        state() {
            return closeParam.state != null;
        },
        isAdmin() {
            // console.info("Usuario actual: ", this.$store.getters.getCurrentUser)
            return this.$store.getters.hasPermission(PERMISSIONS_TYPES.ADMIN);
        },
        currentUser() {
            return this.$store.getters.getCurrentUser;
        },
        showProcessBtn () {
            return this.notification.numOfProcess > 0 || (this.notification.state.id !== this.notificationStates.ACCEPTED && this.notification.state.id !== this.notificationStates.REJECT);
        },
        isNotificationCreator() {
            return this.currentUser.id === this.notification.user.id;
        },
        isNotificationCloser() {
            return (this.notification.userClose &&  this.notification.userClose.id == this.currentUser.id);
        }
    },
    methods: {
        openModal() {
            this.$refs['notification' + this.notification.id].show();
        },
        closeModal() {
            this.$refs['notification' + this.notification.id].hide();
        },
        openModalProcess() {
            this.loadProcess();
            this.$refs['notificationProcess' + this.notification.id].show();
        },
        closeModalProcess() {
            this.$refs['notificationProcess' + this.notification.id].hide();
        },
        doCloseQuery(param) {
            var path = `/${SERVICE_NAMES.NOTIFICATION}/${this.notification.id}`;
            VAPI.put(path, param).then( (response) => {
                this.$emit('onChange', response.data);
                this.notification.state = response.data.state;
                this.notification.closeMessage = response.data.closeMessage;
                this.notification.userClose = response.data.userClose;
                this.notification.closeDate = response.data.closeDate;

                this.closeAcceptValue = true;
                this.$refs['notification' + this.notification.id].hide();
                this.$store.dispatch('setNotificationEvent');
            }).catch( (error) => {  
                console.log("Error al editar Notificacion", error);
                this.closeAcceptValue = false;
                alert("La notificación no pudo ser Cerrada.");
            });
        },
        closeNotification() {

            let valid = this.validateState('justificacion');
            if (this.closeParam.state == null) {
                this.fieldSelected = false;
                valid = false;
            }

            if (!valid) {
                return;
            }
            
            this.fieldSelected = true;
            this.doCloseQuery(this.closeParam);
        },
        closeAndAccept() {
            this.closeAcceptValue = true;
            let param = {
                closeMessage : null,
                state : this.$t('notification.stateCloseOptions.accept').value
            };

            this.doCloseQuery(param);
        },
        validateState(name) {

            if (this.veeFields[name] && (this.veeFields[name].dirty || this.veeFields[name].validated)) {
                
                return !this.errors.has(name);
            }
            return null;
        },
        loadProcess() {

            let query = `/${SERVICE_NAMES.NOTIFICATION_PROCESS}?id=${this.notification.id}`;
            // let query = `/notification-process?id=${this.notification.id}`;
            
            VAPI.get( query ).then(response => {
                this.process = []

                if (response.status === HTTP_STATUS.OK) {
                    this.process = response.data;
                }

            }).catch( ex => {
                console.log("Error Servicio Cargar procesos", ex);
            });
        },
        redirect () {
            this.$router.push({
                name: 'NotificationProcess', 
                params:{ idNotification: this.notification.id.toString()}
            });
        },
        redirectOrigin() {
            this.$router.push({name: this.notification.page.alias, params: {id: this.notification.idComponente}});
        },
        customDate(date) {
            return moment(date).format('DD-MM-YYYY');
        },
        getLink(link){
            if(link.indexOf("http") !== -1){
                return link
            }
            return `https://${link}`
        },
        clickRead () {
            let state = this.notification.isRead;

            if (state == null) {
                state = false;
            }

            let param = {
                state : !state
            }

            var path = `/${SERVICE_NAMES.NOTIFICATION}/read/${this.notification.id}`;

            VAPI.put(path, param).then(response => {
                this.$emit('onChange', response.data);
                this.notification.isRead = response.data.isRead;
                this.$store.dispatch('setNotificationEvent');
            }).catch(error => {
                console.log("Error al modificar es leido.", error);
            });
        },
    }
}
</script>

<style lang="scss" scoped>
.notification-container {
    border: 3px solid rgb(135, 135, 224);
    border-radius: 12px;
}

.name-text {
    font-weight: 700;
    float: left;
    margin-right: 1rem;
    color: rgb(4, 124, 46);
}
.name-text.owner {
    color:rgb(0, 0, 156);
}

.date-style {
    color: #00F;
    padding-left: 2rem;
}

.text-right {
    text-align: right;
}

.accepted-color {
    color: rgb(42, 196, 67);
    font-weight: 700;
}

.reject-color {
    color: rgb(233, 39, 33);
    font-weight: 700;
}

.open-color {
    color: rgb(43, 190, 216);
    font-weight: 700;
}

.informative-color {
    color: #f95a09;
    font-weight: 700;
}

.big-text {
    font-size: 14px;
    word-break: break-all;
}

.comment-link {
    cursor: pointer;
    &:hover {
        color: rgb(9, 114, 156);
    }
}

.msg-text {
    font-size: 22px;
}

.btn-margin-left {
    margin-left: 2rem;
}

.fix-table {
    .table {
        border-bottom: 2px solid black;
    }
}
</style>