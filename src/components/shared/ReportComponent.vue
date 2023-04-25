<template>
    <div>
        <b-row>
            <span v-b-tooltip.hover :title="$t('report_content.report')">
                <b-col class="d-flex">
                    <b-button @click="showReport" variant="warning" 
                            v-if="isAdmin && localCntReport > 0">
                        <i class="fas fa-exclamation-triangle color-icon"></i>
                    </b-button>

                    <b-button @click="showReport" 
                        v-else-if="isAdmin && !localCntReport">
                        <i class="fas fa-exclamation-triangle color-icon-notPending"></i>
                    </b-button>

                    <b-button @click="showReport" v-else>
                        <i class="fas fa-exclamation-triangle"></i>
                    </b-button>

                    <span class="admin-reports" v-if="isAdmin && localCntReport > 0">
                        {{localCntReport}}
                    </span>
                </b-col>
            </span>
        </b-row>

        <!--notLoggedModal -->
        <b-modal ref="notLoggedModal"
                 :title="$t('report_content.notLoggedModal.title')"
                 :hide-footer="true"
        >
            <b-row>
                <b-col>
                    {{$t('report_content.notLoggedModal.message')}}
                </b-col>
            </b-row>
            <br>

            <b-row>
                <b-col class="d-flex justify-content-center">
                    <sipsder-btn :text="$t('report_content.notLoggedModal.buttonText')"
                                @onClick="hideModal('notLoggedModal')"
                                btnType="accept"
                    ></sipsder-btn>
                </b-col>
            </b-row>
        </b-modal>

        <!-- report modal -->
        <b-modal ref="reportModal"
                 :title="$t('report_content.reportModal.title')"
                 :hide-footer="true"
                 @hide="cleanModalReport"
        >
            <b-form @submit.prevent="saveReport">

                <b-row class="row-container">
                    <b-col cols="12">
                        {{$t('report_content.reportModal.message')}}
                    </b-col>
                </b-row>
                <!-- <b-row class="row-container">
                    {{$t('report_content.reportModal.instruction')}}
                </b-row> -->
                <b-row class="row-container">
                    <b-col>
                        <b-form-group
                            :invalid-feedback="errors.first(`${$t('report_content.reportModal.fieldNames.inputReport')}`)">
                            <b-form-textarea 
                                        :name="$t('report_content.reportModal.fieldNames.inputReport')"
                                        :placeholder="$t('report_content.reportModal.instruction')"
                                        v-validate="{required: true, max: 500}"
                                        v-model="reportObject.report.report"
                                        :rows="3"
                                        :state="validateState(`${$t('report_content.reportModal.fieldNames.inputReport')}`)"
                            >
                            </b-form-textarea>
                        </b-form-group>
                    </b-col>
                </b-row>
                <b-row class="row-container">
                    
                    <b-col class="d-flex justify-content-center">
                        <sipsder-btn :text="$t('report_content.reportModal.acceptBtn')"
                                        type="submit"
                                        btnType="accept"
                        ></sipsder-btn>
                    </b-col>
                    <b-col class="d-flex justify-content-center">
                        <sipsder-btn :text="$t('report_content.reportModal.cancelBtn')"
                                        @onClick="hideReportModal"
                                        btnType="cancel"
                        ></sipsder-btn>
                    </b-col>
                    
                </b-row>
            </b-form>
        </b-modal>

        <!-- Admin modal -->
        <b-modal ref="refAdminModal"
                 :title="$t('report_content.adminModal.title')"
                 :hide-footer="true"
                 size="lg"
                 @hide="cleanAdminModal"
        >
            <b-row>
                <!--
                <filter-table :options-table="options_table" :perPage="reportsQuery['size']"
                              :items="items" @action="action($event)" :externalQuery="reportsQuery" :fields="fields_in"></filter-table>
              -->
                <b-col>
                    <b-table responsive :fields="fields_in" :items="itemsLoaded" size="lg" v-if="itemsLoaded.length > 0">
                        <template slot="status" slot-scope="data">

                            <b-form-checkbox v-model="data.item.status" class="d-flex justify-content-center">
                            </b-form-checkbox>

                        </template>
                    </b-table>
                    <span v-else>
                        {{$t('report_content.adminModal.emptyTable')}}
                    </span>
                </b-col>

            </b-row>
            <b-row>
                <b-col v-if="itemsLoaded.length > 0" class="d-flex justify-content-center">
                    <sipsder-btn :text="$t('report_content.adminModal.saveBtn')"
                                 btnType="add"
                                 @onClick="saveAdminModal"
                    ></sipsder-btn>
                </b-col>
                <b-col v-if="itemsLoaded.length > 0" class="d-flex justify-content-center">
                    <sipsder-btn :text="$t('report_content.adminModal.cancelBtn')"
                                 btnType="cancel"
                                 @onClick="hideAdminModal"
                    ></sipsder-btn>
                </b-col>
                <b-col v-if="!itemsLoaded.length" class="d-flex justify-content-center">
                    <sipsder-btn :text="$t('report_content.adminModal.closeBtn')"
                                 btnType="cancel"
                                 @onClick="hideAdminModal"
                    ></sipsder-btn>
                </b-col>
            </b-row>
        </b-modal>

        <b-modal ref="successModal"
                 :title="$t('report_content.adminModal.title')"
                 :hide-footer="true"
                 @hide="cleanAdminModal">
            
            <b-row>
                <b-col>
                    {{$t('report_content.adminModal.successMsg')}}
                </b-col>
            </b-row>
            <br>
            <b-row>
                <b-col class="d-flex justify-content-center">
                    <sipsder-btn :text="$t('report_content.notLoggedModal.buttonText')"
                                @onClick="hideModal('successModal')"
                                btnType="accept"
                    ></sipsder-btn>
                </b-col>
            </b-row>
        </b-modal>

    </div>
