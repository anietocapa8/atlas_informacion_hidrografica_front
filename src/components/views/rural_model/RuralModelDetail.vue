<template>
    <div class="rural-model-detail">
        <div class="feed-title">{{$t( 'rural_model.index.title' )}}</div>
         <div style="text-align:right" class="div-90">
            <sipsder-btn btnType="edit_pen" :text="$t('rural_model.edit_page')" @onClick="setEdit()" v-if="!isEdit && isAdministrator"></sipsder-btn>
            <sipsder-btn btnType="cancel" @onClick="cancelAndClean" v-if="isEdit && isAdministrator"></sipsder-btn>
            <sipsder-btn :text="$t('button.save')" btnType="add" @onClick="update" v-if="isEdit && isAdministrator"></sipsder-btn>
            <sipsder-btn btnType="link" variant="primary" :text="$t('rural_model.consult_card')" style="float:left" @onClick="$router.push({name:'LibraryView', params:{id:ruralModel.idBook}})"></sipsder-btn>  
        </div>
         
        <div class="rural-detail-body div-90">
            <div class="A1">
                <b-form-group :label-cols="4" label-class="font-weight-bold" description= "">
                    <b-form-input :placeholder="$t('rural_model.detail.keyword')" v-model="filterQ" v-validate="'max:70'" :data-vv-as="$t('rural_model.detail.keyword')"></b-form-input>
                </b-form-group>
                <div class="collapse-menu">
                    <div :class="{'collapse': collapse.d1}">
                        <tree-menu v-for="(r,i) in filterRuralModel" :key="i" :node="r" @emitId="onClickChild" :isSearching="isSearching"></tree-menu>
                    </div>
                </div>
            </div>
            <div class="text A2">
               <div class="A">
                    <div class="tab-design" :class="{active : tabIndex==0 }" @click="setTabIndex(0)"><div><span>{{ $t('rural_model.index.generalities') }}</span></div></div>
                    <!-- ENABLE: Descomentar para habilitar pestana de apuestas -->
                    <!-- <div class="tab-design" :class="{active : tabIndex==1 }" @click="setTabIndex(1)" v-if="hasBets()"><div><span>{{betsName}}</span></div></div> -->
                    <div class="tab-design" :class="{active : tabIndex==2 }" @click="setTabIndex(2)" v-if="hasOther()"><div><span>{{ $t('rural_model.detail.numbers') }}</span></div></div>
                </div>
                <div v-if="tabIndex==0" class="B">
                    <div v-if="ruralModelSelected">
                        <div class="titlep" style="margin-bottom: 10px"> <span :style="{'border-bottom-color': ruralModelSelected.color, 'border-bottom-style': 'solid', 'border-left-width': '3px' }">{{ruralModelSelected.name}}</span></div>
                        <rich-text-preview class="description" :content="ruralModelSelected.description" v-if="!isEdit "/>
                        <rich-text :options="customToolbar" @changeValue="changeValueDescription" :newContent="ruralModelSelected.description" v-if="isEdit && isAdministrator"></rich-text>
                    </div>
                </div>
                <div v-if="tabIndex==1" class="B">
                     <div v-if="ruralModelSelected">
                        <div class="titlep" style="margin-bottom: 10px"><span :style="{'border-bottom-color': ruralModelSelected.color, 'border-bottom-style': 'solid', 'border-left-width': '3px' }">{{ruralModelSelected.name}}</span></div>
                        <rich-text-preview class="description" :content="ruralModelSelected.bets" v-if="!isEdit "/>
                        <rich-text :options="customToolbar" @changeValue="changeValueBets" :newContent="ruralModelSelected.bets" v-if="isEdit && isAdministrator"></rich-text>
                    </div>
                </div>
                <div v-if="tabIndex==2" class="B">
                    <div v-if="ruralModelSelected">
                        <div class="titlep" style="margin-bottom: 10px"> <span :style="{'border-bottom-color': ruralModelSelected.color, 'border-bottom-style': 'solid', 'border-left-width': '3px' }">{{ruralModelSelected.name}}</span></div>
                        <div class="related-buttons">
                            <div class="item" @mouseover="setHover2()" @mouseout="setOut2()" @mouseenter="setHover2()" >
                                <div class="title-item">{{ $t('rural_model.detail.numbers_title') }}</div>
                                <div class="body">
                                    <img src="../../../assets/rural-model/Artboard1IMG.png">
                                    <p>{{ $t('rural_model.detail.numbers_consult') }} <span :style="{'border-bottom-color': ruralModelSelected.color, 'border-bottom-style': 'solid', 'border-left-width': '3px' }">"{{ruralModelSelected.name.toLowerCase()}}" </span>.</p>
                                </div>
                                <div class="foot" @click="goIndicators">{{ $t('rural_model.detail.enter') }}</div>
                            </div>
                            <div class="item">
                                <div class="title-item">{{ $t('rural_model.detail.news_title') }}</div>
                                <div class="body">
                                    <img src="../../../assets/rural-model/Artboard2IMG.png">
                                    <p>{{ $t('rural_model.detail.news_consult') }} <span :style="{'border-bottom-color': ruralModelSelected.color, 'border-bottom-style': 'solid', 'border-left-width': '3px' }">"{{ruralModelSelected.name.toLowerCase()}}" </span>.</p>
                                </div>
                                <div class="foot" @click="goNews">{{ $t('rural_model.detail.enter') }}</div>
                            </div>
                            <div class="item">
                                <div class="title-item">{{ $t('rural_model.detail.events_title') }}</div>
                                <div class="body">
                                    <img src="../../../assets/rural-model/Artboard3IMG.png">
                                   <p>{{ $t('rural_model.detail.events_consult') }} <span :style="{'border-bottom-color': ruralModelSelected.color, 'border-bottom-style': 'solid', 'border-left-width': '3px' }">"{{ruralModelSelected.name.toLowerCase()}}" </span>.</p>
                                </div>
                                <div class="foot" @click="goCal">{{ $t('rural_model.detail.enter') }}</div>
                            </div>
                        </div>
                        <div class="community-bar">
                            <div class="title">{{ $t('rural_model.detail.participation_module') }}</div>
                            <community-carousel></community-carousel>
                        </div>
                        <div class="collapse-bar">
                            <div class="collapse-title collapse-title1" @click="toogleCollapsedBar1">{{ $t('rural_model.detail.linked_documents') }} <span :style="{'border-bottom-color': ruralModelSelected.color, 'border-bottom-style': 'solid', 'border-left-width': '3px' }">"{{ruralModelSelected.name.toLowerCase()}}" </span>.</div>
                            <div class="collapse-button" @click="toogleCollapsedBar1"><i v-if="!collapsedBar1" class="fas fa-angle-down"></i><i v-else class="fas fa-angle-right"></i></div>
                            <div class="collapse-body" v-if="!collapsedBar1">
                                <div class="no-legend" v-if="docRural ==  null">
                                    {{ $t('rural_model.detail.no_rural_models') }}
                                </div>
                                <div class="no-legend" v-else v-for="(doc, i) in docRural.slice(0,4)" :key="i">
                                    <span style="max-width: 90%">
                                        <img :src="getImgURL(doc.icon)" style="height: 30px" />&nbsp;
                                        <b><router-link :to="{ name: 'LibraryView' , params: { id: doc.hashedId }}" style="color: black">{{doc.title}}</router-link></b>
                                    </span>
                                </div>
                                <div v-if="docRural && docRural.length >= 4" class="no-legend">
                                    <span>
                                        <p>{{ $t('rural_model.detail.more_documents') }}</p>
                                    </span>
                                </div>
                                <div style="text-align: right;padding: 20px" v-if="docRural !=  null">
                                    <router-link :to="{ name: 'LibraryIndex' , params: { ruralModelId: ruralModelSelected.id }}">{{ $t('rural_model.detail.more_documents') }}</router-link>                  
                                </div>
                            </div>
                        </div>

                        <div class="collapse-bar">
                            <div class="collapse-title collapse-title2" @click="toogleCollapsedBar2">{{ $t('rural_model.detail.linked_norms') }} <span :style="{'border-bottom-color': ruralModelSelected.color, 'border-bottom-style': 'solid', 'border-left-width': '3px' }">"{{ruralModelSelected.name.toLowerCase()}}" </span>.</div>
                            <div class="collapse-button" @click="toogleCollapsedBar2"><i v-if="!collapsedBar2" class="fas fa-angle-down"></i><i v-else class="fas fa-angle-right"></i></div>
                            <div class="collapse-body" v-if="!collapsedBar2">
                                <div class="no-legend" v-if="normRural ==  null">
                                    {{ $t('rural_model.detail.no_norms') }}
                                </div>
                                <div class="no-legend" v-else v-for="(norm, i) in normRural" :key="i">
                                    <b><router-link :to="{ name: 'NormogramDetail' , params: { id: norm.id }}" style="color: black">{{norm.typeName}} {{norm.code ? `- ${norm.code}` : '' }}</router-link></b> - {{norm.date}} <div style="float:right">{{ norm.politic ? 'Politica : ☑':' Politica : ☐'}}</div>
                                </div>
                                <div style="text-align: right;padding: 20px" v-if="normRural !=  null">
                                    <router-link :to="{ name: 'NormogramIndex' , query: { ruralModel: ruralModelSelected.id }}">{{ $t('rural_model.detail.more_norms') }}</router-link>             
                                </div>
                            </div>
                        </div>

                        <div class="collapse-bar">
                            <div class="collapse-title collapse-title3" @click="toogleCollapsedBar3">{{ $t('rural_model.detail.links') }} <span :style="{'border-bottom-color': ruralModelSelected.color, 'border-bottom-style': 'solid', 'border-left-width': '3px' }">"{{ruralModelSelected.name.toLowerCase()}}" </span>.</div>
                            <div class="collapse-button" @click="toogleCollapsedBar3"><i v-if="!collapsedBar3" class="fas fa-angle-down"></i><i v-else class="fas fa-angle-right"></i></div>
                            <div class="collapse-body" v-if="!collapsedBar3">
                                <div v-if="ruralLink != null || ruralLink.length > 0 || actionLink==false " >
                                    <div v-for="(link,i) in ruralLink" :key="i" >

                                       <div v-if="!isAdministrator">
                                           <div class="no-legend">
                                              <span>
                                                <i class="fas fa-globe-americas"></i>&nbsp; 
                                                <a target="_blank" v-b-tooltip.hover :title="link.name" :href="link.url">
                                                    {{link.name.length >= 12 ? `${link.name.slice(0,12)}...` : link.name}}
                                                </a>
                                              </span>
                                              <span v-b-tooltip.hover :title="link.description">&nbsp;- {{link.description}}</span> 
                                            </div>
                                        </div>

                                       <div v-else-if="isAdministrator && isLogged">
                                           <div class="no-legend" v-if="!isEdit2['link'+(i+1)] && link.action!=3">
                                                <b-form-checkbox :id="'checkbox'+i" :value="i" :unchecked-value="null" v-model="selectLink"></b-form-checkbox>
                                                <span><a :href="link.url" v-b-tooltip.hover :title="link.description">{{link.name}}</a></span><span> - {{link.description}}</span>
                                                <div style="float:right; margin-top: -20px;"><sipsder-btn btnType="edit_pen" text="" @onClick="editLink(i)"></sipsder-btn></div>
                                            </div>
                                            <div class="no-legend grid-legend" v-else-if="link.action!=3">
                                                <b-form-checkbox :id="'checkbox'+i" :value="i" :unchecked-value="null" v-model="selectLink"></b-form-checkbox>
                                                <div class="grid-input">
                                                    <div>{{ $t('rural_model.detail.link_lbl') }}<b-form-input v-model="link.url" v-validate="'required|max:800'" :placeholder="$t('rural_model.detail.link_plho')" :data-vv-as="$t('rural_model.detail.link')"></b-form-input></div>
                                                    <div>{{ $t('rural_model.detail.name_lbl') }}<b-form-input v-model="link.name" v-validate="'required|max:180'" :placeholder="$t('rural_model.detail.name_plho')" :data-vv-as="$t('rural_model.detail.name')"></b-form-input></div>
                                                    <div>{{ $t('rural_model.detail.description_lbl') }}<b-form-input v-model="link.description" v-validate="'required|max:280'" :placeholder="$t('rural_model.detail.description_plho')" :data-vv-as="$t('rural_model.detail.description')"></b-form-input></div>
                                                </div>
                                                <div style="float:right; margin-top: -20px; text-align: right">
                                                    <sipsder-btn btnType="accept" text="" @onClick="acceptEditLink(i)"></sipsder-btn>
                                                    <sipsder-btn btnType="cancel" text="" @onClick="cancelEditLink(i)"></sipsder-btn>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                <div v-if="ruralLink == null || ruralLink.length == 0 || actionLink">
                                    <div class="no-legend"> <i class="fas fa-globe-americas"></i> &nbsp; {{ $t('rural_model.detail.no_links') }}</div>
                                </div>
                                <div v-if="isAdministrator && isLogged" style="text-align: right">
                                    <sipsder-btn :text="$t('rural_model.detail.new')" btnType="add" @onClick="newLink()" :disabled="ruralLink.length > 4"></sipsder-btn>
                                    <sipsder-btn :text="$t('button.save')" btnType="accept" :disabled="!withoutSave || isEditingLinks" @onClick="saveLink"></sipsder-btn> 

                                    <sipsder-btn btnType="export" text="" :disabled="selectLink == null  || selectLink == 0" @onClick="moveLink(selectLink, selectLink-1)"></sipsder-btn>
                                    <sipsder-btn btnType="download" text="" :disabled="selectLink == null  || selectLink == ruralLink.length -1 " @onClick="moveLink(selectLink, selectLink+1)"></sipsder-btn>
                                    <sipsder-btn btnType="delete" :text="$t('rural_model.detail.delete')" :disabled="selectLink == null" @onClick="deleteSelectedLink()"></sipsder-btn>
                                </div> 
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="ruralModelSelected" class="div-90" @mouseover="setHover1()" @mouseout="setOut1()" @mouseenter="setHover1()">
            <div class="map-index">
                <div class="title-c text-center"><h1>{{ $t('rural_model.detail.info') }}</h1></div>
                <div class="my-3 text-center">{{ ruralModelSelected.name }}</div>
                <template v-if="ruralModelSelected.mapIds && ruralModelSelected.mapIds.length">
                    <h3>{{ $t('rural_model.detail.filter_search') }}</h3>
                    <map-index
                        :ids="ruralModelSelected.mapIds"
                        @selected="onMapSelect" />
                </template>
                <span v-else>{{ $t('rural_model.detail.no_maps') }}</span>
            </div>
        </div>
         <div style="text-align:center"><sipsder-btn btnType="back" @onClick="$router.go(-1)"></sipsder-btn></div>
         <b-modal ref="errorEvent" :title="'Error'"
            @ok="closeModal('errorEvent')"
            @cancel="closeModal('errorEvent')"
            >
            <b-row class="w-100 center">
                <div class="w-50 red" v-html="error">
                </div>
            </b-row>
        </b-modal>  
    </div>
