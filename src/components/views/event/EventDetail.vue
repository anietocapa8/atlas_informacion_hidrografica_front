<template>
  <div>
    <div class="feed-title">{{$t( 'event_detail.title' )}}</div>
    <div id="contenedor" v-if="event" class="col-90">
      <b-container class='container-form'>
        <b-row align-h="end">
          <sipsder-btn btnType="edit_pen" 
            :text="$t( 'event_detail.edit' )"
            v-if="canEdit"
            @onClick="editDetail">
          </sipsder-btn>
        </b-row>
        <b-row align-v="center">
          <b-col>
            <b-row align-h="start">
              <b-col>
                <div><span class="event-title bold">{{event.name}}</span></div>
                <div><span>{{mapArrayToStringCommaSpaced(event.geographies)}}</span></div>
                <div><span>{{event.place}}</span></div>
                <b-row class="author-details">
                  <b>{{ $t('help.detail.created_by')}}</b>
                  <div class="profile-image">
                    <img :src="getProfileImage( event.authorPhoto )">
                  </div>
                  <span class="author-name">{{ event.authorName }}</span>
                </b-row>
              </b-col>
            </b-row>
          </b-col>
          <b-col>
            <b-row align-h="end" v-if="canEdit">
              <p class="red bold">{{event.statusLabel}}</p>
            </b-row>
          </b-col>
        </b-row>
        <b-row align-v="center" align-h="end">
          <b-col>
            <compact-carousel 
              :attachments="event.attachments" 
              :ruralModels="event.ruralModels"
              :height="260"
              :magnify="true"
              :fillImage="true"
              :delay="20"
              >
            </compact-carousel>
          </b-col>
          <b-col>
            <div>
              <span class="title-green bold">{{ $t( 'event_detail.entity' ) }}</span>	
              <span class="pl-3">{{ mapArrayToStringCommaSpaced(event.institutions) }}</span>
            </div>
            <div>
              <span class="title-green bold">{{ $t( 'event_detail.person' ) }}</span>
              <span class="pl-3">{{ event.person }}</span>
            </div>
            <div>
              <span class="title-green bold">{{ $t( 'event_detail.contact_phone' ) }}</span>
              <span class="pl-3">{{ event.contactPhone }}</span>
            </div>
            <div>
              <span class="title-green bold">{{ $t( 'event_detail.contact_email' ) }}</span>
              <span class="pl-3">{{ event.contactEmail }}</span>
            </div>
            <div>
              <span class="title-green bold">{{ $t( 'event_detail.start' ) }}</span>
              <span class="pl-3">{{ event.startDate | moment("DD MMM YYYY - h:mm a")}}</span>
            </div>
            <div>
              <span class="title-green bold">{{ $t( 'event_detail.end' ) }}</span>
              <span class="pl-3">{{ event.endDate | moment("DD MMM YYYY - h:mm a")}}</span>
            </div>
                 
          </b-col>
        </b-row>      
        <b-row align-v="center" class="options-padded">
          <b-col cols="3" lg="3" sm="3">
            <social-networks-share></social-networks-share>
          </b-col>
          <b-col cols="1" class="d-flex justify-content-center">
            <report-component :contentId="event.id" 
                              :content-type="REPORT_CONTENT_TYPES.EVENTS">
            </report-component>
          </b-col>
          <b-col cols="3" sm="2">
            <score-component :idContent="event.id"
                            :idType="SCORE_CONTENT_TYPE.EVENTS"
                            :likes="event.likes"
                            :dislikes="event.dislikes">
            </score-component>
          </b-col>
          <b-col cols="1">
            <div class="relative">
              <i class="fas fa-comment" @click="scrollTo"/>
              <div class="number">{{ event.comments == null ? 0 : event.comments }}</div>
            </div>
          </b-col>
          <b-col>
            <print-component>
              <b-row align-v="center">
                <b-col>
                  <b-row >
                    <b-col>
                      <div><span class="event-title bold">{{event.name}}</span></div>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col cols="9">
                      <b-row>
                        <b-col>
                          <div><span>{{mapArrayToStringCommaSpaced(event.geographies)}}</span></div>
                          <div><span>{{event.place}}</span></div>
                        </b-col>
                      </b-row>
                      <b-row class="author-details">
                        <b-col>
                          <b>{{ $t('help.detail.created_by')}}</b>
                          <div class="profile-image">
                            <img :src="getProfileImage( event.authorPhoto )">
                          </div>
                          <span class="author-name">{{ event.authorName }}</span>
                        </b-col>
                      </b-row>
                    </b-col>
                    <b-col>
                        <p class="red bold">{{event.statusLabel}}</p>
                    </b-col>
                  </b-row>
                </b-col>
              </b-row>

              <b-row align-v="center" align-h="end">
                <b-col>
                  <compact-carousel 
                    :attachments="event.attachments" 
                    :ruralModels="event.ruralModels"
                    :magnify="true"
                    :height="260"
                    :fillImage="true"
                    :delay="20"
                    >
                  </compact-carousel>
                </b-col>
                <b-col>
                  <div>
                    <span class="title-green bold">{{ $t( 'event_detail.entity' ) }}</span>	
                    <span class="pl-3">{{ mapArrayToStringCommaSpaced(event.institutions) }}</span>
                  </div>
                  <div>
                    <span class="title-green bold">{{ $t( 'event_detail.person' ) }}</span>
                    <span class="pl-3">{{ event.person }}</span>
                  </div>
                  <div>
                    <span class="title-green bold">{{ $t( 'event_detail.contact_phone' ) }}</span>
                    <span class="pl-3">{{ event.contactPhone }}</span>
                  </div>
                  <div>
                    <span class="title-green bold">{{ $t( 'event_detail.contact_email' ) }}</span>
                    <span class="pl-3">{{ event.contactEmail }}</span>
                  </div>
                  <div>
                    <span class="title-green bold">{{ $t( 'event_detail.start' ) }}</span>
                    <span class="pl-3">{{ event.startDate | moment("DD MMM YYYY - h:mm a")}}</span>
                  </div>
                  <div>
                    <span class="title-green bold">{{ $t( 'event_detail.end' ) }}</span>
                    <span class="pl-3">{{ event.endDate | moment("DD MMM YYYY - h:mm a")}}</span>
                  </div>          
                </b-col>
              </b-row> 
              <br>
              <b-row>
                <b-col>
                  <rich-text-preview class="justified-text" :content="event.description"/>
                </b-col>
              </b-row>
              <b-row>
                <b-col>
                  <div><span class="bold">{{ $t( 'event_detail.notes' ) }}</span></div>
                </b-col>
              </b-row>
              <b-row>
                <b-col>
                  <rich-text-preview class="justified-text" :content="event.notes"/>
                </b-col>
              </b-row>

              <b-row class="options-padded">
                <b-col>
                  <div><span class="blue">{{ $t( 'event_detail.related' ) }} {{event.tags}}</span></div>
                </b-col>
              </b-row>
            </print-component>
          </b-col>
        </b-row>
        <b-row>
            <span class="title-green bold">{{ $t( 'event_detail.summary' ) }}</span>
            <div class="summary">{{ event.summary}}</div>  
        </b-row>
        <b-row>
          <rich-text-preview class="justified-text" :content="event.description"/>
        </b-row>
        <br>
        <b-row>
          <div><span class="title-green bold">{{ $t( 'event_detail.notes' ) }}</span></div>
        </b-row>
        <b-row>
          <rich-text-preview class="justified-text" :content="event.notes"/>
        </b-row>
        <b-row class="options-padded">
          <div><span class="blue">{{ $t( 'event_detail.related' ) }} {{event.tags}}</span></div>
        </b-row>
        <b-row>      	
          <div class="w-100 comments options-padded">
            <comment-component :parentId="event.id" typeParent="events"></comment-component>
          </div>
        </b-row>
        <b-row class="options-padded bold">
          {{ $t( 'event_detail.incoming' ) }}
        </b-row>
        <b-row>
          <event-carousel v-if="related.length > 0" :related="related"></event-carousel>
          <div v-else class="w-100">
            <b-card>
              <b-card-body>
                <b-row align-h="center" align-v="center">
                  {{ $t( 'event_detail.no_content' ) }}
                </b-row>
              </b-card-body>
            </b-card>
          </div>
        </b-row>
        <b-row align-h="center">
          <sipsder-btn btnType="back" :text="$t( 'event_detail.back_to_list' )" @onClick="backToList">
          </sipsder-btn>
          <sipsder-btn btnType="back" :text="$t( 'event_detail.back' )" @onClick="back">
          </sipsder-btn>
        </b-row>
      </b-container>
    </div>
  </div>
