<template>
<div class="search-index">
    <div class="feed-title">{{$t( 'metasearch.title' ).toUpperCase()}}</div>
    <div class="col-90 container-form">
        <div class="filter-box">
            <div class="legend">{{$t( 'community.survey.filter' ).toUpperCase()}}</div>
            <div class="t-rurals grid-col">
                <b-form-group :label-cols="4" label-class="font-weight-bold">
                    <treeselect v-model="filter.ruralModel" 
                        :multiple="true"
                        :options="autocomplets.rurals"
                        :openDirection="'below'"
                        :placeholder="$t( 'faqs.modal.rural_select')"
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
                </b-form-group>
            </div>
            <div class="t-images grid-col-50">
                <b-form-group label-class="font-weight-bold"></b-form-group>
                    <b-form-checkbox style="color: white" v-model="filter.images">{{$t('metasearch.images')}}</b-form-checkbox>                
            </div>
            <div class="t-text grid-col">
                <b-form-group :label-cols="4" label-class="font-weight-bold" description= "">
                    <b-form-input :placeholder="$t( 'metasearch.query')" v-model="filter.searchQuery" 
                    v-b-tooltip.hover :title="$t('metasearch.tooltip')" maxlength="100"></b-form-input>
                </b-form-group>
            </div>
            <div class="grid-col buttons-col t-buttons">
                <sipsder-btn btnType="search" @onClick="loadMore()" :disabled="filter.searchQuery.length < METASEARCH.MIN_LENGTH"></sipsder-btn>
                <sipsder-btn btnType="clean" @onClick="clearfilter()"></sipsder-btn>
            </div>
        </div>
        <div class="info-filter">
            <div class="p-5 mt-3" style="text-align: right">
                {{$t( 'metasearch.advanced_query')}} 
                <span>
                    <router-link :to="{name: 'CommunityLibrary'}">
                        {{$t( 'metasearch.advanced_query_doc')}}
                    </router-link>
                </span>
                ,
                <span>
                    <router-link :to="{name: 'RuralIndicatorIndex'}">
                        {{$t( 'metasearch.advanced_query_figure')}}
                    </router-link>
                </span>
                {{$t( 'metasearch.advanced_query_or')}} 
                <span>
                    <router-link :to="{name: 'CommunityImages'}">
                        {{$t( 'metasearch.advanced_query_images')}}
                    </router-link>
                </span>
            </div>
        </div>
        <b-row v-if="isSearching" class="px-5 py-3" align-h="center" align-v="center">
            <div class="bordered-blue-container w-50 text-center">
                {{$t('metasearch.searching')}}...
            </div>
        </b-row>
        <b-row v-else-if="isLoading" class="px-5 py-3" align-h="center" align-v="center">
            <div class="bordered-blue-container w-50 text-center">
                {{$t('roles.loading')}}...
            </div>
        </b-row>
        <div v-else-if="meta.pageElements > 0" class="search-list">
            <div class="item">
                <div class="info-filter">
                    <div class="info">
                        {{meta.pageElements}} {{$t( 'library.results' )}}
                    </div>
                </div>
                <b-pagination size="md" style="justify-content: center;" :total-rows="meta.totalElements" v-model="filterParams.page" 
                    v-if="meta !== null" @input="loadMore()" :per-page="filterParams.size">
                </b-pagination>
                <div class="search-item item" v-for="(result,i) in results" :key="i">
                    <div class="grid-content">
                        <div>
                            <div>
                                <b>{{result.title}}</b>
                                <span style="font-style:italic; margin-left: 10px">({{$t(`route.${result.pageAlias}`)}})</span>
                            </div>
                            <br>
                            <p style="display:inline-block; overflow: hidden;text-overflow: ellipsis; width:auto; max-width:100%; max-height: 50px">
                                {{result.description}}
                            </p>
                            <br>
                            <div style="display: flex">
                                <p style="color: blue; cursor: pointer" @click="resultDetail(result)">{{$t( 'metasearch.link')}}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <br>
            <div>
                <b-pagination size="md" style="justify-content: center;" :total-rows="meta.totalElements" v-model="filterParams.page"
                    v-if="meta.totalElements >= filterParams.size" @input="loadMore()" :per-page="filterParams.size">
                </b-pagination>
            </div>
        </div>
        <div v-else class="no-elements">{{$t( 'metasearch.no_elements' )}}</div>
    </div>
</div>
</template>

<script>
import VAPI from "../../../http_common";
import { SERVICE_NAMES, HTTP_STATUS, METASEARCH } from '../../../sipsder_constants';
import Treeselect from '@riophae/vue-treeselect';
import S_UTIL from "../../../util/sipsder_util";

