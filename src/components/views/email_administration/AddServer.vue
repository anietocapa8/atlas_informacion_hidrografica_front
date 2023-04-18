<template>
    <div class="container">
        <div class="form-group required">
            <b-form>
                <b-form-group>
                    <b-row>
                        <b-col>
                            <label class="control-label">{{$t("smtp_admin.formName")}}</label>
                        </b-col>
                        <b-col>
                            <b-form-input v-model="item.name" v-validate="'required|max:30'" name="Nombre"
                                          data-vv-validate-on="change" :data-vv-as="$t('smtp_admin.formName')" />
                            <span class="error">{{errors.first('Nombre')}}</span>
                        </b-col>
                    </b-row>
                    <b-row class="row-margin">
                        <b-col>
                            <label class="control-label">{{$t("smtp_admin.formEmail")}}</label>
                        </b-col>
                        <b-col>
                            <b-form-input v-model="item.email" v-validate="'required|email|max:180'"
                                          name="email" :data-vv-as="$t('smtp_admin.formEmail')"/>
                            <span class="error">{{errors.first('email')}}</span>
                        </b-col>
                    </b-row>
                    <b-row class="row-margin">
                        <b-col>
                            <label class="control-label">{{$t("smtp_admin.formPassword")}}</label>
                        </b-col>
                        <b-col>
                            <b-form-input v-model="item.pass" v-validate="'required|max:600'"
                                          name="Contraseña" :data-vv-as="$t('smtp_admin.formPassword')"/>
                            <span class="error">{{errors.first('Contraseña')}}</span>
                        </b-col>
                    </b-row>
                    <b-row class="row-margin">
                        <b-col>
                            <label class="control-label">{{$t("smtp_admin.formSmtpServer")}}</label>
                        </b-col>
                        <b-col>
                            <b-form-input v-model="item.smtpServer" v-validate="'required|max:180'"
                                          name="Servidor Smtp" :data-vv-as="$t('smtp_admin.formSmtpServer')"></b-form-input>
                            <span class="error">{{errors.first('Servidor Smtp')}}</span>
                        </b-col>
                    </b-row>
                    <b-row class="row-margin">
                        <b-col>
                            <label class="control-label">{{$t("smtp_admin.formPort")}}</label>
                        </b-col>
                        <b-col>
                            <b-form-input v-model="item.port" v-validate="'required|between:1,65535'"
                                        name="Puerto" :data-vv-as="$t('smtp_admin.formPort')"/>
                            <span class="error">{{errors.first('Puerto')}}</span>
                        </b-col>
                    </b-row>
                    <b-row class="row-margin">
                        <b-col>
                            <label class="control-label">{{$t("smtp_admin.formStatus")}}</label>
                        </b-col>
                        <b-col>
                            <b-form-select
                                    :options="state" v-model="item.status"></b-form-select>
                        </b-col>
                    </b-row>
                    <b-row class="row-margin">
                        <b-col>
                            <label class="control-label">{{$t("smtp_admin.formSsl")}}</label>
                        </b-col>
                        <b-col>
                            <b-form-select
                                    :options="state" v-model="item.ssl"></b-form-select>
                        </b-col>
                    </b-row>
                    <b-alert variant="danger" :show="showErrorAlert">
                        {{errorMessage}}
                    </b-alert>
                    <div class="button-center-container">
                        <b-row class="row-margin">
                            <b-col>
                                <sipsder-btn :text="$t('smtp_admin.btnSave')"
                                             btnType="accept"
                                             @onClick="onSubmit"></sipsder-btn>
                            </b-col>
                            <b-col>
                                <sipsder-btn :text="$t('smtp_admin.btnExit')"
                                             btnType="cancel"
                                             @onClick="exitModal"></sipsder-btn>
                            </b-col>
                        </b-row>
                    </div>
                </b-form-group>
            </b-form>
        </div>
    </div>
</template>

