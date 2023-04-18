<template>
  <div id="app">
      <b-container class='container-form div-90'>
        
        <sipsder-title :title="$t('registration.title').toUpperCase()"
                      type="user"
                      section="registry"
        >
          <b-row slot="content">
            <b-col>
              <b-row>
                <b-col class="font-weight-bold text-justify">
                    {{$t('registration.alertInitialText')}}
                </b-col>
              </b-row>
              <br>
              <b-row>
                <b-col class="text-justify">
                  {{$t('registration.initialText')}}
                </b-col>
              </b-row>
            </b-col>
            
          </b-row>
        </sipsder-title>

        <b-form @submit.prevent="onSubmit" @reset="onReset">

          <b-form-group horizontal
                  :label-cols="3"
                  label-class="font-weight-bold"
                  :description="$t('registration.emailTextDescription')"
                  :label="$t('registration.emailText')+asterisk"
                  :invalid-feedback="invalidFeedback"
                  :state="stateEmail"
          >
              <b-input-group>
                <b-input-group-prepend is-text>
                  <span class="fa fa-at"></span>
                </b-input-group-prepend>

                <b-form-input required v-model.trim="user.email" :state="stateEmail">
                </b-form-input>

              </b-input-group>
          </b-form-group>

          <b-row>
            <b-col cols="12" md="6">
                <b-form-group :label-cols="4"
                        label-class="font-weight-bold"
                        :label="$t('registration.firstNameText')+asterisk"
                >

                <b-form-input required v-model.trim="user.firstName"></b-form-input>

                </b-form-group>
            </b-col>
            <b-col cols="12" md="6">
                <b-form-group :label-cols="4"
                        label-class="font-weight-bold"
                        :label="$t('registration.lastNameText')+asterisk"
                >
                
                  <b-form-input required v-model.trim="user.lastName"></b-form-input>

                </b-form-group>
            </b-col>
            
          </b-row>
          <b-row>
            <b-col cols="12" md="6">
                <b-form-group :label-cols="4"
                        label-class="font-weight-bold"
                        :label="$t('registration.sexText')+asterisk"
                >

                  <b-form-select v-model="user.sex" :options="optionsSex" required>
                  </b-form-select>

                </b-form-group>
            </b-col>  
            
          </b-row>
          <hr/>

          <b-row>
              <b-col cols="12" md="6">
                  <b-form-group :label-cols="4"
                          label-class="font-weight-bold"
                          :label="$t('registration.countryText')+asterisk"
                  >
                  <vue-select required v-if="autocomplets.countries" 
                      v-model.trim="user.country"
                      label="name" 
                      :options="autocomplets.countries">
                  </vue-select>
                  <!-- <b-form-input v-model.trim="user.country"></b-form-input> -->
                  </b-form-group>
              </b-col>

              <b-col cols="12" md="6">
                <b-alert
                  :show="countryCountDown"
                  dismissible
                  variant="alert"
                  @dismissed="countryCountDown=0"
                  @dismiss-count-down="countDownChanged"
                  >
                  {{ $t('registration.obligatoryField') }}
                </b-alert>
              </b-col>
          </b-row>

          <b-row>
              <b-col cols="12" md="6" v-if="autocomplets.departments !== null">
                  <b-form-group :label-cols="4"
                          label-class="font-weight-bold"
                          :label="$t('registration.departmentText')+asterisk"
                  >
                    <vue-select required v-model.trim="user.departament" 
                      label="name" 
                      :options="autocomplets.departments"></vue-select>
                  <!-- <b-form-input v-model.trim="user.city"></b-form-input> -->
                  </b-form-group>
              </b-col>
          </b-row>

          <b-row>
              <b-col cols="12" md="6" v-if="autocomplets.cities !== null">
                  <b-form-group :label-cols="4"
                          label-class="font-weight-bold"
                          :label="$t('registration.cityText')+asterisk"
                  >
                    <vue-select required v-model.trim="user.city" 
                      label="name" 
                      :options="autocomplets.cities"></vue-select>
                  <!-- <b-form-input v-model.trim="user.city"></b-form-input> -->
                  </b-form-group>
              </b-col>
              
              <b-col cols="12" md="6" v-if="autocomplets.localidad !== null">
                  <b-form-group :label-cols="4"
                          label-class="font-weight-bold"
                          :label="$t('registration.localidadText')+asterisk"
                  >
                  <vue-select 
                    v-model.trim="user.localidad" 
                    label="name" 
                    :options="autocomplets.localidad"></vue-select>
                  <!-- <b-form-input v-model.trim="user.localidad"></b-form-input> -->
                  </b-form-group>
              </b-col>
          </b-row>
          <hr />
          <!-- <b-row> -->
              <!-- No soy un robot -->
              <!--<vue-recaptcha 
                  ref="recaptcha"        
                  @verify="onVerify"
                  @expired="onExpired"
                  :sitekey="sitekeyRegistro">
              </vue-recaptcha>-->
              <!-- <button @click="resetRecaptcha"> Reset ReCAPTCHA </button> -->
          <!-- </b-row> -->
          <hr />
          
          
          <b-row>
              <b-col cols="12" md="6">
                  <b-form-group :label-cols="4"
                          label-class="font-weight-bold"
                          :description= "$t('registration.passwordDescription')"
                          :label="$t('registration.passwordText')+asterisk"
                  >
                  <vue-password required v-model="user.password">
                  </vue-password>
                    
                  </b-form-group>
              </b-col>
              
              <b-col cols="12" md="6">
                  <b-form-group :label-cols="4"
                          label-class="font-weight-bold"
                          :label="$t('registration.confirmPasswordText')+asterisk"
                          :invalid-feedback="invalidPassword"
                          :state="statePassword"
                  >
                  <vue-password required v-model="user.confirmPassword" :disableStrength="true">
                  </vue-password>

                  </b-form-group>
              </b-col>
          </b-row>
          <hr />
          <b-row>
            <b-col cols="1" md="1" class="d-flex align-content-end">
              <b-form-checkbox id="checkboxTermsAndUse"
                                v-model="statusTermAndUse"
                                value="accepted"
                                unchecked-value="not_accepted">
                      <!-- <router-link :to="{name: 'TermsAndConditionsPage'}"> {{$t('registration.acceptedTermAndUseText')}}</router-link> -->
              </b-form-checkbox>
            </b-col>
            <b-col cols="4" md="4" style="margin: 0; padding: 0; cursor: pointer" class="d-flex align-content-end">
              <h4 style="color: blue"  @click="terms()">{{$t('registration.acceptedTermAndUseText')}}</h4>
            </b-col>

            <b-col cols="12" md="7">
              <label v-html="$t('registration.obligatoryFields').replace('*', TEMPLATES.MANDATORY_SYMBOL)"></label>
            </b-col>
          </b-row>
              <br/>
          <b-row >
              <b-col class="text-right" cols="6">
                
                <sipsder-btn btnType="back" @onClick="$router.go(-1)">
                </sipsder-btn>

                <!-- <b-btn variant="secondary">
                  <span class="fa fa-undo-alt"></span>
                  {{$t("registration.back")}}
                </b-btn> -->
              </b-col>
              <b-col class="text-left" cols="6" >
                <div id="disabled-wrapper" class="d-inline-block">
                  <sipsder-btn btnType="add" :text="$t('registration.createNewAccountText')" type="submit">
                  </sipsder-btn>
                </div>

                <!-- <b-tooltip target="disabled-wrapper" triggers="hover" v-if="!captchaVerified">
                  {{$t('registration.catcha_error')}}
                </b-tooltip> -->

                <!-- <b-btn variant="secondary" type="submit">
                  <span class="fa fa-plus-circle"></span>
                  {{$t("registration.createNewAccountText")}}
                </b-btn> -->
              </b-col>
          </b-row>
        </b-form>
        <hr/>
            <!-- <b-btn variant="warning" v-b-modal.login>Probando Modal</b-btn> -->
      </b-container>
      
      <!-- modales -->
      <b-modal ref="errorsModal" :title="$t('registration.warning')" hideFooter>
        <div>
          <b><label for="listErrors"> {{$t('registration.solveErrors')}} </label></b>
          <ul id="listErrors">
            <li v-for="error in errorsMsg" :key="error">
              {{error}}
            </li>
          </ul>
        </div>
        <div class="w-100 text-center">
          <sipsder-btn btnType="accept" @onClick="closeModal('errorsModal')">
          </sipsder-btn>
        </div>

      </b-modal>

      <b-modal ref="termsAndConditionsModal" :title="$t('registration.termAndUse')" hideFooter>
        <div>
          <b-row>
            <b-col cols="2" class="text-right">
              <span class="fill-cols fa fa-exclamation-circle"></span>
            </b-col>
            <b-col cols="10">
              <b><label > {{$t('registration.acceptedTermAndUseError')}} </label></b>
            </b-col>
          </b-row>

        </div>
        <div>
          <b-row>
            <b-col class="text-right">
              <router-link to="/">
                <sipsder-btn btnType="back" :title="$t('registration.exit')">
                </sipsder-btn>

              </router-link>
            </b-col>
            <b-col class="text-left">
              <sipsder-btn btnType="accept" :title="$t('registration.continue')" @onClick="closeModal('termsAndConditionsModal')">
              </sipsder-btn>
              
            </b-col>
          </b-row>
        </div>
      </b-modal>

      <b-modal ref="loadingModal" :title="$t('registration.modal.loading')" hideFooter>
        <div>
          {{$t('registration.loading')}}
        </div>
      </b-modal>
      <!-- Correct modal -->

      <!-- Correct modal -->

    <b-modal ref="creation_success" :title="$t('registration.modal.create')" centered hideFooter>
      <div>
        <b-row>

          <b-col cols="12">
            <b><label > {{$t('registration.modal.createContent')}} </label></b>
          </b-col>

        </b-row>

      </div>
      <div>
        <b-row>
          <b-col class="text-center">
            <sipsder-btn @onClick="closeSuccessModal" btnType="accept" :title="$t('registration.modal.understand')">
            </sipsder-btn>
          </b-col>
        </b-row>
      </div>
    </b-modal>

      <b-modal ref="terms" size="xl" :title="$t('registration.modal.terms_and_conditions')" centered hideFooter>
        <div>
          <b-row>

            <b-col cols="12">
              <b-form-textarea id="textarea1"
                  class="text-details"
                  :value="terms_conditions"
                  :rows="15"
                  :max-rows="20" readonly>
                  {{ terms_conditions }}
              </b-form-textarea>
            </b-col>

          </b-row>

        </div>
        <div>
          <b-row>
            <b-col class="text-center">
              <sipsder-btn @onClick="close_terms" btnType="accept" :title="$t('registration.modal.understand')">
              </sipsder-btn>
            </b-col>
          </b-row>
        </div>
      </b-modal>
    </div>
