<template>
    <div class="container-r">
      <div class="container-feedback">
        <b-card no-body>
            <b-tabs  pills card style="heigth: 100% !important">
              <b-tab title="Twitter" v-if="view_twitter">
                <template slot="title">
                    <b-btn  class="fab fa-twitter-square" @click="network_active = 0"> </b-btn>
                </template>
                  <div class="container-tweet" v-if="network_active == 0">
                    <timeline :id="twitter_data.user" :sourceType="'likes'" :options="{ theme: 'light' }"/>
                  </div>

              </b-tab>
              <b-tab title="Instagram"  v-if="view_instagram">
                  <template slot="title">
                    <b-btn  class="fab fa-instagram"  @click="network_active = 1"> </b-btn>
                  </template>
                  <div class="container-images" v-if="network_active == 1">
                      <vue-instagram :token="instagram_data.token" :tags="[]" :count="3" mediaType="image">
                        <template slot="feeds" slot-scope="props">
                          <b-card
                          :img-src="props.feed.images.standard_resolution.url"
                           :href="props.feed.images.standard_resolution.url"
                          img-top
                          > 
                            <p class="title is-4">{{ props.feed.user.full_name }}</p>
                            <p class="subtitle is-6">@ {{ props.feed.user.username }}</p>
                            <div v-if='props.feed.caption == ""'>
                              {{ props.feed.caption.text }}
                            </div>
                          </b-card>
                          <div slot="footer" class="card-footer card-footer-border">
                            <b-row>
                              <b-col>
                                <p class="card-footer-item "><i class="fa fa-heart"></i> &nbsp; {{ props.feed.likes.count }}</p>
                              </b-col>
                              <b-col>
                                <p class="card-footer-item"><i class="fa fa-commenting"></i> &nbsp; {{ props.feed.comments.count }}</p>
                              </b-col>
                              <b-col>
                                <a :href="props.feed.link" target="_blank" class="card-footer-item"><i class="fa fa-external-link"></i> &nbsp; Link</a>
                              </b-col>
                            </b-row>
                          </div >
                        </template>
                        <template slot="error" slot-scope="props">
                            <div class="fancy-alert"> {{ props.error.error_message }}</div>
                        </template>
                      </vue-instagram>
                  </div>
              </b-tab>

              <b-tab title="Facebook" class="tab_facebook" v-if="view_facebook" >
                <template slot="title">
                  <b-btn  class="fab fa-facebook " @click="network_active = 2"> </b-btn>
                </template>
                <div class="container-facebook" v-if="network_active == 2">
                  <iframe :src="facebook_data.url"
                  style="border:none;overflow:auto" 
                  scrolling="no"
                  frameborder="0"
                  allowTransparency="true" 
                  allow="encrypted-media">
                  </iframe>
                </div>
                
              </b-tab>

               <b-tab title="Flickr" class="tab_flickr" v-if="view_flickr">
                <template slot="title">
                  <b-btn  class="fab fa-flickr" @click="network_active = 3"> </b-btn>
                </template>
                <div class="container-images" v-if="network_active == 3" >
                  <div v-for="(image,i) in flickr_data.json.items" :key="i" >
                    
                    <template> 
                      <b-card
                       :img-src="image.media.m"
                          img-top
                      >
                      
                      <a :href="image.link" target="_blank"><i class="fa fa-external-link"></i> &nbsp;
                      <p class="subtitle is-6">{{ image.title }}</p>
                      </a>
                      </b-card>
                    </template>

                  </div>
              
                </div>
                
              </b-tab>
            </b-tabs>
        </b-card>
      </div>
    </div>
</template>

<script>
import Tweet from "vue-tweet-embed/tweet";
import Timeline from "vue-tweet-embed/timeline";
import VueInstagram from "vue-instagram";
import VAPI from "../../../http_common";
import axios from 'axios';
import { SERVICE_NAMES } from '@/sipsder_constants'
import {SOCIAL_NETWORKS_IDS} from '../../../domain_constants'

const VAPI_FLICKR = axios.create({
  baseURL: 'https://api.flickr.com/services/feeds',
  timeout: 6000,
})