</template>

<script>
    import { SERVICE_NAMES } from '@/sipsder_constants'
    import {RURAL_MODEL_TYPES, PERMISSIONS_TYPES, RURALMODEL} from '../../../domain_constants'
    import RichText from '../../shared/RichText.vue'
    import RichTextPreview from '../../shared/RichTextPreview';
    import MapIndex from '@/components/shared/arcgis/MapIndex';
    import CommunityCarousel from "../../shared/carousel/CommunityCarousel.vue";
    import TreeMenu from '../../shared/TreeMenu.vue'
    import VAPI from '../../../http_common';
    import _ from 'lodash';
    import S_UTIL from "@/util/sipsder_util";


    export default {
        data(){
            return {
                over1: false,
                over2: false,
                collapsedBar1: true,
                collapsedBar2: true,
                collapsedBar3: true,
                isSearching: false,
                filterQ:'',
                betsName: this.$t('rural_model.detail.bets'),
                collapse:{
                    d1: false,
                    d2: false
                },
                save:{
                    description: null,
                    bets: null
                },
                isEdit:false,
                isEdit2:{
                    link1:false,
                    link2:false,
                    link3:false,
                    link4:false,
                    link5:false
                },
                isEditingLinks: false,
                linkAux:{
                    name: '',
                    url: '',
                    description: ''
                },
                error:'',
                actionLink: false,
                withoutSave: false,
                ruralModel: [],
                ruralModelTree: null,
                ruralModelSelected: null,
                ruralLink: null,
                normRural: null,
                docRural: null,
                selectLink: null,
                tabIndex:0,
                customToolbar: [
                    [{ 'font': [] }],
                    [{ 'size': ['small', false, 'large', 'huge'] }],
                    ["bold", "italic", "underline"],
                    [{ list: "ordered" }, { list: "bullet" }],
                    ['link', 'image', 'video', 'formula'],
                    [{'align': ''}, {'align': 'center'}, {'align': 'right'}, {'align': 'justify'}],
                    [{ 'color': [] }, { 'background': [] }],
                    [{ 'script': 'sub'}, { 'script': 'super' }],
                    [{ 'header': [false, 1, 2, 3, 4, 5, 6, ] }]
                ],
            }
        },
        async beforeCreate() {
             try {
                    const response = await VAPI.get( `/${SERVICE_NAMES.RURAL_MODEL}/tree?active=true` );
                    this.ruralModelTree= response.data.data;
              }
              catch( error ) {
                  console.error( 'Error fetching rural model tree' + error.toString() );
              }
              try {
                  let idM=null
                  if(this.$route.params.ruralId  == null || this.$route.params.ruralId == undefined ){
                      idM=RURALMODEL.DEVELOPMENT_DIMENSIONS;
                  }
                  else{
                      idM=this.$route.params.ruralId
                  }
                  const response = await VAPI.get( `/${SERVICE_NAMES.RURAL_MODEL}/${idM}`);
                  this.formatRuralFigures(response.data);
                  this.ruralModelSelected= response.data;
                  this.save.description = response.data.description
                  this.save.bets = response.data.bets 
                  const response2 = await VAPI.get(`/${SERVICE_NAMES.LINK}/${this.ruralModelSelected.id}`)
                  this.ruralLink =  response2.data.data
                  
              }
              catch( error ) {
                  console.error( 'Error fetching rural model tree' + error.toString() );
              }
              try {
                  let idM=null
                  if(this.$route.params.ruralId  == null || this.$route.params.ruralId == undefined ){
                      idM=RURALMODEL.DEVELOPMENT_DIMENSIONS;
                  }
                  else{
                      idM=this.$route.params.ruralId
                  }
                  const response = await VAPI.get(`/${SERVICE_NAMES.RURAL_DOCUMENTS}/mini/${this.ruralModelSelected.id}`);
                  this.docRural= response.data.data;
                  const response2 = await VAPI.get(`/${SERVICE_NAMES.NORMS}/mini/${this.ruralModelSelected.id}`)
                  this.normRural =  response2.data.data
                  
              }
              catch( error ) {
                  console.error( 'Error fetching rural model tree' + error.toString() );
              }
               VAPI.get(`/${SERVICE_NAMES.RURAL_MODEL}/general?book=true`).then((output) => {
                    this.ruralModel=output.data;
                }).catch((e) => {
                    
                });
        },
        watch: {
            filterQ: function (val) {
                if(val === '')
                    this.isSearching = false
                else
                    this.isSearching = true
            },
        },
        methods:{
            getImgURL(url) {
                return S_UTIL.getImgURL(url)
            },
            newLink(){
                var p = this.ruralLink.length
                this.ruralLink.push({
                    id:null,
                    name: '',
                    description: '',
                    url: '',
                    action: 4,
                    ruralId: this.ruralModelSelected.id,
                    priority:p
                })
                this.isEdit2['link'+(p+1)] = true
                this.getActionLink()
            },
            moveLink(i , newI){
                Array.prototype.move = function(from,to){
                    this.splice(to,0,this.splice(from,1)[0]);
                    return this;
                };
                var auxPriority = this.ruralLink[newI].priority
                this.ruralLink[newI].priority = this.ruralLink[i].priority
                this.ruralLink[i].priority =  auxPriority
                if(this.ruralLink[newI].action == 0){
                    this.ruralLink[newI].action = 2
                }
                if(this.ruralLink[i].action == 0 ){
                    this.ruralLink[i].action = 2
                }
                this.ruralLink.move(i,newI)
                this.selectLink = newI
                this.isEdit2['link'+(newI+1)] = this.isEdit2['link'+(i+1)]
                this.isEdit2['link'+(i+1)] = false
                this.withoutSave = true
            },
            editLink(i){
                this.linkAux.name =  this.ruralLink[i].name
                this.linkAux.url =  this.ruralLink[i].url
                this.linkAux.description =  this.ruralLink[i].description
                this.isEdit2['link'+(i+1)]=!this.isEdit2['link'+(i+1)]
                this.isEditingLinks = true
            },
            acceptEditLink(i){
                var validate = true
                var validateMessage = ''
                if(this.ruralLink[i].url =='' || this.ruralLink[i].url  == null ){
                    validate = false
                    validateMessage = this.$t('rural_model.detail.error_url');
                }
                if(this.ruralLink[i].url.indexOf("http://") == -1 && this.ruralLink[i].url.indexOf("https://") == -1  ){
                    
                    this.ruralLink[i].url= 'https://'+this.ruralLink[i].url

                }
                        
                if(this.ruralLink[i].name =='' || this.ruralLink[i].name  == null ){
                    validate = false
                    validateMessage = this.$t('rural_model.detail.error_name');
                }
                if(this.ruralLink[i].description =='' || this.ruralLink[i].description  == null ){
                    validate = false
                    validateMessage = this.$t('rural_model.detail.error_description');
                }
                if(this.ruralLink[i].url.length > 800){
                    validate = false
                    validateMessage += this.$t('rural_model.detail.error_url_length');
                }
                if(this.ruralLink[i].name.length > 180){
                    validate = false
                    validateMessage += this.$t('rural_model.detail.error_name_length');
                }
                if(this.ruralLink[i].description.length > 280){
                    validate = false
                    validateMessage += this.$t('rural_model.detail.error_description_length');
                }
                if(validate){
                    if(this.ruralLink[i].id != null) this.ruralLink[i].action = 2
                    else this.ruralLink[i].action = 1
                    this.isEdit2['link'+(i+1)]=!this.isEdit2['link'+(i+1)]
                    this.withoutSave = true
                    this.isEditingLinks = false
                }
                else{
                    this.error = validateMessage
                    this.showModal("errorEvent")
                }
            },
            cancelEditLink(i){
                const index = i
                if(this.ruralLink[index].action === 4){
                    this.selectLink = index;
                    this.deleteSelectedLink()
                }
                else{
                    this.ruralLink[index].name = this.linkAux.name
                    this.ruralLink[index].url = this.linkAux.url
                    this.ruralLink[index].description = this.linkAux.description 
                    this.isEdit2['link'+(index+1)]=!this.isEdit2['link'+(index+1)]
                    this.isEditingLinks = false
                }
            },
            deleteSelectedLink(){
                for(var i= this.selectLink ; i < this.ruralLink.length -1 ; i++){
                    this.moveLink(i , i+1)
                }
                if(this.ruralLink[this.selectLink].action!=4 || this.withoutSave)
                    this.withoutSave = true
                if(this.ruralLink[this.selectLink].action==1 || this.ruralLink[this.selectLink].action==4 ){
                    for(var i = this.selectLink+1 ; i < this.ruralLink.length; i++ ){
                         this.ruralLink[i].priority= i-1
                    }
                    this.ruralLink.splice(this.selectLink, 1)
                }
                else if(this.ruralLink[this.selectLink].action== 0 || this.ruralLink[this.selectLink].action== 2){
                     for(var i = this.selectLink+1 ; i < this.ruralLink.length; i++ ){
                         this.ruralLink[i].priority= i-1
                    }
                    this.ruralLink[this.selectLink].action = 3
                }

                this.selectLink= null
                
                
                this.getActionLink()
                this.saveLink()
            },
            getActionLink(){
                var action = true
                this.ruralLink.forEach(link=>{
                    if(link.action != 3 || action == false){
                        action = false
                    }
                    else{
                        action = true
                    }
                })
                this.actionLink = action
            },
            async saveLink(){
                var linkList={
                    linkList: this.ruralLink
                }
                const response = await VAPI.post(`/${SERVICE_NAMES.LINK}/save` , linkList);
                const response2 = await VAPI.get(`/${SERVICE_NAMES.LINK}/${this.ruralModelSelected.id}`);
                this.ruralLink=response2.data.data
                this.withoutSave = false
                this.selectLink= null
            },
            update(){
                VAPI.put(`/${SERVICE_NAMES.RURAL_MODEL}/detail/${this.ruralModelSelected.id}`, this.save).then((output) => {
                    this.isEdit = false
                }).catch((e) => {
                
                });
            },
            hasBets(){
                if( this.ruralModelSelected == null)
                    return false
                if(this.ruralModelSelected.type.id === RURAL_MODEL_TYPES.COMPONENT){
                    this.betsName = this.$t('rural_model.detail.bets');
                    return (this.ruralModelSelected.type.id === RURAL_MODEL_TYPES.COMPONENT && this.ruralModelSelected.level === 2 && this.ruralModelSelected.idOrigin == RURALMODEL.DEVELOPMENT_DIMENSIONS ) 
                }
                else{
                    this.betsName = this.$t('rural_model.detail.impl_actions');
                    return ( this.ruralModelSelected.type.id === RURAL_MODEL_TYPES.TOOL && this.ruralModelSelected.id === RURALMODEL.TRANSFORMATION ) 
                }
            },
            hasOther(){
               return this.ruralModelSelected ? this.ruralModelSelected.id !== RURALMODEL.COHESION : false
            },
            isStructure(id){
                return id != RURAL_MODEL_TYPES.TRANSVERSAL && id != RURAL_MODEL_TYPES.TOOL
            },
            setTabIndex(index){
                this.tabIndex=index
            },
            onClickChild (event) {
                this.getModel(event)
            },
            setEdit(){
                this.isEdit = true
            },
            setCollapse(deph){
                if(deph === 1){
                    this.collapse.d1 = !this.collapse.d1 
                }
                    
                if(deph === 2){
                    this.collapse.d2 = !this.collapse.d2
                }
                    
            },
            changeValueDescription(value){
                this.ruralModelSelected.description = value
                this.save.description = this.ruralModelSelected.description
            },
             changeValueBets(value){
                this.ruralModelSelected.bets = value
                this.save.bets = this.ruralModelSelected.bets 
            },
            cancelAndClean(){
                this.tabIndex=0
                this.isEdit=false
                this.save.description = null
                this.save.bets = null
                this.getModel(this.ruralModelSelected.id);
            },
            async getModel(id){
                this.tabIndex=0
                try {
                    const response = await VAPI.get(`/${SERVICE_NAMES.RURAL_MODEL}/${id}`);
                    this.formatRuralFigures(response.data);
                    this.ruralModelSelected= response.data;
                    this.save.description = response.data.description
                    this.save.bets = response.data.bets
                    const response2 = await VAPI.get(`/${SERVICE_NAMES.LINK}/${this.ruralModelSelected.id}`)
                    this.ruralLink =  response2.data.data 
                    this.isEdit2.link1=false
                    this.isEdit2.link2=false
                    this.isEdit2.link3=false
                    this.isEdit2.link4=false
                    this.isEdit2.link5=false
                    this.selectLink= null
                    this.collapsedBar1 = true
                    this.collapsedBar2 = true
                    this.collapsedBar3 = true
                }
                catch( error ) {
                    console.error( 'Error fetching rural model tree' + error.toString() );
                }
                 try {
                  const response = await VAPI.get(`/${SERVICE_NAMES.RURAL_DOCUMENTS}/mini/${this.ruralModelSelected.id}`);
                  this.docRural= response.data.data;
                  const response2 = await VAPI.get(`/${SERVICE_NAMES.NORMS}/mini/${this.ruralModelSelected.id}`)
                  this.normRural =  response2.data.data
                  
                }
                catch( error ) {
                    console.error( 'Error fetching rural model tree' + error.toString() );
                }
            },
            showModal(ref){
                this.$refs[ref].show();
            },
            closeModal(ref){
                this.$refs[ref].hide();
            },
            toogleCollapsedBar1(){
                this.collapsedBar1 = !this.collapsedBar1
            },
             toogleCollapsedBar2(){
                this.collapsedBar2 = !this.collapsedBar2
            },
             toogleCollapsedBar3(){
                this.collapsedBar3 = !this.collapsedBar3
            },
            setHover1(){
                this.over1 = true
            },
             setOut1(){
                this.over1 = false
            },
            setHover2(){
                this.over2 = true
            },
             setOut2(){
                this.over2 = false
            },
            goCal(){
                this.$router.push({ name: 'CalendarIndex', query: { rural: this.ruralModelSelected.idOrigin ? this.ruralModelSelected.idOrigin : this.ruralModelSelected.id } });
            },
            goNews(){
                this.$router.push({ name: 'NewsIndex', params: { rural: this.ruralModelSelected.id }})
            },
            formatRuralFigures(ruralModel) {
                ruralModel.mapIds = ruralModel.ruralFigures
                    .map(ruralFigure => ruralFigure.map.url);
                const obj = {}
                ruralModel.ruralFigures
                    .forEach(ruralFigure => {
                        obj[ruralFigure.map.url] = ruralFigure
                });
                ruralModel.ruralFigures = obj;
            },
            onMapSelect(map) {
                const figure = this.ruralModelSelected.ruralFigures[map.id];
                if (figure.indicator) {
                    this.$router.push({ name: 'RuralIndicatorDetail', params: { id: figure.indicator.id }});
                } else {
                    this.$router.push({ name: 'RuralFigureDetail', params: { id: figure.id }});
                }
            },
            goIndicators(){
                this.$router.push({ name: 'RuralIndicatorIndex', params: { rural: this.ruralModelSelected.id}})
            },
        },
        computed: {
                isLogged() {
                    return this.$store.getters.isAuthenticated
                },
                isAdministrator( ) {
                    return this.$store.getters.hasPermission(PERMISSIONS_TYPES.ADMIN);
                },
                filterRuralModel(){
                    const self = this
                    var result = []
                    function getAll(p){
                        var aux = false
                        JSON.parse(JSON.stringify(p)).forEach(e=>{
                            if (e.children) aux = getAll(e.children)
                            if(e.label.toLowerCase().includes(self.filterQ.toLowerCase()) || aux) {
                                e.label= e.label.toLowerCase().replace(self.filterQ.toLowerCase(), '<span style="font-weight:bold">'+self.filterQ.toLowerCase()+'</span>')
                                result.push(e)
                            } 
                        })
                    }
                    if( this.ruralModelTree == null)
                        return null
                    if( self.filterQ === '')
                        return this.ruralModelTree
                    getAll(this.ruralModelTree)
                    return result 
                },
            },
            components: {
                RichText,
                RichTextPreview,
                TreeMenu,
                CommunityCarousel,
                MapIndex,
            }
    }
