<template>
    <div class="container">
        <b-form class="form-group required">
            <b-row>
                <b-col>
                    <label class="control-label">{{$t('institutionAdmin.domain')}}</label>
                </b-col>
                <b-col>
                    <b-form-input v-validate="'required'" :name="$t('institutionAdmin.domain')"
                                  v-model="newDomain.domain"></b-form-input>
                    <span class="error">{{errors.first("Dominio")}}</span>
                </b-col>
            </b-row>
            <b-alert variant="danger" :show="showErrorAlert">
                {{errorMessage}}
            </b-alert>
            <div class="button-container">
            <b-row>
                <b-col>
                    <sipsder-btn :text="$t('institutionAdmin.save')"
                                 btnType="accept"
                                 @onClick="saveMethod"></sipsder-btn>
                </b-col>
                <b-col>
                    <sipsder-btn :text="$t('institutionAdmin.cancel')"
                                 btnType="cancel"
                                 @onClick="cancelMethod"></sipsder-btn>
                </b-col>
            </b-row>
            </div>
        </b-form>
    </div>
</template>

<script>
    import Vue from 'vue'
    import {SERVICE_NAMES} from "../../../sipsder_constants";
    import VAPI from '../../../http_common'
    import VeeValidate from 'vee-validate'
    
    export default {
        name: "AddDomain",
        data(){
            return{
                showErrorAlert:false,
                errorMessage:'',
                validationData:'undefined',
                unique:false,
                newDomain:{
                    "id":-1,
                    "domain":""
                }
            }
        },
        methods:{

            validateOnBack() {
                let self = this;
                // console.log("Query value " + this.newDomain.domain);
                // validate in temporal
                let temp_array = this.$store.getters.getEmailDomainAdded;
                let index = temp_array.indexOf(this.newDomain.domain);
                if (index === -1) {
                    VAPI.get('/' + SERVICE_NAMES.EMAIL_DOMAIN + '?domain=' + this.newDomain.domain).then(result => {
                        if (result.status === 200) {
                            self.errorMessage = this.$t("institutionAdmin.addDomainError");
                            self.showErrorAlert = true;
                        } else {
                            self.$emit("saveDomainEvent", this.newDomain);
                        }

                    }).catch(error => {
                        console.log(error);
                        self.errorMessage = this.$t("institutionAdmin.addDomainError");
                        self.showErrorAlert = true;
                    });
                } else {
                    self.errorMessage = this.$t("institutionAdmin.addDomainError");
                    self.showErrorAlert = true;
                }
            },

            saveMethod: function (event) {
                let self = this;
                // Validate form
                this.$validator.validateAll().then(result => {
                    if (result) {
                        // verify that the domain does not exists
                        this.validateOnBack();
                    } else {
                        // console.log("Fail validation ");
                        this.showErrorAlert = true;
                        this.errorMessage = self.$t("institutionAdmin.formInstitution.frontValidationErrorMsg");
                    }
                });
            },
            cancelMethod: function(event){
                this.showErrorAlert=false;
                this.$validator.reset();
                this.$validator.errors.clear();
                this.$emit('cancelDomainEvent', event)
            }
        }
    }
</script>

<style lang="sass" scoped>
.button-container
    text-align: center
    margin-top: 2%
</style>
<style scoped>
    .form-group.required .control-label:after {
        content:"*";
        color:red;
    }

    .error {
        color: red;
    }
</style>