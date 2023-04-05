<template>
    <div id="notification" >
        <b-container class='container-form'>
            <sipsder-title :title="$t('notification.title')">
                <b-form slot="content">
                    <br>
                    <b-row>
                        <b-col cols="12" class="filter-container" md="10" offset-md="1">
                            <!-- Filtros -->
                            <h1 class="font-weight-bold">{{$t('notification.filterMsg')}}</h1>
                            <b-row>
                                <b-col>
                                    <b-form-group :label="$t('notification.filterTitles.state')">
                                        <b-form-select :options="stateOptions" v-model="filter.state">
                                            <template slot="first">
                                                <option :value="null">{{$t('notification.filterAll')}}</option>
                                            </template>
                                        </b-form-select>
                                    </b-form-group>
                                </b-col>
                                <b-col>
                                    <b-form-group :label="$t('notification.filterTitles.section')">
                                        <b-form-select :options="sectionOptions" v-model="filter.section">
                                            <template slot="first">
                                                <option :value="null"></option>
                                            </template>
                                        </b-form-select>
                                    </b-form-group>
                                </b-col>
                                <b-col>
                                    <b-form-group :label="$t('notification.filterTitles.action')">
                                        <b-form-select :options="actionOptions" v-model="filter.action">
                                            <template slot="first">
                                                <option :value="null"></option>
                                            </template>
                                        </b-form-select>
                                    </b-form-group>
                                </b-col>
                            </b-row>
                            <b-row>
                                <b-col cols="4">    
                                    <b-form-group :label="$t('notification.filterTitles.userType')">
                                        <b-form-select :options="userTypeOptions" v-model="filter.userType">
                                            <template slot="first">
                                                <option :value="null"></option>
                                            </template>
                                        </b-form-select>
                                    </b-form-group>
                                </b-col>
                                <b-col cols="4">
                                    <b-form-group 
                                        :label="$t('notification.filterTitles.moreThan')">
                                        <datepicker :placeholder="$t('util.insertDate')" 
                                            class="date-picker"
                                            :language = "languages[language]"
                                            :calendar-button = "true"
                                            calendar-button-icon = "fa fa-calendar"
                                            :clear-button = "true"
                                            v-model="filter.higherDate"
                                            >
                                        </datepicker>
                                    </b-form-group>
                                </b-col>

                                <b-col cols="4">
                                    <b-form-group 
                                        :label="$t('notification.filterTitles.lessThan')"
                                    >
                                        <datepicker :placeholder="$t('util.insertDate')" 
                                            class="date-picker"
                                            :language = "languages[language]"
                                            :calendar-button = "true"
                                            calendar-button-icon = "fa fa-calendar"
                                            :clear-button = "true"
                                            v-model="filter.lessDate"
                                            >
                                        </datepicker>   
                                    </b-form-group>

                                </b-col>
                                
                            </b-row>

                            <b-row>
                                <b-col cols="12" class="text-center">
                                    <sipsder-btn btnType="search" @onClick="search"></sipsder-btn>
                                    <sipsder-btn btnType="clean" @onClick="cleanFilter"></sipsder-btn>
                                </b-col>
                            </b-row>
                        </b-col>
                    </b-row>
                </b-form>
            </sipsder-title>
            
            
            <b-row>
                <b-col cols="12">
                    <!-- contenido pageable -->
                    <notification-list ref="notificationList" :filterParam="filter">

                    </notification-list>

                </b-col>
            </b-row>

            <div v-if="isAdmin">
                <hr>

                <b-form >
                    <b-row>
                        <b-col cols="12" class="d-flex justify-content-center">
                            <h1>{{$t('notification.statistics')}}</h1>
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col cols="12" md="10">
                            <b-form-group :label="$t('notification.statisticsMsg')" horizontal label-cols="5">
                                <b-form-select :options="stateOptions" v-model="filterStatistics.state">
                                    <template slot="first">
                                        <option :value="null">{{$t('notification.filterAll')}}</option>
                                    </template>
                                </b-form-select>
                            </b-form-group>
                        </b-col>
                        <b-col cols="12" md="2" style="margin-top: -10px;">
                            <sipsder-btn btnType="export_data" @onClick="getStatistics">
                            </sipsder-btn>
                        </b-col>
                    </b-row>
                </b-form>
                <hr >
            </div>

            <b-row align-h="center" align-v="center">
                <sipsder-btn btnType="back" @onClick="previousPage( )">
                </sipsder-btn>
            </b-row>
        </b-container>
    </div>
</template>

