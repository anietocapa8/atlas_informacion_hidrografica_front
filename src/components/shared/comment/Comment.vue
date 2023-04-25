<template>
    <div transition="slide">
        <div class="msg">
            <div class="msg-body" :class="{'status-disable': !comment.status}" >
                <b-row>
                    <b-col cols="12">
                        <b-row>
                            <b-col cols="9" >
                                <div class="name-text">
                                    {{comment.userFirstName}} {{comment.userLastName}}
                                </div>
                                <div class="date-text">
                                    {{timeDiference}}
                                </div>
                            </b-col>
                            <b-col cols="2" v-if="editable">
                                <b-form-group>
                                    <b-checkbox :id="'checkbox'+comment.id"
                                        @click.native.prevent = "clickEnable"
                                        v-model="comment.status">
                                        {{$t("comment.enable")}}
                                    </b-checkbox>
                                </b-form-group>
                            </b-col>
                        
                            <b-col cols="1" class="btn-options" v-if="editable">
                                <sipsder-btn btnType="edit_pen" text="" @onClick="showModal" class="move-up">
                                </sipsder-btn>
                            </b-col>
                        </b-row>
                        <b-row>
                            <b-col cols="12" class="comment-content">
                                <b-form-textarea plaintext :value="comment.content" no-resize rows="2">

                                </b-form-textarea>
                            </b-col>
                        </b-row>
                        <b-row >
                            <b-col offset-md="8" cols="6" md="1" >
                                <report-component 
                                    v-if="isLogged"
                                    :contentId="comment.id" 
                                    :content-type="REPORT_CONTENT_TYPES.COMMENTS"
                                    :cntReport="comment.numOfReport"
                                    >
                                </report-component>
                            </b-col>
                            <b-col cols="6" md="3">
                                <score-comment :idContent="comment.id" 
                                    :id-type="SCORE_CONTENT_TYPE.COMMENTS"
                                    :likes="comment.numOfLike"
                                    :dislikes="comment.numOfDislike">

                                </score-comment>
                            </b-col>
                        </b-row>
                    </b-col>
                    
                    
                </b-row>
            </div>
        </div>
        <!-- Detalle del comentario -->
        <b-modal :ref="'comments'+comment.id" :title="$t('comment.commentDetail')" hideFooter v-if="editable"> 
            <b-form @submit.prevent="updateComment">
                <b-row>
                    <b-col>
                        <b-row>
                            <b-col cols="12">
                                <div class="name-text">
                                    {{comment.userFirstName}} {{comment.userLastName}}
                                </div>
                                <div class="date-text">
                                    {{timeDiference}}
                                </div>
                            </b-col>
                            
                        </b-row>
                        <br>
                        
                        
                        <b-row>
                            <b-col cols="12">
                                <b-form-group>
                                    <b-form-textarea v-model="newComment" class="input-message" 
                                            name="message"  rows="2" :disabled="!userEnable"
                                            :placeholder="$t('comment.writeComment')" noResize required>
                                    </b-form-textarea>
                                </b-form-group>
                            </b-col>
                        </b-row>

                    </b-col>
                </b-row>
                <b-row>
                    <b-col cols="12" class="d-flex justify-content-center">
                        <sipsder-btn btnType="accept" :text="$t('comment.edit')" type="submit">
                        </sipsder-btn>
                        <sipsder-btn btnType="cancel" @onClick="hideModal">
                        </sipsder-btn>
                    </b-col>
                </b-row>
            </b-form>
        </b-modal>

        <!-- Modal disable -->
        <b-modal :ref="'commentsDisable'+comment.id" :title="$t('comment.disable')" hideFooter v-if="editable">
            <b-form @submit.prevent="saveModalDisable">
                <b-row>
                    <b-col cols="12">
                        <p>
                            {{$t('comment.disableContent')}}
                        </p>
                    </b-col>
                </b-row>
                
                <b-row>
                    <b-col cols="12">
                            <b-form-group
                            :label-cols="4"
                            label-class="font-weight-bold"
                            :label="$t('comment.justification')"
                            >
                                <b-form-textarea class="input-message" 
                                        name="message"  rows="5"
                                        v-model="msgJustification"
                                        :placeholder="$t('comment.writeReport')" noResize required>
                                </b-form-textarea>
                            </b-form-group>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col class="text-center">
                        <sipsder-btn btnType="save" type="submit"></sipsder-btn>
                        <sipsder-btn btnType="cancel" @onClick="hideModalDisable"></sipsder-btn>
                    </b-col>
                </b-row>
            </b-form>
        </b-modal>
    </div>
</template>

<script>
import ReportComponent from '@/components/shared/ReportComponent'
import ScoreComment from '@/components/shared/ScoreComponent'
import VAPI from "../../../http_common";
import { SERVICE_NAMES, SCORE_CONTENT_TYPE, REPORT_CONTENT_TYPES } from '../../../sipsder_constants';
import {PERMISSIONS_TYPES} from "../../../domain_constants";

