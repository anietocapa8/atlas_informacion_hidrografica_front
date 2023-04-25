<template>
    <div id="process">
        <b-container class="container-form">
            <b-row>
                <b-col>
                    <sipsder-title :title="$t('notificationProcess.title')"
                        :text="$t('notificationProcess.processTitleText')"
                        type="admin"
                    ></sipsder-title>
                </b-col>
            </b-row>

            <b-form >
                <b-row>
                    <b-col cols="12" md="4">
                        <b-form-group
                            label-class="font-weight-bold"
                            :label="$t('notificationProcess.inputsText.functionary') + ' ' + TEMPLATES.MANDATORY_SYMBOL"
                            :invalid-feedback="errors.first('funcionario')"
                        >
                            <b-input v-model.trim="processIn.functionary"
                                name="funcionario"
                                v-validate="{required: true, max:120}"
                                :state="validateField('funcionario')"
                                :data-vv-as="$t('notificationProcess.inputsText.functionary')"
                            >
                            </b-input>

                        </b-form-group>

                        <b-form-group
                            label-class="font-weight-bold"
                            :label="$t('notificationProcess.inputsText.description')+ ' ' + TEMPLATES.MANDATORY_SYMBOL"
                            :invalid-feedback="errors.first('descripcion')"
                        >
                            <b-input v-model.trim="processIn.description"
                                name="descripcion"
                                v-validate="{required: true, max:280}"
                                :state="validateField('descripcion')"
                                :data-vv-as="$t('notificationProcess.inputsText.description')"
                            >
                            </b-input>

                        </b-form-group>
                    </b-col>

                    <b-col cols="12" md="4">
                        <b-form-group
                            label-class="font-weight-bold"
                            :label="$t('notificationProcess.inputsText.reference') + ' ' + TEMPLATES.MANDATORY_SYMBOL"
                            :invalid-feedback="errors.first('referencia')"
                        >
                            <b-input v-model.trim="processIn.reference"
                                name="referencia"
                                v-validate="{required: true, max:60}"
                                :state="validateField('referencia')"
                                :data-vv-as="$t('notificationProcess.inputsText.reference')"
                            >
                            </b-input>

                        </b-form-group>

                        <b-form-group
                            label-class="font-weight-bold"
                            :label="$t('notificationProcess.inputsText.url') + ' ' + TEMPLATES.MANDATORY_SYMBOL"
                            :invalid-feedback="errors.first('url')"
                        >
                            <b-input v-model.trim="processIn.url"
                                name="url"
                                v-validate="{max:180, url: true}"
                                :state="validateField('url')"
                                :data-vv-as="$t('notificationProcess.inputsText.url')"
                            >
                            </b-input>

                        </b-form-group>
                    </b-col>

                    <b-col cols="12" md="4">
                        <b-form-group
                            label-class="font-weight-bold"
                            :label="$t('notificationProcess.inputsText.date') + ' ' + TEMPLATES.MANDATORY_SYMBOL"

                        >
                            <datepicker :placeholder="$t('util.insertDate') "  
                                        class="date-picker"
                                        :language = "languages[language]"
                                        :calendar-button = "true"
                                        calendar-button-icon = "fa fa-calendar"
                                        :clear-button = "true"
                                        v-model="processIn.requestDate"
                                        :disabledDates="disabledDates"
                                        >
                            </datepicker>

                        </b-form-group>

                        <b-form-group
                            label-class="font-weight-bold"
                            :label="$t('notificationProcess.inputsText.state') + ' ' + TEMPLATES.MANDATORY_SYMBOL"
