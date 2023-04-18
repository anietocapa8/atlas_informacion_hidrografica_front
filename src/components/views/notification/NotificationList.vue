<template>
    <div id="notification-list">
        <b-container class='container-form'>
            <!-- navegacion paginacion -->
            <b-row>
                <b-col v-if="notificationsList.length > 0" class="d-flex justify-content-center">
                    <b-pagination size="lg" class="center" :total-rows="elements" v-model="currentPage" v-if="elements !== null"
                        :per-page="pageSize" @input="loadPage">
                    </b-pagination>
                </b-col>
            </b-row>
            <!-- Contenido de la lista -->
            <b-row>
                <b-col cols="12" v-if="notificationsList.length > 0">
                    <div v-for="noti in notificationsList" :key="noti.id">
                        <notification-cmp :notification="noti" @onChange="updateComent">

                        </notification-cmp>
                        <br>
                    </div>
                </b-col>
                <b-col v-else>
                    {{$t('notification.emptyNotifications')}}
                </b-col>
            </b-row>
            <!-- navegacion paginacion -->
            <br>
            <b-row>
                <b-col v-if="notificationsList.length > 0" class="d-flex justify-content-center">
                    <!-- <b-pagination size="md" class="center" :total-rows="meta.totalElements" v-model="page" v-if="meta !== null"
                        @input="loadMore"
                        :per-page="size">
                    </b-pagination> -->
                    <b-pagination size="lg" class="center" :total-rows="elements" v-model="currentPage" v-if="elements !== null"
                        :per-page="pageSize" @input="loadPage">
                    </b-pagination>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
import moment from 'moment'
import NotificationCmp from './NotificationCmp'
import VAPI from '../../../http_common';
import { SERVICE_NAMES } from '../../../sipsder_constants';
import { filter } from 'bluebird';

export default {
    name: "NotificationList",
    props : {
        sortBy : {
            type: String,
            default : "creationDate"
        },
        pageSize: {
            type: Number,
            default: 10,
        },
        filterParam: {
            type: Object,
            default: null
        }
    },
    components : {
        "notification-cmp" : NotificationCmp,
    },
    data() {
        return {
            notificationsList : [],
            elements : 0,
            currentPage : 1,
            filter: null,
        }
    },
    created() {
        // `/${SERVICE_NAMES.COMMENTS}/type/${this.PARENT_TYPES.NEWS}/parent/${this.parentId}?page=${this.page}&size=${this.pageSize}`
        let open = 1;
        // Query en la cual carga solo las notificaciones abiertas
        // let query = `/${SERVICE_NAMES.NOTIFICATION}?page=${this.currentPage - 1}&size=${this.pageSize}&sort=${this.sortBy},desc&state=${open}`
        //Query que carga todas las notificaciones
        let query = `/${SERVICE_NAMES.NOTIFICATION}?page=${this.currentPage - 1}&size=${this.pageSize}&sort=${this.sortBy},desc`
        
        this.doGetQuery(query);
    },
    methods: {
        doGetQuery(query) {
            VAPI.get(query).then(response => {
                this.notificationsList = response.data.data;
                this.elements = response.data.meta.totalElements;
            }).catch(error => {
                console.log("Error al usar servicio de Notificaciones", error);
            });
        },
        loadPage() {
            let query = `/${SERVICE_NAMES.NOTIFICATION}?page=${this.currentPage - 1}&size=${this.pageSize}&sort=${this.sortBy},desc`
            query += this.filterQuery();
            
            this.doGetQuery(query);
        },
        filteredSearch(){
            this.currentPage = 1;
            this.filter = this.filterParam;
            let query = `/${SERVICE_NAMES.NOTIFICATION}?page=${this.currentPage - 1}&size=${this.pageSize}&sort=${this.sortBy},desc`
            query += this.filterQuery();
            
            this.doGetQuery(query);
        },
        updateComent(notification) {
            
            for (var i = 0; i < this.notificationsList.length; i++) {
                if (notification.id == this.notificationsList[i].id) {
                    this.notificationsList[i] = notification;
                    break;
                }
            }

        },
        filterQuery() {
            let query = '';
            
            if (this.filter) {
                for (var key in this.filter) {
                    if (this.filter[key]) {
                        if (this.filter[key].id) {    
                            query += `&${key}=${this.filter[key].id}`
                        } else if (key == "lessDate" || key == "higherDate") {
                            query += `&${key}=${moment(this.filter[key]).format('DD-MM-YYYY')}`
                        } else {
                            query += `&${key}=${this.filter[key].toISOString()}`
                        }
                    }
                }
            }

            return query;
        }
    }
}
</script>

<style scoped>

</style>