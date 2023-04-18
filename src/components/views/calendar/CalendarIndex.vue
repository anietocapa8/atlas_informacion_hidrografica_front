<template>
    <div class="">
        <div class="feed-title">{{$t( 'calendar.indexTitle' )}}</div>
        <div class="calendar-index container-form col-90">
            <b-row class="filter-box">
                <b-col>
                    <b-row>
                        <b-col>
                            <div class="legend">
                                {{$t( 'community.survey.filter' ).toUpperCase()}}
                            </div>
                        </b-col>
                    </b-row>
                    <b-row :class="{'filter-admin': canCreateEvent , 'filter-public': !isAdministrator}">
                        <b-col>
                            <b-form-group label-class="font-weight-bold" description= "">
                                <b-form-input :placeholder="$t( 'calendar.q')" v-model="filterParams.q" v-validate="'max:70'"></b-form-input>
                            </b-form-group>
                        </b-col>
                        <b-col v-if="geoLocal">
                            <b-form-group label-class="font-weight-bold">
                                <v-select v-if="geoLocal" v-model.trim="filterParams.geo" label="name" :placeholder="$t( 'calendar.geo')" :options="geoLocal"></v-select>
                            </b-form-group>
                        </b-col>
                        <b-col v-if="institutions">
                            <b-form-group label-class="font-weight-bold">
                                <v-select v-if="institutions" v-model.trim="filterParams.institution" label="name" :placeholder="$t( 'calendar.institution')" :options="institutions"></v-select>
                            </b-form-group>
                        </b-col>
                        <b-col v-if="stateArray && isLogged && canCreateEvent">
                            <b-form-group label-class="font-weight-bold" v-if="isLogged && canCreateEvent">
                                <v-select v-if="stateArray" v-model="filterParams.status" label="label" :placeholder="$t( 'calendar.status')" :options="stateArray"></v-select>
                            </b-form-group>
                        </b-col>
                    </b-row>
                    
                    <b-row>
                        <b-col class="filter-buttons">
                            <sipsder-btn btnType="search" @onClick="getFilter()"></sipsder-btn>
                            <sipsder-btn btnType="clean"  @onClick="clearFilter()" ></sipsder-btn>
                        </b-col>
                    </b-row>
                </b-col>
            </b-row>
            <hr>
            <div class="calendar" >
                <div class="calendar-message" v-if="!isLogged">
                    <p>{{$t( 'calendar.notLoggedMessage')}}, {{$t( 'calendar.please')}} <router-link :to="{ name: 'UserRegistration'}">{{$t( 'calendar.register')}}</router-link> {{$t( 'calendar.or')}}  <a v-b-modal.login href="#">{{$t( 'calendar.authenticate')}}</a> {{$t( 'calendar.publish')}}</p>
                </div>
                <div class="calendar-message" v-if="isLogged && canCreateEvent">
                    <p></p>
                    <sipsder-btn btnType="add" :text="$t( 'calendar.add')" @onClick="$router.push({name:'CalendarCreate'})" ></sipsder-btn>
                </div>
                <div class="calendar-grid" >
                    <div class="calendar-component">
                        <vue-cal :selected-date="$route.params.date" hide-view-selector :locale="$i18n.locale" :events="events" default-view="month" @day-focus="logEvents('day-focus', $event)" :xsmall="isResponsive"></vue-cal>
                    </div>
                    <div class="tabs">
                        <div class="A">
                            <div class="tab-design" :class="{active : tabIndex==0 }" @click="setTabIndex(0)"><div><span>{{$t( 'calendar.listGeneral')}}</span></div></div>
                            <div class="tab-design" :class="{active : tabIndex==1 }" @click="setTabIndex(1)"><div><span>{{$t( 'calendar.listRelated')}}</span></div></div>
                        </div>
                        <div v-if="tabIndex==0" class="B">
                        <div v-for="(v,i) in eventsTable" :key="i" @click="eventDetail(v.id, v.url)">
                            <div class="event-grid" :class="{'current-event' :  moreDate(todayDate,v.startDate) &&   moreDate(v.endDate,todayDate)}">
                                <div>
                                    <div v-if="v.attachments[0].nameType='Video'">
                                        <img :style="{'border-color': v.ruralModels[0].color, 'border-style': 'solid','border-width': '7px' }" :src="getYTvideoCode(v.attachments[0].url)">
                                    </div>
                                        <div v-else>
                                        <img :style="{'border-color': v.ruralModels[0].color, 'border-style': 'solid','border-width': '7px' }" :src="getImgURL(v.attachments[0].url)">
                                    </div>
                                        <div class="colors-container">
                                            <div class="colors" v-for="(r, j) in v.ruralModels" :key="j"
                                                    :style="{'background-color': r.color}" v-b-tooltip.hover :title="r.name">
                                                </div>
                                        </div>
                                </div>
                                    <div class="legend">
                                        <div class="date">{{v.startDate | moment("DD MMM YYYY - h:mm a")}} - {{v.endDate | moment("DD MMM YYYY - h:mm a")}}</div>
                                        <div>{{v.name}}</div>
                                        <div>{{v.person}}, {{v.contactPhone}}</div>
                                        <div v-if="v.institutions.length>0">{{v.institutions[0].name}}</div>
                                        <div>{{v.place}}</div>
                                        <div class="descript">{{v.summary}}</div>
                                        <div v-if="moreDate(todayDate,v.startDate) &&   moreDate(v.endDate,todayDate)" class="today-event">Evento en curso</div>
                                    </div>
                            </div>
                        </div>
                        </div>
                        <div v-if="tabIndex==1" class="B">
                            <div v-if="isLogged && eventsRelated.length>0">
                                <div v-for="(v,i) in eventsRelated" :key="i" @click="eventDetail(v.id, v.url)">
                                    <div class="event-grid" :class="{'current-event' :  moreDate(todayDate,v.startDate) &&   moreDate(v.endDate,todayDate)}">
                                        <div>
                                            <div v-if="v.attachments[0].nameType='Video'">
                                                <img :style="{'border-color': v.ruralModels[0].color, 'border-style': 'solid','border-width': '7px' }" :src="getYTvideoCode(v.attachments[0].url)">
                                            </div>
                                            <div v-else>
                                                <img :style="{'border-color': v.ruralModels[0].color, 'border-style': 'solid','border-width': '7px' }"  :src="getImgURL(v.attachments[0].url)">
                                            </div>
                                            <div class="colors-container" >
                                                <div class="colors" v-for="(r, j) in v.ruralModels" :key="j"
                                                    :style="{'background-color': r.color}" v-b-tooltip.hover :title="r.name">
                                                </div>
                                            </div>
                                        </div>
                                            <div class="legend">
                                                <div class="date">{{v.startDate | moment("DD MMM YYYY - h:mm a")}} - {{v.endDate | moment("DD MMM YYYY - h:mm a")}}</div>
                                                <div>{{v.name}}</div>
                                                <div>{{v.person}}, {{v.contactPhone}}</div>
                                                <div v-if="v.institutions.length>0">{{v.institutions[0].name}}</div>
                                                <div>{{v.place}}</div>
                                                <div class="descript">{{ v.summary }}</div>
                                                <div v-if="moreDate(todayDate,v.startDate) &&   moreDate(v.endDate,todayDate)" class="today-event">{{$t( 'calendar.nowEvent')}}</div>
                                            </div>
                                    </div>
                                </div>
                            </div>
                            <div v-else-if="isLogged && eventsRelated.length==0">
                                <div class="event-grid-legend">
                                    <p>{{$t( 'calendar.nullRelated')}}</p>
                                </div>
                            </div>
                            <div v-else>
                                <div class="event-grid-legend">
                                    <p>{{$t( 'calendar.notLoggedMessageEvents')}} <router-link :to="{ name: 'userRegistration'}">{{$t( 'calendar.register')}}</router-link> {{$t( 'calendar.or')}}  <a v-b-modal.login href="#">{{$t( 'calendar.authenticate')}}</a>.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- seccion de impresion -->
            <b-row>
                <b-col class="d-flex justify-content-end">
                    <print-component>                        
                        <div class="calendar-grid" >
                            <div class="calendar-component">
                                <vue-cal :selected-date="$route.params.date" 
                                    hide-view-selector 
                                    :locale="$i18n.locale" 
                                    :events="events" 
                                    default-view="month" 
                                    @day-focus="logEvents('day-focus', $event)" 
                                    :xsmall="isResponsive"
                                ></vue-cal>
                            </div>
                            <div class="tabs">
                                <div class="A">
                                    <div class="tab-design" :class="{active : tabIndex==0 }" @click="setTabIndex(0)"><div><span>{{$t( 'calendar.listGeneral')}}</span></div></div>
                                    <div class="tab-design" :class="{active : tabIndex==1 }" @click="setTabIndex(1)"><div><span>{{$t( 'calendar.listRelated')}}</span></div></div>
                                </div>
                                <div v-if="tabIndex==0" class="BB">
                                    <div v-for="(v,i) in eventsTable" :key="i" @click="eventDetail(v.id, v.url)">
                                        <div class="event-grid" :class="{'current-event' :  moreDate(todayDate,v.startDate) &&   moreDate(v.endDate,todayDate)}">
                                            <div>
                                                <div v-if="v.attachments[0].nameType='Video'">
                                                    <img :style="{'border-color': v.ruralModels[0].color, 'border-style': 'solid','border-width': '7px' }" :src="getYTvideoCode(v.attachments[0].url)">
                                                </div>
                                                    <div v-else>
                                                    <img :style="{'border-color': v.ruralModels[0].color, 'border-style': 'solid','border-width': '7px' }" :src="getImgURL(v.attachments[0].url)">
                                                </div>
                                                    <div class="colors-container">
                                                        <div class="colors" v-for="(r, j) in v.ruralModels" :key="j"
                                                                :style="{'background-color': r.color}" v-b-tooltip.hover :title="r.name">
                                                            </div>
                                                    </div>
                                            </div>
                                                <div class="legend">
                                                    <div class="date">{{v.startDate | moment("DD MMM YYYY - h:mm a")}} - {{v.endDate | moment("DD MMM YYYY - h:mm a")}}</div>
                                                    <div>{{v.name}}</div>
                                                    <div>{{v.person}}, {{v.contactPhone}}</div>
                                                    <div v-if="v.institutions.length>0">{{v.institutions[0].name}}</div>
                                                    <div>{{v.place}}</div>
                                                    <div class="descript">{{ v.summary }}</div>
                                                    <div v-if="moreDate(todayDate,v.startDate) &&   moreDate(v.endDate,todayDate)" class="today-event">Evento en curso</div>
                                                </div>
                                        </div>
                                    </div>
                                </div>
                                <div v-if="tabIndex==1" class="BB">
                                    <div v-if="isLogged && eventsRelated.length>0">
                                        <div v-for="(v,i) in eventsRelated" :key="i" @click="eventDetail(v.id, v.url)">
                                            <div class="event-grid" :class="{'current-event' :  moreDate(todayDate,v.startDate) &&   moreDate(v.endDate,todayDate)}">
                                                <div>
                                                    <div v-if="v.attachments[0].nameType='Video'">
                                                        <img :style="{'border-color': v.ruralModels[0].color, 'border-style': 'solid','border-width': '7px' }" :src="getYTvideoCode(v.attachments[0].url)">
                                                    </div>
                                                    <div v-else>
                                                        <img :style="{'border-color': v.ruralModels[0].color, 'border-style': 'solid','border-width': '7px' }"  :src="getImgURL(v.attachments[0].url)">
                                                    </div>
                                                    <div class="colors-container" >
                                                        <div class="colors" v-for="(r, j) in v.ruralModels" :key="j"
                                                            :style="{'background-color': r.color}" v-b-tooltip.hover :title="r.name">
                                                        </div>
                                                    </div>
                                                </div>
                                                    <div class="legend">
                                                        <div class="date">{{v.startDate | moment("DD MMM YYYY - h:mm a")}} - {{v.endDate | moment("DD MMM YYYY - h:mm a")}}</div>
                                                        <div>{{v.name}}</div>
                                                        <div>{{v.person}}, {{v.contactPhone}}</div>
                                                        <div v-if="v.institutions.length>0">{{v.institutions[0].name}}</div>
                                                        <div>{{v.place}}</div>
                                                        <div class="descript">{{ v.summary }}</div>
                                                        <div v-if="moreDate(todayDate,v.startDate) &&   moreDate(v.endDate,todayDate)" class="today-event">{{$t( 'calendar.nowEvent')}}</div>
                                                    </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div v-else-if="isLogged && eventsRelated.length==0">
                                        <div class="event-grid-legend">
                                            <p>{{$t( 'calendar.nullRelated')}}</p>
                                        </div>
                                    </div>
                                    <div v-else>
                                        <div class="event-grid-legend">
                                            <p>{{$t( 'calendar.notLoggedMessageEvents')}} <router-link :to="{ name: 'user-registration'}">{{$t( 'calendar.register')}}</router-link> {{$t( 'calendar.or')}}  <a v-b-modal.login href="#">{{$t( 'calendar.authenticate')}}</a>.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </print-component>
                </b-col>
            </b-row>
            <!-- fin seccion de impresion -->
            <!--<div style="text-align:right"><sipsder-btn btnType="export" @onClick="print"></sipsder-btn></div>-->
            <div style="text-align:center"><sipsder-btn btnType="back" @onClick="$router.go(-1)"></sipsder-btn></div>
        </div>
    </div>
