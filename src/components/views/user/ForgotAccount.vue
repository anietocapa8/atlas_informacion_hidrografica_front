<template>
    <div id="forgotAcountModal">
        <b-modal id="forgot" ref="forgotModal" :title="$t('forgotAccount.titleModal')" hideFooter>
            <b-form>
                <b-row>
                    <b-col>
                        {{$t('forgotAccount.message')}}
                    </b-col>
                </b-row>
                <br>
                <b-row>
                    <b-col cols="12">
                        <b-form-group
                                :label-cols="4"
                                label-class="font-weight-bold"
                                :label="$t('forgotAccount.userType') + TEMPLATES.MANDATORY_SYMBOL">
                                <b-select v-model="userAuthType" :options="userAuthTypes"></b-select>
                        </b-form-group>
                    </b-col>
                </b-row>
                
                <b-row>
                    <b-col cols="12" v-if="userAuthType == userAuthTypes.CITIZEN.value">
                        <b-form-group
                                :label-cols="4"
                                label-class="font-weight-bold"
                                :description="$t('login.emailDescription')"
                                :label="$t('forgotAccount.emailMsg') + TEMPLATES.MANDATORY_SYMBOL"
                                :invalid-feedback="errors.first('email')"
                                >
                                <b-input-group>
                                    <b-input v-model.trim="email2"
                                        id="email-field"
                                        ref="email-field"
                                        name="email" 
                                        :state="stateEmail" 
                                        v-validate="'required|email|max:100'"
                                        :data-vv-as="$t('login.email')"
                                    >

                                    </b-input>
                                    <b-input-group-prepend is-text>
                                        <span class="fa fa-at"></span>
                                    </b-input-group-prepend>
                                </b-input-group>
                        </b-form-group>
                    </b-col>

                    <b-col cols="12" v-else>
                        <b-form-group
                            :label-cols="4"
                            label-class="font-weight-bold"
                            :description="$t('login.userNameDescription')"
                            :label="$t('login.userName') +' '+ TEMPLATES.MANDATORY_SYMBOL"
                            :invalid-feedback="errors.first('alias-field')"
                        >
                            <b-input-group>
                                <b-form-input v-model.trim="email2"
                                    id="alias-field"
                                    ref="alias-field"                                
                                    name="alias-field" 
                                    v-validate="'required|max:100'"
                                    :data-vv-as="$t('login.userName')">
                                </b-form-input>
                                <b-input-group-prepend is-text>
                                    <span class="fa fa-user"></span>
                                </b-input-group-prepend> 
                            </b-input-group>
                        </b-form-group>
                    </b-col>
                
                    <!--<b-col cols="12" class="d-flex justify-content-center">
                        <vue-recaptcha   
                            ref="forgotRecaptcha"
                            @verify="onCaptchaVerified"
                            @expired="onExpired" 
                            :sitekey="sitekey">
                        </vue-recaptcha>
                    </b-col>-->
                    <b-col cols="12" class="d-flex justify-content-center">
                        <sipsder-btn @onClick="closeModal" btnType="cancel"></sipsder-btn>
                        <sipsder-btn @onClick="send" btnType='send' :disabled="errors.any()"></sipsder-btn>
                    </b-col>
                </b-row>
                <!-- mensajes de error o aceptacion -->
                <b-row class="text-center">
                    <b-col cols="12" class="d-flex justify-content-center">
                        <label v-html="$t('util.obligatoryFields').replace('*', TEMPLATES.MANDATORY_SYMBOL)"></label>
                    </b-col>
                    <b-col cols="12" class="d-flex justify-content-center alert-text" v-if="requestStatus == REQUESTS.FAIL">
                        {{$t('forgotAccount.registerMsg')}}  
                        <router-link :to="{name: 'UserRegistration'}" class="text"> {{ $t('util.clickHere')}} </router-link>
                    </b-col>
                    <b-col cols="12" class="d-flex justify-content-center success-text" v-if="requestStatus == REQUESTS.SUCCESS"> 
                        {{$t('forgotAccount.successMsg')}}
                        <br/>
                        {{$t('forgotAccount.emailSendMsg')}}
                    </b-col>
                </b-row>
                <br>
            </b-form>
        </b-modal>

        <b-modal ref="change_success" :title="$t('forgotAccount.modal.title')" centered hideFooter>
            <div>
                <b-row >
                    <b-col cols="12">
                        <b><label > {{$t('forgotAccount.modal.message')}} </label></b>
                    </b-col>

                </b-row>
            </div>
            <div>
                <b-row>
                <b-col class="text-center">
                    <sipsder-btn @onClick="closeSuccessModal" btnType="accept" :text="$t('forgotAccount.modal.understand')">
                    </sipsder-btn>
                </b-col>
                </b-row>
            </div>
        </b-modal>
    </div>
