<template>
  <div class="news-detail" id="newDetails">
    <div class="feed-title">{{$t('news.detail.title')}}</div>
    <div class="news-content div-90" v-if="news !== null">
      
      <div class="news-information">

        <div class="title">
          <h2>{{title}}</h2>
          <sipsder-btn btnType="edit_pen" class="w-100 right" @onClick="editNews()" v-if="isAdmin"></sipsder-btn>
        </div>
        <div class="description">
          {{description}}
        </div>
        <div class="multiple mt-3">
          <div class="geography" v-for="(v,i) in news.geographies" :key="i">
            {{v.geography.name}}<template v-if="i !== news.geographies.length -1">,</template>
          </div>
        </div>

        <b-row class="mt-4 mb-4 d-flex justify-content-center">
          <b-col lg="8" v-if="newsAttachments.length">
            <compact-carousel
              :attachments="newsAttachments"
              :fields="carouselFields"
              :rural-models="newsRuralModels"
              :height="260"
              :fillImage="true"
              :delay="20"
            />
          </b-col>
        </b-row>

        <div class="info-container mt-4">
          <div class="left-grid">
            <div class="left-subtext d-inline-flex justify-content-between w-100">
              <div>{{ news.news.date | moment("DD MMM YYYY - h:mm:ss a") }}</div>
              <div class="language-container">
                <div class="language" 
                  @click="changeLanguage(v.code)"
                  v-for="(v,k) in languages" :key="k"
                >
                  {{v.code}}
                </div>
              </div>
            </div>
            <br>
            <span class="left-subtext">{{$t('news.detail.by')}} {{news.news.author}}</span>
            <div class="multiple left-subtext mb-4">
              <div class="instituion" v-for="(v,i) in news.institutions" :key="i">
                {{v.institution.name}}<template v-if="i !== news.institutions.length -1">,</template>
              </div>
            </div>
            <div class="w-100 center">
              <div class="w-33">
                <s-share-question :detailed-url="''"></s-share-question>
              </div>
              <div class="w-33">
                <print-component style="height: 100%">
                  <b-row class="title">
                    <b-col class=" d-flex justify-content-center">
                      <h2>{{title}}</h2>
                    </b-col>
                  </b-row>
                  <div class="print-image mt-3 mb-3">
                    <img
                      v-if="newsAttachments[0].typeName === 'Video'"
                      :src="getImageYT(newsAttachments[0].url)"
                      :alt="newsAttachments[0].description"
                    />
                    <img
                      v-else
                      :src="getImgURL(newsAttachments[0].url)"
                      :alt="newsAttachments[0].description"
                    />
                  </div>
                  <div class="left-subtext">{{$t('news.detail.by')}} {{news.news.author}}</div>
                  <div>{{ news.news.date | moment("DD MMM YYYY - h:mm:ss a") }}</div>
                  <div class="multiple left-subtext mb-4">
                    <div class="instituion" v-for="(v,i) in news.institutions" :key="i">
                      {{v.institution.name}}<template v-if="i !== news.institutions.length -1">,</template>
                    </div>
                  </div>
                  <b-row>
                    <b-col class="description">
                      {{description}}
                    </b-col>
                  </b-row>
                  <b-row class="multiple">
                    <b-col>
                      <div class="geography" v-for="(v,i) in news.geographies" :key="i">
                        {{v.geography.name}}<template v-if="i !== news.geographies.length -1">,</template>
                      </div>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col class="content">
                      <rich-text-preview class="content-body" :content="content"/>
                      <div class="title">
                        {{$t('news.detail.related')}}: 
                      </div>
                      <div class="multiple">
                        <div class="info">
                          {{news.news.tags}}
                        </div>
                      </div>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col>
                      <div class="tags">
                        <word-cloud-component></word-cloud-component>
                      </div>
                    </b-col>
                  </b-row>
                </print-component>
              </div>
              <div class="w-33">
                <report-component :contentId="news.news.id" 
                  :content-type="REPORT_CONTENT_TYPES.NEWS"></report-component>
              </div>
              <div class="w-33">
                <score-component :idContent="news.news.id" 
                  :idType="SCORE_CONTENT_TYPE.NEWS"
                  :likes="news.likes"
                  :dislikes="news.dislikes"></score-component>
              </div>
              <div class="relative">
                <i class="fas fa-comment" @click="scrollTo"/>
                <div class="number">{{news.comments}}</div>
              </div>
            </div>
            <div class="content">
              <rich-text-preview class="content-body" :content="content"/>
              <div class="title">
                {{$t('news.detail.related')}}: 
              </div>
              <div class="multiple">
                <div class="info">
                  {{news.news.tags}}
                </div>
              </div>
            </div>
          </div>
          <div class="right-grid">
            <div class="readed-side">
              <most-visited></most-visited>
            </div>
            <div class="tags">
              <word-cloud-component></word-cloud-component>
            </div>
          </div>
        </div>

      </div>

      <div class="w-100 comments">
        <s-comment :parentId="news.news.id" typeParent="news"></s-comment>
      </div>

      <div class="more-news div-90">
        <div class="title">
          {{$t('news.detail.more')}}
        </div>
        <news-carousel :related="related"></news-carousel>
      </div>
      <div class="w-100 center-container">
        <sipsder-btn :text="'Regresar a Noticias Generales'" class="mg-10" btnType="back" @onClick="$router.push({
          name: 'NewsIndex'
        })"></sipsder-btn>
        <sipsder-btn btnType="back" class="mg-10" @onClick="$router.go(-1)"></sipsder-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { Carousel, Slide } from 'vue-carousel';