</template>

<script>
    import { SERVICE_NAMES } from '@/sipsder_constants'
    import {EVENT_STATE, EVENT_STATE_LABEL, PERMISSIONS_TYPES} from '../../../domain_constants'
    import VAPI from '../../../http_common';
    import VueCal from 'vue-cal'
    import vSelect from "vue-select";
    import moment from 'moment';
    import RichTextPreview from "../../shared/RichTextPreview";
    import PrintComponent from "../../shared/PrintComponent";
    import S_UTIL from "@/util/sipsder_util";

export default {
    components: { 
        'vue-cal': VueCal,
        "v-select": vSelect,
        RichTextPreview,
        PrintComponent,
    },
    data(){ 
        return{
            PERMISSIONS_TYPES,
            tabIndex: 0,
            firstEntry: true,
            filterParams: {
                page: 0,                    // Page number
                size: 30,                   // Page size
                geo: null,                    // Location
                institution: null,            // Entities
                status: {id:null, label: null},                 // Show all enabled questions: true, otherwise: false
                q: '',                      // Search string
                startDated:'',              // Today 
                sort: 'startDate,asc',
                rural: null      
            },
            stateArray:[],
            autocomplets:{
                geograph:[],
                institution:[]
            },
            eventsRelated:[],
            eventsTable:[],
            events: [],
        }
    },
    computed: {
        isAdministrator( ) {
            return this.$store.getters.hasPermission(PERMISSIONS_TYPES.ADMIN);
        },
        canCreateEvent( ) {
            return this.$store.getters.hasPermission(PERMISSIONS_TYPES.ADMIN) || this.$store.getters.hasPermission(PERMISSIONS_TYPES.CONTROL);
        },
        isLogged() {
            return this.$store.getters.isAuthenticated
        },
        todayDate(){
            let today = new Date();
            let date = today.getTime();
            return date
        },
        geoLocal(){
            return this.$store.getters.getGeoLocal
        },
        institutions(){
             return this.$store.getters.getInstitutionsF
        },
        isResponsive() {
            return this.$store.getters.isResponsive;
        },
    },
    async created(){
        this.$store.dispatch( 'getGeoLocal');
        this.$store.dispatch( 'getInstitutionsF');
        this.filterParams.status.id=EVENT_STATE.PUBLISH
        this.filterParams.status.label=EVENT_STATE_LABEL.PUBLISH
        this.stateArray.push({'id': EVENT_STATE.PENDING, 'label': EVENT_STATE_LABEL.PENDING});
        this.stateArray.push({'id': EVENT_STATE.REJECTED, 'label': EVENT_STATE_LABEL.REJECTED});
        this.stateArray.push({'id': EVENT_STATE.PUBLISH, 'label': EVENT_STATE_LABEL.PUBLISH});
        this.stateArray.push({'id': EVENT_STATE.PUBLISH_DISABLED, 'label': EVENT_STATE_LABEL.PUBLISH_DISABLED});  

        const response = await VAPI.get(`${SERVICE_NAMES.EVENT}/all${this.buildQuery(true)}`);
         if( response.data != null && response.data.data != null ) {
             this.eventsTable = response.data.data
         }

         if(this.$store.getters.isAuthenticated){
            const response5 = await VAPI.get(`${SERVICE_NAMES.EVENT}/user${this.buildQuery(false)}`);
            if( response5.data != null && response5.data.data != null ) {
                this.eventsRelated = response5.data.data
            }
         }

         const response2 = await VAPI.get(`${SERVICE_NAMES.EVENT}/calendar/${EVENT_STATE.PUBLISH}`);
         if( response2.data != null && response2.data.data != null) {
             this.events= response2.data.data
             this.events.forEach( (e)=>{
                        e.start= moment(e.start).format('YYYY-MM-DD h:mm')
                        e.end= moment(e.end ).format('YYYY-MM-DD h:mm')
            })
         }

         this.firstEntry = false;

    },
    methods:{
        setTabIndex(index){
            this.tabIndex=index
        },
        getFilter(){
            VAPI.get(`${SERVICE_NAMES.EVENT}/all${this.buildQuery(true)}`).then((response)=>{
                if( response.data != null && response.data.data != null ) {
                    this.eventsTable = response.data.data
                }
                else{
                    this.eventsTable = []
                }
            }).catch((e) => {
          
            });
            if(this.$store.getters.isAuthenticated)    {
                VAPI.get(`${SERVICE_NAMES.EVENT}/user${this.buildQuery(false)}`).then((response)=>{
                    if( response.data != null && response.data.data != null ) {
                        this.eventsRelated = response.data.data
                    }
                    else{
                        this.eventsRelated = []
                    }
                }).catch((e) => {
            
                }); 
            }
            VAPI.get(`${SERVICE_NAMES.EVENT}/calendar/${this.filterParams.status.id}`).then((response)=>{
                if( response.data != null && response.data.data != null ) {
                    this.events = response.data.data
                    this.events.forEach( (e)=>{
                        e.start= moment(e.start).format('YYYY-MM-DD h:mm')
                        e.end= moment(e.end).format('YYYY-MM-DD h:mm')
                    })
                }
                else{
                    this.events = []
                }
            }).catch((e) => {
          
            });    
        },
        clearFilter(){
            this.filterParams.page = 0
            this.filterParams.size = 30
            this.filterParams.geo = null
            this.filterParams.institution = null
            this.filterParams.status.id=EVENT_STATE.PUBLISH
            this.filterParams.status.label=EVENT_STATE_LABEL.PUBLISH
            this.filterParams.q =''
            this.filterParams.startDated =''
            this.filterParams.sort ='startDate,asc'
            this.$route.params.date = null
            this.$route.query.rural = null
            this.getFilter()
        },
        moreDate(d1,d2){
            var strtDt = new Date(d1);
            var endDt = new Date(d2);
            var flag = false; // false

            if (endDt <= strtDt){
                flag = true; // true
            }
            return  flag
        },
        buildQuery(e) {
            if( this.$route.params.date != null) this.filterParams.startDated = this.$route.params.date;
            if( this.$route.query.rural != null && this.firstEntry) this.filterParams.rural = this.$route.query.rural;
            if( this.filterParams.startDated === '' ) this.filterParams.startDated = this.getDate(null);
            let query = '?page=' + this.filterParams.page  + '&size=' + this.filterParams.size + '&calendar=true';
            if( this.filterParams.geo != null) query += '&geo=' + this.filterParams.geo.id;
            if( this.filterParams.institution != null ) query += '&institution=' + this.filterParams.institution.id;
            if( this.filterParams.status != null ) {
                 query += '&status=' + this.filterParams.status.id;
            }
            else {
                    query += '&status=' + EVENT_STATE.PUBLISH;
            }
            if( this.filterParams.q !== '' ) query += '&q=' + this.filterParams.q;
            query += '&sort=' + this.filterParams.sort;
            query += '&startDated= ' +  this.filterParams.startDated
            if(this.filterParams.rural!= null && this.firstEntry && e) query += '&rural='+this.filterParams.rural            
            // console.log( "Query params sent to backend: ", query );
            return query;
        },
         getDate (date) {
            const toTwoDigits = num => num < 10 ? '0' + num : num;
            if(date==null ){
                
                let today = new Date();
                date= today.getFullYear()+"-"+toTwoDigits(today.getMonth()+1)+"-"+toTwoDigits(today.getDate())+" "+toTwoDigits(today.getHours())+":"+toTwoDigits(today.getMinutes())+":"+toTwoDigits(today.getSeconds())
            }
            else{
                date = moment(date , 'YYYY-MM-DD').format('YYYY-MM-DD') + " 00:00:00" 
            }
            
            return date
        },
        logEvents(t, e){
            this.filterParams.startDated = this.getDate(e)
            this.getFilter()
        },
        eventDetail( id ,url ) {
            this.$router.push( { name: 'EventDetail', params: { id : id, url: url } } );
        },
        getImgURL(url) {
            return S_UTIL.getImgURL(url)
        },
        getYTvideoCode(url){
          if(url.search("youtube")>0){
            var res = url.split("/")
            var rel = res[4].split("?")
            return "https://img.youtube.com/vi/"+rel[0]+"/hqdefault.jpg"
          }
          else{
            return  S_UTIL.getImgURL(url)
          }
      },
    }
}
</script>