</template>

<script>

    import {SERVICE_NAMES, HTTP_STATUS} from "../../sipsder_constants";
    import {PERMISSIONS_TYPES} from '../../domain_constants'
    import VAPI from '../../http_common'
    import FilterTable from './FilterTable'

    export default {
        name: "ReportComponent",
        props: {
            contentType: {
                type: Number,
                required: true
            },
            contentId: {
                type: Number,
                required: true
            },
            cntReport: {
                type: Number,
                default: null
            }
        },
        components: {
            FilterTable
        },
        data() {
            return {
                items: 'getReports',
                itemsLoaded: [],
                options_table: {
                    "detail": {
                        "id": 0,
                        "class": "btn-success",
                        "label": "",
                        "icon": 'edit_pen'
                    }
                },
                updateObject: {
                    reportsToUpdate: []
                },
                reportsQuery: {
                    "size": 2
                },
                fields_in: [
                    {
                        key: 'userName',
                        label: this.$t('report_content.adminModal.tableFields.user'),
                        sortable: true
                    },
                    {
                        key: 'date',
                        label: this.$t('report_content.adminModal.tableFields.date'),
                        sortable: true
                    },
                    {
                        key: 'userType',
                        label: this.$t('report_content.adminModal.tableFields.userType'),
                        sortable: true
                    },
                    {
                        key: 'report',
                        label: this.$t('report_content.adminModal.tableFields.report'),
                        sortable: false
                    },
                    {
                        key: 'status',
                        label: this.$t('report_content.adminModal.tableFields.checked'),
                        sortable: false
                    }
                ],
                pending: false,
                role: null,
                isAdmin: false,
                reportText: '',
                localCntReport: 0,
                reportObject: {
                    report: {
                        id: -1,
                        status: false,
                        report: '',
                    },
                    idContent: this.contentId,
                    idType: this.contentType
                }
            }
        },

        methods: {
            saveAdminModal() {
                let self = this;
                let query = `/${SERVICE_NAMES.REPORT}/${this.contentType}`
                //'/' + SERVICE_NAMES.REPORT + '/1/status'
                this.updateObject.reportsToUpdate = this.itemsLoaded;
                this.updateObject.idType = this.contentType;
                VAPI.put(query, this.updateObject).then(response => {
                    // show success modal
                    self.$refs.successModal.show();
                    self.$refs.refAdminModal.hide();
                }).catch(ex => {
                    console.log("error saving reports admin " + ex.toString());
                });
            },
            cleanAdminModal() {
                if (this.isAdmin) {
                    this.loadItems();
                }
            },
            hideAdminModal() {
                this.$refs.refAdminModal.hide();
            },
            loadItems() {
                let query = `/${SERVICE_NAMES.REPORT}?type=${this.contentType}&relatedId=${this.contentId}`
                // '/' + SERVICE_NAMES.REPORT + '/commentId/' + this.contentId
                VAPI.get( query ).then(response => {
                    if (response.status === HTTP_STATUS.OK) {
                        this.itemsLoaded = response.data;

                        this.localCntReport = this.itemsLoaded.filter(function(x) {
                            return x.status ==0;
                        }).length;

                    } else if (response.status === HTTP_STATUS.NO_CONTENT) {
                        this.itemsLoaded = [];
                    }
                }).catch(error => {
                    console.log("Error Loading reports", error);
                });
            },
            cleanModalReport() {
                this.reportObject.report.report = '';
            },
            saveReport() {
                let valid = this.validateState(`${this.$t('report_content.reportModal.fieldNames.inputReport')}`);
                
                if (!valid) {
                    return;
                }
                this.reportObject.routerName = this.$route.name;
                this.reportObject.path = this.$route.path;

                VAPI.post('/' + SERVICE_NAMES.REPORT, this.reportObject).then(response => {
                    console.log("registro exitoso");
                    console.log(response);
                    if (response.status === HTTP_STATUS.OK) {
                        this.hideReportModal();
                        this.$refs.successModal.show();
                    } else {
                        alert("Problemas al guardar el reporte.");
                    }
                    //this.cleanModalReport();
                }).catch(ex => {
                    console.log("registro fallido " + ex.toString());
                    alert("Error al realizar el reporte.");
                })
            },
            showModal(modal) {
                this.$refs[modal].show();
            },
            // showModal() {
            //     this.$refs.notLoggedModal.show();
            // },
            // showReportModal() {
            //     this.$refs.reportModal.show();
            // },
            hideModal(modal) {
                this.$refs[modal].hide();
            },
            // hideModal() {
            //     this.$refs.notLoggedModal.hide();
            // },
            // hideSuccessModal() {
            //     this.$refs.successModal.hide();
            // },
            hideReportModal() {
                // clear fields
                this.cleanModalReport();
                this.$validator.reset();
                this.$refs.reportModal.hide();
                //this.$refs.successModal.show();
            },
            loadUserRole() {
                let user = this.$store.getters.getCurrentUser;
            },
            findUserRole() {
                if(this.$store.getters.hasPermission(PERMISSIONS_TYPES.ADMIN)) {
                    this.isAdmin = true;
                } else {
                    this.isAdmin = false;
                }
            },
            async showReport() {
                if (this.isLogged === false) {
                    // show modal informative
                    this.showModal('notLoggedModal');
                } else {
                    this.hideModal('notLoggedModal');
                    // is Admin or logged user
                    if (this.isAdmin) {
                        // // show admin form
                        await this.loadItems();
                        
                        this.$refs.refAdminModal.show();
                    } else {
                        //show report form
                        this.showModal('reportModal');
                    }
                }
            },
            validateState(name) {

                if (this.veeFields[name] && (this.veeFields[name].dirty || this.veeFields[name].validated)) {
                    
                    return !this.errors.has(name);
                }
                return null;
            },

        },

        computed: {
            usr: function () {
                return this.$store.getters.getCurrentUser;
            },
            isLogged: function () {
                return this.$store.getters.isAuthenticated && this.$store.getters.hasPermission(PERMISSIONS_TYPES.PARTICIPATE);
            }
        },

        // watch: {
        //     usrRole: function (val) {
        //         this.findUserRole(val);
        //     }
        // },

        mounted() {
            this.findUserRole();
            if (this.cntReport && this.cntReport != null) {
                this.localCntReport = this.cntReport;
            } else { // Caso especial en el que no se tiene info desde el componente padre.
                if (this.isAdmin) {
                    this.loadItems();
                }
            }
            this.loadUserRole();
        },
        beforeMount() {
        }

    }
</script>

<style scoped>
    .color-icon {
        color: #F00;
    }

    .color-icon-notPending {
        color: #000;
    }

    /*.fa-exclamation-triangle {*/
    /*background: white;*/
    /*}*/

    .button-container {
        background: white;
        border: none;
    }

    .row-container {
        padding-top: 2%;
        padding-left: 2%;
        padding-right: 2%;
    }

    .admin-reports {
        padding-left: 2%;
        font-size: medium;
    }

</style>