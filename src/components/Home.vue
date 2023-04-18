<template>
  <div>
    <div v-show="images.length">
      <b-carousel id="carousel1"
        class="home-carousel-banner"
        indicators
        background="#ababab"
        :interval="4000"
        v-model="slide"
        @sliding-start="onSlideStart"
        @sliding-end="onSlideEnd">
        <div v-for="(item) in images" :key="item.id" >
          <b-carousel-slide :caption="item.name">
                <template v-slot:img>
                  <img
                    class="d-block w-100 img-c" style="cursor: pointer"
                    @click="toImage(item.url)"
                    :src="getImgURL(item.imageUrl)"
                    :alt="item.name">
                </template>
                <p class="carousel-text">{{item.description}}</p>
          </b-carousel-slide>
        </div>
      </b-carousel>
    </div>

    <div v-if="upperLinks && upperLinks.length > 0" class="upper-links-container">
      <div class="row align-items-center justify-content-start">
        <div class="col-12 col-md-4 col-lg-3 text-center align-self-center upper-link-container" v-for="link in upperLinks" :key="link.id">
          <div class="upper-link">
            <img v-if="link.attachment && link.attachment.url" :src="getImgURL(link.attachment.url)" :alt="link.name">
            <a 
              class="text-center link" target="_blank"
              v-b-tooltip.hover :title="link.description ? link.description : link.name"
              :href="getLink(link.url)" 
            >
              {{link.name}}
            </a>
          </div>
        </div>
      </div>
    </div>

    <div>
      <div class="home-grid" :class="{'grid-1': !enabledButtons.button1 && !enabledButtons.button2, 'grid-3': enabledButtons.button1 && !enabledButtons.button2, 'grid-2': !enabledButtons.button1 && enabledButtons.button2, 'grid-4': enabledButtons.button1 && enabledButtons.button2}">

        <div class="rural-dev">
          <planning-feed />
        </div>

        <div class="calendar">
          <div class="calendar-home">
            <div class="tabs">
              <div class="tab" :class="{active : tabIndex==0 }" @click="setTabIndex(0)"><div>{{ $t('home.calendar') }}</div></div>
              <div class="tab" :class="{active : tabIndex==1 }" @click="setTabIndex(1)"><div>{{ $t('home.schedule') }}</div></div>
            </div>
            <div class="calendar-component" v-if="tabIndex==0">
                <vue-cal xsmall hide-view-selector :locale="$i18n.locale" @day-focus="goCal($event)" :events="events" default-view="month" :disable-views="['years', 'year', 'week' ,'day']"></vue-cal>
            </div>
            <div class="calendar-component" v-if="tabIndex==1">
              <div class="list-grid">
                <div class="list-events" v-for="(v,i) in eventsTable" :key="i" :class="{'current-event' :  moreDate(todayDate,v.startDate) &&   moreDate(v.endDate,todayDate)}"  :style="{'border-bottom-color': v.ruralModels[0].color, 'border-bottom-style': 'solid','border-bottom-width': '7px' }"  @click="eventDetail(v.id, v.url)" >
                    <div class="date">{{v.startDate | moment("DD MMM YYYY - h:mm a")}} - {{v.endDate | moment("DD MMM YYYY - h:mm a")}}</div>
                    <div>{{v.name}}</div>
                    <div>{{v.person}}, {{v.contactPhone}}</div>
                    <div v-if="v.institutions.length>0">{{v.institutions[0].name}}</div>
                    <div>{{v.place}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="news">
          <news-feed></news-feed>
        </div>
        <div class="report button" v-if="enabledButtons.button1" @click="$router.push({ name: urlButtons.button1 })">
          <img src="../assets/home/report.png">
          <div class="title" v-b-tooltip.hover :title="$t('home.report')">{{ $t('home.report') }}</div>
        </div>

        <div class="energy button" v-if="enabledButtons.button2" @click="goToLinkButton(urlButtons.button2)">
          <img src="../assets/home/energy2.png" class="sun">
          <img src="../assets/home/energy1.png" class="turbine">
          <div class="title" v-b-tooltip.hover :title="$t('home.energy')">{{ $t('home.energy') }}</div>
        </div>

        <div class="community-bar">
          <div class="title" v-b-tooltip.hover :title="$t('home.community')">{{ $t('home.community') }}</div>
          <community-carousel></community-carousel>
        </div>

        <div class="proyect-tools button" @click="$router.push({name:'ProcedureIndex'})">
          <div class="glow-wrap">
            <i class="glow"></i>
          </div>
          <div class="title" v-b-tooltip.hover :title="$t('home.rural_procedures')">{{ $t('home.rural_procedures') }}</div>
        </div>

        <div class="library button" @click="$router.push({name:'ProyectToolIndex'})">
          <div class="glow-wrap">
            <i class="glow"></i>
          </div>
          <div class="title" v-b-tooltip.hover :title="$t('home.project_tools')">{{ $t('home.project_tools') }}</div>
        </div>

        <div class="procedure button" @click="$router.push({name:'LibraryIndex'})">
          <div class="glow-wrap">
            <i class="glow"></i>
          </div>
          <div class="title" v-b-tooltip.hover :title="$t('home.rural_library')">{{ $t('home.rural_library') }}</div>
        </div>

        <div class="topic button" @click="$router.push({name:'RuralHousingIndex'})">
          <div class="title" v-b-tooltip.hover :title="$t('home.innovating_rurality')">{{ $t('home.innovating_rurality') }}</div>
        </div>

        <div class="social-media">
          <social-network-feed></social-network-feed>
        </div>

      </div>
    </div>


  </div>


</template>

<script>
  import { SERVICE_NAMES } from '@/sipsder_constants'
  import {EVENT_STATE} from '../domain_constants'
  import VAPI from '../http_common'
  import SocialNetworkFeed from './views/social_networks_feed/SocialNetworksFeed.vue'
  import NewsFeed from './shared/news_feed_share/NewsFeed.vue'
  import RichTextPreview from "./shared/RichTextPreview";
  import CommunityCarousel from "./shared/carousel/CommunityCarousel.vue";
  import PlanningFeed from './shared/planning_feed_share/PlanningFeed.vue'
  import VueCal from 'vue-cal'
  import moment from 'moment';
  
import S_UTIL from "../util/sipsder_util";

  export default {
    data () {
      return {
        tabIndex: 0,
        slide: 0,
        sliding: null,
        images: [],
        events: [],
        eventsTable: [],
        //images: [ "https://picsum.photos/1024/480/?image=52" ]
        enabledButtons: {
          button1: false,
          button2: false
        },
        urlButtons: {
          button1: '',
          button2: ''
        },
        upperLinks: [],
      }
    },
    computed: {
      isResponsive() {
        return this.$store.getters.isResponsive;
      },
      todayDate(){
        let today = new Date();
        let date = today.getTime();
        return date
      },
    },
    async beforeMount(){
      try {
        const responseLinks =  await VAPI.get(`/logo-link-color/active`);
        if (responseLinks.data.data && responseLinks.data.data.links && responseLinks.data.data.links.length > 0) {
          this.upperLinks = responseLinks.data.data.links.filter(link => link.upper); 
        }
        const response = await VAPI.get(SERVICE_NAMES.SIPSDER)
        if( response.data != null && response.data.data != null) {
          this.enabledButtons.button1 = response.data.data[0]["reportEnabled"];
          this.enabledButtons.button2 = response.data.data[0]["energyEnabled"];
          this.urlButtons.button1 = response.data.data[0]["reportUrl"];
          this.urlButtons.button2 = response.data.data[0]["energyUrl"];
        }
      } catch (error) {
        console.error(error);
      }
      try{
        const response2 = await VAPI.get(`/${SERVICE_NAMES.EVENT}/calendar/${EVENT_STATE.PUBLISH}`);
        if( response2.data != null && response2.data.data != null) {
          this.events= response2.data.data
          this.events.forEach( (e)=>{
              e.start= moment(e.start).format('YYYY-MM-DD h:mm')
              e.end= moment(e.end).format('YYYY-MM-DD h:mm')
          })
        }
      } catch(e){
        console.error(e.toString());
      }
      try{
        const response = await VAPI.get(`/${SERVICE_NAMES.EVENT}/all?page=0&size=6&status=${EVENT_STATE.PUBLISH}&startDated=${this.getDate(null)}&calendar=true&sort=startDate,asc`);
        if( response.data != null && response.data.data != null ) {
          this.eventsTable = response.data.data
        }
      }
      catch(e){
        console.error(e.toString());
      }
      VAPI.get(`${SERVICE_NAMES.BANNER}/active`).then((output) => {
        // sort images by start date descending
        this.images = output.data.data.sort((a, b) => {
          return new Date(b.startDate) - new Date(a.startDate);
        });
      }).catch((e) => {
        console.error(e.toString());
      });
    },
    methods: {
      getLink(link) {
        if (link.indexOf("http") !== -1) {
          return link;
        }
        return `https://${link}`;
      },
      getImgURL (url) {
            return S_UTIL.getImgURL(url);
      },
      goToLinkButton(link){
        window.open(link, '_blank');
      },
      setTabIndex(index){
            this.tabIndex=index
      },
      onSlideStart (slide) {
        this.sliding = true
      },
      onSlideEnd (slide) {
        this.sliding = false
      },
      toImage(url) {
        window.open(url, '_blank');
      },
      eventDetail( id, url ) {
          this.$router.push( { name: 'EventDetail', params: { id:id, url:url } } );
      },
      goCal(e){
        this.$router.push({ name: 'CalendarIndex', params: { date: this.getDate(e) }})
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
        moreDate(d1,d2){
            var strtDt = new Date(d1);
            var endDt = new Date(d2);
            var flag = false; // false

            if (endDt <= strtDt){
                flag = true; // true
            }
            return  flag
        },
    },
    components: {
      RichTextPreview,
      SocialNetworkFeed,
      NewsFeed,
      PlanningFeed,
      VueCal,
      CommunityCarousel
    }
  }
</script>


<style lang="sass">
// disables the caption in banner img. Remove all style tag to re enable
.home-carousel-banner
  .carousel-caption
    display: none
</style>

<style lang="sass" scoped>
@import '../stylesheets/style.sass'
.img-c
    img
      width: 100%
      height: 320px !important
.carousel-text
  padding: 0 12%
.background-img
  width: 100vw
  height: 100vh
  position: fixed
  background-size: 70% auto
  background-repeat: no-repeat
  background-position: 100% 15%
  background-attachment: fixed
  z-index: -10
.cursor-pointer
  cursor: pointer
.w-100
  width: 100%
  display: block;
  width: auto;
  height: 320px !important
.upper-links-container
  background-color: $colorTitleDark
  box-shadow: 0 0 5px #333
  margin-bottom: 2rem
  width: 100%
.upper-link-container
  border-bottom: 1px solid rgba(255, 255, 255, 0.15)
  border-right: 1px solid rgba(255, 255, 255, 0.15)
.upper-link
  display: flex
  justify-content: center
  align-items: center
  padding: 0.4rem 0.3rem
  img
    height: 32px
    image-rendering: auto;
    image-rendering: crisp-edges;
    image-rendering: pixelated;
    image-rendering: -webkit-optimize-contrast;
.link
  cursor: pointer
  color: white
  font-family: $fontBody
  font-size: 1.3rem
  padding: 0.35rem 0.4rem
  overflow: hidden
  text-overflow: ellipsis
  white-space: nowrap
  &:hover
    opacity: 0.7
.grid-1
  grid-template-areas: "a a a b c" "a a a b c" "a a a e c" "d d d e c" "d d d f c" " d d d f i" "g g h h i" "g g h h i"
  grid-template-rows: repeat(8, 150px)
.grid-2
  grid-template-areas: "a a a b k" "a a a b c" "a a a e c" "d d d e c" "d d d f c" " d d d f i" "g g h h i" "g g h h i"
  grid-template-rows: repeat(8, 150px)
.grid-3
  grid-template-areas: "a a a b j" "a a a b c" "a a a e c" "d d d e c" "d d d f c" " d d d f i" "g g h h i" "g g h h i"
  grid-template-rows: repeat(8, 150px)
.grid-4
  grid-template-areas: "a a a b j" "a a a b k" "a a a e c" "d d d e c" "d d d f c" " d d d f i" "g g h h i" "g g h h i"
  grid-template-rows: repeat(8, 150px)
.home-grid
  max-width: 92%
  margin: 10px 5%
  display: grid
  //grid-template-areas: "a a a b c" "a a a b c" "a a a e c" "d d d e j" "d d d f k" " d d d f i" "g g h h i" "g g h h i"
  //grid-template-rows: repeat(8, 150px)
  grid-template-columns: repeat(5,19.2%)
  grid-gap: 1%
  .title
    padding: 12px
    font-size: 28px
    font-weight: bold
    font-family: $fontBody
    text-align: left
    text-shadow: 2px 2px 4px #000000;
    a
    color: #fff
  .rural-dev
    grid-area: a
    background: #D38429
    background-size: contain
    background-repeat: no-repeat
    background-position-x: center
    background-position-y: bottom
    position: relative
    overflow: hidden
  .calendar
    grid-area: b
  .news
    grid-area: c
    position: relative
  .community-bar
    grid-area: d
    background: #fff url('../assets/home/community.png')
    background-size: cover
    background-repeat: no-repeat
    background-position-x: right
    background-position-y: center
    position: relative
    .title
      width: 50%
      position: absolute
      top: 25px
      right: 0
      text-align: right
      background: linear-gradient( to right, transparent ,rgba(243, 30, 0, .7), rgba(254, 0, 0, .7));
  .proyect-tools
    grid-area: e
    background:  #4B816B
    background-size: contain
    background-repeat: no-repeat
    background-position-x: center
    background-position-y: bottom
    display: grid
    align-items: center
    justify-items: center
    .title
      text-align: center
    .glow
      background: #57A7B5
  .library
    grid-area: f
    background: #1F6B36
    background-size: contain
    background-repeat: no-repeat
    background-position-x: center
    background-position-y: bottom
    display: grid
    align-items: center
    justify-items: center
    .title
      text-align: center
    .glow
      background: #1E9E8D
  .procedure
    grid-area: g
    background: #286994
    background-size: contain
    background-repeat: no-repeat
    background-position-x: center
    background-position-y: bottom
    display: grid
    align-items: center
    justify-items: start
    .title
      text-align: center
    .glow
      background: #5f95e3
  .topic
    grid-area: h
    background: #02747c
    background-size: contain
    background-repeat: no-repeat
    background-position-x: center
    background-position-y: bottom
    display: grid
    align-items: center
    justify-items: end
    background-image: url('../assets/home/topics.png')
    background-size: cover
    .title
      text-align: center
    
  .report
    grid-area: j
    background: #13A0C0
    display: grid
    grid-template-columns: 24% 74%
    grid-gap: 2%
    align-items: center
    justify-items: center
    .title
      text-align: left
      font-size: 24px
    .glow
      background: #13AfC0
  .energy
    grid-area: k
    background: #FDB816
    display: grid
    align-items: end
    justify-items: start
    overflow: hidden
    position: relative
    .sun
      height: 80%
      position: absolute
      top: -10px
      left: -10px
    .turbine
      height: 80%
      position: absolute
      bottom: 20px
      right: 7px
    .title
      text-align: left
      font-size: 24px
    .glow
      background: #FDBf16
  .social-media
    grid-area: i
  .dock
    position: absolute
    top: 0
    right: 0
    height: 75px
  .button
    cursor: pointer
    overflow: hidden
    text-align: center
    position: relative
    transition: all .2s ease-in-out
    .title
      z-index: 10
    .glow
      display: block
      position: absolute
      width: 200%
      height: 200%
      opacity: .5
      top: 0
      transform: rotate(45deg) translate(30%, 0)
      transition: all 1s cubic-bezier(0.645, 0.045, 0.355, 1)
      z-index: 8
    .glow-wrap
      overflow: hidden
      position: absolute
      width: 100%
      height: 100%
      top: 0
    &:hover
      .glow
        transform: rotate(0) translate(0, 0)
        transition: all 1s cubic-bezier(0.645, 0.045, 0.355, 1)
        opacity: .7
      .glow-wrap
        margin-top: 0
      transform: scale(0.95)
@media only screen and (max-width: 1440px)
  .home-grid
    max-width: 95% !important
    grid-template-rows: repeat(8, 120px) !important
    grid-template-columns: repeat(5,19.2%) !important 
    .title
      font-size: 20px !important
    .dock
      height: 55px
  .calendar-home
    max-height: 250px !important
  .calendar-component
    height: 250px !important
  .tabs
   .tab
    div
      bottom: 30% !important
@media only screen and (max-width: 1280px)
  .community-bar
    .title
      top: 10px !important
@media only screen and (max-width: 800px)
  .img-c
    img
      height: 250px !important
  .w-100
    height: 250px !important
  .upper-link-container
    border-bottom: 1px solid rgba(255, 255, 255, 0.15)
    border-right: none
  .upper-link
    padding: 0.25rem 0
    img
      height: 24px
  .link
    font-size: 1.25rem
  .grid-1
    grid-template-areas: "a a a a" "a a a a " "a a a a " "d d d d" "d d d d" "d d d d" "b b c c" "b b c c"  "e e c c" "e e i i" "f f i i"  "f f i i" "g g g g" "g g g g" "h h h h" "h h h h" 
    grid-template-rows: repeat(16, 120px) !important
    grid-template-columns: repeat(4,24%) !important 
    min-height: 2200px
  .grid-2
    grid-template-areas: "a a a a" "a a a a " "a a a a " "d d d d" "d d d d" "d d d d" "b b k k" "b b c c"  "e e c c" "e e i i" "f f i i"  "f f i i" "g g g g" "g g g g" "h h h h" "h h h h" 
    grid-template-rows: repeat(16, 120px) !important
    grid-template-columns: repeat(4,24%) !important 
    min-height: 2200px
  .grid-3
    grid-template-areas: "a a a a" "a a a a " "a a a a " "d d d d" "d d d d" "d d d d" "b b j j" "b b c c"  "e e c c" "e e i i" "f f i i"  "f f i i" "g g g g" "g g g g" "h h h h" "h h h h" 
    grid-template-rows: repeat(16, 120px) !important
    grid-template-columns: repeat(4,24%) !important 
    min-height: 2200px
  .grid-4
    grid-template-areas: "a a a a" "a a a a " "a a a a " "d d d d" "d d d d" "d d d d" "b b j k" "b b c c"  "e e c c" "e e i i" "f f i i"  "f f i i" "g g g g" "g g g g" "h h h h" "h h h h" 
    grid-template-rows: repeat(16, 120px) !important
    grid-template-columns: repeat(4,24%) !important 
    min-height: 2200px
  .home-grid
    max-width: 95% !important
    margin: 10px 85px !important
    //grid-template-areas: "a a a a" "a a a a " "a a a a " "d d d d" "d d d d" "d d d d" "b b c c" "b b c c"  "e e j k" "e e i i" "f f i i"  "f f i i" "g g g g" "g g g g" "h h h h" "h h h h" 
    //grid-template-rows: repeat(16, 120px) !important
    //grid-template-columns: repeat(4,24%) !important 
    //min-height: 2200px
    .title
      font-size: 16px !important
    .dock
      height: 55px
  .calendar-home
    max-height: 250px !important
  .calendar-component
    height: 250px !important
  .tabs
   .tab
    div
      bottom: 30% !important
  .button
    transition: all .2s ease-in-out !important
    img
      height: 180px !important
      transition: all .2s ease-in-out !important
    &:hover
      transform: scale(0.95)
@media only screen and (max-width: 425px)
  .grid-1
    grid-template-areas: "a a a a" "a a a a " "a a a a " "d d d d" "d d d d" "d d d d" "b b b b" "b b b b" "c c c c " "c c c c " "c c c c " "i i i i " "i i i i " "i i i i "  "e e e e" "e e e e" "f f f f" "f f f f" "g g g g" "g g g g" "h h h h" "h h h h" 
    grid-template-rows: repeat(22, 120px) !important
    grid-template-columns: repeat(4,24%) !important 
    min-height: 3400px !important 
  .grid-2
    grid-template-areas: "a a a a" "a a a a " "a a a a " "d d d d" "d d d d" "d d d d" "b b b b" "b b b b" "k k k k" "c c c c " "c c c c " "c c c c " "i i i i " "i i i i " "i i i i "  "e e e e" "e e e e" "f f f f" "f f f f" "g g g g" "g g g g" "h h h h" "h h h h" 
    grid-template-rows: repeat(24, 120px) !important
    grid-template-columns: repeat(4,24%) !important 
    min-height: 3600px !important 
  .grid-3
    grid-template-areas: "a a a a" "a a a a " "a a a a " "d d d d" "d d d d" "d d d d" "b b b b" "b b b b" "j j j j" "c c c c " "c c c c " "c c c c " "i i i i " "i i i i " "i i i i "  "e e e e" "e e e e" "f f f f" "f f f f" "g g g g" "g g g g" "h h h h" "h h h h" 
    grid-template-rows: repeat(23, 120px) !important
    grid-template-columns: repeat(4,24%) !important 
    min-height: 3600px !important 
  .grid-4
    grid-template-areas: "a a a a" "a a a a " "a a a a " "d d d d" "d d d d" "d d d d" "b b b b" "b b b b" "j j j j" "k k k k" "c c c c " "c c c c " "c c c c " "i i i i " "i i i i " "i i i i "  "e e e e" "e e e e" "f f f f" "f f f f" "g g g g" "g g g g" "h h h h" "h h h h" 
    grid-template-rows: repeat(24, 120px) !important
    grid-template-columns: repeat(4,24%) !important 
    min-height: 3700px !important 
  .home-grid
    max-width: 95% !important
    margin: 10px 46px !important
    //grid-template-areas: "a a a a" "a a a a " "a a a a " "d d d d" "d d d d" "d d d d" "b b b b" "b b b b" "c c c c " "c c c c " "c c c c " "j j j j" "k k k k" "i i i i " "i i i i " "i i i i "  "e e e e" "e e e e" "f f f f" "f f f f" "g g g g" "g g g g" "h h h h" "h h h h" 
    //grid-template-rows: repeat(24, 120px) !important
    //grid-template-columns: repeat(4,24%) !important 
    //min-height: 3600px !important 
    .title
      font-size: 16px !important
    .dock
      height: 55px
  .calendar-home
    max-height: 250px !important
  .calendar-component
    height: 250px !important
  .tabs
   .tab
    div
      bottom: 30% !important
  .button
    transition: all .2s ease-in-out !important
    img
      height: 150px !important
      transition: all .2s ease-in-out !important
    &:hover
      transform: scale(0.95)
    
</style>

<style lang="scss" scoped>

@import '../stylesheets/style.sass';

.background-img{
  width: 100vw;
  height: 100vh;
  position: fixed;
  background-size: 70% auto;
  background-repeat: no-repeat;
  background-position: 100% 15%;
  background-attachment: fixed;
  z-index: -10;
}
.cursor-pointer{
  cursor: pointer;
}
.w-100{
  width: 100%;
  height: 320px;
}
.img-fluid{
    max-width: 100%;
    height: 250px !important;
}
.meta{
    width: 74%;
    margin: 40px auto;
    min-height: 350px;
    font-size: 1.2rem;
}
.meta-grid{
  display: grid;
  grid-template-columns: 2fr 1.5fr 1fr;
  align-items: center;
  justify-items: center;
  min-height: 350px;
  grid-gap: 20px
}
.meta-search{
  width: 100%;
  height: 100%;
}
 .calendar-home{
    display: grid;
    grid-template-columns: 15% 85%;
    width: 100%;
    height: 100%;
    max-height: 312px
    
 }
 .calendar-component{
    width: 100%;
    height: 312px;
    background: #fff;
 }
 .list-grid{
    display: grid;
    grid-template-columns: 100%;
    grid-gap: 10px;
    overflow: hidden;
    overflow-y: auto;
    height: 100%;
    padding: 0 10px;
    border-top: 10px solid #fff;
    border-bottom: 10px solid #fff;
    .list-events{
      position: relative;
      background: #eee;
      transition: all .1s ease-in-out;
      padding: 10px;
      margin: 10px;
      cursor: pointer;
      &:hover{
          transform: scale(1.02); 
      }
    }
      .date{
          font-size: 1rem;
      }
      .descript{
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
    }
  }
 .current-event{
        background: $colorTitle !important;
        color: #fff;
 }
 .active{
    background: $colorTitle !important;
    box-shadow: 0px 0px 3px #555 !important;
    z-index: 2 !important;
 }
 .tabs{
   .tab{
    height: calc(50% + 15px);
    position: relative;
    background: $colorTitleDark;
    color: #fff;
    border-top-left-radius: 20px;
    border-bottom-left-radius: 20px;
    z-index: 1;
    font-weight: bold;
    font-size: 1.25rem;
    cursor: pointer;
    &:nth-child(2){
      margin-top: -30px;
    }
    &:hover{
      box-shadow: 0px 0px 3px #555;
      z-index: 3;
    }
    div{
      position: absolute;
      bottom: 50%;
      width: 100%;
      transform: rotate(-90deg);
      margin: 0 auto;
    }
   }
 }
</style>

<style lang="sass" scoped>

  .container-box 
    background-image: unset

</style>