<style lang="scss" scoped>
.question-icon {
    color:#0db8bb;
    font-size: 2.5rem;
}
.v-select {
    background: white;
}

</style>

<style lang="sass">
@import '../../../stylesheets/style.sass'
.calendar-grid
   
    .vuecal__cell-events-count
        background: $colorWarning
        width: 15px
        height: 15px
        line-height: 15px
        font-size: 12px
        bottom: 10px
    .vuecal__title
        background: $colorTitle
        color: #fff
    .vuecal__cell.current, .vuecal__cell.today
        background: $colorSidebarMobile
        color: #fff
    .vuecal__cell.selected
        background: $colorTitle
        color: #fff
        font-weight: bold
    .vuecal__flex .vuecal__body
        font-size: 1.2rem
    .vuecal__header
        font-size: 1.4rem
    .vuecal__event
        background: rgba(46,204,113,.9)



</style>

<style lang="sass" scoped>
@import '../../../stylesheets/style.sass'
.feed-title
    position: relative
    display: inline-block
    color: #fff
    background: url(../../../assets/title/barra_sola_2.png)
    background-repeat: no-repeat
    background-size: 100% 100%
    height: 90px
    width: 105%
    font-size: 40px
    font-weight: bold
    font-family: $fontBody
    margin-left: -10%
    margin-top: 15px
    margin-bottom: 3%
    padding-left: calc(10% + 20px)
    padding-top: 20px
    a
        text-decoration: none
        color: #fff