>
                            <b-form-select :options="optionsStates" v-model="processIn.processState">
                                <option :value="null" disabled>{{$t('util.select_option')}}</option>
                            </b-form-select>

                        </b-form-group>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col>
                        <label v-html="$t('util.obligatoryFields').replace('*', TEMPLATES.MANDATORY_SYMBOL)"></label>
                    </b-col>
                </b-row>
                <!-- botones del form -->
                <b-row>
                    <b-col class="d-flex justify-content-end" v-if="editMode">
                        <sipsder-btn btnType="edit" @onClick="editProcess">
                        </sipsder-btn>

                        <sipsder-btn btnType="cancel" @onClick="changeAddMode">
                        </sipsder-btn>
                    </b-col>
                    <b-col class="d-flex justify-content-end" v-else>
                        <sipsder-btn btnType="add" :text="$t('notificationProcess.addProcess')"
                            @onClick="createProcess"
                        >
                        </sipsder-btn>

                        <sipsder-btn btnType="clean" @onClick="resetFields">
                        </sipsder-btn>
                    </b-col>
                </b-row>
            </b-form>
        
            <br>

            <b-row>
                <b-col v-if="process.length > 0">
                    <b-table responsive :fields="fieldsTable" :items="process" size="lg" >
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

                        <template slot="edit" slot-scope="data">

                            <div  class="d-flex justify-content-center edit-btn">
                                <sipsder-btn btnType="edit_pen" text="" @onClick="selectProcess(data.item.id)">
                                </sipsder-btn>
                                <!-- <a :href="data.item.url">{{data.item.description}}</a> -->
                            </div>

                        </template>
                    </b-table>
                </b-col>
                <b-col v-else>
                    {{$t('notificationProcess.emptyProcess')}}
                </b-col>
            </b-row>

            <!-- align-h="center" align-v="center" -->
            <b-row >
                <b-col class="d-flex justify-content-center">
                    <sipsder-btn btnType="back" @onClick="previousPage( )">
                    </sipsder-btn>
                </b-col>
            </b-row>
        </b-container>

        <b-modal ref="successModal"
                 :title="$t('notificationProcess.modalTitle')"
                 :hide-footer="true">

            {{$t('notificationProcess.modalSuccess')}}
            <br>
            <sipsder-btn :text="$t('util.accepted')"
                         @onClick="hideModal('successModal')"
                         btnType="accept"
            ></sipsder-btn>
        </b-modal>
        
        <b-modal ref="incompleteDataModal"
                 :title="$t('notificationProcess.errorData.modalTitle')"
                 :hide-footer="true">

            {{$t('notificationProcess.errorData.modalText')}}
            <br>
            <sipsder-btn :text="$t('util.accepted')"
                         @onClick="hideModal('incompleteDataModal')"
                         btnType="accept"
            ></sipsder-btn>
        </b-modal>

    </div>
</template>

<script>
import moment from 'moment'
import VAPI from "../../../http_common";
import { SERVICE_NAMES, HTTP_STATUS, TEMPLATES } from '../../../sipsder_constants';
import {PERMISSIONS_TYPES} from "../../../domain_constants";
import Datepicker from 'vuejs-datepicker';
import * as lang from "vuejs-datepicker/src/locale"; //importar locale

