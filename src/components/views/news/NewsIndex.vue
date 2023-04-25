<template>
<div>
  <div class="feed-title">{{$t('news.detail.title')}}</div>
  <div class="news-container container-form div-90">
    

    <div class="filter-container">
      <!-- <i class="fas fa-search search-grey"></i> -->
      <b-row class="filter">
        <b-col md="10">
          <b-row>
            <b-col class="title-fitler" md="4">
              {{ $t('faqs.filter_title') }}
            </b-col>
            <b-col md="3">
              <b-form-select
                v-if="isAdmin"
                :options="statusOptions"
                v-model="status">
              </b-form-select>
            </b-col>
            <b-col md="3">
              <div class="search-container">
                <i class="fas fa-search input-search"></i>
                <input type="text" :placeholder="$t('news.index.search')"
                v-model="search">
              </div>
            </b-col>
          </b-row>
          <b-row>
            <b-col md="4" >
              <treeselect v-model="selectedQueryModel" 
                :multiple="true" 
                :options="ruralModels"
                :openDirection="'below'"
                :placeholder="$t( 'faqs.modal.rural_select' )"
                :clearable="true"
                :default-expand-level="1">
                <label slot="option-label" slot-scope="{ node, shouldShowCount, count, labelClassName, countClassName }" :class="labelClassName">
                  <img v-if="node.raw.url != null" :src="getImgURL(node.raw.url)" height="16" width="16"> 
                  <span v-else-if="node.raw && node.raw.color" class="dot" :style="{backgroundColor: node.raw.color}"></span>
                  {{ node.label }}
                  <span v-if="shouldShowCount" :class="countClassName">({{ count }})</span>
                </label>
                <div slot="value-label" slot-scope="{ node }">{{ node.label | truncate10chars }}</div>
              </treeselect>
            </b-col>
            <b-col md="2">
              <b-form-group class="mg-left" style="color: white">
                  <b-form-radio-group 
                    v-model="selectedType" :options="types"
                    stacked>
                  </b-form-radio-group>
              </b-form-group>
            </b-col>
            <b-col class="d-flex justify-content-end" md="2">
              <b-form-group  style="color: white">
                <b-form-radio-group v-model="selectedTime" :options="dates" stacked>
                </b-form-radio-group>
              </b-form-group>
            </b-col>
            <b-col md="3">
              <b-form-group style="color: white">
                <b-form-radio-group v-model="selectedTime" :options="datesTwo" stacked>
                </b-form-radio-group>
              </b-form-group>
            </b-col>
            
          </b-row>
        </b-col>
        <b-col md="2">
          <div class="row column">
            <sipsder-btn btnType="search"
              class="mg-right"
              @onClick="searchQuery"
            ></sipsder-btn>
            <sipsder-btn btnType="clean"
              @onClick="clear"
            ></sipsder-btn>
          </div>
        </b-col>
        
      </b-row>
    </div>
    

    <div class="add-container">
      <div class="col-50">
        <i class="fas fa-th-large mg-right" @click="showGrid = true"></i>
        <i class="fas fa-list" @click="showList"></i>
      </div>
      <div class="add" v-if="isAdmin">
        <sipsder-btn btnType="add" :text="$t('news.index.add')" @onClick="addNew"></sipsder-btn>
      </div>
    </div>

    <div v-if="showGrid" class="center column">
          <div class="news-grid-c">
            <div  v-for="(n, i) in newsGrid" :key="i"  class="news-item">
              <div class="img-container-grid">
                <div style="position: relative" class="center" v-if="n.attachmentType === 'Video'">
                  <iframe height="150" style="width: 100%; border: 3px solid transparent" :style="{'border-color': n.principal}" :src="getImgURL(n.attachment)"></iframe>
                  <div class="cover" @click="newsDetailGrid(i)"></div>
                </div>
                <img v-else :src="getImgURL(n.attachment)" :style="{'border-color':n.principal}" @click="newsDetailGrid(i)">
                <div class="colors-container">
                  <div class="colors" :style="{'background-color': n.principal}" v-b-tooltip.hover :title="n.clasification"></div>
                  <div class="colors" v-for="(r, j) in n.colors" :key="j" :style="{'background-color': r}" v-b-tooltip.hover :title="n.clasifications[j]"></div>
                  <div class="language-container">
                    <div class="language" v-for="(v,k) in n.language" :key="k">
                        {{v}}
                    </div>
                  </div>
                </div>
              </div>
              <br>
              <div class="info-container">
                <div class="info" >
                  <div class="col-70">
                    {{n.createdAt | moment("DD MMM YYYY-h:mm:ss a")}}
                  </div>
                  <div class="col-30" style="text-align: right">
                    <sipsder-btn btnType="edit_pen" text="" @onClick="editNews(n.id)"  v-if="isAdmin" style="transform: scale(0.7);margin-top: -30px;"></sipsder-btn>
                  </div>
                </div>
                <div class="info" v-if="isAdmin" v-html="n.status? '<span style=\'color:green\'>'+$t('news.index.enable')+'</span>':'<span style=\'color:red\'>'+$t('news.index.disable')+'</span>'">
                </div>
                <div class="title" @click="newsDetailGrid(i)">
                  {{n.title}}
                </div>
                <div class="info">
                    {{n.description}}
                </div>
              </div>
            </div>
          </div>
      
    </div>

    
    <div v-else class="center column">
      <b-pagination size="md" class="center top-paginator" :total-rows="meta.totalElements" v-model="page" v-if="meta !== null"
        @input="loadMore"
        :per-page="size">
      </b-pagination>

      <div class="news-list" v-for="(n, i) in result" :key="i">
        <div class="img-container">
          <div style="position: relative; width: 100%; height: 250px;" class="center" v-if="n.attachmentType === 'Video'">
            <iframe width="350" height="250"
              @click="newsDetail(i)"
              style="border: 3px solid transparent"
              :style="{'border-color': n.principal}"
              :src="getImgURL(n.attachment)">
            </iframe>
            <div class="cover"
            @click="newsDetail(i)"></div>
          </div>
          <img v-else :src="getImgURL(n.attachment)"
          @click="newsDetail(i)"
          :style="{'border-color': n.principal}">
          <div class="colors-container">
            <div class="colors"
                  :style="{'background-color': n.principal}" v-b-tooltip.hover :title="n.clasification"></div>
            <div class="colors" v-for="(r, j) in n.colors" :key="j"
            :style="{'background-color': r}" v-b-tooltip.hover :title="n.clasifications[j]"></div>
          </div>
        </div>
        <div class="info-container mg-left">
          <div class="info">
            {{n.createdAt | moment("DD MMM YYYY-h:mm:ss a")}}
            <sipsder-btn btnType="edit_pen" text="" @onClick="editNews(n.id)"  v-if="isAdmin" style="transform: scale(0.7);margin-top: -30px;"></sipsder-btn>
          </div>
          <div class="info" v-if="isAdmin" v-html="n.status? '<span style=\'color:green\'>'+$t('news.index.enable')+'</span>':'<span style=\'color:red\'>'+$t('news.index.disable')+'</span>'">
          </div>
          <div class="title" @click="newsDetail(i)">
            {{n.title}}
          </div>
          <div class="info">
            {{n.description}}
          </div>
          
        </div>
      </div>

      <b-pagination size="md" class="center" :total-rows="meta.totalElements" v-model="page" v-if="meta !== null"
        @input="loadMore"
        :per-page="size">
      </b-pagination>
    </div>
    
    
    <div class="col-100 column mg-tb-10">
      <div class="col-100 right" v-if="showGrid">
        <sipsder-btn btnType="load_more" :text="$t('news.index.more')" @onClick="showList"></sipsder-btn>
      </div>
      
    </div>
    
  </div>
    <div class="col-100 center">
        <sipsder-btn btnType="back" @onClick="$router.go(-1)"></sipsder-btn>
    </div>
  </div>