<script>
    import VAPI from '../../../http_common'
    import ElSlPanel from "element-ui/packages/color-picker/src/components/sv-panel";
    import { SERVICE_NAMES, HTTP_STATUS } from "@/sipsder_constants";

    export default {
        name: "AddServer",
        components: {ElSlPanel},
        props:{
            item: Object
        },
        data(){
            return{
                showErrorAlert:false,
                errorMessage:"",
                response: null,
                state:[
                    {
                        value: 0,
                        text: 'Inactivo'
                    },
                    {
                        value: 1,
                        text: 'Activo'
                    }
                ],
                newServer:{
                    id:-1,
                    name:'',
                    email:'',
                    smtpServer: '',
                    port:'',
                    status:0,
                    password:'',
                    ssl:0
                },
                query:{
                    'email': '',
                    'smtpServer': '',

                },
                unique: false,
                active: false
            }
        },
        mounted(){
            this.showErrorAlert=false;
            this.errors.clear();
        },
        methods:{
            createObject:function (){
                this.newServer.id = -1;
                this.newServer.name = this.item.name;
                this.newServer.pass = this.item.pass;
                this.newServer.email = this.item.email;
                this.newServer.smtpServer = this.item.smtpServer;
                this.newServer.port = this.item.port;
                this.newServer.status = this.item.status;
                this.newServer.ssl = this.item.ssl;
            },
            errorResponse(status) {
                this.showErrorAlert = true;
                if (status === HTTP_STATUS.CONFLICT) {
                    this.errorMessage = this.$t("smtp_admin.uniqueValidationError");
                } else {
                    this.errorMessage = this.$t("smtp_admin.creationError");
                }
            },
            createOrUpdateEmailServer:function(){
                if (this.item.id === -1){
                    // create new server
                    this.createObject();
                    let self = this;
                    VAPI.post('/' + SERVICE_NAMES.SMTP_SERVER, this.newServer).then(response =>
                        {
                            let result = response.data;
                            this.$emit("successEvent");
                            //this.$store.dispatch("setEmailAdministration", {});
                        }
                    ).catch(e => {
                        console.error("Error has occurred " + e.toString());
                        self.showErrorAlert = true;
                        if (e.response.status === HTTP_STATUS.CONFLICT) {
                            self.errorMessage = self.$t("smtp_admin.uniqueValidationError");
                        } else {
                            self.errorMessage = self.$t("smtp_admin.creationError");
                        }
                        //throw error;
                    });
                }else{
                    // update existing user
                    this.createObject();
                    this.newServer.id = this.item.id;
                    VAPI.put('/' + SERVICE_NAMES.SMTP_SERVER + '/' + this.item.id, this.newServer).then(response =>
                    {
                        self.response = response.data;
                        this.$emit("successEvent");
                        //self.$store.dispatch("setEmailAdministration", {});
                    }).catch(e => {
                        console.error("Error update email server "+e.toString());
                        self.errorMessage = this.$t("smtpServer.updateError");
                        self.showErrorAlert = true;
                    })
                }
            },

            onSubmit:function(){
                let data = '';
                // validate form
                this.$validator.validate().then(result => {
                    // do things if not validate
                    if (!result){
                        this.showErrorAlert = true;
                        this.errorMessage = this.$t("smtp_admin.formValidationError");
                    }else{
                        this.createOrUpdateEmailServer();
                    }
                });
            },

            clearErrors:function(){
                // cleaning errors
                this.showErrorAlert= false;
                this.errors.clear();
                this.$validator.reset();
            },

            exitModal:function(){
                this.unique = false;
                this.showErrorAlert=false;
                this.clearErrors();
                this.$emit("exitModal");
            }
        },

    }
</script>

<style scoped>
    .row-margin {
        margin-top: 2%;
        display: flex;
    }

    .form-group.required .control-label:after {
        content:"*";
        color:red;
    }
    .error {
        color: red;
    }

    .button-center-container {
        text-align: center;
        margin-top: 2%;
    }
</style>