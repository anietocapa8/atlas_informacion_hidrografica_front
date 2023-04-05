<template>
    <div class="container container-form">
        <b-container>
            <sipsder-title :title="$t('userAdmin.title').toUpperCase()"
                           type="admin"
                           section="configuration">
            
                <div class="filter-container" slot="content">
                    <b-row>
                        <b-col class="title-fitler" cols="8">
                            {{ $t('faqs.filter_title') }}
                        </b-col>
                    </b-row>
                    <b-row class="filter">
                        <b-col>
                            <user-searcher @searchEvent="searchMade" @resetSearch="resetMade"/>
                        </b-col>
                    </b-row>
                </div>                           
            </sipsder-title>

        </b-container>
        <hr/>
        <h1 align="center" class="font-weight-bold" v-if="!madeSearch">{{$t("userAdmin.tableDefaultTitle").toUpperCase()}}</h1>
        <h1 align="center" class="font-weight-bold" v-else>{{$t("userAdmin.tableSearchTitle").toUpperCase()}}</h1>
        <div class="table">
            <filter-table :optionsTable="options_table" :perPage="userQuery['size']" :items="items" @action="action($event)" :externalQuery="userQuery" :fields="fields"></filter-table>
        </div>

        <div class="button-container">
            <b-row>
                <b-col>
                    <b-row>
                        <b-col>
                            <sipsder-btn :text="$t('userAdmin.backBtn')"
                                         btnType="back"
                                         @onClick="$router.push({name:'Home'})"></sipsder-btn>
                        </b-col>
                        <!-- <b-col>
                            <sipsder-btn :text="$t('userAdmin.adminInstitutionsBtn')"
                                         btnType=""
                                         @onClick="$router.push({name:'InstitutionAdmin'})"></sipsder-btn>
                        </b-col> -->
                    </b-row>
                </b-col>
            </b-row>
        </div>

        <b-modal ref="modifyModal"
                size="lg"
                class="font-weigth-bold"
                :title="$t('userAdmin.editModal.title')"
                scrollable 
                :hide-footer="true">
            <b-form>
                <b-form-group>
                    <b-row>
                        <b-col cols="4" class="font-weight-bold">
                            {{$t("userAdmin.editModal.name")}}
                        </b-col>
                        <b-col>
                            <b-input :value="currUser.firstName + ' ' + currUser.lastName" disabled>
                            </b-input>
                        </b-col>
                    </b-row>
                    <br>
                    <b-row>
                        <b-col cols="4" class="font-weight-bold">
                            {{$t("userAdmin.editModal.email")}}
                        </b-col>
                        <b-col>
                            <b-input :value="currUser.email" disabled>
                            </b-input>
                        </b-col>
                    </b-row>
                    <br>
                    <b-row>
                        <b-col cols="4" class="font-weight-bold">
                            {{$t("userAdmin.editModal.institution")}}
                        </b-col>
                        <b-col>
                            <vue-select v-model="userInstitution" 
                                :placeholder="$t('userAdmin.editModal.selectOption')"
                                label="name" :options="getInstitutions"
                                :disabled="isSDPOficial(currUser)"
                            >
                            </vue-select>
                        </b-col>
                    </b-row>
                    <br>
                    <b-row>
                        <b-col cols="4" class="font-weight-bold">
                            {{$t("userAdmin.editModal.userTypeLabel")}}
                        </b-col>
                        <b-col>
                            <b-form-group :description="typeStatus()">
                                <b-form-select 
                                    v-model="currUser.type"
                                    :options="userTypeOptions"
                                    :disabled="isSDPOficial(currUser)"
                                />
    
                            </b-form-group>
                        </b-col>
                    </b-row>
                    <br>
                    <b-row>
                        <b-col cols="4" class="font-weight-bold" vertical-align="center">
                            {{$t("userAdmin.editModal.authType")}}
                        </b-col>
                        <b-col>
                            <b-input :value="getAuthTypeTextCurrUSer()" disabled>
                            </b-input>
                        </b-col>
                    </b-row>
                    <br>
                    <b-row >
                        <b-col cols="4" class="font-weight-bold">
                            <label>{{$t("userAdmin.editModal.statusLabel")}}</label>
                        </b-col>
                        <b-col>
                            <b-form-select id="idStatus"
                                           v-model="currUser.statusValue"
                                           :options="stateOptions"
                            >
                            </b-form-select>
                        </b-col>
                    </b-row>
                    <br>
                    <b-row v-if="currUser.statusValue == stateOptions.NO_CHECK.value">
                        <b-col cols="4" class="font-weight-bold" vertical-align="center">
                            {{$t("userAdmin.editModal.justification")}} <span style='color:red'>*</span>
                        </b-col>
                        <b-col>
                            <b-textarea rows="3" v-model="currUser.motiveDisabled">
                            </b-textarea>
                        </b-col>
                    </b-row>
                    <br>
                    <b-row>
                        <b-col cols="4" class="font-weight-bold">
                            {{$t("userAdmin.editModal.creationDate")}}
                        </b-col>
                        <b-col>
                            <b-input v-model="currUser.creationDate" disabled>
                            </b-input>
                        </b-col>
                    </b-row>
                    <br>
                    <b-row>
                        <b-col cols="4" class="font-weight-bold">
                            {{$t("userAdmin.editModal.editionDate")}}
                        </b-col>
                        <b-col>
                            <b-input v-model="currUser.lastModifiedDate" disabled>
                            </b-input>
                        </b-col>
                    </b-row>
                    <br>
                    <b-row>
                        <b-col cols="4" class="font-weight-bold">
                            {{$t("userAdmin.editModal.editionUser")}}
                        </b-col>
                        <b-col>
                            <b-input v-model="editUser" disabled>
                            </b-input>
                        </b-col>
                    </b-row>
                    <br>
                    <b-row >
                        <b-col class="d-flex justify-content-center">
                            <sipsder-btn :text="$t('userAdmin.editModal.saveBtn')"
                                         btnType="accept"
                                         @onClick="updateUser"></sipsder-btn>
                        </b-col>
                        <b-col class="d-flex justify-content-center">
                            <sipsder-btn :text="$t('userAdmin.editModal.cancelBtn')"
                                         btnType="cancel"
                                         @onClick="cancelEdit"></sipsder-btn>
                        </b-col>
                    </b-row>
                </b-form-group>
            </b-form>
        </b-modal>
        <b-modal
                ref="successModal"
                :title="$t('userAdmin.editModal.updatedTitle')"
                :hide-footer="true"
                @hide="resetMade"
        >
            {{$t("userAdmin.editModal.updatedMessage")}}
            <br>
            <sipsder-btn :text="$t('button.accept')"
                         btnType="accept"
                         @onClick="hideSuccessModal"></sipsder-btn>
        </b-modal>

    </div>