</template>
<script>

import VAPI from '../../../http_common';
import CompactCarousel from './CompactCarousel.vue';
import EventCarousel from './EventCarousel.vue';
import RichTextPreview from "../../shared/RichTextPreview";
import SocialNetworksShare from '../../shared/social_networks_share/SocialNetworksShare.vue';
import ReportComponent from '../../shared/ReportComponent.vue';
import ScoreComponent from '../../shared/ScoreComponent.vue';
import CommentComponent from "../../shared/comment/CommentComponent.vue"
import { SERVICE_NAMES, SCORE_CONTENT_TYPE, REPORT_CONTENT_TYPES } from '../../../sipsder_constants';
import { EVENT_STATE, PERMISSIONS_TYPES } from '../../../domain_constants'
import PrintComponent from "../../shared/PrintComponent";
import S_UTIL from "../../../util/sipsder_util";
import moment from 'moment';

export default {
	async beforeMount( ){
    this.fetchAndSetEvent();
  },
  watch: {
    "$route.params.id"(value) {
      this.fetchAndSetEvent();
    }
  },
  components: {
    CompactCarousel,
    EventCarousel,
    RichTextPreview,
    SocialNetworksShare,
    ReportComponent,
    ScoreComponent,
    CommentComponent,
    PrintComponent,
  },
  data: () => ({
    SCORE_CONTENT_TYPE,
    REPORT_CONTENT_TYPES,
    PERMISSIONS_TYPES,
    event: null,
    related: []
  }),
  methods: {
    getImgURL (url) {
        return S_UTIL.getImgURL(url);
    },
    async fetchAndSetEvent() {
      const detail = await this.fetchEvent( );
      this.event = detail;
      if(this.$route.params.url!== undefined && this.event.url !== this.$route.params.url){
          this.$router.push({name: 'CalendarIndex'});
      } else {
        const related = await this.fetchRelated( this.event.id );
        if( related == null ) {
          this.related = []
        }
        else {
          this.related = related;
        }
      }
    },
  	async fetchEvent( ) {
  		try {
        const response = await VAPI.get(`${SERVICE_NAMES.EVENT}/detail/${this.$route.params.id}`);
        return response.data;
      }
      catch( error ) {
        console.log( 'Error fetching detailed event info', error );
      }
    },
    async fetchRelated( id ) {
  		try {
          const response = await VAPI.get(`${SERVICE_NAMES.EVENT}/${id}/related-geographies`);

          return response.data.data.map(event => {
            // fix datetime offset
            let stDate = moment(event.start).toDate();
            let endDate = moment(event.end).toDate();
            stDate.setTime( stDate.getTime() - stDate.getTimezoneOffset()*60*1000 );
            endDate.setTime( endDate.getTime() - endDate.getTimezoneOffset()*60*1000 );

            return {
              ...event,
              start: stDate,
              end: endDate
            }
          });

      }
      catch( error ) {
        console.log( 'Error fetching related events ', error );
      }
  	},
  	mapArrayToStringCommaSpaced( array ) {
  		if( array != null )
  			return array.map( ( item ) => { return item.name } ).join( ', ' );
    },
    getProfileImage(url) {
      return url ? this.getImgURL(url) : require("../../../assets/profile.png");
    },
    scrollTo (){
      this.$scrollTo('.comments', 500);
    },
    editDetail( ) {
      this.$router.push( { name: 'CalendarCreate', params: { id: this.$route.params.id + '' } } );
    },
    back( ) {
      this.$router.go( -1 );
    },
    backToList( ) {
    	this.$router.push( { name: 'CalendarIndex' } );
    }
  },
  computed: {
    canEdit( ) {
      if( this.$store.getters.isAuthenticated &&
        ( this.event.status == EVENT_STATE.PENDING || this.event.status == EVENT_STATE.PUBLISH ) &&
        ( this.event.author == this.$store.getters.getCurrentUser.id ||
        	this.$store.getters.hasPermission( PERMISSIONS_TYPES.CONTROL ) ) ) 
        return true;
      return false;
    }
  }
}
</script>
<style lang="sass" scoped>
@import '../../../stylesheets/style.sass'
@media screen  and (max-width: $widthTablet)
  .col-90
    width: 80% !important
    margin: 0 auto