export default {
    name: "NotificationProcess",
    props: {
        idNotification : {
            type: String,
            required: true,
        }
    },
    data() {
        return {
            TEMPLATES: TEMPLATES,
            language: "es",
            languages: lang,
            editMode: false,
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
                },
                {
                    key: 'edit',
                    label: this.$t('notification.tableTitles.edit'),
                    // sortable: true,
                }                
            ],
            process: [],
            processIn: {
                functionary: null,
                reference: null,
                requestDate: null,
                description: null,
                url: null,
                processState: null,
                notificationId : null,
            },
            fieldsNames: [
                "funcionario",
                "descripcion",
                "referencia",
                "url",
            ],
            selectedProcess: null,
            optionsStates: [],
        }
    },
    created() {
        
        this.loadProcess();
        this.loadStates();
        this.processIn.notificationId = this.idNotification;
    },
    computed: {
        isAdmin() {
            return this.$store.getters.hasPermission(PERMISSIONS_TYPES.ADMIN);
        },
        disabledDates() {
            return { from: new Date() };
        }
    },
    methods : {
        showModal(modalRef) {
            this.$refs[modalRef].show();
        },
        hideModal(modalRef) {
            this.$refs[modalRef].hide();
        },
        loadProcess() {
            let query = `/${SERVICE_NAMES.NOTIFICATION_PROCESS}?id=${this.idNotification}`;
            
            VAPI.get( query ).then(response => {
                this.process = []
                if (response.status === HTTP_STATUS.OK) {
                    this.process = response.data;
                }
            }).catch( ex => {
                console.log("Error Servicio Cargar procesos", ex);
            });

        },
        createProcess() {
            let valid = true;

            this.fieldsNames.forEach(field => {
                valid &= this.validateField(field);
            });

            if (!this.processIn.requestDate) {
                valid = false;
            }
            if (!valid) {
                this.showModal("incompleteDataModal");
                return;
            }

            console.info ("Proceso a guardar", this.processIn);

            let query = `/${SERVICE_NAMES.NOTIFICATION_PROCESS}`;
            
            VAPI.post( query, this.processIn ).then(response => {
                this.process.push(response.data);
                this.resetFields();
            }).catch( ex => {
                console.log("Error Servicio Guardar procesos", ex);
            });
        },
        editProcess() {
            this.selectedProcess.functionary= this.processIn.functionary,
            this.selectedProcess.reference= this.processIn.reference;
            this.selectedProcess.requestDate= this.processIn.requestDate;
            this.selectedProcess.description= this.processIn.description;
            this.selectedProcess.url= this.processIn.url;
            this.selectedProcess.processState= this.processIn.processState;
            this.selectedProcess.notificationId= this.idNotification;

            let query = `/${SERVICE_NAMES.NOTIFICATION_PROCESS}/${this.idNotification}`;

            VAPI.put(query, this.selectedProcess).then((response) => {
                this.showModal('successModal');
                this.resetFields();
                this.editMode = false;
            }).catch((error) => {
                console.log("Error al editar proceso", error);
            });
        },
        loadStates() {

            let query = `/${SERVICE_NAMES.NOTIFICATION_PROCESS}/states`;            
            
            VAPI.get( query ).then(response => {
                this.optionsStates = []

                if (response.status === HTTP_STATUS.OK) {
                    response.data.forEach(item=>{
                        this.optionsStates.push({value: item, text: item.state});
                    });
                }

            }).catch( ex => {
                console.log("Error Servicio cargar estados de los procesos", ex);
            });
        },
        previousPage() {
            this.$router.go( -1 );
        },
        customDate(date) {
            return moment(date).format('DD-MM-YYYY');
        },
        selectProcess(idProcess) {
            this.process.forEach(pro=>{
                if (pro.id == idProcess) {
                    this.processIn.reference= pro.reference;
                    this.processIn.functionary= pro.functionary;
                    this.processIn.requestDate= pro.requestDate;
                    this.processIn.description= pro.description;
                    this.processIn.url= pro.url;
                    this.processIn.processState= pro.processState;
                    this.processIn.notificationId= this.idNotification;
                    
                    this.selectedProcess = pro;                    
                }
            });
            this.editMode = true;
        },
        getLink(link){
            if(!link) {
                return "";
            }
            if(link.indexOf("http") !== -1){
                return link
            }

            return `https://${link}`
        },
        resetFields() {
            
            this.processIn.reference= null;
            this.processIn.functionary= null;
            this.processIn.requestDate= null;
            this.processIn.description= null;
            this.processIn.url= null;
            this.processIn.processState= null;
            this.$validator.reset();
        },
        changeAddMode() {
            this.editMode = false;
            this.resetFields();
        },
        validateField(name) {
            if (this.veeFields[name] && (this.veeFields[name].dirty || this.veeFields[name].validated)) {
                
                return !this.errors.has(name);
            }
            return null;
        },
    },
    components: {
        "datepicker": Datepicker,
    }
}
</script>

<style lang="scss" scoped>
// .edit-btn {    
//     button.sipsder-button{
//         img {
//           height: 3.5rem !important;
//         }
//     } 
// }
</style>