.colors-container
    width: 100%
    height: 30px
    .colors
        margin: 5px 0 0 5px
        width: 25px
        height: 25px
        border-radius: 50%
        float: right
.current-event
    background: $colorTitle !important
    color: #fff
.calendar-index
    width: 80%
    margin: 0 10%
.calendar-message
    display: grid
    grid-template-columns: 6fr 1fr
    grid-gap: 10px
.filter-grid
    display: grid
    grid-gap: 10px
.filter-admid
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr
.filter-public
    display: grid
    grid-template-columns: 2fr 2fr 2fr
.filter-buttons
    text-align: center
.calendar-grid
    display: grid
    grid-gap: 15px
    grid-template-columns:  1fr 1fr
    min-height: 700px
    // background: #fff
    padding: 20px 0
.calendar-component
    min-height: 600px
    height: 600px
.tabs
    display: grid
    grid-template-columns: 1fr
    grid-template-rows: 70px auto
    min-height: 600px
    .A
        margin-left: 15px
        display: inline-flex
    .BB
        margin-top: -10px
        background: #fff
        box-shadow: 0px 0px 3px #555
        border-radius: 3px
        z-index: 3
        overflow: hidden
        border: 5px solid #fff
        .event-grid-legend
            display: grid
            grid-template-columns: 100%
            grid-gap: 15px
            margin: 15px
            padding: 10px
            cursor: pointer
            background: #eee
        .event-grid
            display: grid
            grid-template-columns: 45% 45%
            grid-gap: 15px
            margin: 15px
            padding: 10px
            cursor: pointer
            background: #eee
            transition: all .1s ease-in-out
            &:hover
                transform: scale(1.02) 
            img
                width: 100%
                max-height: 137px
            .legend
                position: relative
                width: 100%
                .today-event
                    position: absolute
                    bottom: -20px
                    padding: 0 10px 0px 10px
                    width: auto
                    right: -10%
                    background: $colorTitle
                    text-align: right
                .date
                    font-size: 1rem
                .descript
                    overflow: hidden
                    text-overflow: ellipsis
                    white-space: nowrap
    .B
        margin-top: -10px
        background: #fff
        box-shadow: 0px 0px 3px #555
        border-radius: 3px
        z-index: 3
        overflow: hidden
        overflow-y: auto 
        max-height: 600px
        border: 5px solid #fff
        .event-grid-legend
            display: grid
            grid-template-columns: 100%
            grid-gap: 15px
            margin: 15px
            padding: 10px
            cursor: pointer
            background: #eee
        .event-grid
            display: grid
            grid-template-columns: 45% 45%
            grid-gap: 15px
            margin: 15px
            padding: 10px
            cursor: pointer
            background: #eee
            transition: all .1s ease-in-out
            &:hover
                transform: scale(1.02) 
            img
                width: 100%
                max-height: 137px
            .legend
                position: relative
                width: 100%
                .today-event
                    position: absolute
                    bottom: -20px
                    padding: 0 10px 0px 10px
                    width: auto
                    right: -10%
                    background: $colorTitle
                    text-align: right
                .date
                    font-size: 1rem
                .descript
                    overflow: hidden
                    text-overflow: ellipsis
                    white-space: nowrap