</script>

<style lang="sass" scoped>
@import '../../../stylesheets/style.sass'
.collapse
    height: 0
.menu
    cursor: pointer
    height: 40px
.title
    background: $colorTitle
    color: #fff
    padding: 0 10px

.community-bar
    margin: 20px
    background-color: #fff
    background-image: url('../../../assets/home/community.png')
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
.border-title
    border-top: 10px solid $colorTitle
    height: 50px
.collapse-menu
    height: auto
    max-height: 800px
    overflow-y: auto
    overflow-x: hidden
    background: #fff 
    box-shadow: 0px 0px 3px #333
    border-top: 10px solid $colorTitle
    border-bottom: 10px solid $colorTitle
.rural-model-detail
    padding: 0 15px
    font-size: 1.5rem
    font-family: "Open Sans", sans-serif
.rural-detail-body
    font-family: "Open Sans", sans-serif
    font-size: 1.5rem
    display: grid
    grid-gap: 15px
    grid-template-columns: 25% 75%
    grid-template-areas: 'a b' '. c'
.A1
    grid-area: a
.A2
    grid-area: b
    max-width: 100%
.A3
    grid-area: c
    min-height: 600px
    max-width: 100%
    overflow: hidden
    .B
        background: $colorTitle !important
    .title-c
        margin: 20px 0
    .img-contain
        position: relative
        max-height: 600px
        overflow: hidden
        img
            width: 100%
        .back
            max-height: 600px
        .control
            position: absolute
            top: 0
            right: 0
            width: 100%