</template>

<script>

//import VueRecaptcha from "vue-recaptcha";
import VuePassword from "vue-password";
import vSelect from "vue-select";
import VAPI from "../../../http_common";
import { GEOGRAPHY_TYPE, GEOGRAPHY_SPECIAL } from '../../../domain_constants';
import { SERVICE_NAMES, HTTP_STATUS, TEMPLATES/*, RECAPTCHA_SITE_KEY */} from '../../../sipsder_constants';

export default {
  data: function() {
    return {
      TEMPLATES: TEMPLATES,
      // Variable del recatcha
      //   TODO: change this public key
      //sitekeyRegistro: RECAPTCHA_SITE_KEY,
      //reCartchaResponse: "",
      user: {
        name: "",
        email: "",
        firstName: "",
        sex: "",
        lastName: "",
        country: "",
        departament: "",
        city: "",
        localidad: "",
        password: "",
        confirmPassword: "",
        geoLive: {
          id: undefined,
          type: {
            id : undefined,
          }
        }
      },
      // variables de la pagina
      autocomplets: {
        countries: [
          {  },
        ],
        departments: null,
        cities: null,
        localidad: null
      },
      asterisk: "<span style='color:red'>*<span>",
      countryCountDown: 0,
      dismissSecs: 10,
      errorsMsg: [],
      optionsSex: [
        { value: 1, text: this.$t("util.sexOptions.women") },
        { value: 2, text: this.$t("util.sexOptions.men") },
        { value: 3, text: this.$t("util.sexOptions.intersex") },
      ],
      reg: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/,
      statePassword: true,
      statusTermAndUse: "not_accepted",
      terms_conditions: null,
      //captchaVerified: false,
    };
  },
  beforeCreate(){
    this.$scrollTo('.container-sipsder', 0)
  },
  mounted(){
    VAPI.get(`${SERVICE_NAMES.POLICY_TOOL}/find-one`)
    .then(response => {
        this.terms_conditions = response.data.content;
    })
    .catch(function(error) {
        console.log("Error al Consumir servicio Termns and conditions: " + error);
    });
  },
  methods: {
    onSubmit: function(event) {
      var valid = true;
      this.errorsMsg = [];

      if (this.statusTermAndUse === "not_accepted") {
        this.$refs.termsAndConditionsModal.show();
        return;
      }
      
      if (this.user.localidad !== null && this.user.localidad !== "") {
        this.user.geoLive = this.user.localidad;
        this.user.geoLive.type = {id: this.user.localidad.type.id};
      } else if (this.user.city !== null && this.user.city !== "") {
        this.user.geoLive = this.user.city;
        this.user.geoLive.type = {id: this.user.city.type.id};
      } else if (this.user.departament !== null && this.user.departament !== "") {
        this.user.geoLive = this.user.departament;
        this.user.geoLive.type = {id: this.user.departament.type.id};
      } else if (this.user.country !== null && this.user.country !== "") {
        this.user.geoLive = this.user.country;
        // console.log(this.user.geoLive.id + " estos aca " + this.user.country.type.id);
        this.user.geoLive.type = {id: this.user.country.type.id};
      } else {
        //TODO: alert en datos de ubicacion o eliminar funcion
        //this.showAlertCity();
        valid = false;
        this.errorsMsg.push(this.$t('registration.errorMsg.ubication'));
      }

      if (!this.checkPassword(this.user.password)) {
        valid = false;
        this.errorsMsg.push(this.$t('registration.errorMsg.password'));
      }
      /*
      if (this.reCartchaResponse === null || this.reCartchaResponse === undefined || this.reCartchaResponse === "") {
        valid = false;
        this.errorsMsg.push(this.$t('registration.errorMsg.captcha'));
      }*/

      if (this.user.password !== this.user.confirmPassword) {
        valid = false;
        this.errorsMsg.push(this.$t('registration.errorMsg.password_match'));
      }

      if (!this.stateEmail) {
        valid = false;
        this.errorsMsg.push(this.$t('registration.errorMsg.email'));
      }

      if (!valid) {
        this.$refs.errorsModal.show();
        return;
      }

      let newUser = {
        email: this.user.email,
        firstName: this.user.firstName,
        sexId: this.user.sex,
        lastName: this.user.lastName,
        password: this.user.password,
        geoLive : this.user.geoLive
      }

      VAPI.post("/" + SERVICE_NAMES.USER_REGISTRATION, newUser).then((response) => {
        this.$refs.creation_success.show()
        this.clearUser();
      }).catch(error => {
        console.log("Error del post" + error);

        if (error.response !== undefined && error.response.status == HTTP_STATUS.UNPROCESSABLE_ENTITY) {
          this.errorsMsg = ["El correo ya fue registrado."];
          this.$refs.errorsModal.show();
        } else {
          console.info("Error al crear el usuario", error.response);
        }
      });
    },
    onReset: function(event) {
      console.log("Reset");
    },
    /*onVerify: function(response) {
      console.log("Verify: " + response);
      this.reCartchaResponse = response;
      this.captchaVerified = true;
    },
    onExpired: function() {
      console.log("Expired");
      this.reCartchaResponse = "";
      this.captchaVerified = false;
    },
    resetRecaptcha() {
      this.reCartchaResponse = "";
      this.captchaVerified = false; 
      this.$refs.recaptcha.reset(); // Direct call reset method
    },*/
    countDownChanged(dismissCountDown) {
      this.countryCountDown = dismissCountDown;
    },
    showAlertCity: function() {
      this.countryCountDown = this.dismissCountDown;
    },
    clearUser: function() {
      this.statusTermAndUse= "not_accepted";
      this.user.name = "";
      this.user.email= "";
      this.user.firstName= "";
      this.user.sex= "";
      this.user.lastName= "";
      this.user.country= "";
      this.user.city= "";
      this.user.localidad= "";
      this.user.password= "";
      this.user.confirmPassword= "";
      //this.resetRecaptcha();
      this.user.geoLive= {
          id: undefined,
          type: {
            id : undefined,
          }
      }
    },
    checkPassword: function(password) {
      if (password.length < 6 || password.length > 20) {
        return false;
      }
      var checkNumber = false;
      var checkChar = false;

      password = password.toLowerCase();

      for (var i = 0; i < password.length; i++) { 
        if ('0' <= password[i] && password[i] <= '9') {
          checkNumber = true;
        }
        if ('a' <= password[i] && password[i] <= 'z') {
          checkChar = true;
        }
        if (checkNumber && checkChar) {
          break;
        }
      }

      if (!checkNumber || !checkChar) {
        return false;
      }

      return true;
    },
    getDepartments: async function(idParent) {
      let path = `/${SERVICE_NAMES.GEOGRAPHY}?type=${GEOGRAPHY_TYPE.DEPARTAMENTO}&idParent=${idParent}`;
      try {
        let response = await VAPI.get(path);
        // console.info("respuesta departamentos", response);
        if (response.data.length > 0) {
            this.autocomplets.departments = response.data;
          } else {
            this.autocomplets.departments = null;
            this.autocomplets.cities = null;
            this.autocomplets.localidad = null;
          }
      } catch (error) {
        this.autocomplets.departments = null;
        this.autocomplets.cities = null;
        this.autocomplets.localidad = null;
        console.info("Geografia departamento no encontrado.", error);
      }
      // console.info("respuesta departamentos>>>", this.autocomplets.departments);
    },
    getCities: function(idParent) {
      //this.$refs.loadingModal.show();
      this.showAlertCity= false;
      let path = `/${SERVICE_NAMES.GEOGRAPHY}?type=${GEOGRAPHY_TYPE.MUNICIPIO}&idParent=${idParent}`;
      // "/" + SERVICE_NAMES.GEOGRAPHY + "/type/" + GEOGRAPHY_TYPE.MUNICIPIO + "/" + idParent 
      VAPI.get(path)
        .then(response => {
          if (response.data.length > 0) {
            this.autocomplets.cities = response.data;
          } else {
            this.autocomplets.cities = null;
            this.autocomplets.localidad = null;
          }
          //this.$refs.loadingModal.hide();
        })
        .catch(error => {
          this.autocomplets.cities = null;
          this.autocomplets.localidad = null;
          //this.$refs.loadingModal.hide();
        });
    },
    getLocalidad: function(idParent) {
      //this.$refs.loadingModal.show();
      let path = `/${SERVICE_NAMES.GEOGRAPHY}?type=${GEOGRAPHY_TYPE.LOCALIDAD}&idParent=${idParent}`;
      // "/" + SERVICE_NAMES.GEOGRAPHY + "/type/" + GEOGRAPHY_TYPE.LOCALIDAD + "/" +  idParent
      VAPI.get(path)
        .then(response => {
          if (response.data.length > 0) {
            this.autocomplets.localidad = response.data;
          } else {
            this.autocomplets.localidad = null;
          }
          //this.$refs.loadingModal.hide();
        })
        .catch(error => {
          this.autocomplets.localidad = null;
          //this.$refs.loadingModal.hide();
        });
    },
    closeModal: function(ref) {
      this.$refs[ref].hide()
    },
    terms(){
      //alert("este es el modal")
      this.$refs.terms.show();
    },
    close_terms(){
      this.$refs.terms.hide();
    },
    goHome(){
        this.$router.push({ name: 'Home'})
    },
    closeSuccessModal(){
      this.$refs.creation_success.hide()
      this.goHome();
    }
  },
  components: {
    //"vue-recaptcha": VueRecaptcha,
    "vue-password": VuePassword,
    "vue-select": vSelect
  },
  computed: {
    stateEmail() {
      if (this.user.email === "") {
        return null;
      }
      let valid = this.reg.test(this.user.email);
      if (valid) {
        let emailArr = this.user.email.split("@");
        if (emailArr.length == 2) {
          let domain = emailArr[1];
          if (domain.includes("gov.co") ) {
            valid = false;
          }
        } else {
          valid = false;
        }
      }
      return valid;
    },
    invalidFeedback() {
      if (this.user.email.length === 0) {
        return "";
      }
      let msg = this.$t("registration.invalidMessage");
      
      let emailArr = this.user.email.split("@");
      if (emailArr.length == 2) {
        let domain = emailArr[1];
        if (domain.includes("gov.co") ) {
          msg = this.$t("registration.invalidMessageDomain");
        }
      }
      
      return msg;
    },
    invalidPassword() {
      if (this.user.password.length === 0) {
        return "";
      }

      return this.$t("registration.invalidMessagePassword");
    }
  },
  created() {
    let path = `/${SERVICE_NAMES.GEOGRAPHY}?type=${GEOGRAPHY_TYPE.PAIS}`;
    //"/" + SERVICE_NAMES.GEOGRAPHY + "/type/" + GEOGRAPHY_TYPE.PAIS

    VAPI.get(path)
      .then(response => {
        this.autocomplets.countries = response.data;
      })
      .catch(function(error) {
        console.log("Error al Consumir servicio geografia: " + error);
      });
  },
  watch: {
    "user.country": function(value) {
      if (value != null && value !== undefined && value != "") {
        this.getDepartments(value.id);
      } else {
        this.autocomplets.departaments = null;
        this.autocomplets.cities = null;
        this.autocomplets.localidad = null;
      }
    },
    "user.departament": function(value) {
      if (value != null && value !== undefined && value != "") {
        this.getCities(value.id);
      } else {
        this.autocomplets.cities = null;
        this.autocomplets.localidad = null;
      }
    },
    "user.city": function(value) {
      if (value != null && value !== undefined && value != "") {
        this.getLocalidad(value.id);
      }
    },
    "user.confirmPassword": function(value) {
      this.statePassword = this.user.password === this.user.confirmPassword;
    },
    "user.password": function(value) {
      if (this.user.confirmPassword.length > 0)
        this.statePassword = this.user.password === this.user.confirmPassword;
    }
  }
};
</script>
<style lang="sass" scoped>
@import '../../../stylesheets/style.sass'
@media screen  and (max-width: $widthTablet)
    .div-90
        width: 80% !important
        margin: 0 auto
</style>

<style lang="scss" scoped>

.fill-cols {
  font-size: xx-large;
}

legend .requerido {
  &::after {
    content: "*";
    color: red;
  }
}
</style>