export default {
    components: {
        Treeselect
    },
    data(){
        
        return {
            METASEARCH: METASEARCH,
            isLoading: false,
            isSearching: false,
            filter: {
                searchQuery: this.$route.query.q,
                ruralModel: null,
                images: false
            },
            filterParams: { page: 1, size: 10, },
            autocomplets: {
                rurals: []
            },
            meta: {totalElements: 0, pageElements: 0},
            results: null,
            lastPage: 0,
            lastSearch: null
        }
    },
    methods: {
        getImgURL (url) {
            return S_UTIL.getImgURL(url);
        },
        clearfilter(){
            let lastQuery = this.filter.searchQuery
            this.filterParams = { page: 1, size: 10, }
            this.meta = {totalElements: 0, pageElements: 0}
            this.filter = {
                searchQuery: '',
                ruralModel: null,
                images: false
            }
            this.results = null
            this.lastPage = 0
            this.lastSearch = null
            // this.loadMore()
        },
        resultDetail(result){
            let routeData = null
            if(result.pageAlias == "SurveyResult"){
                routeData = this.$router.resolve({path: METASEARCH.SURVEY_PREFIX + result.url});
            }   else if(result.id){
                routeData = this.$router.resolve({name: result.pageAlias, params: {id: result.id}});
            }   else{
                routeData = this.$router.resolve({name: result.pageAlias});
            }
            window.open(routeData.href, '_blank');
        },
        async loadMore(){
            this.isSearching = true
            this.results = []
            this.$store.dispatch("setSearchQuery", this.filter.searchQuery);
            // if(this.filterParams.page == 1 && this.lastSearch != ){}
         
            let query = '?page=' + this.filterParams.page  + '&size=' + this.filterParams.size;
            query += '&q=' + this.filter.searchQuery
            if(this.filter.ruralModel != null && this.filter.ruralModel != ''){
                query += '&ruralModel=' + this.filter.ruralModel
            }
            if(this.filter.images){
                query += '&attachment=' + "Imágen,Video"
            }
            try{
                const response = await VAPI.get(`/${SERVICE_NAMES.METASEARCH_ENGINE}/search${query}`);
                if(response.status == HTTP_STATUS.NO_CONTENT){
                    this.meta = {totalElements: 0, pageElements: 0} 
                }
                else if (response.status == HTTP_STATUS.OK) {
                    this.results = response.data;
                    
                    if(this.lastPage < this.filterParams.page){
                        this.lastPage = this.filterParams.page
                        this.meta.totalElements += this.results.length
                    }
                    if(this.results.length > this.filterParams.size){
                        this.results.splice(-1,1)
                    }else{
                        this.meta.totalElements = this.results.length
                    }
                    this.meta.pageElements = this.results.length
                }
            }
            catch( error ) {
                console.log( 'Error fetching results ', error );
            }

            this.isSearching = false
        }
    },
    async beforeMount(){
        this.$store.dispatch("setSearchDesktop", false);

        this.isLoading = true
        let ruralModels = await VAPI.get( `${SERVICE_NAMES.RURAL_MODEL}/tree` );
        this.autocomplets.rurals = ruralModels.data.data;
        this.isLoading = false

        this.loadMore()
    },
    beforeDestroy(){
        this.$store.dispatch("setSearchQuery", null);
    }
}
</script>

<style lang="sass" scoped>
    @import '@/stylesheets/style.sass'
    .no-elements
        border: solid black 1px
        padding: 30px
        margin: 30px 0
        text-align: center
    .search-index
        width: 100%
    .col-90
        width: 90%
        margin-left: auto
        margin-right: auto 
    .bordered-blue-container
        padding: 20px
        border: 2px solid $colorTitle
        border-radius: 15px
    .feed-title
        position: relative
        display: inline-block
        color: #fff
        background: url(../../../assets/title/barra_sola_4.png)
        background-repeat: no-repeat
        background-size: 100% 100%
        height: 90px
        width: 110%
        font-size: 40px
        font-weight: bold
        font-family: $fontBody
        margin-left: -10%
        margin-top: 15px
        margin-bottom: 3%
        padding-left: calc(10% + 20px)
        padding-top: 20px
    .filter-box
        display: grid
        grid-template-columns: 1fr 1fr 1fr 1fr
        grid-template-areas: 'a b c d' 'e f g h'
        grid-gap: 15px
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
            .v-select, .dropdown-toggle
                padding: 0px !important
                height: 30px !important
            .selected-tag
                font-size: 17px !important
                margin: 0 !important
        .t-rurals
            grid-area: e
            width: 120%
        .t-images
            grid-area: f
            margin-top: -15px
            margin-left: 40%
        .t-text
            grid-area: g
            width: 110%
        .t-buttons
            grid-area: h
            text-align: center
    .search-list
        background: linear-gradient(#fff,#fff) padding-box, linear-gradient(to bottom, transparent, $colorTitle) border-box
        min-height: 500px
        margin-top: 20px
        padding: 30px 15px 15px 15px
        border-bottom-left-radius: 10px
        border-bottom-right-radius: 10px
        border: 3px solid transparent
        .search-item
            border-bottom: 3px solid
            border-image-source: linear-gradient(90deg, transparent 0%, $colorTitle 50%, transparent 100%)
            border-image-slice: 1
            &:last-child
                border: none
            padding: 15px
            .grid-content
                display: grid
                grid-template-columns: 90% 10%
                align-items: center
                padding: 20px
        .info-filter
            position: relative
            height: 60px
        .info
            font-size: 2rem
            font-weight: bold
            position: absolute
            top: 0 
            left: 0
        .sort
            position: absolute
            top: 0 
            right: 0
            min-width: 160px
    

</style>