export default {
    props : {
        comment : {
            type: Object,
            required: true
        },
    },
    data() {
        return {
            newComment: "",
            msgJustification: "",
            SCORE_CONTENT_TYPE: SCORE_CONTENT_TYPE,
            REPORT_CONTENT_TYPES: REPORT_CONTENT_TYPES,
        }
    },
    computed : {
        editable() {
            let edit = false;
            let user = this.$store.getters.getCurrentUser;
            
            if (user) {                
                edit = (user.id === this.comment.userId || this.isAdmin);
            }
            
            return edit;
        },
        isLogged() {
            let user = this.$store.getters.getCurrentUser;
            let ans = false;
            if (user) {
                ans = this.$store.getters.hasPermission(PERMISSIONS_TYPES.PARTICIPATE);
            }
            return ans;
        },
        userEnable() {
            let user = this.$store.getters.getCurrentUser;
            let ans = false;
            if (user && this.comment.userId == user.id) {
                ans = true;
            }
            return ans;
        },
        isAdmin() {
            return this.$store.getters.hasPermission(PERMISSIONS_TYPES.ADMIN);
        },
        timeDiference(){
            var date = new Date();
            var dif = date.getTime() - this.comment.creationDate;
            dif /= 60*1000;
            dif |= 0;
            var msg = this.$t('comment.timeAgo');

            if (dif > 60 * 24) {
                dif /= 60 * 24;
                dif |= 0;
                msg = msg.replace("#calcTime", dif).replace("#timeUnit", this.$t('comment.days'));
                
            } else if (dif > 60) {
                dif /= 60;
                dif |= 0;
                msg = msg.replace("#calcTime", dif).replace("#timeUnit", this.$t('comment.hours'));
            } else {
                msg = msg.replace("#calcTime", dif).replace("#timeUnit", this.$t('comment.minutes'));
            } 

            return msg;
        }
    },
    methods : {
        showModal() {
            this.newComment = this.comment.content;
            this.$refs['comments' + this.comment.id].show();
        },
        hideModal() {
            this.$refs['comments' + this.comment.id].hide();
        },
        saveModalDisable() {
            this.saveBack(false);
            this.$refs['commentsDisable' + this.comment.id].hide();
        },
        hideModalDisable () {
            this.$refs['commentsDisable' + this.comment.id].hide();
        },
        updateComment () {
            if (this.comment.content === this.newComment) {
                return;
            }
            var prevText = this.comment.content;
            this.comment.content = this.newComment;
            var path = `/${SERVICE_NAMES.COMMENTS}/${this.comment.id}`;
            VAPI.put(path, this.comment).then((response) => {
                
                this.$refs['comments' + this.comment.id].hide();
            }).catch((error) => {
                if (error.response.status == 401)
                    alert("No tiene permisos para editar este comentario.");
                else
                    alert("Error al editar comentario.");

                this.comment.content = prevText;
            });
        },
        saveBack(newStatus){
            let status = {
                status: newStatus,
                msg: this.msgJustification,
                routerName: this.$route.name,
                path: this.$route.path,
            };
            var path = `/${SERVICE_NAMES.COMMENTS}/${this.comment.id}/status`;
            VAPI.put(path, status).then((response) => {
                this.comment.status = newStatus;
            }).catch((error) => {
                console.log(error);
                if (error && error.response && error.response.status && error.response.status == 401)
                    alert("No tiene permisos para Habilitar/Deshabilitar este comentario.");
                else
                    alert("Error al editar comentario.");
            });
        },
        clickEnable(){
            let user = this.$store.getters.getCurrentUser;
            
            if (user && this.comment.userId == user.id) {
                this.saveBack(!this.comment.status);
            } else if (this.isAdmin) {         
                if (this.comment.status === true) {
                    this.$refs['commentsDisable' + this.comment.id].show();
                } else {
                    this.saveBack(true);
                }
            } else {
                alert("No tiene permisos para realizar esta accion.");
            }
        }
    },
    components : {
        ReportComponent,
        ScoreComment,
    },
}
</script>

<style lang="scss" scoped>

.msg { 
    font-size: 17px;
    background-color: #FFF;
    border-radius: 0 5px 5px 5px;
    margin-bottom: 1rem;
}

.msg-body {
    padding: .2em;
    color: #666;
    line-height: 1.5;
}

.name-text {
    font-weight: 700;
    float: left;
    margin-right: 1rem;
    color: #000;
}

.date-text {
    color:#3e67b1;
    font-style: italic;
    font-weight: 600;
    text-shadow: -1px -1px 1px rgba(141, 93, 255, 0.1), 1px 1px 1px rgba(148, 102, 255, 0.541);
}
.comment-content {
    overflow-x: auto;
}

.status-disable {
    background-color: #f5d4d4;
}
.move-up {
    margin-top: -20px;
}
</style>

<style lang="scss">
.btn-options {
    text-align: right;
    button.sipsder-button{
        img {
          height: 3.5rem !important;
        }
    } 
}
</style>
