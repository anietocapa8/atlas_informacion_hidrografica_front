<template>
    <div class="container">
        <div v-if="!addDomainModal">
            <b-form class="form-group required">
                <b-container fluid>
                    <b-row>
                        <b-col><label class="control-label">{{$t("institutionAdmin.formInstitution.institutionName")}}</label></b-col>
                        <b-col>
                            <b-form-input v-validate="'required|max:80'" name="Institution" v-model="objectModel.name">
                            </b-form-input>
                            <span class="error">{{errors.first("Institution")}}</span>
                        </b-col>
                    </b-row>
                    <b-row class="row-margin">
                        <b-col><label class="control-label">{{$t("institutionAdmin.formInstitution.userType")}}</label></b-col>
                        <b-col>
                            <b-form-select :options="userTypeOptions" v-validate="'required'" name="TipoUsuario"
                                           v-model="objectModel.userType.id">
                            </b-form-select>
                            <span class="error">{{errors.first("TipoUsuario")}}</span>
                        </b-col>
                    </b-row>
                    <b-row class="row-margin">
                        <b-col><label>{{$t("institutionAdmin.formInstitution.createdUser")}}</label></b-col>
                        <b-col>
                            <b-form-input readonly></b-form-input>
                        </b-col>
                    </b-row>
                    <b-row class="row-margin">
                        <b-col><label class="control-label">{{$t("institutionAdmin.formInstitution.status")}}</label></b-col>
                        <b-col>
                            <b-form-select :options="stateOptions" v-validate="'required'" name="Status" v-model="objectModel.status">
                            </b-form-select>
                            <span class="error">{{errors.first("Status")}}</span>
                        </b-col>
                    </b-row>
                    <b-row class="row-margin">
                        <b-alert :show="showErrorMessage" variant="danger">{{$t("institutionAdmin.formInstitution.frontValidationErrorMsg")}}</b-alert>
                        <b-alert :show="!showErrorMessage && institutionNameError" variant="danger">
                            {{$t("institutionAdmin.formInstitution.repeatInstitutionNameErrorMsg")}}
                        </b-alert>
                    </b-row>
                </b-container>
            </b-form>
            <b-container>
                <b-row>
                    <b-col>
                        <sipsder-btn :text="$t('institutionAdmin.formInstitution.addDomainBtn')"
                                     btnType="add"
                                     @onClick="showModal">
                        </sipsder-btn>
                    </b-col>
                    <b-col>
                    </b-col>
                </b-row>
                <b-row>
                    <div class="table">
                        <filter-table :optionsTable="options_table" :perPage="EmailDomainQuery['size']"
                                      :items="items" @action="action($event)" :externalQuery="EmailDomainQuery"
                                      :fields="fields_i"></filter-table>
                    </div>
                </b-row>
                <b-row>
                    <b-col>
                        <sipsder-btn :text="$t('institutionAdmin.formInstitution.saveDomainBtn')"
                                     btnType="accept"
                                     @onClick="saveInstitutionMethod">
                        </sipsder-btn>
                    </b-col>
                    <b-col>
                        <sipsder-btn :text="$t('institutionAdmin.formInstitution.cancelDomainBtn')"
                                     btnType="cancel"
                                     @onClick="hideModal">
                        </sipsder-btn>
                    </b-col>
                </b-row>
            </b-container>
            </div>
        <div v-else>
            <div v-if="showDomain">
                <add-domain @cancelDomainEvent="cancelDomainMethod" @saveDomainEvent="saveDomainMethod"/>
            </div>
            <div v-else>
                <delete-confirm :message=this.message @acceptEvent="acceptDelete" @declineEvent="declineDelete"></delete-confirm>
            </div>
        </div>
        <!--Add Domain Modal
        <b-modal id="idAddDomainModal">
            <add-domain/>
        </b-modal>
        -->
        <!-- delete confirm modal -->
    </div>
</template>

