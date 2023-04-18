<template>
  <div class="news-feed">
    <div class="title" v-b-tooltip.hover :title="$t('home.newsFeed.news')"><router-link :to="{ name: 'NewsIndex'}">{{ $t('home.newsFeed.news') }}</router-link></div>
    <div class="feed-body">
        <div class="latest-news">
          <span class="padding">{{$t( 'home.newsFeed.latestNews')}}</span>
          <div class="body">
            <div v-for="(v, i) in latest" :key="i" class="new-item">
              <span class="news-date">{{getDate(v.date)}}</span><br>
              <span class="news-geography">{{v.geographyName}}</span><br>
              <span class="news-headline"><router-link :to="{ name: 'NewsDetail', params: { id: v.id, url: v.url }}">{{v.headline}}</router-link></span><br>
              <span class="news-description">{{v.resume}}</span>
            </div>
          </div>
          <span class="more-news padding"><router-link :to="{ name: 'NewsIndex'}">{{$t( 'home.newsFeed.moreNews')}}</router-link></span>
        </div>
        <div class="most-news">
          <most-visited></most-visited>
        </div>
        <div class="personal-news" v-if="enabled">
          <span>{{$t( 'home.newsFeed.relatedNews')}}</span>
          <div class="body" v-if="isLogged && related.length > 0">
           <div v-for="(v, i) in related" :key="i" class="new-item">
              <div class="news-date">{{getDate(v.date)}}</div>
              <div class="news-geography">{{v.geographyName}}</div>
              <div class="news-headline"><router-link :to="{ name: 'NewsDetail', params: { id: v.id, url: v.url }}">{{v.headline}}</router-link></div>
              <div class="news-description">{{v.resume}}</div>
            </div>
          </div>
          <div v-else-if="isLogged && (related == null || related.length==0)" class="body">
            <div>
              {{$t( 'home.newsFeed.nullRelated')}}
            </div>
          </div>
          <div class="body" v-else>
            <div>
              {{$t( 'home.newsFeed.notLoggedMessage')}} <a v-b-modal.login href="#">{{$t( 'home.newsFeed.authenticate')}}</a> o <router-link :to="{ name: 'UserRegistration'}">{{$t( 'home.newsFeed.register')}}</router-link>
            </div>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
import VAPI from '../../../http_common';
import NewsMostVisited from "./NewsMostVisited.vue"
import { SERVICE_NAMES } from '@/sipsder_constants';

export default {
  data(){
    return {
      latest:[],
      related:[],
      enabled: false
    }
  },
  methods: {
    getDate:function(date){
      let dateBreak = date.split("-")
      let newDate = this.$t( 'util.months_long.'+ dateBreak[1]) + " " + dateBreak[2] + " del " + dateBreak[0]
      return newDate
    }
  },
  computed:{
    isLogged() {
      return this.$store.getters.isAuthenticated
    }
  },
  components:{
    "most-visited": NewsMostVisited
  },
  mounted() {
   
  },
  beforeMount() {
    VAPI.get(`${SERVICE_NAMES.NEWS}/latest`).then((output) => {
        this.latest=output.data.data;
      }).catch((e) => {
        
      });
      if(this.$store.getters.isAuthenticated){
          VAPI.get(`${SERVICE_NAMES.NEWS}/related`).then((output) => {
          this.related=output.data.data;
        }).catch((e) => {
          
        });
      }
    
      
  },
};
</script>

<style lang="sass" scoped>
@import '../../../stylesheets/style.sass'
.news-feed
  width: 100%
  height: 100%
  margin: 0 auto
  background: #5591a4
  background-size: contain
  background-repeat: no-repeat
  background-position-x: center
  background-position-y: bottom
  display: grid
  grid-template-rows: 65px
  .title
      padding: 12px
      font-size: 28px
      font-weight: bold
      font-family: $fontBody
      overflow: hidden
      text-overflow: ellipsis
      white-space: nowrap
      text-shadow: 2px 2px 4px #000000;
      a
        color: #fff
.feed-body
  height: 100%
  width: 100%
  background: rgba(255,255,255,.5)
  padding: 3px
  overflow-y: auto
  div
    align-self: center
  .latest-news
    position: relative
    margin-bottom: 20px
    margin-top: 15px
    .padding
      padding: 10px
    span
      font-weight: bold
      font-size: 20px
    .body
      height: 80% !important
      width: 100% !important
      margin: 0 !important
      padding: 15px
      div
        margin: 0
        a
          color: #333 !important
          text-decoration: none
          &:hover 
            text-decoration: underline
      .new-item
        height: auto
        overflow: hidden
        text-overflow: ellipsis
        border-bottom: 1px dotted #333
        padding: 5px 0 5px 0
        .news-date
          color: #333
          font-size: 12px
        .news-geography
          color: #990033
          font-size: 12px
          overflow: hidden
          text-overflow: ellipsis
          white-space: nowrap
          max-height: 30px
        .news-headline
          color: #333
          font-size: 14px
          overflow: hidden
          text-overflow: ellipsis
          white-space: nowrap
          max-height: 30px
        .news-description
          overflow: hidden
          text-overflow: ellipsis
          white-space: nowrap
          max-height: 30px
          font-size: 14px
    .more-news
      position: absolute
      font-size: 14px
      right: 0
      bottom: -10px
      padding: 1px !important
  .most-news
    overflow: hidden
  .personal-news
    overflow: hidden
    span
      font-weight: bold
      font-size: 20px
      padding: 10px
    .body
      display: grid
      grid-template-columns: 1fr
      grid-template-rows: 33% 33% 33%
      grid-gap: 5%
      height: 80% !important
      width: 100% !important
      margin: 0 !important
      padding: 15px
      div
        align-self: baseline
        margin: 0
        a
          color: #333 !important
          text-decoration: none
          &:hover 
            text-decoration: underline
      .new-item
        height: auto
        overflow: hidden
        text-overflow: ellipsis
        border-bottom: 1px dotted #333
        padding: 5px 0 5px 0
        .news-date
          color: #333
          font-size: 12px
        .news-geography
          color: #990033
          font-size: 12px
          overflow: hidden
          text-overflow: ellipsis
          white-space: nowrap
          max-height: 30px
        .news-headline
          color: #333
          font-size: 14px
          overflow: hidden
          text-overflow: ellipsis
          white-space: nowrap
          max-height: 30px
        .news-description
          overflow: hidden
          text-overflow: ellipsis
          white-space: nowrap
          max-height: 30px
          font-size: 14px
@media screen  and (max-width:  1440px)
    .news-feed
        .title
            font-size: 22px !important
@media screen  and (max-width:  800px)
    .news-feed
        .title
            font-size: 16px !important
</style>