</template>

<script>
//import VueRecaptcha from "vue-recaptcha";
import VAPI from '../../../http_common'
import { SERVICE_NAMES, HTTP_STATUS, TEMPLATES/*, RECAPTCHA_SITE_KEY */} from '../../../sipsder_constants';
import { AUTHENTICATION_TYPE } from '../../../domain_constants'

export default {
    data: function() {
        return {
            TEMPLATES:TEMPLATES,
            email: "",
            email2: "",
            //sitekey: RECAPTCHA_SITE_KEY,
            //captchaVerified: false,
            requestStatus: 0,
            userAuthType: AUTHENTICATION_TYPE.CITIZEN.value,
            REQUESTS: {
                UNDEFINED: 0,
                SUCCESS: 1,
                FAIL: 2,
            },
            userAuthTypes: AUTHENTICATION_TYPE,
            reg: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/,
        }
    },
    /*components: {
        "vue-recaptcha": VueRecaptcha,
    },*/
    computed: {
        stateEmail() {
            if (this.email2 == "")
                return null;
            return this.reg.test(this.email2);
        },
        isCitizen(){
            let user = this.$store.getters.getCurrentUser;
            // console.info("Ususario actual SDP:", user, user.authType, user.authType == AUTHENTICATION_TYPE.CITIZEN.value);
            return (user && user.authType != undefined && user.authType == AUTHENTICATION_TYPE.CITIZEN.value);
        },
    },
    methods: {
        goHome(){
            this.$router.push({ name: 'Home'})
        },
        closeSuccessModal(){
            this.$refs.change_success.hide();
            this.requestStatus= this.REQUESTS.UNDEFINED;
            this.goHome();
        },
        closeModal() {
            this.email2 = "";
            //this.captchaVerified = false;
            this.requestStatus= this.REQUESTS.UNDEFINED;
            this.$refs.forgotModal.hide();
        },
        async send() {
            let valid = this.$validator.validateAll();
            if (!valid) {
                return;
            }
            let path = `${SERVICE_NAMES.USER_RECOVER}/recover-acount`;
            let param = {
                userAuthType: this.userAuthType,
                alias: this.email2
            };
            // console.info("param" , param, this.email2);
            try {
                let response = await VAPI.post(path, param);
                if (response && response.status == HTTP_STATUS.OK) {
                    this.requestStatus = this.REQUESTS.SUCCESS;
                    this.$refs.change_success.show();
                } else {
                    this.requestStatus = this.REQUESTS.FAIL;
                }
                this.email2 = "";
            } catch (error) {
                console.info("Fallo: ", error);
                this.requestStatus = this.REQUESTS.FAIL;
                this.email2 = "";
            }
        },
        /*onCaptchaVerified(recaptchaToken) {
            this.captchaVerified = true;
        },
        onExpired() {
            this.captchaVerified = false;
        },*/
    }
}
</script>


<style lang="scss" scoped>
.alert-text {
    padding-top: 1.5rem;
    font-size: 11px;
    color: #ff0000;
    span {
        color: #ff0000;
    }

    .link-text {
        cursor: pointer;
        color: #007bff;
    }
}
.success-text {
    color: #007bff;
}

</style>