.related-buttons
    margin-top: 30px
    display: grid
    grid-template-columns: 33% 33% 33%
    grid-gap: 15px
    .item
        position: relative
        width: 90%
        justify-self: center
        border: 2px solid $colorTitle
        border-radius: 5px
        padding: 15px
        background: url(../../../assets/modal/red.png)
        background-position: bottom right
        background-size: contain
        background-repeat: no-repeat
        height: 350px
        overflow: hidden
        .control
            background: rgba(255, 255, 255, 0.8)
            position: absolute
            top: 0
            left: 0
            width: 100%
            z-index: 3
        .body
            margin-top: 10px
            img
                width: 100%
                height: 150px
        .title-item
            text-align: center
            font-weight: bold
        .foot
            padding-right: 15px
            line-height: 80px
            cursor: pointer
            font-weight: bold
            color: #fff
            text-align: right
            position: absolute
            bottom: -4px
            right: 0
            height: 70px
            width: 50%
            min-width: 100px
            background: $colorTitle
            mask-image: url(../../../assets/modal/esquina_inferior.svg)
            mask-size: cover
            background-size: cover
            background-repeat: no-repeat
            &:hover
                 background: $colorTitleDark
        
.collapse-bar
    position: relative
    margin-top: 30px
    min-height: 50px
    box-shadow: 0px 0px 3px #555
    border: 2px solid #777
    border-radius: 5px
    .grid-legend
        display: grid
        grid-template-columns: 10% 70% 20%
        .grid-input
            display: grid
            grid-template-columns: 1fr 1fr 1fr
            grid-gap: 5px
            margin-top: -17px
    .no-legend
        padding: 20px
        background: #eee
        max-height: 70px
        height: 70px
        margin-bottom: 10px
        width: 100%
        span
            white-space: nowrap
            overflow: hidden
            text-overflow: ellipsis
            width: auto
            max-width: 78%
            display: inline-block
    .collapse-body
        padding: 20px
    .collapse-button
        position: absolute
        top: 5px
        right: 15px
        color: #fff
        font-size: 2rem
    .collapse-title
        line-height: 50px
        height: 50px
        padding: 0 30px 0 15px
        color: #fff
        font-weight: bold
        white-space: nowrap
        overflow: hidden
        text-overflow: ellipsis
    .collapse-title1
        background:#283C55
    .collapse-title2
        background:#f05d4d
    .collapse-title3
        background:#818286