</template>

<script>
import VAPI from '../../../http_common'
import Treeselect from '@riophae/vue-treeselect';
import moment from 'moment'
import { Carousel, Slide } from 'vue-carousel';
import { PERMISSIONS_TYPES } from '../../../domain_constants'
import { SERVICE_NAMES, HTTP_STATUS } from '@/sipsder_constants'
import PrintComponent from "../../shared/PrintComponent";
import S_UTIL from "../../../util/sipsder_util";

export default {
  
  data(){
    return {
      showGrid: true,
      result: [],
      meta: null,
      page: 1,
      size: 10,
      search: '',
      statusOptions: [
        {value: -1, text: this.$t('news.index.state')},
        {value: 1, text: this.$t('news.index.enable')},
        {value: 0, text: this.$t('news.index.disable')}
      ],
      types: [
        {value: 2, text: this.$t('news.index.image')},
        {value: 3, text:  this.$t('news.index.video')},
      ],
      status: -1,
      selectedType: -1,
      ruralModels: [],
      selectedQueryModel: [],
      selectedTime: -1,
      dates: [
      ],
      datesTwo: [],
      newsGrid: [],
      newsGridVideos: [],
      ids: []
      
    }
  },
  
  async beforeMount() {
    this.dates.push({value: moment().startOf('day').valueOf(), text: this.$t('news.index.today')})
    this.dates.push({value: moment().startOf('week').valueOf(), text: this.$t('news.index.week')})
    this.dates.push({value: moment().startOf('month').valueOf(), text: this.$t('news.index.month')})
    this.datesTwo.push({value: moment().subtract(2, 'months').valueOf(), text: this.$t('news.index.three') })
    this.datesTwo.push({value: moment().subtract(6, 'months').valueOf(), text: this.$t('news.index.six') })
    this.datesTwo.push({value: moment().startOf('year').valueOf(), text: this.$t('news.index.year')})
    let status = 1
    if(this.isAdmin){
      status = -1
    }else {
      this.status = 1
    }
    
    let ruralModels = await VAPI.get(`${SERVICE_NAMES.RURAL_MODEL}/tree`);
    this.ruralModels = ruralModels.data.data;
    
    if(this.$route.params.rural!=null || this.$route.params.rural != undefined){
      this.showGrid = false
      if(!this.meta){
        let status = 1
        if(this.isAdmin){
          status = -1
        }else {
          this.status = 1
        }
        this.selectedQueryModel.push(this.$route.params.rural)
        let response = await VAPI.get(`${SERVICE_NAMES.NEWS}/search?state=${status}&models=${this.$route.params.rural}&type=-1&time=-1&q=&page=${this.page - 1}&size=${this.size}`)
        this.result = response.data.data
        this.result.forEach(n => {
          n.language = n.language.split(",")
          if(n.clasifications)
            n.clasifications = n.clasifications.split(",")
          if(n.colors)
            n.colors = n.colors.split(",")
          if(n.geographies)
            n.geographies = n.geographies.split(",")
        })

        this.meta = response.data.meta
      }
    } else {
      let responseGrid = await VAPI.get(`${SERVICE_NAMES.NEWS}/grid?page=${this.page - 1}&size=${this.size}`)
      this.newsGrid = responseGrid.data.data
      this.newsGrid.forEach(n => {
        n.language = n.language.split(",")
        if(n.clasifications)
          n.clasifications = n.clasifications.split(",")
        if(n.colors)
          n.colors = n.colors.split(",")
        if(n.geographies)
          n.geographies = n.geographies.split(",")
      })
      
      let responseGridVideo = await VAPI.get(`${SERVICE_NAMES.NEWS}/grid-videos?page=${this.page - 1}&size=${this.size}`)
      this.newsGridVideos = responseGridVideo.data.data
      this.newsGridVideos.forEach(n => {
        n.language = n.language.split(",")
        if(n.clasifications)
          n.clasifications = n.clasifications.split(",")
        if(n.colors)
          n.colors = n.colors.split(",")
        if(n.geographies)
          n.geographies = n.geographies.split(",")
      })
    }
  },
  computed: {
    isAdmin() {
      return this.$store.getters.hasPermission(PERMISSIONS_TYPES.ADMIN)
    }
  },
  methods: {
    scrollTopPaginator(){
      this.$scrollTo(".top-paginator", 500, {offset: -100,})
    },
    getImgURL (url) {
      return S_UTIL.getImgURL(url);
    },
    async showList(){
      this.showGrid = false
      if(!this.meta){
        let status = 1
        if(this.isAdmin){
          status = -1
        }else {
          this.status = 1
        }
        let response = await VAPI.get(`${SERVICE_NAMES.NEWS}/search?state=${status}&models=&type=-1&time=-1&q=&page=${this.page - 1}&size=${this.size}`)
        this.result = response.data.data
        this.result.forEach(n => {
          n.language = n.language.split(",")
          if(n.clasifications)
            n.clasifications = n.clasifications.split(",")
          if(n.colors)
            n.colors = n.colors.split(",")
          if(n.geographies)
            n.geographies = n.geographies.split(",")
        })
        this.meta = response.data.meta
      }
    },
    clear(){
      this.selectedQueryModel = []
      this.selectedTime = -1
      this.selectedType = -1
      this.search = ''
      if(this.isAdmin){
        this.status = -1
      }else {
        this.status = 1
      }
      this.searchQuery()
    },
    newsDetailGridVideos(i){
      this.$router.push({ name: 'NewsDetail', params: { id: this.newsGridVideos[i].id, url: this.newsGridVideos[i].url } })
    },
    newsDetailGrid(i){
      this.$router.push({ name: 'NewsDetail', params: { id: this.newsGrid[i].id, url: this.newsGrid[i].url } })
    },
    newsDetail(i){
      this.$router.push({ name: 'NewsDetail', params: { id: this.result[i].id, url: this.result[i].url } })

    },
    async searchQuery() {
      this.showGrid = false
      this.page = 1;
      let response = await VAPI.get(`${SERVICE_NAMES.NEWS}/search?state=${this.status}&q=${this.search}&models=${this.selectedQueryModel.join(",")}&type=${this.selectedType}&time=${this.selectedTime}&page=${this.page - 1}&size=${this.size}`)
      
      if(response.status === HTTP_STATUS.OK) {
        this.result = response.data.data
        this.meta = response.data.meta
        this.result.forEach(n => {
        n.language = n.language.split(",")
        if(n.clasifications)
          n.clasifications = n.clasifications.split(",")
        if(n.colors)
          n.colors = n.colors.split(",")
        if(n.geographies)
          n.geographies = n.geographies.split(",")
        })
      }else {
        this.result = []
        this.meta = null
      }
      
    },
    async loadMore() {
      let query = `state=${this.status}&models=${this.selectedQueryModel.join(",")}&type=${this.selectedType}&time=${this.selectedTime}&q=${this.search}`
      
      let response = await VAPI.get(`${SERVICE_NAMES.NEWS}/search?${query}&page=${this.page - 1}&size=${this.size}`)
      if(response.status === HTTP_STATUS.OK) {
        this.result = response.data.data
        
        this.result.forEach(n => {
          n.language = n.language.split(",")
          if(n.clasifications)
            n.clasifications = n.clasifications.split(",")
          if(n.colors)
            n.colors = n.colors.split(",")
          if(n.geographies)
            n.geographies = n.geographies.split(",")
        })
      }
    },
    editNews(id) {
      this.$router.push({name: 'NewsCreate', params: {id: id}})

    },
    addNew(){
      this.$router.push({name: 'NewsCreate'})
    }
  },
  watch: {
    result : function (val) {
      this.scrollTopPaginator();
    }
  },
  components: {
    Treeselect,
    Carousel, 
    Slide,
    PrintComponent,
  }
}
</script>