<script>
    import AddDomain from './AddDomain'
    import FilterTable from '../../shared/FilterTable'
    import DeleteConfirm from './DeleteConfirm'
    import VAPI from '../../../http_common'
    import {SERVICE_NAMES} from "../../../sipsder_constants";
    import { mapGetters } from 'vuex'
    export default {
        name: "InstitucionesRegistradas",
        props: {
            id:{
                type: Number,
                default: -1
            }
        },
        components:{
            AddDomain,
            FilterTable,
            DeleteConfirm
        },
        methods:{
            acceptDelete:function(){
                this.deleteInstitution(this.emailDetail);
                this.EmailDomainQuery = {
                    drop: true,
                    institutionId: this.id,
                    "size": 5
                };
                this.addDomainModal = false;
                this.showDomain = true;
            },
            deleteInstitution(email) {
                this.$store.dispatch("deleteDomain", email);
            },

            loadData(id){
                let self = this;
                if (id === -1){
                    this.objectModel={
                        name: '',
                        userType: {id: 0},
                        userCreated: '',
                        status: ''
                    };
                    this.EmailDomainQuery = {
                        drop: false,
                        "size": 5,
                        institutionId: id
                    }
                }else{
                this.EmailDomainQuery={
                    drop: false,
                    "size": 5,
                    institutionId: id
                };
                    VAPI.get('/' + SERVICE_NAMES.INSTITUTION + '/' + id).then(response => {
                     self.objectModel = response.data;
                 }).catch(e => {
                     console.log(" And error has ocurred loading the entity "+e.toString());
                 })
                }

            },

            declineDelete:function(){
                this.addDomainModal = false;
                this.showDomain = false;

            },
            showModal:function (event) {
                this.addDomainModal=true;
                this.showDomain = true;
                this.$emit('showModalEvent', event)
            },
            hideModal(){
                //clear error messages
                this.$emit('hideModalEvent');
            },
            clearStatus(){
                this.errors.clear();
                this.objectModel = {
                    name: '',
                    userType: {id: 0},
                    userCreated: '',
                    status: ''
                };
                this.addDomainModal = false;
                this.showDomain = true;
                this.showErrorMessage = false;
                this.institutionNameError = false;
                this.$store.dispatch("deleteEmailAdded", {});
            },
            saveDomainMethod(domainObj){
                // check form validation
                let domainDTO = {
                  id:-1,
                  domain: domainObj.domain
                };
                this.$store.dispatch('setEmailDomain',domainDTO);
                this.domainInProcess = true;
                this.addDomainModal = false;
            },
            cancelDomainMethod(){
                this.addDomainModal=false;
                //this.$store.dispatch('deleteEmailAdded', {});
            },
            action(index){

                switch(index.id) {
                    case 0:
                        this.emailDetail = index.item;
                        this.addDomainModal = true;
                        this.showDomain = false;
                        this.message = this.$t("institutionAdmin.formInstitution.questionMsg");
                        break;
                    case 1:
                        alert("esto es editar")
                        this.detail = {
                            title: "Testtest",
                            description: "Description",
                            status: "Activo"
                        };
                        break;
                    default:
                        alert("ningun caso")
                }

            },
            loadUserType(){
                let self = this;
                let arrayData = [];
                self.userTypeOptions = [];
                
                VAPI.get('/' + SERVICE_NAMES.USER_TYPE + '?type=Institucional').then(response => {
                    arrayData = response.data.data;
                    for (let i = 0; i < arrayData.length; i++) {
                        self.userTypeOptions.push({value:arrayData[i].id, text:arrayData[i].type});
                    }
                }).catch(e => {
                    console.log("Error has occurred in usertypeload "+e.toString());
                })
            },
            saveInstitutionMethod(){
                let self = this;
                this.$validator.validateAll().then(result => {
                    if (this.$validator.errors.any()){
                        self.showErrorMessage = true;
                    }else{
                        // save institutions
                        let institutionObject = {
                            institution:{
                                id: -1,
                                name: null,
                                status: null,
                                userType: {
                                    id: -1
                                }
                            },
                            emailDomains:[]
                        };
                        // load data
                        institutionObject.institution.id = this.id;
                        institutionObject.institution.name = this.objectModel.name;
                        institutionObject.institution.status = this.objectModel.status;
                        institutionObject.institution.userType.id = this.objectModel.userType.id;
                        institutionObject.emailDomains = this.$store.getters["getEmailDomainAdded"];
                        if (institutionObject.institution.id === -1){
                            //new
                            // validate name on back
                            VAPI.post('/' + SERVICE_NAMES.INSTITUTION, institutionObject).then(response => {
                                let id = response.data.id;
                                // update table
                                this.$emit("saved")
                            }).catch(e => {
                                console.log("Error creating institution "+e.toString());
                                if (e.status === 409) {
                                    // conflict name
                                    self.showErrorMessage = false;
                                    self.institutionNameError = true;
                                }
                            })
                        }else{
                            // update
                            VAPI.put('/' + SERVICE_NAMES.INSTITUTION + '/' + institutionObject.institution.id, institutionObject).then(response => {
                                // update table
                                this.$emit("saved");
                            }).catch(e => {
                                console.log("Updated institution fail "+e.toString());
                                // show error message
                            })
                        }
                    }

                });

            },

            makeQuery(id){
                this.EmailDomainQuery = {
                    drop: true,
                    "size": 5,
                    institutionId: id,

                }
            }
        },
        computed:{

        },
        watch:{
          id: function (newId) {
                  this.loadData(newId);
                  this.$validator.reset();
              this.makeQuery(newId);
          }  
        },
        mounted(){
            this.makeQuery(this.id);
            this.loadData(this.id);
        },
        beforeMount(){
            this.loadUserType();
            this.$store.dispatch("deleteEmailDomain", {});
        },
        data(){
            return{
                domainInProcess:false,
                domainDeleted:false,
                addDomainModal:false,
                institutionNameError: false,
                items:'getEmailDomain',
                showDomain:true,
                showDelete:true,
                //emailDetail:"",
                message:"",
                options_table: {
                    "edit": {
                        "id": 0,
                        "icon": 'delete'
                    }
                },

                fields_i: [
                    {
                        key: 'domain',
                        label: 'Dominio',
                        sortable: true,
                        sortDirection: 'desc'
                    },
                    {
                        key: 'actions',
                        label: 'Actions'
                    }
                ],
                EmailDomainQuery:{
                    "size": 5,
                    institutionId: this.id
                },

                EmailDomainQueryExt:{
                    "size": 5,
                    institutionId: this.id
                },
                stateOptions:[
                    {
                        value: false,
                    text: "Inactivo"},
                    {
                        value: true,
                    text:"Activo"}
                ],
                userTypeOptions: [],
                showErrorMessage: false,

                objectModel:{
                    name: '',
                    userType: {id: 0},
                    userCreated: '',
                    status: ''
                }


            }
        }
    }
</script>

<style lang="sass" scoped>
.button-center-container
    text-align: center

    .table
    width: 100%
</style>

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
</style>