export default {

  props: {

  },

  data() {
    return {
      
      instagram_data:{
        token: ''
      },
      twitter_data:{
        user: ''
      },
      facebook_data:{
        user: '',
        token: '',
        url: ''
      },
      flickr_data:{
        user: '',
        token: '',
        json: ''
      },
      
      network_active: 0,
      view_instagram: false,
      view_twitter: false,
      view_facebook: false,
      view_flickr: false,
      paramStr: ''

    };
  },
  components: {
    tweet: Tweet,
    timeline: Timeline,
    VueInstagram
  },
  computed:{
    instagram_token(){
      return this.token_aux;
    }
  },
  methods: {
    instagram_method() {
      this.view_instagram = true;
    },
    twitter_method(){
      this.view_twitter = false;
    },
    facebook_method(){
      this.view_facebook = false;
    },
    flickr_method(){
      this.view_flickr = false;
    }
  },
  beforeCreate() {
        VAPI.get(`${SERVICE_NAMES.SOCIAL_NETWORK}`)
            .then(response => {
              if(response.data.data) {
                response.data.data.forEach(element => {
                  if (element.id == SOCIAL_NETWORKS_IDS.INSTAGRAM){
                      this.instagram_data.token = element.token;
                      if(element.initPage == 1){
                          this.view_instagram = true;
                      }
                  }
                  if (element.id == SOCIAL_NETWORKS_IDS.TWITTER){
                      this.twitter_data.user = element.user;
                      if(element.initPage == 1){
                          this.view_twitter = true;
                      }
                  }
                  if (element.id == SOCIAL_NETWORKS_IDS.FACEBOOK){
                      this.facebook_data.user = element.user;
                      this.facebook_data.token = element.token;
                      this.facebook_data.url = `https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2F${this.facebook_data.user}%2F&tabs=timeline&small_header=false&adapt_container_width=true&show_facepile=true&appId=${this.facebook_data.token}`
                      if(element.initPage == 1){
                          this.view_facebook = true;
                      }
                  }if(element.id == SOCIAL_NETWORKS_IDS.FLICKR){
                       if(element.initPage == 1){
                          this.view_flickr = true;
                          VAPI.get(`${SERVICE_NAMES.SOCIAL_NETWORK}/flickr`)
                              .then(response => {
                                  this.flickr_data.json = response.data;
                              })
                              .catch(function(error) {
                                      console.log("Error al Consumir servicio Red Social: " + error);
                              });
                      }
                  }
                });
              }
            })
            .catch(function(error) {
                console.log("Error al Consumir servicio Red Social: " + error);
            });
    },
  beforeMount(){
  
  }
};
</script>
<style lang="scss">

@import '../../../stylesheets/style.sass';
@import '@/stylesheets/helpers/_variables.sass';
.container-r{
  height: 100%;
}
.container-feedback {
  width: 100%;
  height: 100%;
  .nav-link {
    padding: 5px;
    @media screen and (max-width: 1100px){
      padding: 3px;
      .button {
        font-size: 10px;
      }
      
    }
  }
  .tab-content {
      overflow-y: auto ;
      height: 416px ;
     .active{
       height: 100%;
     }
  }

  .tab_facebook{
    overflow-y: hidden ;
    height: 100%;
    .container-facebook{
       height: 100%;
    }
    iframe{
      height: 100%;
      width: 100%;
    }
  }

}
.container-images {
  margin: 0 10px;
}

@media screen  and (max-width:  1440px){
   .tab-content {
      height: 320px !important;
   }
}
@media screen  and (max-width:  800px){
   .tab-content {
      height: 349px !important;
   }
}
</style>
<style lang="scss" scoped >




//###### TWITTER ##########

.container-tweet {
  width: 100%;

  .card-body {
    padding: 0px !important;
  }
}

//###### FACEBOOK ##########

//###### INSTAGRAM ##########

.card-footer-border {
  background-color: transparent;
  border-top: none;
  padding-top: 0px;

  .col {
    border-width: 1px;
    border-style: solid;
    border-color: lightgray;
    border-top: none;
  }
}

.card-body {
  padding-right: 0px;
  padding-left: 0px;
  padding-top: 5px;
}
</style>
