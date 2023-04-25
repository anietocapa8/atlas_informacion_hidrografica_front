<template>
    <div class="container container-form">
        <sipsder-title :title="$t('forgotAccount.page.title')"
                        type="user">
            <div slot="content">
                {{$t('forgotAccount.page.message')}}
            </div>
        </sipsder-title>  
        <b-row>
            <b-col>
                <b-form-group :label-cols="4"
                    label-class="font-weight-bold"
                    :description= "$t('registration.passwordDescription')"
                    :label="$t('registration.passwordText')+asterisk"
                    :state="statePassword"
                    :invalid-feedback="invalidPassword"
                >
                    <vue-password required v-model="password">
                    </vue-password>
                </b-form-group>
            </b-col>
        </b-row>
        <b-row>
            <b-col>
                <b-form-group :label-cols="4"
                    label-class="font-weight-bold"
                    :label="$t('registration.confirmPasswordText')+asterisk"
                    :invalid-feedback="invalidConfirmPassword"
                    :state="invalidConfirmPasswordState"
                >
                    <vue-password required v-model="repeatPassword" :disableStrength="true">
                    </vue-password>
                </b-form-group>
            </b-col>
        </b-row>

        <b-row>
            <b-col class="d-flex justify-content-center">
                <sipsder-btn btnType="accept" @onClick="sendRecover()">
                </sipsder-btn>
            </b-col>
        </b-row>

        <b-row class="text-center" v-if="confirm">
            <b-col cols="12">
              <h2>{{$t('forgotAccount.page.success')}}</h2>
            </b-col>
        </b-row>

        <b-row class="text-center" v-if="error">
            <b-col cols="12">
              <h2>{{$t('forgotAccount.page.error')}}</h2>
            </b-col>
        </b-row>

        <b-modal ref="change_success" :title="$t('forgotAccount.modal.title')" centered hideFooter>
            <b-row class="text-center" v-if="confirm">
                <b-col cols="12">
                <h2>{{$t('forgotAccount.page.success')}}</h2>
                </b-col>
            </b-row>

            <b-row class="text-center" v-if="error">
                <b-col cols="12">
                <h2>{{$t('forgotAccount.page.error')}}</h2>
                </b-col>
            </b-row>

            <b-row>
                <b-col class="text-center">
                    <sipsder-btn @onClick="closeSuccessModal" btnType="accept" :text="$t('forgotAccount.modal.understand')">
                    </sipsder-btn>
                </b-col>
            </b-row>
        </b-modal>
    </div>
</template>

<script>
import VAPI from '../../../http_common';
import {HTTP_STATUS, SERVICE_NAMES } from '../../../sipsder_constants';
import VuePassword from "vue-password";

export default {
name: "ConfirmRecoveryAccount",
data: function() {
    return {
        password: "",
        repeatPassword: "",
        confirm: false,
        error: false,
        asterisk: "<span style='color: red'>*</span>",
    }
},
methods: {
    async sendRecover() {
        if (!this.statePassword || !this.invalidConfirmPasswordState) {
            return;
        }
        let param = {
            token: this.$route.query.token,
            password: this.password
        }
        
        try {
            let response = await VAPI.post(`${SERVICE_NAMES.USER_RECOVER}/confirm-recover`, param);
            if(response.status == 200){
                this.confirm = true;
            }else{
                this.error = true;  
            }
        } catch (ex) {
            console.info(ex);
            this.error = true; 
        }
        this.$refs.change_success.show();
    },
    closeSuccessModal () {
        this.$refs.change_success.hide();
        this.confirm= false;
        this.error= false;
    }
},
computed: {
    invalidPassword() {
      if (this.password.length === 0) {
        return "";
      }

      return this.$t("registration.invalidMessagePassword");
    },
    invalidConfirmPassword() {
        if (!this.repeatPassword || this.repeatPassword.length == 0 || this.repeatPassword === this.password) {
            return "";
        }
        
        return this.$t('change_password.passwordCheckError');
    },
    statePassword () {
        if (!this.password || this.password === "") {
            return null;
        }
      
        return 6 <= this.password.length && this.password.length <= 20;
    },
    invalidConfirmPasswordState() {
        if (!this.repeatPassword || this.repeatPassword.length == 0) {
            return null;
        }
        
        return this.repeatPassword === this.password;
    }
},
components: {
    "vue-password": VuePassword,
}
}
</script>

<style scoped>

</style>