<script>
import NotificationList from './NotificationList'
import Datepicker from 'vuejs-datepicker';
import * as lang from "vuejs-datepicker/src/locale"; //importar locale
import VAPI from '../../../http_common'
import {URI, SERVICE_NAMES, HTTP_STATUS} from '../../../sipsder_constants';
import {PERMISSIONS_TYPES} from "../../../domain_constants";


export default {

    name: "notification",
    components : {
        "notification-list" : NotificationList,
        "datepicker": Datepicker,
    },
    data() {
        return {
            stateOptions : [],
            actionOptions : [],
            userTypeOptions :[],
            sectionOptions : [],
            notification : {
                section : "section",
                action : "action",
                status: "status",
                date : "date",
                hour: "hour",
                content: "content",
                user: {
                    type : "algo",
                    fullName : "full name",
                },
            },
            filter : {
                state : null,
                action : null,
                section : null,
                userType : null,
                lessDate : null,
                higherDate : null,
            },
            filterStatistics : {
                state : null,
            },
            language: "es",
            languages: lang,
        }
    },
    computed: {
        isAdmin() {
            return this.$store.getters.hasPermission(PERMISSIONS_TYPES.ADMIN);
        },
    },
    created() {
        let path = `${SERVICE_NAMES.NOTIFICATION_STATE}`;
        VAPI.get(path).then( response => {

            if (response.data) {
                response.data.forEach(state => {
                    this.stateOptions.push({text: state.state, value: state});
                });
                // si se quiere que cargue solo querys abiertas.
                // if (this.stateOptions.length > 1)
                //     this.filter.state = this.stateOptions[1].value;
            }
            
        }).catch( (error) => {
            console.log(error);
        });

        path = `${SERVICE_NAMES.NOTIFICATION_ACTION}`;
        VAPI.get(path).then( response => {

            if (response.data) {
                response.data.forEach(action => {
                    this.actionOptions.push({text: action.action, value: action});
                });
            }            
            
        }).catch( (error) => {
            console.log(error);
        });

        path = `${SERVICE_NAMES.PAGE}`;
        VAPI.get(path).then( response => {

            if (response.data && response.data.data) {
                response.data.data.forEach(page => {
                    this.sectionOptions.push(
                        {text: this.$t(`route.${page.page}`), value: page}
                    );
                });
            }

        }).catch( (error) => {
            console.log(error);
        });

        path = `${SERVICE_NAMES.USER_TYPE}`;
        VAPI.get(path).then( response => {

            if (response.data && response.data.data) {
                response.data.data.forEach(userType => {
                    this.userTypeOptions.push({text: userType.type, value: userType});
                });
            }
            
        }).catch( (error) => {
            console.log(error);
        });

    },
    methods : {
        cleanFilter() {
            this.filter.state = null;
            this.filter.action = null;
            this.filter.section = null;
            this.filter.userType = null;
            this.filter.lessDate = null;
            this.filter.higherDate = null;
            this.$refs.notificationList.filteredSearch();
        },
        previousPage() {
            this.$router.go( -1 );
        },
        search() {
            this.$refs.notificationList.filteredSearch();
        },
        async getStatistics() {
            try {
                let idState = (this.filterStatistics.state == null) ? null : this.filterStatistics.state.id;
                let path = `${SERVICE_NAMES.NOTIFICATION}/statistics?state=${idState}`;
                
                let response = await VAPI.get(path, {responseType: "blob"});
                
                if (response && response.status == HTTP_STATUS.OK) {
                    const url = window.URL.createObjectURL(new Blob([response.data]));
                    const link = document.createElement("a");
                    link.href = url;
                    let tmpUser = this.$store.getters.getCurrentUser;
                    let todayDate = new Date();
                    let fileName = `Notificaciones_${tmpUser.lastName + "," + tmpUser.firstName}_al_${todayDate.getDate()}_${todayDate.getMonth() + 1}_${todayDate.getFullYear()}.xlsx`
                    link.setAttribute("download", fileName);
                    document.body.appendChild(link);
                    link.click();
                    link.parentNode.removeChild(link);
                } else {
                    console.log("Archivo no se pudo generar", response.status);
                    alert("Archivo no se pudo generar");
                }
            } catch (error) {
                console.log(error);
                this.errorMessage = error.response.data.message;
            }
        }
    }
}
</script>

<style scoped lang="scss">
.filter-container{
    width: 100%;
    // display: flex;
    // justify-content: center;
    // align-items: center;
    // flex-wrap: nowrap;
    padding: 15px 15px 5px 15px;
    border-radius: 10px;    
    background-color: #02747C;
    color: #fff;

    .v-select {
      background: white;
    }

    .border-user {
      border: 1px solid black;
      padding: 0px 4px;
    }
}
</style>
