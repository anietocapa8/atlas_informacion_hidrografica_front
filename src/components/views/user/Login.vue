<template>
    <div>
        <b-modal @hidden="onHidden" id='login' ref="loginModal" :title='$t("login.titleModal")' hideFooter>
            
            <b-form>
                <b-row>
                    <b-col cols="12">
                        <b-form-group
                            :label-cols="4"
                            label-class="font-weight-bold"
                            :label="$t('login.userType') + ' ' + TEMPLATES.MANDATORY_SYMBOL"
                        >
                            <b-select v-model="varLogin.userType" :options="userTypes"></b-select>
                        </b-form-group>
                    </b-col>
                </b-row>
                <b-row v-if="varLogin.userType == userTypes.CITIZEN.value">
                    <b-col cols="12">
                        <b-form-group
                            :label-cols="4"
                            label-class="font-weight-bold"
                            :description="$t('login.emailDescription')"
                            :label="$t('login.email') + ' ' + TEMPLATES.MANDATORY_SYMBOL">

                            <b-input-group>
                                <b-form-input v-model.trim="varLogin.email" 
                                    name="email" 
                                    :state="stateEmail" 
                                    v-validate="'required|email|max:100'"
                                    :data-vv-as="$t('login.email')">
                                </b-form-input>
                                <b-input-group-prepend is-text>
                                    <span class="fa fa-at"></span>
                                </b-input-group-prepend> 
                            </b-input-group>

                            <b-row v-if="errors.has('email')">
                                <span class="error-msg">{{ errors.first( 'email' ) }}</span>
                            </b-row> 

                        </b-form-group>
                    </b-col>
                </b-row>
                <b-row v-else>
                    <b-col cols="12">
                        <b-form-group
                            :label-cols="4"
                            label-class="font-weight-bold"
                            :description="$t('login.userNameDescription')"
                            :label="$t('login.userName') +' '+ TEMPLATES.MANDATORY_SYMBOL"
                            :invalid-feedback="errors.first('email')"
                        >

                            <b-input-group>
                                <b-form-input v-model.trim="varLogin.email" 
                                    name="email" 
                                    v-validate="'required|max:100'"
                                    :data-vv-as="$t('login.userName')">
                                </b-form-input>
                                <b-input-group-prepend is-text>
                                    <span class="fa fa-user"></span>
                                </b-input-group-prepend> 
                            </b-input-group>
                            <b-row v-if="errors.has('email')">
                                <span class="error-msg">{{ errors.first( 'email' ) }}</span>
                            </b-row> 
                        </b-form-group>
                    </b-col>
                </b-row>

                <b-row>
                    <b-col cols="12">
                        <b-form-group :label-cols="4"
                                    label-class="font-weight-bold"
                                    :description= "$t('util.obligatoryFields').replace('*', TEMPLATES.MANDATORY_SYMBOL)"
                                    :label="$t('login.password') + TEMPLATES.MANDATORY_SYMBOL">
                            <b-input-group>
                                <b-form-input v-model.trim="varLogin.passwordContent" 
                                            :type="varLogin.showPassword ? 'text' : 'password'"
                                            name="password" 
                                            v-validate="'required|max:40'"
                                            :data-vv-as="$t('login.password')">
                                </b-form-input>
                                <b-input-group-prepend is-text>
                                    <span class="fa" 
                                        v-bind:class="varLogin.showPassword ? 'fa-eye' : 'fa-eye-slash'"
                                        @click="togglePasswordVisibility()">
                                    </span>
                                </b-input-group-prepend> 
                            </b-input-group>
                            <b-row v-if="errors.has('password')">
                                <span class="error-msg">{{ errors.first( 'password' ) }}</span>
                            </b-row> 
                        </b-form-group>
                    </b-col>
                </b-row>
<!-- Check box recordar contrase;a.
                <b-row>
                    <b-col cols="12">
                        
                        <b-form-checkbox 
                                        v-model="varLogin.statusTermAndUse"
                                        value="accepted"
                                        unchecked-value="not_accepted">
                            {{$t('login.remember')}}
                        </b-form-checkbox>
                    </b-col>
                </b-row> -->
                
                <b-row >
                    
                    <b-col class="text-left msg-text">
                        {{ $t('login.forgotPasswordBtn') }}
                        <span v-b-modal.forgot @click="closeModal" class="link-text">
                            {{ $t('login.clickHere') }}
                        </span>
                        <!-- <b-btn variant="success">{{ $t('login.forgotPasswordBtn') }}</b-btn> -->
                    </b-col>

                    <b-col class="text-left msg-text">
                        <!-- <sipsder-btn btnType="add" :text="$t('login.newAccountBtn')"></sipsder-btn> -->
                        {{ $t('login.newAccountBtn') }}
                        <span @click="closeModal">
                            <router-link :to="{name: 'UserRegistration'}" class="text"> {{ $t('login.clickHere') }} </router-link>
                        </span>
                        <!-- <a href=""> {{ $t('login.clickHere') }} </a> -->
                        <!-- <b-btn variant="success">{{ $t('login.newAccountBtn') }}</b-btn> -->
                    </b-col>                  

                </b-row>
                <br/>
                <!-- No soy un robot 
                <b-row >
                    <b-col class="d-flex justify-content-center">
                        <vue-recaptcha    
                            ref="recaptcha"
                            @verify="onCaptchaVerified"
                            @expired="onExpired"
                            :sitekey="varLogin.sitekey">
                        </vue-recaptcha>
                    </b-col>
                </b-row>-->
                <b-row> 
                    <b-col class="alert-text" v-if="!varLogin.validCredentials">
                        <b-row>
                            <b-col cols="12" class="d-flex justify-content-center">
                                <span>{{errorMessage}}</span>
                            </b-col>
                        </b-row>
                        <br>
                    </b-col>
                </b-row>
                <br/>
                <b-row class="d-flex justify-content-center">
                    <b-col cols="5" offset-md="1">
                        <sipsder-btn @onClick="signIn" :disabled="loading || errors.any()" btnType="login"></sipsder-btn>
                        <!-- <sipsder-btn @onClick="signIn" :disabled="loading || errors.any()" btnType="login"></sipsder-btn> -->
                    </b-col>
                    <b-col cols="5">
                        <sipsder-btn @onClick="closeModal" btnType="cancel"></sipsder-btn>
                    </b-col>
                </b-row>
                <br />
            </b-form>
        </b-modal>
        <sipsder-forgot>
        </sipsder-forgot>
    </div>