.feed-title
    position: relative
    display: inline-block
    color: #fff
    background: url(../../../assets/title/barra_sola_2.png)
    background-repeat: no-repeat
    background-size: 100% 100%
    width: 110%
    font-size: 40px
    font-weight: bold
    font-family: $fontBody
    margin-left: -10%
    margin-top: 15px
    margin-bottom: 5%
    padding-left: calc(10% + 20px)
    padding-top: 20px
    a
        text-decoration: none
        color: #fff

.div-90
    width: 90%
    margin-left: auto
    margin-right: auto 

.text
    display: grid
    grid-template-columns: 1fr
    grid-template-rows: 50px auto
    min-height: 600px
    .A
        margin-left: 15px
        display: inline-flex
        max-width: 100%
    .B
        margin-top: -10px
        background: #fff
        box-shadow: 0px 0px 3px #555
        border-radius: 3px
        z-index: 3
        padding: 20px
        overflow: hidden
        overflow-y: auto 
        max-height: 820px
        border: 1px solid $colorTitle
        max-width: 100%
        .titlep
            text-align: center
            font-weight: bold
            
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

@media screen  and (max-width: $widthDesktop)
    .tab-design
        font-size: 1.1rem !important
    .rural-detail-body
        font-size: 1.2rem !important
        grid-template-columns: 30% 70% !important
    .related-buttons
        font-size: 1.1rem !important
        .item
            height: 300px !important
            .body
                img
                    height: 100px !important
            .foot
                width: 80%  !important
    .collapse-bar
        font-size: 1.1rem !important
        white-space: nowrap !important
    .A1 , .A2 , .A3
        max-width: 712px

@media screen  and (max-width: $widthTablet)
    .tab-design
        font-size: 1.1rem !important
    .rural-detail-body
        grid-template-columns: 100% !important
        grid-template-areas: 'a' 'b' 'c' !important
    .related-buttons
        grid-template-columns: 100% !important
    .collapse-bar
        font-size: 1.2rem !important
        white-space: nowrap !important
    .A1 , .A2 , .A3
        max-width: 712px
    .div-90
        width: 80% !important
@media screen  and (max-width: $widthMobile)
    .A1 , .A2 , .A3
        max-width: 412px
    .div-90
        width: 85% !important
    .text
        min-height: unset !important
        grid-template-rows: unset !important
        .A
            display: flex !important
            flex-wrap: wrap
            width: 100%
            margin-left: 0 !important
        .B
           width: 100%
    .tab-design  
        height: 70px !important
        max-width: unset !important
        margin: 5px
        width: 40%
        div
            height: 70px !important
            span
                height: 70px !important
    .feed-title
        padding-left: calc(10% + 40px) !important
        font-size: 20px !important
.map-index
  background: rgba(250, 250, 250, 0.8)
  padding: 30px
  font-size: 1.5rem
  border: 3px solid $colorTitle
  border-radius: 1.5rem
</style>