import VAPI from '../../../http_common';
import CompactCarousel from "../event/CompactCarousel";
import NewsMostVisited from "../../shared/news_feed_share/NewsMostVisited.vue";
import NewsCarousel from "../../shared/NewsCarousel.vue";
import RichTextPreview from "../../shared/RichTextPreview";
import SocialNetworksShare from '../../shared/social_networks_share/SocialNetworksShare.vue';
import ReportComponent from '../../shared/ReportComponent.vue';
import ScoreComponent from '../../shared/ScoreComponent.vue';
import { SCORE_CONTENT_TYPE, REPORT_CONTENT_TYPES, SERVICE_NAMES } from '../../../sipsder_constants';
import CommentCmp from "../../shared/comment/CommentComponent.vue"
import WordCloudComponent from '../../shared/WordCloudComponent.vue'
import { PERMISSIONS_TYPES } from '../../../domain_constants'
import PrintNew from './PrintNewsDetail.vue'
import PrintComponent from "../../shared/PrintComponent";
import S_UTIL from '../../../util/sipsder_util'


export default {
  data(){
    return  {
      SCORE_CONTENT_TYPE,
      REPORT_CONTENT_TYPES,
      news: null,
      related: null,
      languages: [],
      title: '',
      description: '',
      content: '',
      index: 0,
      indX: 1,
      extraAttach: null,
      newsAttachments: null,
      newsRuralModels: null,
      carouselFields: [
        { name: "title", style: ["strong"] },
        { name: "author", prev: this.$t("rurality_stories.detail.author") }
      ]
    }
  },
  components: {
    Carousel,
    CompactCarousel,
    Slide,
    "most-visited":NewsMostVisited,
    "news-carousel":NewsCarousel,
    "rich-text-preview": RichTextPreview,
    's-share-question': SocialNetworksShare,
    ReportComponent,
    ScoreComponent,
    "s-comment" : CommentCmp,
    WordCloudComponent,
    PrintNew,
    PrintComponent,
  },
  computed: {
    isAdmin() {
      return this.$store.getters.hasPermission(PERMISSIONS_TYPES.ADMIN)
    }
  },
  async beforeMount(){
    let result = await VAPI.get(`${SERVICE_NAMES.NEWS}/${this.$route.params.id}`)
    
    this.news = result.data.data
    if(this.$route.params.url!== undefined && this.news.news.url !== this.$route.params.url){
        this.$router.push({name: 'NewsIndex'});
    } else {

      this.newsAttachments = result.data.data.attachments.map(att => {
        return { ...att, ...att.attachment };
      })

      this.newsRuralModels = result.data.data.news.newsRuralModel.map(rural => {
        return { ...rural, ...rural.ruralModel };
      })

      this.languages = [this.news.news.language]
      this.news.child.forEach(element => {
        this.languages.push(element.language)
      });
      this.title = this.news.news.headline
      this.description = this.news.news.description
      this.content = this.news.news.content
      this.index = 0

      VAPI.get(`${SERVICE_NAMES.NEWS}/related-model/${this.news.news.id}`).then((output) => {
          this.related=output.data.data;
        }).catch((e) => {
          
        });
    }
  },
  methods:{
    editNews(){
      this.$router.push({name: 'NewsCreate', params: {id: this.news.news.id}})    
    },
    scrollTo(){
      this.$scrollTo('.comments', 500);
    },
    getImageYT(url) {
      if (url.indexOf("youtube") !== -1) {
        var res = url.split("/");
        var rel = res[4].split("?");
        return "https://img.youtube.com/vi/" + rel[0] + "/hqdefault.jpg";
      }
      return url;
    },
    getImgURL(url) {
      return S_UTIL.getImgURL(url);
    },
    changeLanguage(v){
      if(this.news.news.language.code === v){
        this.title = this.news.news.headline
        this.description = this.news.news.description
        this.content = this.news.news.content

      }
      var i;
      for (i = 1; i < this.languages.length; i++) { 
        if(this.languages[i].code === v){
          this.title = this.news.child[i-1].headline
          this.description = this.news.child[i-1].description
          this.content = this.news.child[i-1].content
        }
      }
    },
  }
}
</script>