</template>

<script>

import ForgotAccount from "./ForgotAccount.vue" ;
//import VueRecaptcha from "vue-recaptcha";
import { VAPI } from '../../../http_common'
import { HTTP_STATUS, TEMPLATES /*, RECAPTCHA_SITE_KEY */} from '../../../sipsder_constants'
import { AUTHENTICATION_TYPE } from '../../../domain_constants'

export default {
    data: function(){
        return {
            TEMPLATES:TEMPLATES,
            varLogin: {
                //sitekey: RECAPTCHA_SITE_KEY,
                email: '',
                passwordContent: '',
                statusTermAndUse: 'not_accepted',
                //captchaVerified: false,
                validCredentials: true,
                errorMessage: null,
                imgLogo: '../../assets/sipsder_logo.png',
                showPassword: false,
                userType : AUTHENTICATION_TYPE.CITIZEN.value,
            },
            reg: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/,
            userTypes: AUTHENTICATION_TYPE,
        }
    },
    computed: {
        stateEmail() {
            if (this.varLogin.email == "")
                return null;
            return this.reg.test(this.varLogin.email);
        },
        error () {
            return this.$store.getters.getError;
        },
        loading () {
            return this.$store.getters.getLoading;
        },
        isLogged() {
            return this.$store.getters.isAuthenticated;
        }
    },
    watch: {
        error (value) {
            this.errorMessage = null;
            if (value) {
                if (value.response && value.response.status === HTTP_STATUS.UNAUTHORIZED) {
                    this.varLogin.validCredentials = false;
                    this.errorMessage = value.response.data.message;
                }
                this.alert = true;
            }
        },
        alert (value) {
            if (!value) {
                this.$store.dispatch('setError', false)
            }
        },
        isLogged (value) {
            this.closeModal();
        }
    },
    methods: {
        togglePasswordVisibility() {
            this.varLogin.showPassword = !this.varLogin.showPassword;
        },
        signIn() {
            this.errorMessage = null;
            this.varLogin.validCredentials = true;
            this.$store.dispatch('signIn', {
                email: this.varLogin.email, 
                password: this.varLogin.passwordContent,
                userType: this.varLogin.userType,
            });
        },
        closeModal() {
            this.clearData();
            this.$refs.loginModal.hide();
        },
        
        /*onCaptchaVerified(recaptchaToken) {
            this.varLogin.captchaVerified = true;
        },
        onExpired() {
            this.varLogin.captchaVerified = false;
        },*/
        clearData() {
            this.varLogin.email = '';
            this.varLogin.passwordContent = '';
            this.varLogin.statusTermAndUse = 'not_accepted';
            /*this.varLogin.captchaVerified = false;
            this.varLogin.captchaVerified = false;
            this.$refs.recaptcha.reset();*/
            this.varLogin.showPassword = false;
            this.$validator.reset();
            this.$validator.errors.clear();
            this.varLogin.validCredentials = true;
            this.errorMessage = null;
        },
        onHidden (evt) {
            this.clearData();
        }
    },
    beforeMount() {
        //console.info('RECAPTCHA_SITE_KEY', RECAPTCHA_SITE_KEY);
    },
    components: {
        //"vue-recaptcha": VueRecaptcha,
        "sipsder-forgot": ForgotAccount,  
    }
}
</script>

<style lang="scss">
    .modal-content {
        background-image: url('../../../assets/modal/red.png'), url('../../../assets/modal/esquina_inferior.png');
    }
    .modal-header { 
        background-image: url('../../../assets/modal/esquina_superior.png');
    }
</style>

<style lang="scss" scoped>
    .alert-text {
        text-align: center;
        padding-top: 1.5rem;
        font-size: 16px;
        color: #ff0000;
        span {
            color: #ff0000;
        }

        .link-text {
            cursor: pointer;
            color: #007bff;
        }
    }
    .msg-text {
        padding-top: 1.5rem;
        font-size: 13px;
        color: #000000;
        span {
            color: #000000;
        }

        .link-text {
            cursor: pointer;
            color: #007bff;
        }
    }
    .error-msg {
        color: red;
        font-size: 13px;
        padding: 10px 15px 10px 15px;
    }
</style>
