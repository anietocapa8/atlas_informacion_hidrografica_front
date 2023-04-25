<template>
    <div>
        <b-modal @hidden="onHidden" id="password-modal" ref="passwordModal" :title='$t("change_password.title")' hideFooter>
            <b-row>
                <b-col class="text-justify">
                    {{$t('change_password.message')}}
                </b-col>
            </b-row>
            <hr>
            <b-row>
                <b-col cols="12" >
                    <b-form-group :label-cols="4"
                            label-class="font-weight-bold"
                            :label="$t('change_password.current_password')+TEMPLATES.MANDATORY_SYMBOL"
                    >
                    <vue-password required v-model="oldPass" :disableStrength="true">
                    </vue-password>

                    </b-form-group>
                </b-col>

                <b-col cols="12" >
                    <b-form-group :label-cols="4"
                            label-class="font-weight-bold"
                            :description="$t('change_password.passwordDescription')"
                            :label="$t('change_password.new_password')+TEMPLATES.MANDATORY_SYMBOL"
                            :invalid-feedback="invalidPassword(newPass)"
                            :state="invalidPasswordState"
                    >
                    <vue-password required v-model="newPass">
                    </vue-password>
                        
                    </b-form-group>
                </b-col>
                
                <b-col cols="12" >
                    <b-form-group :label-cols="4"
                            label-class="font-weight-bold"
                            :label="$t('change_password.new_password_confirm')+TEMPLATES.MANDATORY_SYMBOL"
                            :invalid-feedback="invalidConfirmPassword()"
                            :state="invalidConfirmPasswordState"
                    >
                    <vue-password required v-model="repeatNewPass" :disableStrength="true">
                    </vue-password>

                    </b-form-group>
                </b-col>
          </b-row>
          <b-row>
              <b-col v-if="errorMsg" class="error-msg">
                  {{errorMsg}}
              </b-col>
              <b-col v-if="successMsg" class="success-msg d-flex justify-content-center">
                  {{successMsg}}
              </b-col>
          </b-row>
          <b-row>
              <b-col class="d-flex justify-content-center">
                    <sipsder-btn btnType="accept" @onClick="changePassword()">
                    </sipsder-btn>
                    <sipsder-btn btnType="cancel" @onClick="closeModal()">
                    </sipsder-btn>
              </b-col>
          </b-row>
        </b-modal>

        <b-modal ref="change_success" :title="$t('change_password.modal.title')" centered hideFooter>
            <div>
                <b-row v-if="isCitizen">
                    <b-col cols="12">
                        <b><label > {{$t('change_password.modal.messageCitizen')}} </label></b>
                    </b-col>

                </b-row>

                <b-row v-else>
                    <b-col cols="12">
                        <b><label > {{$t('change_password.modal.messageSDP')}} </label></b>
                    </b-col>

                </b-row>
            </div>
            <div>
                <b-row>
                <b-col class="text-center">
                    <sipsder-btn @onClick="closeSuccessModal" btnType="accept" :text="$t('change_password.modal.understand')">
                    </sipsder-btn>
                </b-col>
                </b-row>
            </div>
        </b-modal>
    </div>
</template>

<script>
import VuePassword from "vue-password";
import VAPI from '../../../http_common';
import {HTTP_STATUS, SERVICE_NAMES, TEMPLATES} from '../../../sipsder_constants';
import {AUTHENTICATION_TYPE, USER_STATUS} from "../../../domain_constants";

export default {
name: "ChangePassword",
data(){
    return {
        TEMPLATES: TEMPLATES,
        oldPass: null,
        newPass: null,
        repeatNewPass: null,
        errorMsg: null,
        STATUS_OK: 0,
        successMsg: null,
    }
},
computed: {
    invalidPasswordState() {
      if (!this.newPass || this.newPass === "") {
        return null;
      }
      
      return 6 <= this.newPass.length && this.newPass.length <= 20;
    },
    invalidConfirmPasswordState() {
        if (!this.repeatNewPass || this.repeatNewPass.length == 0) {
            return null;
        }
        
        return this.repeatNewPass === this.newPass;
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
      this.$refs.change_success.hide()
      this.goHome();
    },
    closeModal() {
        this.$refs.passwordModal.hide();
    },
    clearData() {
        this.successMsg= null;
        this.errorMsg= null;
        this.oldPass= null;
        this.newPass= null;
        this.repeatNewPass= null;
        this.$validator.reset();
        this.$validator.errors.clear();
    },
    onHidden(evt) {
        this.clearData();
    },
    invalidPassword(password) {
      if (!password || password.length === 0) {
        return "";
      }

      if (6 <= password.length && password.length <= 20) {
          return "";
      }

      return this.$t("change_password.passwordFormatError");
    },
    invalidConfirmPassword() {
        if (!this.repeatNewPass || this.repeatNewPass.length == 0 || this.repeatNewPass === this.newPass) {
            return "";
        }
        
        return this.$t('change_password.passwordCheckError');
    },
    async changePassword() {
        let user = this.$store.getters.getCurrentUser;
        if (!user) {
            return;
        }
        let param = {
            id: user.id,
            oldPassword: this.oldPass,
            newPassword: this.newPass,
        };

        try {
            let response = await VAPI.put(`${SERVICE_NAMES.USER_PROFILE}/change-password`, param);
            this.errorMsg = null;
            if (response.status == HTTP_STATUS.OK) {
                let data = response.data;
                if (data.status) {
                    this.successMsg = `${this.$t('change_password.password_success')}`;
                    this.$refs.change_success.show();
                } else {
                    this.errorMsg = `${this.$t('change_password.password_error')}: ${data.message}`;
                }
            } else {
                this.errorMsg = `${this.$t('change_password.password_error')}: ${data.message}`;
            }
        } catch (ex) {
            console.info(ex);
            this.errorMsg = this.$t('change_password.password_error');
        }
    }
},
components: {
    "vue-password": VuePassword,
}
}
</script>

<style lang="scss" scoped>
.error-msg {
    color: red;
}
.success-msg {
    color: #007bff;
}
</style>