<style lang="sass" scoped>
  @import '../../../stylesheets/style.sass'
  $padding-const: 15px
  $padding-offset: 60px
  .multiple
    display: flex
    justify-content: flex-start
    align-items: center
  .right
    display: flex
    justify-content: flex-end
    align-items: center
  .mg-10
    margin: 10px
  .center-container
    display: flex
    justify-content: center
    align-items: center
  .tags
    margin-top: 50px
    justify-self: center
    width: 250px
    height: 250px
  .relative
    position: relative
  .number
    font-size: 1.2rem
    color: white
    position: absolute
    top: 15%
    left: 45%
  .fa-comment
    font-size: 2.5rem
    cursor: pointer
  .w-33
    width: 20%
  .center
    display: flex
    justify-content: left
    align-items: center
  .news-detail
    padding-top: 30px
    padding-left:  $padding-offset
    .news-content
      width: 90%
  .title
    font-weight: bold !important
    h2
      width: 100%
      margin-right: 10px
      font-size: 2.5rem
      font-style: italic
  .image
    width: 250px
    height: 200px
    padding: 15px
    position: relative
    div
      width: 90%
      margin: 0 auto
      height: 200px
      overflow: hidden
      img
        width: 100%
        margin: 0 auto
        max-height: 200px
      iframe
        width: 100%
        height: 200px
        margin: 0 auto

  .print-image
    max-width: 50%

  .feed-title
    position: relative
    display: inline-block
    color: #fff
    background: url(../../../assets/title/barra_sola.png)
    background-repeat: no-repeat
    background-size: 100% 100%
    height: 90px
    width: 110%
    font-size: 40px
    font-weight: bold
    font-family: $fontBody
    padding-left: 50px
    padding-top: 20px
    margin: 0 0 15px ($padding-offset*-1)
  .language-container
    .language
      cursor: pointer
      padding: 2px
      font-size: 1rem
      margin: 0 2px
      border: 1px solid $colorSidebarMobile
      color: $colorSidebarMobile
      display: inline-block

  .rural-model, .geography, .instituion 
    display: indline-block
    font-family:Palatino Linotype
    font-style: italic
    font-size: 1.25rem
  
  .geography, .instituion
    color: #6d6e71

  .news-information
    margin-left: $padding-const
    width: 95%
    margin-top: 10px
    .title, .description
      width: 100%
      display: flex
      justify-content: flex-start
      align-items: center
      text-align: justify

  .img-container
    display: grid
    grid-template-columns: 80% 20%
    grid-gap: 20px
    margin-top: 10px
    .multimedia
      img
        width: auto
        
    .info
      align-self: end
      margin-bottom: 30px
      .author
        text-transform: uppercase
        font-size: 1rem
        font-weight: 700

  .info-container
    display: grid
    grid-template-columns: 70% 30%
    grid-gap: 20px
    margin-bottom: 30px
    .left-grid
      .left-subtext
        color: #6d6e71
        font-size: 1.3rem
        font-weight: 600
      .share
        height: 30px
      .content
        margin-top: 10px
        .content-body
        	text-align: justify
          margin-bottom: 30px
      .info
        font-size: 1.25rem
        font-weight: 100
        color: $colorSidebarMobile
        text-transform: uppercase
    .right-grid
      display: flex
      align-items: center
      flex-direction: column
      margin-left: 10px
      border-left: 1px solid #DBDBDB
      .readed-side
        margin-left: 3rem
        margin-top: 15px
        width: 90%
        justify-self: right
        .most-visited
          span
            background: white !important
          ol
            background: white !important

  .colors-container
    width: 100% !important
    height: 30px
    display: flex
    justify-content: flex-end
    align-items: center
    .colors
      margin: 5px 0 0 5px
      width: 25px
      height: 25px
      border-radius: 50%
      float: right

  .content
    font-size: 1.5rem
        
  .more-news
    position: relative
    width: 100%
    margin-left: 15px
    button
      background: white
      border-radius: 3px
      font-size: 5rem
      color: $colorTitle
      font-weight: bold
      border: 1px solid transparent
    .previmg
      position: absolute
      left: -2.5%
      top: 5%
      height: 90%
    .nextimg
      position: absolute
      right: -2.5%
      top: 5%
      height: 90%
  

  @media screen  and (max-width: 806px)
    .center-container
      flex-direction: column
    .w-33
      width: 100%
    .center
      flex-wrap: wrap
    .img-container
      grid-template-columns: 100% !important
    .info-container
      grid-template-columns: 100% !important
    .info-container
      .right-grid
        margin-left: 0
        border: none
        .readed-side
          margin-left: 0


  @media screen  and (max-width: 1600px) and (min-width: 806px)
    .more-news
      margin-left: -35px !important


  @media screen  and (max-width: $widthMobile)
    .feed-title
        padding-left: calc(10% + 40px) !important
        font-size: 20px !important
    .news-detail
        padding: unset !important
    .info-container
      .right-grid
        margin-left: 0
        border: none
        .readed-side
          margin-left: 0


  @media screen  and (max-width: $widthTablet)
      .div-90
          width: 80% !important
          margin: 0 auto  
      .info-container
      .right-grid
        margin-left: 0
        border: none
        .readed-side
          margin-left: 0


</style>