@media screen  and (max-width: $widthMobile)
  .feed-title
    padding-left: calc(10% + 40px) !important
    font-size: 20px !important
</style>
<style scoped>
.feed-title {
  position: relative;
  display: inline-block;
  color: #fff;
  background: url(../../../assets/title/barra_sola_2.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  height: 90px;
  width: 105%;
  font-size: 40px;
  font-weight: bold;
  margin-left: -10%;
  margin-top: 15px;
  margin-bottom: 3%;
  padding-left: calc(10% + 20px);
  padding-top: 20px;
}

.feed-title a {
  text-decoration: none;
  color: #fff;
}
           
.justified-text{
	text-align: justify;
}
.event-title {
  font-size: xx-large;
}
.red {
	color: red;
}
.blue {
	color: #2a78e4;
}
.title-green {
	color: #0db8bb;
}
.bold {
	font-weight: bold;
}
.options-padded {
  padding-top: 15px;
  padding-bottom: 15px;
}
.relative {
  position: relative;
}
.summary{
  text-align: justify;
  margin-bottom: 10px
}
.number {
  font-size: 1.2rem;
  color: white;
  position: absolute;
  top: 10%;
  left: 18%;
}
.fa-comment {
  font-size: 2.5rem;
  cursor: pointer;
}
.profile-image {
  display: inline-block;
  width: 30px;
  height: 30px;
  margin-left: 5px;
  border-radius: 50%;
  border: 2px solid #777; 
}
.profile-image img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
.author-details {
  padding-left: 3%;
  padding-top: 5%;
  padding-bottom: 3%;
}
.author-name {
  padding-left: 2%;
}
@media (max-width: 800px) {
  .number {
    left: 35%;
  }
}
@media (max-width: 768px) {
  .number {
    left: 60%;
  }
}
@media (min-width: 1200px) {
	.container {
		max-width: 1200px;
		padding-right: 50px;
	}	
}
</style>
