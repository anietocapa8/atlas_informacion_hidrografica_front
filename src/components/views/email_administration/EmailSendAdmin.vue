<template>
    <div class="container container-form">
        <b-container>
        <sipsder-title :title="$t('smtp_admin.title')"
                       type="admin"
                       :text="$t('smtp_admin.welcomeMessage')"
                       section="configuration"></sipsder-title>
        <div class="container">
            <div class="button-right-container">
                <sipsder-btn :text="$t('smtp_admin.btnAdd')"
                             btnType="add"
                             v-b-modal.idAddEmailServer></sipsder-btn>
            </div>
        </div>
        <div class="counter-container">
            {{ $t('smtp_admin.register_of') + $store.getters.getEmailAdministrationMeta }}
        </div>
        <div class="table">
            <filter-table :optionsTable="options_table" :perPage="emailQuery['size']" :items="items"
                          @action="action($event)" :externalQuery="emailQuery" :fields="fields_1"></filter-table>
        </div>
        <div class="button-center-container">
            <sipsder-btn :text="$t('smtp_admin.btnReturn')"
                         btnType="back"
                         @onClick="$router.push({name:'Home'})"></sipsder-btn>
        </div>
        <b-modal id="idAddEmailServer"
                 ref="refAddEmailServer"
                 :title="addModalTitle"
                 hide-footer
                 @hidden="hideModal">
                <add-server :item="emailAdministration" @exitModal="hideModal" @successEvent="successModal" ref="refAddComponent"/>
        </b-modal>
        <b-modal ref="refSuccessModal"
                 :title="successModalTitle"
                 hide-footer
                 @hide="refreshTable"
        >
            <div class="fluid-container">
                <b-alert variant="success" show>
                    {{ $t('smtp_admin.success_saving') }}
                </b-alert>
            </div>
            <sipsder-btn :text="$t('smtp_admin.btnAccept')"
                         @onClick="hideSuccessModal"
                         btnType="accept"></sipsder-btn>
        </b-modal>
        </b-container>
    </div>
    
</template>

<script>
    import AddServer from './AddServer'
    import FilterTable from '../../shared/FilterTable'
    import VAPI from '../../../http_common'
    import {SERVICE_NAMES} from "../../../sipsder_constants";

    export default {
        name: "EmailSendAdmin",
        components:{
            AddServer,
            FilterTable,
        },
        data() {
            return {
                //Table data
                firstRegister: 0,
                lastRegister: 0,
                items: 'getEmailAdministration',
                success:false,
                addModalTitle: this.$t("smtp_admin.titleAddServer"),
                successModalTitle: this.$t("smtp_admin.titleSuccess"),
                options_table: {
                    "detail": {
                        "id": 0,
                        "class": "btn-success",
                        "label": '',
                        "icon": 'search'
                    }
                },
                fields_1: [
                    {
                        key: 'serverName',
                        label: this.$t("smtp_admin.tableName"),
                        sortable: true
                    },
                    {
                        key: 'email',
                        label: this.$t("smtp_admin.tableEmail"),
                        sortable: true
                    },
                    {
                        key: 'smtpServer',
                        label: this.$t("smtp_admin.tableSmtpServer"),
                        sortable: true
                    },
                    {
                        key: 'port',
                        label: this.$t("smtp_admin.tablePort"),
                        sortable: true
                    },
                    {
                        key:'statusName',
                        label: this.$t("smtp_admin.tableStatus"),
                        sortable: true
                    },
                    {
                        key: 'lastModifiedDate',
                        label: this.$t("smtp_admin.tableLastUpdate"),
                        sortable: true
                    },
                    {
                        key: 'actions',
                        label: this.$t("smtp_admin.tableActions")
                    }
                ],
                emailQuery: {
                    "size": 5
                },
                emailAdministration: {
                    'id':-1,
                    'name':"",
                    'email':"",
                    'servidorSmtp':"",
                    'port':"",
                    'status':{'id':0},
                    'pass':'',
                    'lastModifiedDate':""
                },
            }
        },
        methods:{
            hideSuccessModal() {
                this.$refs.refSuccessModal.hide();
            },
            getEntity: function(value){
                if (value === -1){
                }else{
                    VAPI.get(`${SERVICE_NAMES.SMTP_SERVER}/${value}`).then(response => {
                            this.emailAdministration = response.data;
                            if(this.emailAdministration.ssl){
                              this.emailAdministration.ssl = 1;
                            }else{
                              this.emailAdministration.ssl = 0;
                            }
                        }
                    ).catch(error => {
                        console.error("Error al cargar la entidad " + error.toString());
                    });
                }
            },
            action(index){

                switch(index.id) {
                    case 0:
                        this.getEntity(index.item.id);
                        //this.emailAdministration = index.item;
                        this.$refs.refAddEmailServer.show();
                        break;
                    case 1:
                        alert("esto es editar"); // TODO: Alert refactor
                        this.detail = {
                            title: "Testtest",
                            description: "Description",
                            status: "Activo"
                        }
                        break;
                    default:
                        alert("ningun caso") // TODO: Alert refactor
                }
            },

            refreshTable(){
                this.emailQuery = {
                    drop: true,
                    "size":5
                }
            },

            hideModal:function () {
                this.$refs.refAddEmailServer.hide();
                for(let i=0; i<10; i++){
                    this.$refs.refAddComponent.clearErrors();
                }
                this.emailAdministration = {
                    'id':-1,
                        'name':"",
                        'email':"",
                        'servidorSmtp':"",
                        'port':"",
                        'status':0,
                        'lastModifiedDate':""
                };
                },
            successModal:function () {
                this.$refs.refAddEmailServer.hide();
                this.EmailDomainQuery = {
                    drop: true,
                    "size": 5
                };
                this.$refs.refSuccessModal.show();
            }
        }
    }
</script>

<style lang="sass" scoped>
    .button-right-container
        width: 100%
        text-align: right
    .button-center-container
        text-align: center
        .counter-container
            width: 100%
            text-align: right


</style>