</template>

<script>
    import UserSearcher from "./UserSearcher"
    import UserCreator from "./UserCreator"
    import vSelect from "vue-select";
    import FilterTable from '../../shared/FilterTable.vue'
    import VAPI from '../../../http_common'
    import {SERVICE_NAMES, HTTP_STATUS, INSTITUTION_IDS} from "../../../sipsder_constants";
    import {AUTHENTICATION_TYPE, USER_STATUS} from "../../../domain_constants";

    export default {
        name: "UsersAdmin",
        data(){
          return{
              //Query
              name:"",
              email:"",
              userType:"",
              institution:"",
              madeSearch:false,
              userTypes: [],
              userTypesModal: [],
              user: {
                  id: '',
                  status: '',
                  userType: {id: ''},
                  name: '',
                  lastName: '',
                  email: '',
                  motiveDisabled: '',
              },
              currUser: {
                id: null,
                firstName: "",
                lastName: "",
                email: "",
                authType: null,
                creationDate: "",
                lastModifiedDate: "",
                motiveDisabled: "",
                statusValue: null,
                typeName: "",
              },
              userInstitution: {name: ''},
              editUser: '',
              institutions: [],
              //Table data
              items: 'getUser',
              options_table: {
                  "detail": {
                      "id": 0,
                      "class": "btn-success",
                      "label": "",
                      "icon": 'edit_pen'
                  }
              },
              userQuery:{
                  "size":5
              },
              size: 5,
              fields:[
                  {
                      key: 'firstName',
                      label: this.$t('userAdmin.tableTitles.name'),
                      sortable: true,
                      sortDirection: 'desc',
                      'class': 'text-center overflow-wrap word-break'
                  },
                  {
                      key: 'lastName',
                      label: this.$t('userAdmin.tableTitles.lastname'),
                      sortable: true,
                      sortDirection: 'desc',
                      'class': 'text-center overflow-wrap word-break'
                  },
                  {
                      key: 'email',
                      label: this.$t('userAdmin.tableTitles.email'),
                      'class': 'text-center overflow-wrap word-break'
                  },
                  {
                      key: 'type',
                      label: this.$t('userAdmin.tableTitles.userType'),
                      sortable: true,
                      sortDirection: 'desc',
                      'class': 'text-center overflow-wrap',
                      formatter: value => {
                          return value.type;
                      }
                  },
                  {
                        key: 'authType',
                        label: this.$t('userAdmin.tableTitles.authType'),
                        sortable: true,
                        sortDirection: 'desc',
                        'class': 'text-center overflow-wrap ',
                        formatter: value => {
                            
                            return this.getAuthTypeText(value);
                        }
                  },
                  {
                      key: 'statusValue',
                      label: this.$t('userAdmin.tableTitles.state'),
                      sortable: true,
                      sortDirection: 'desc',
                      'class': 'text-center overflow-wrap word-break',
                      formatter: value => {
                          let res = USER_STATUS.NO_AUTHORIZED.text;
                          switch(value) {
                                case USER_STATUS.NO_CHECK.value:
                                    res = USER_STATUS.NO_CHECK.text;
                                    break;
                                case USER_STATUS.NO_PROFILE.value:
                                    res = USER_STATUS.NO_PROFILE.text;
                                    break;
                                case USER_STATUS.AUTHORIZED.value:
                                    res = USER_STATUS.AUTHORIZED.text;
                                    break;
                                default :
                                    res = USER_STATUS.NO_AUTHORIZED.text;
                          }
                          return res;
                      }
                  },
                  {
                      key: 'creationDate',
                      label: this.$t('userAdmin.tableTitles.createdDate'),
                      sortable: true,
                      sortDirection: 'desc',
                      'class': 'text-center overflow-wrap word-break'
                  },
                  {
                      key: 'lastModifiedDate',
                      label: this.$t('userAdmin.tableTitles.lastModifiedDate'),
                      sortable: true,
                      sortDirection: 'desc',
                      'class': 'text-center overflow-wrap word-break'
                  },
                  {
                      key: 'actions',
                      label: this.$t('userAdmin.tableTitles.actions'),
                  }
              ],
              stateOptions: USER_STATUS,
              options: [{
                  value: null,
                  text: 'Please select an option'
                 },
                  {
                      value: 'a',
                      text: 'This is First option'
                  },
                  {
                      value: 'b',
                      text: 'Selected Option'
                  },
                  {
                      value: {
                          'C': '3PO'
                      },
                      text: 'This is an option with object value'
                  },
                  {
                      value: 'd',
                      text: 'This one is disabled',
                      disabled: true
                  }
              ],
          }
        },
        components:{
            UserSearcher,
            UserCreator,
            FilterTable,
            "vue-select": vSelect,
        },
        methods:{
            isSDPOficial (currUser) {
                return currUser.authType == AUTHENTICATION_TYPE.SDP_OFFICIAL.value;
            },
            typeStatus() {
                if (!this.currUser.type) {
                    return this.$t('util.obligatoryField');
                }
                return "";
            },
            hideSuccessModal() {
                this.$refs.successModal.hide();
            },
            searchMade:function (event, form) {
                
                this.madeSearch=true;
                
                this.userQuery = {
                    drop: false,
                    name:form.name,
                    email:form.email,
                    userType:form.userType,
                    state:form.state,
                    institution: encodeURI(form.institution),
                    size: this.size
                }
            },
            copyUser (backUser) {
                this.currUser = backUser;
                // console.info("Usuario copiado", this.currUser);
            },
            async loadUserData (id) {
                try {
                    let response = await VAPI.get(`/${SERVICE_NAMES.USER_ADMIN}/${id}`);
                    if (response.status == HTTP_STATUS.OK) {
                        this.editUser = response.data.userEditedName;
                        if (response.data.institution)
                            this.userInstitution = response.data.institution;
                        else
                            this.userInstitution = {name: ''}
                        this.copyUser(response.data.user);
                        // this.currUser = response.data.user;
                    } else {
                        console.info("Error mapping user ", e)
                    }
                    // console.info("Respuesta User > : ", this.editUser, this.userInstitution, this.currUser);
                } catch (e) {
                    console.info("Error Loading user ", e)
                }

                if (this.isSDPOficial) {
                    // this.userInstitution = this.institutions.find(x => x.id == INSTITUTION_IDS.SDP);
                    this.userInstitution =  this.institutions.filter(org => org.id === INSTITUTION_IDS.SDP);
                }
                return this.currUser;
            },
            updateUser(){
                let self = this;
                if (!this.currUser.type) {
                    return;
                }
                let param= {
                     'institutionID': null,
                     'userTypeID': this.currUser.type.id,
                     'statusID': this.currUser.statusValue,
                     'motiveDisabled': this.currUser.motiveDisabled,
                };

                if (this.userInstitution) {
                    param.institutionID = this.userInstitution.id;
                }

                VAPI.put("/" + SERVICE_NAMES.USER_ADMIN + "/" + this.user.id, param).then(response => {
                    self.$refs.successModal.show();
                }).catch(e => {
                    console.info("Error updating ", e)
                })
            },
            cancelEdit(){
                this.$refs.modifyModal.hide();
            },
            loadUserTypes(array){
                // console.info("Load user type data ", array);
                this.userTypesModal = [];
                VAPI.get(`${SERVICE_NAMES.USER_TYPE}`).then(response => {
                    let arrayData = response.data.data;
                    let i = 0;
                    // console.log("loading usertypes user", arrayData);
                    for (i = 0; i < arrayData.length; i++) {
                        array.push({value: arrayData[i].id, text: arrayData[i].type});
                        this.userTypesModal.push({text: arrayData[i].type, value: arrayData[i]});
                    }
                }).catch(e => {
                    console.info("Error has occurred in usertypeload ", e);
                })
                // console.info("Tipos de usuario: ", this.userTypesModal);
            },
            getAuthTypeTextCurrUSer() {
                let value = this.currUser.authType;
                return this.getAuthTypeText(value);
            },
            getAuthTypeText(value){
                let res = "SIPSDER";
                // console.info("Tipo autenticacion: ", value);
                switch (value) {
                    case AUTHENTICATION_TYPE.CITIZEN.value:
                        res = AUTHENTICATION_TYPE.CITIZEN.text;
                        break;
                    case AUTHENTICATION_TYPE.SDP_OFFICIAL.value:
                        res = AUTHENTICATION_TYPE.SDP_OFFICIAL.text;
                        break;
                    case AUTHENTICATION_TYPE.SDP_AUTHORIZED.value:
                        res = AUTHENTICATION_TYPE.SDP_AUTHORIZED.text;
                        break;
                    default:
                        res = AUTHENTICATION_TYPE.CITIZEN.text;
                }
                // console.info("Tipo autenticacion - res: ", res);
                return res;
            },
            resetMade:function(){
                this.madeSearch=false;
                this.userQuery= {
                    drop: true,
                    "size": 5
                }
            },
            async action(index){
                switch(index.id) {
                    case 0:
                        this.user.id = index.item.id;
                        this.user = await this.loadUserData(index.item.id);
                        this.$refs.modifyModal.show();
                        break;
                    case 1:
                        // console.info("esto es editar");
                        this.detail = {
                            title: "Testtest",
                            description: "Description",
                            status: "Activo"
                        }
                        break;
                    default:
                        console.info("ningun caso")
                }
            },
            async loadInstitutions() {
                let path = `/${SERVICE_NAMES.INSTITUTION}/all?profile=true`;
                try {
                    let response = await VAPI.get(path);
                    if (response.status == HTTP_STATUS.OK) {
                        this.institutions = response.data.data;
                    }
                } catch (error) {
                    console.info("Problemas al buscar instituciones", error);
                }

            },
        },
        computed: {
            getInstitutions() {
                var ret = this.institutions;
                if (this.currUser && this.currUser.type) {
                    ret =  this.institutions.filter(org => org.typeId === this.currUser.type.id);
                }
                return ret;
            },
            userTypeOptions() {
                let options = []
                if (this.currUser.authType == AUTHENTICATION_TYPE.CITIZEN.value) {
                    options = this.userTypesModal.filter(type => type.value.authType == AUTHENTICATION_TYPE.CITIZEN.value);
                } else if (this.currUser.authType == AUTHENTICATION_TYPE.SDP_OFFICIAL.value) {
                    options = this.userTypesModal.filter(type => type.value.authType == AUTHENTICATION_TYPE.SDP_OFFICIAL.value);
                } else {
                    options = this.userTypesModal.filter(type => type.value.authType == AUTHENTICATION_TYPE.SDP_AUTHORIZED.value);
                }
                return options;
            }
        },
        created(){
            this.loadUserTypes(this.userTypes);
            this.loadInstitutions();
        },
        watch: {
            'currUser.type': function (val) {
                // console.info("Cambio: ", (this.userInstitution && this.getInstitutions.filter(ins => ins.id === this.userInstitution.id).length == 0));
                if (this.userInstitution && this.getInstitutions.filter(ins => ins.id === this.userInstitution.id).length == 0) {
                    this.userInstitution = null;
                }
            }
        },
    }
</script>

<style lang="sass" scoped>
    @import '../../../stylesheets/style.sass'

    .button-container
        text-align: center

    .left-button-container
        text-align: right

    .row-margins
        padding-top: 2%

    .filter-container
        padding: 15px 15px 5px 15px
        border-radius: 10px
        background-color: $colorTitleDark
    .title-fitler
        color: white
        font-style: italic
        font-weight: bolder
        font-size: 2.5rem
    .filter
        margin: 10px 0
        justify-content: space-between
        align-items: center
        input
            border-radius: 10px
            padding: 2px 20px
</style>