.tab-design  
    margin-bottom: 10px !important
    transform: rotate(3deg)
    max-width: 50%
    margin-right: 20px
    font-size: 1.34rem
    div
        cursor: pointer
        width: 105%
        background: $colorTitle
        color: white
        border-radius: 10px
        min-height: 70px
        padding: 10px 3.5em 14px 1em
        span
            display: block
            transform: rotate(-4deg)
    &.active
        div
            box-shadow: 0px 0px 3px #555
            background: $colorTitleDark
            color: white
            border-color: unset
            transition: 0.5s
    &:hover
        div
            box-shadow: 0px 0px 3px #555



@media screen  and (max-width: $widthTablet)
    .calendar-grid
        grid-template-columns: 100% !important
    .event-grid
        grid-template-columns: 100% !important
    .filter-admin
        grid-template-columns: 100% !important
    .filter-public
        grid-template-columns: 100% !important
    .tab-design 
        font-size: 1.2rem !important
    .col-90
        width: 80% !important
        margin: 0 auto
@media screen  and (max-width: $widthMobile)
    .filter-box
        margin: 0 !important
    .event-grid
        width: 80% !important
    .tab-design 
        font-size: 1.0rem !important
    .feed-title
        padding-left: calc(10% + 40px) !important
        font-size: 20px !important

.filter-box
    background: $colorTitleDark
    padding: 15px 15px 15px 15px
    border-radius: 10px
    .legend
        grid-area: a
        color: #fff
        font-weight: bold
        font-family: $fontBody
        font-size: 2rem
    .grid-col
        .form-group input, .b-form-group, .form-group
            height: 100% !important
            max-height: 50px !important
            border-radius: 4px !important
            div
                height: 100% !important
                background: #fff !important
                border-radius: 4px !important
        button
            margin-top: -15px
        .buttons
            text-align: center
            margin-top: -15px
        .grid-col-50
            display: grid
            grid-template-columns: 2fr 1fr
            grid-gap: 15px
        .selected-tag
            font-size: 17px !important
            margin: 0 !important
            
</style>