<style lang="sass" scoped>
  @import '../../../stylesheets/style.sass'
  .dot 
    height: 16px
    width: 16px
    border-radius: 50%
    display: inline-block

  .feed-title
    position: relative
    display: inline-block
    color: #fff
    background: url(../../../assets/title/barra_sola.png)
    background-repeat: no-repeat
    background-size: 100% 100%
    min-height: 90px
    width: 105%
    font-size: 36px
    font-weight: bold
    font-family: $fontBody
    margin-left: -10%
    margin-top: 15px
    margin-bottom: 3%
    padding-left: calc(10% + 40px)
    padding-top: 20px
  .news-grid-c
    display: grid
    grid-template-areas: 'a b c' 'd e f' 'g h i'
    grid-template-columns: 32% 32% 32%
    width: 100%
    grid-gap: 1%
  .news-item
    padding: 15px
    border: 2px solid $colorTitle
    transition: all .2s ease-in-out
    cursor: pointer
    &:hover
         transform: scale(0.95)
    .img-container-grid
        max-width: 100% !important
        height: 50%
        img
          max-width: 100% !important
          height: 230px
          width: auto
    &:nth-child(1)
      grid-area: a
    &:nth-child(2)
      grid-area: b
    &:nth-child(3)
      grid-area: c
    &:nth-child(4)
      grid-area: d
    &:nth-child(5)
      grid-area: e
    &:nth-child(6)
      grid-area: f
    &:nth-child(7)
      grid-area: g
    &:nth-child(8)
      grid-area: h
    &:nth-child(9)
      grid-area: i
  .fa-pencil-alt
    font-size: 2rem
  .cover
    width: 100%
    height: 100%
    background: transparent
    position: absolute
    top: 0
    left: 0
  .right
    text-align: right
  .mg-left
    margin: 15px
  .mg-tb-10
    margin: 10px 0 !important
  .start
    justify-content: centerrr
    display: flex
    align-items: flex-start
  .grey
    margin: 15px 0
    background-color: lighten(grey,40%)
    min-height: 350px
    display: flex
    justify-content: flex-start
    align-items: flex-start
    flex-direction: column
    border: 2px solid #0db8bb
    .title-multimedia
      font-size: 2.5rem
      text-transform: uppercase
      font-weight: 600
      padding: 10px
    .no-content
      width: 100%
      margin-top: 100px
      color: white
      font-size: 2.5rem
      text-transform: uppercase
      display: flex
      justify-content: center
      align-items: center
  .col-0
    width: 0
    display: none
  .space-between
    display: flex
    align-items: flex-start
    justify-content: space-between
    flex-wrap: wrap
  .left
    margin-left: 15px
    margin-bottom: 15px
    display: flex
    justify-content: center
    align-items: flex-start
    flex-direction: column
    .info-container
  .mg-top
    margin-top: 15px
  .img-container-grid
    width: 100%
    +flexbox
    +justify-content(center)
    +align-items(center)
    +flex-direction(column)
    .colors-container
      width: 100%
      height: 30px
      +flexbox
      justify-content: flex-end
      +align-items(center)
      .colors
        cursor: pointer
        margin: 0 0 0 5px
        width: 25px
        height: 25px
        border-radius: 50%
      .language-container
        +flexbox
        +justify-content(flex-start)
        +align-items(center)
        .language
          font-size: 1rem !important
          padding: 2px
          margin: 0 2px
          border: 1px solid $colorSidebarMobile
          color: $colorSidebarMobile
    img
      border: 3px solid transparent
  .fa-th-large, .fa-list
    cursor: pointer
    font-size: 2.5rem
  .column
    flex-direction: column
  .col-100
    width: 100%
  .col-90
    width: 90%
  .col-85
    width: 82%
  .col-15
    width: 15%
  .col-80
    width: 80%
  .col-50
    width: 50%
  .col-70
    width: 70%
  .col-30
    width: 30%
  .col-60
    width: 60%
  .col-40
    width: 40%
  .mg-left
    margin-left: 15px
  .mg-right
    margin-right: 5px
  .search-container
    position: relative

  .input-search
    position: absolute
    left: 5px
    top: 25%
  .col-20
    width: 20%
  .search-grey
    font-size: 12.5rem
    color: white
    background-color: grey
  .filter-container
    width: 100%
    display: flex
    justify-content: center
    align-items: center
    flex-wrap: nowrap
    padding: 15px 15px 5px 15px
    border-radius: 10px
    background-color: $colorTitleDark
  .title-fitler
    color: white
    font-style: italic
    color: white
    font-weight: bolder
    font-size: 2.5rem
  .filter
    margin: 10px 0
    width: 100%
    display: flex
    justify-content: center
    align-items: center
    .row
      width: 100%
      display: flex
      justify-content: space-between
      align-items: center
      flex-wrap: nowrap
      input
        width: 100%
        border-radius: 10px
        padding: 2px 20px
  .title
    color: black !important
    width: 100%
    color: white
    font-weight: 600
    font-size: 2rem
    text-transform: uppercase
  .news-container
    width: 100%
    +flexbox
    +justify-content(flex-start)
    +flex-direction(column)
    padding: 1% 5%
  .center
    +flexbox
    +justify-content(center)
    +align-items(center)
  .add-container
    margin-top: 10px
    +flexbox
    +justify-content(flex-start)
    +align-items(center)
  .add
    width: 50%
    text-align: right
  .news-list
    margin: 10px
    width: 100%
    +flexbox
    +justify-content(flex-start)
    +align-items(center)
  .info-container
    width: 100%
    +flexbox
    +justify-content(center)
    +align-items(flex-start)
    +flex-direction(column)
    .clasification
      font-size: 2.0rem
      font-weight: 600
    .title
      cursor: pointer
      font-size: 1.5rem
      font-weight: 400
    .info
      display: flex
      justify-content: flex-start
      width: 100%
      font-size: 1.1rem
      font-weight: 100
  .img-container
    width: 350px
    +flexbox
    +justify-content(center)
    +align-items(center)
    +flex-direction(column)
    img
      border: 3px solid transparent
      width: 350px
      height: auto
      margin-bottom: 5px
      object-fit: fill
    .colors-container
      width: 100%
      height: 30px
      +flexbox
      justify-content: flex-end !important
      +align-items(center)
      .colors
        cursor: pointer
        margin: 0 0 0 5px
        width: 25px
        height: 25px
        border-radius: 50%
      .language-container
        +flexbox
        +justify-content(flex-start)
        +align-items(center)
      .language
        font-size: 1rem !important
        padding: 2px
        margin: 0 2px
        border: 1px solid $colorSidebarMobile
        color: $colorSidebarMobile
  .white
    color: white !important
  .border-white
    border: 1px solid white !important
  @media screen and (max-width: $widthTablet)
    .news-grid-c
      grid-template-areas: 'a' 'b' 'c' 'd' 'e' 'f' 'g' 'h' 'i' !important
      grid-template-columns: 100% !important
      min-height: 4000px
  @media screen and (max-width: $widthMobile)
    .news-grid-c
      grid-template-areas: 'a' 'b' 'c' 'd' 'e' 'f' 'g' 'h' 'i' !important
      grid-template-columns: 100% !important
      min-height: 4200px
    .space-between
      justify-content: center !important
      align-items: center !important
    .left
      justify-content: center !important
      align-items: flex-start !important
      flex-direction: column !important
    .col-20
      width: 80% !important
    .column
      flex-direction: row
    .col-85
      width: 100%
    .col-15
      width: 100%
    .col-80
      width: 100%
    .col-50
      width: 100%
    .col-70
      width: 80%
    .col-40
      width: 100%
    .col-60
      width: 80%
    .col-30
      width: 80%
      margin: 10px 0
    .mg-left
      margin-left: 10px
    .mg-right
      margin-right: 5px
    .search-container
      width: 85%
      margin: 5px 0
    .input-search
    .col-20
      width: 20%
    .search-grey
    .filter-container
      flex-wrap: wrap
    .filter
      flex-direction: column
      .row
        flex-direction: column
        input
    .title
    .news-container
    .center
      flex-wrap: wrap
    .add
    .news-list
      flex-direction: column
    .info-container
      .clasification
        font-size: 2.5rem
      .title
        font-size: 2rem
      .info
        font-size: 1.5rem
    .img-container
      img
      .colors-container
        .colors
  @media screen  and (max-width: $widthMobile)
    .div-90
        width: 80% !important
    .feed-title
        padding-left: calc(10% + 40px) !important
        font-size: 20px !important
  @media screen  and (max-width: $widthTablet)
      .div-90
          width: 80% !important
          margin: 0 auto
</style>
