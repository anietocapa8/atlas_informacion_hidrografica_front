<template>
    <div>
        <div class="feed-title">{{$t( 'proyectTool.projects.create.title' )}}</div>
        <div class="col-90 container-form">
            <div class="welcome">
                {{$t( 'proyectTool.projects.create.messageAll' )}} <br> <br>
                <span v-if="isAdministrator && projectIndex ==2 ">{{$t( 'proyectTool.projects.create.messageAdmin' )}} <router-link :to="{name:'ProcedureIndex'}">{{$t( 'proyectTool.projects.create.addProcedure' )}}</router-link></span>
            </div>
            <div class="wizard">
                <div v-for="(item,i) in projectTitle" :key="i" class="item" :class="{'focus': i == projectIndex}"  v-b-tooltip.hover :title="item"  @click="goToIndex(i)">
                    <div class="text">{{item}}</div>
                </div>
            </div>
            <div class="page" v-if="projectIndex == 0">
                 <div :class="{'state-grid': !isNew , 'enabled-grid': !isAdministrator || isNew}">
                    <b-form-group :label-cols="4" label-class="font-weight-bold" :label="$t( 'proyectTool.announcement.create.state' )+asterisk" class="state-g" v-if="isAdministrator && !isNew">
                        <v-select v-model.trim="state" label="label" :placeholder="$t( 'community.survey.status' )" :options="stateOps"  class="font-size-14" v-if="oldState == stateOps[2].value"></v-select>
                        <span v-else><b>{{project.statusName}}</b><br></span>
                        <span v-if="isAdministrator && !isNew"><b>{{$t( 'library.visor.addFor' )}}</b>&nbsp; <i class="fas fa-user"></i> {{project.userName}} {{project.userLastName}}, {{project.userType}}</span>
                    </b-form-group> 
                    <b-form-group :label-cols="4" label-class="font-weight-bold" :label="$t( 'proyectTool.announcement.create.state' )+asterisk" class="state-g" v-else-if="!isNew">
                        <span><b>{{project.statusName}}</b><br></span>
                        <span v-if="!isNew"><b>{{$t( 'library.visor.addFor' )}}</b>&nbsp; <i class="fas fa-user"></i> {{project.userName}} {{project.userLastName}}, {{project.userType}}</span>
                    </b-form-group> 
                    <b-form-group :label-cols="4"
                            label-class="font-weight-bold"
                            label="&nbsp;" style="text-align: right;float:right;" class="enabled-g" v-if="oldState != stateOps[1].value">
                                <b-form-checkbox id="checkbox1" v-model="project.enabled">
                                <b>{{$t( 'proyectTool.announcement.create.enabled' )}} </b>
                            </b-form-checkbox>
                    </b-form-group>   
                </div>
                <b-form-group :label-cols="4" label-class="font-weight-bold" description= "" v-if="!project.enabled || project.enabled=='false'" :label="$t( 'proyectTool.projects.create.disableReason' )+asterisk">
                    <b-form-input placeholder="" v-model="project.reason"  ></b-form-input>
                </b-form-group>
                <b-form-group label-class="font-weight-bold" :label="$t( 'proyectTool.projects.create.institution')+ asterisk">
                    <v-select v-if="institutions" v-model.trim="institution" label="name" :placeholder="$t( 'calendar.institution')" :options="institutions" :clearable='false'></v-select>
                </b-form-group>
                <b-form-group :label-cols="4" label-class="font-weight-bold" description= "" :label="$t( 'proyectTool.projects.create.name' )+asterisk">
                    <b-form-input :placeholder="$t( 'proyectTool.projects.create.name' )" v-model="project.name" ></b-form-input>
                </b-form-group>
                <b-form-group :label-cols="4" label-class="font-weight-bold" :label="$t( 'proyectTool.announcement.create.summary' )+asterisk" :description="$t( 'proyectTool.announcement.create.characters' )+(280-project.summary.length)">
                    <b-form-textarea
                        id="textarea1"
                        v-model="project.summary"
                        :placeholder="$t( 'proyectTool.announcement.create.summary' )"
                        :rows="3"
                        :max-rows="6"
                    ></b-form-textarea>
                </b-form-group>
                 <b-form-group :label-cols="4" label-class="font-weight-bold" description= "" :label="$t( 'proyectTool.projects.create.description' )+asterisk">
                    <rich-text :options="customToolbar" @changeValue="changeValueDescription" :newContent="project.description" style="overflow: auto; max-width: none; padding: 0px"></rich-text>
                </b-form-group>
                 <b-form-group :label-cols="4" label-class="font-weight-bold" description= "" :label="$t( 'proyectTool.projects.create.time' )+asterisk">
                    <rich-text :options="customToolbar" @changeValue="changeValueTime" :newContent="project.time" style="overflow: auto; max-width: none; padding: 0px"></rich-text>
                </b-form-group>
                 <b-form-group :label-cols="4" label-class="font-weight-bold" description= "" :label="$t( 'proyectTool.projects.create.resources' )+asterisk">
                    <rich-text :options="customToolbar" @changeValue="changeValueResources" :newContent="project.resources" style="overflow: auto; max-width: none; padding: 0px"></rich-text>
                </b-form-group>
                <b-form-group :label-cols="4" label-class="font-weight-bold" :label="$t( 'proyectTool.announcement.create.ruralS' )+asterisk" description= "">
                        <treeselect v-model="selectedQueryModel" 
                            :multiple="false" 
                            :options="rurals"
                            v-if="rurals != null"
                            :openDirection="'below'"
                            :placeholder="$t( 'faqs.modal.rural_select' )"
                            :clearable="true"
                            :disable-branch-nodes="true"
                            :default-expand-level="1"
                            :show-count="true">
                            <label slot="option-label" slot-scope="{ node, shouldShowCount, count, labelClassName, countClassName }" :class="labelClassName">
                                <img v-if="node.raw.url != null" :src="getImgURL(node.raw.url)" height="16" width="16"> 
                                <span v-else-if="node.raw && node.raw.color" class="dot" :style="{backgroundColor: node.raw.color}"></span>        
                                <span> {{ node.label.split('/')[0] }} </span>
                                <span class="grey-label-text" v-if="node.label.split('/')[1] !== undefined"> {{ ' / ' + node.label.split('/')[1] }} </span>
                                <span v-if="shouldShowCount" :class="countClassName">({{ count }})</span>
                            </label>
                        </treeselect>
                </b-form-group>
                <b-form-group :label-cols="4" label-class="font-weight-bold" :label="$t( 'proyectTool.projects.create.product' )+ asterisk" description= "">
                    <div style="display: grid; grid-template-columns: 11fr 1fr">
                        <vue-bootstrap-typeahead
                                v-if="products"
                                :data="products"
                                v-model="qProduct"
                                ref="typeahead"
                                class="w-100"
                                :serializer="s => s.typePlusName"
                                :placeholder="$t( 'proyectTool.projects.create.productPlaceholder' )"
                                :value="qProduct"
                                @hit="product = $event"
                            ></vue-bootstrap-typeahead>
                        <sipsder-btn btnType="add" text="" @onClick="addSelectedP()" style="transform: scale(0.9); margin-top: -8%"></sipsder-btn>
                    </div>
                    
                    <b-col cols=12 v-if="productSel.length > 0" class="d-flex justify-content-center">
                        <b-table responsive striped hover small :fields="fields.product" :items="productSel">
                            <!-- Columna definida para la acciones -->
                            <template slot="principal" slot-scope="data">
                                <div  class="justify-content-center" style="cursor: pointer" @click="changeProductPrincipal(data.item.id)">
                                    <b-form-checkbox
                                                :id="'check'+data.item.id"
                                                :disabled="true"
                                                :value="true"
                                                :unchecked-value="false"
                                                v-model="data.item.principal" >
                                                </b-form-checkbox>
                                </div>
                            </template>
                            <template slot="actions" slot-scope="row">
                                <div  class="d-flex justify-content-center">
                                    <sipsder-btn btnType="delete" text="" @onClick="removeElementP(row.item)">
                                    </sipsder-btn>
                                </div>
                            </template>
                        </b-table>
                    </b-col>
                    <b-col cols=12 v-else class="d-flex justify-content-center">
                        {{$t( 'proyectTool.projects.create.emptyPMessage' )}}
                    </b-col>
                    <div v-if="notProduct != ''">{{notProduct}}</div>
                </b-form-group>

                <b-form-group :label="$t('news.create.tags')+asterisk"  label-class="font-weight-bold">
                    <tags-input v-model="tag" :placeholder="$t('norm.create.form.tags_enter')" :tags="tags" @tags-changed="newTags => tags = newTags"></tags-input>
                </b-form-group>
            </div>
            <div class="page" v-if="projectIndex == 1">
                <div :class="{'state-grid': !isNew , 'enabled-grid': !isAdministrator || isNew}">
                    <b-form-group :label-cols="4" label-class="font-weight-bold" :label="$t( 'proyectTool.announcement.create.state' )+asterisk" class="state-g" v-if="isAdministrator && !isNew">
                        <v-select v-model.trim="state" label="label" :placeholder="$t( 'community.survey.status' )" :options="stateOps"  class="font-size-14" v-if="oldState == stateOps[2].value"></v-select>
                        <span v-else><b>{{project.statusName}}</b><br></span>
                        <span v-if="isAdministrator && !isNew"><b>{{$t( 'library.visor.addFor' )}}</b>&nbsp; <i class="fas fa-user"></i> {{project.userName}} {{project.userLastName}}, {{project.userType}}</span>
                    </b-form-group>
                    <b-form-group :label-cols="4" label-class="font-weight-bold" :label="$t( 'proyectTool.announcement.create.state' )+asterisk" class="state-g" v-else-if="!isNew">
                        <span><b>{{project.statusName}}</b><br></span>
                        <span v-if="!isNew"><b>{{$t( 'library.visor.addFor' )}}</b>&nbsp; <i class="fas fa-user"></i> {{project.userName}} {{project.userLastName}}, {{project.userType}}</span>
                    </b-form-group> 
                    <b-form-group :label-cols="4"
                            label-class="font-weight-bold"
                            label="&nbsp;" style="text-align: right;float:right;" class="enabled-g" v-if="oldState != stateOps[1].value">
                                <b-form-checkbox id="checkbox1" v-model="project.enabled">
                                <b>{{$t( 'proyectTool.announcement.create.enabled' )}} </b>
                            </b-form-checkbox>
                    </b-form-group> 
                </div>
                <b-form-group :label-cols="4" label-class="font-weight-bold" description= "" v-if="!project.enabled || project.enabled=='false'" :label="$t( 'proyectTool.projects.create.disableReason' )+asterisk">
                    <b-form-input placeholder="" v-model="project.reason"  ></b-form-input>
                </b-form-group>
                <b-form-group :label-cols="4" label-class="font-weight-bold" description= "" :label="$t( 'proyectTool.projects.create.name' )+asterisk">
                    <b-form-input :placeholder="$t( 'proyectTool.projects.create.name' )" v-model="project.name" :disabled="true"></b-form-input>
                </b-form-group>
                <hr>

                <b-row class="mg-top-30">    
                    <b-col cols="5">
                        <b-form-group :label="$t('proyectTool.projects.create.locality')+asterisk" class="bold">
                            <b-form-select  v-model="selectedLocality">
                                <option v-for="(locality, i) in autocomplets.localities" :key="i" :value="locality" :placeholder="locality.name">{{locality.name}}</option>
                            </b-form-select>
                        </b-form-group>
                    </b-col>

                    <b-col cols="2">
                        <br>
                        <div class="bold center" style="margin-top: 10px">
                            <b-form-checkbox @change="allLocality = !allLocality" v-model="allLocality" :disabled="!selectedLocality">
                                {{$t('prototype.create.form.all_locality')}}
                            </b-form-checkbox>
                        </div>
                    </b-col>

                    <b-col cols="4">
                        <b-form-group :label="$t('prototype.create.form.sub_locality')+asterisk" class="bold">
                            <b-form-select  v-model="selectedNeighborhood" :disabled="allLocality">
                                <option v-for="(neighbor, i) in autocomplets.neighborhood" :key="i" :value="neighbor" :placeholder="neighbor.name">{{neighbor.name}}</option>
                            </b-form-select>
                        </b-form-group>
                    </b-col>

                    <b-col cols="1" style="margin-top: 10px">
                        <sipsder-btn :disabled="!selectedLocality" btnType="add" :text="''" @onClick="addLocality()" />
                    </b-col>
                </b-row>

                <!-- LOCALITIES -->
                <b-row v-if="localities.length">
                    <b-col cols=12 class="d-flex center-text">
                        <b-table responsive striped hover small 
                            class="justify-content-center"
                            :fields="[
                                {key: 'locality', label: 'Localidad', sortable: true},
                                {key: 'subLocality', label: 'Vereda', sortable: true},
                                {key: 'actions', label: 'Acciones'}
                                ]" :items="localities">
                                <!-- Columna definida para la acciones -->
                            <template slot="actions" slot-scope="row">
                                <div  class="d-flex justify-content-center">
                                    <sipsder-btn btnType="delete" :text="''" @onClick="deleteLocality(row.index)" />
                                </div>
                            </template>
                        </b-table>
                    </b-col>
                </b-row>
                <br>
                <br>
                <div class="divE">
                    <label >{{$t('proyectTool.projects.create.imageLabel')}} <span style='color: red'>*</span></label><br>
                    <sipsder-btn btnType="uploadImage" variant="primary" :text="$t('proyectTool.projects.create.imageButton')"
                    @onClick="showModal('addImageModal')"
                    ></sipsder-btn> 
                    <div class="carrousel" v-if="project.images.length!=0">

                        <div class="bigOne" :key="pIndex">
                            <div v-if="selectImage.idType==3">
                                <iframe  :src="selectImage.url" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                            </div>
                            <div v-else>
                                <img :src="getImgURL(selectImage.url)">
                            </div>
                        </div>
                        <div class="scroll" >
                            <div v-for="(image,i) in project.images" :key="i" >
                                <div v-if="image.action!=2" class="slide" @click="setSelectImage(i)"  
                                v-bind:class="{ activeSlide: (image.id==selectImage.id) }">
                                    <img :src="getYTvideoCode(image.url)" alt="" >
                                </div>
                            </div>
                        </div>
                        </div>
                        <div class="carrouselOptions" v-if="project.images.length!=0">
                        <div><button @click="scroll_left"><i class="fas fa-caret-left"></i></button></div>
                        <div>
                            <div>
                            <button @click="setImagePrincipal"> {{$t('about.main')}} 
                                <b-form-checkbox id="checkbox2"
                                            value="true"
                                            unchecked-value="false" v-model="selectImage.principal"
                                ></b-form-checkbox>
                            </button>
                            </div>
                            <div>
                            <sipsder-btn :text="$t('button.delete')"
                                    btnType="cancel" @onClick="deleteImage"
                            ></sipsder-btn></div>
                            </div>
                        <div><button @click="scroll_right"><i class="fas fa-caret-right"></i></button></div>
                    </div>
                </div>
            </div>
            <div class="page" v-if="projectIndex == 2">
                <div :class="{'state-grid': !isNew , 'enabled-grid': !isAdministrator || isNew}">
                    <b-form-group :label-cols="4" label-class="font-weight-bold" :label="$t( 'proyectTool.announcement.create.state' )+asterisk" class="state-g" v-if="isAdministrator && !isNew">
                        <v-select v-model.trim="state" label="label" :placeholder="$t( 'community.survey.status' )" :options="stateOps"  class="font-size-14" v-if="oldState == stateOps[2].value"></v-select>
                        <span v-else><b>{{project.statusName}}</b><br></span>
                        <span v-if="isAdministrator && !isNew"><b>{{$t( 'library.visor.addFor' )}}</b>&nbsp; <i class="fas fa-user"></i> {{project.userName}} {{project.userLastName}}, {{project.userType}}</span>
                    </b-form-group>
                    <b-form-group :label-cols="4" label-class="font-weight-bold" :label="$t( 'proyectTool.announcement.create.state' )+asterisk" class="state-g" v-else-if="!isNew">
                        <span><b>{{project.statusName}}</b><br></span>
                        <span v-if="!isNew"><b>{{$t( 'library.visor.addFor' )}}</b>&nbsp; <i class="fas fa-user"></i> {{project.userName}} {{project.userLastName}}, {{project.userType}}</span>
                    </b-form-group> 
                    <b-form-group :label-cols="4"
                            label-class="font-weight-bold"
                            label="&nbsp;" style="text-align: right;float:right;" class="enabled-g" v-if="oldState != stateOps[1].value">
                                <b-form-checkbox id="checkbox1" v-model="project.enabled">
                                <b>{{$t( 'proyectTool.announcement.create.enabled' )}} </b>
                            </b-form-checkbox>
                    </b-form-group> 
                </div>
                <b-form-group :label-cols="4" label-class="font-weight-bold" description= "" v-if="!project.enabled || project.enabled=='false'" :label="$t( 'proyectTool.projects.create.disableReason' )+asterisk">
                    <b-form-input placeholder="" v-model="project.reason"  ></b-form-input>
                </b-form-group>
                <b-form-group :label-cols="4" label-class="font-weight-bold" description= "" :label="$t( 'proyectTool.projects.create.name' )+asterisk">
                    <b-form-input :placeholder="$t( 'proyectTool.projects.create.name' )" v-model="project.name" :disabled="true"></b-form-input>
                </b-form-group>
                <hr>
                <b-form-group :label-cols="4" label-class="font-weight-bold" :label="$t( 'proyectTool.projects.create.announcement' )" description= "">
                    <div style="display: grid; grid-template-columns: 11fr 1fr">
                        <v-select v-model.trim="announcement" label="name" :placeholder="$t( 'proyectTool.projects.create.announcement' )" :options="announcements" v-if="announcements != null" class="font-size-14"></v-select>
                        <sipsder-btn btnType="add" text="" @onClick="addSelectedA()" style="transform: scale(0.9); margin-top: -8%"></sipsder-btn>
                    </div>
                    
                    <b-col cols=12 v-if="announcementSel.length > 0" class="d-flex justify-content-center">
                        <b-table responsive striped hover small :fields="fields.announcement" :items="announcementSel">
                            <!-- Columna definida para la acciones -->
                            <template slot="actions" slot-scope="row">
                                <div  class="d-flex justify-content-center">
                                    <sipsder-btn btnType="delete" text="" @onClick="removeElementA(row.item)">
                                    </sipsder-btn>
                                </div>
                            </template>
                        </b-table>
                    </b-col>
                    <b-col cols=12 v-else class="d-flex justify-content-center">
                        {{emptyAMessage}}
                    </b-col>
                </b-form-group>

                <b-form-group :label-cols="4" label-class="font-weight-bold" :label="$t( 'proyectTool.announcement.create.funding' )" description= "">
                    <div style="display: grid; grid-template-columns: 11fr 1fr">
                        <v-select v-model.trim="funding" label="name" :placeholder="$t( 'proyectTool.announcement.create.typeF' )" :options="fundings" v-if="fundings != null" class="font-size-14"></v-select>
                        <sipsder-btn btnType="add" text="" @onClick="addSelectedF()" style="transform: scale(0.9); margin-top: -8%"></sipsder-btn>
                    </div>
                    
                    <b-col cols=12 v-if="fundingSel.length > 0" class="d-flex justify-content-center">
                        <b-table responsive striped hover small :fields="fields.funding" :items="fundingSel">
                            <!-- Columna definida para la acciones -->
                            <template slot="actions" slot-scope="row">
                                <div  class="d-flex justify-content-center">
                                    <sipsder-btn btnType="delete" text="" @onClick="removeElementF(row.item)">
                                    </sipsder-btn>
                                </div>
                            </template>
                        </b-table>
                    </b-col>
                    <b-col cols=12 v-else class="d-flex justify-content-center">
                        {{emptyFMessage}}
                    </b-col>
                </b-form-group>

                <b-form-group :label-cols="4" label-class="font-weight-bold" :label="$t( 'proyectTool.projects.create.procedure' )" description= "">
                    <div style="display: grid; grid-template-columns: 11fr 1fr">
                        <v-select v-model.trim="procedure" label="name" :placeholder="$t( 'proyectTool.projects.create.procedure' )" :options="procedures" v-if="procedures != null" class="font-size-14"></v-select>
                        <sipsder-btn btnType="add" text="" @onClick="addSelectedPr()" style="transform: scale(0.9); margin-top: -8%"></sipsder-btn>
                    </div>
                    
                    <b-col cols=12 v-if="procedureSel.length > 0" class="d-flex justify-content-center">
                        <b-table responsive striped hover small :fields="fields.procedure" :items="procedureSel">
                            <!-- Columna definida para la acciones -->
                            <template slot="actions" slot-scope="row">
                                <div  class="d-flex justify-content-center">
                                    <sipsder-btn btnType="delete" text="" @onClick="removeElementPr(row.item)">
                                    </sipsder-btn>
                                </div>
                            </template>
                        </b-table>
                    </b-col>
                    <b-col cols=12 v-else class="d-flex justify-content-center">
                        {{emptyPrMessage}}
                    </b-col>
                </b-form-group>
            </div>

             <div style="text-align: center;">
                <sipsder-btn btnType="back" @onClick="returnBack"></sipsder-btn>
                <sipsder-btn
                    v-if="projectIndex <2 && state.value == 4"
                    btnType="add"
                    :text=" $t('proyectTool.projects.create.saveContinue') "
                    @onClick="validate(1)"
                ></sipsder-btn>
                <sipsder-btn
                    v-if="state.value == 4"
                    btnType="add"
                    :text="projectIndex <2 ? $t('proyectTool.projects.create.onlySave') :  $t('proyectTool.projects.create.savePartial')"
                    @onClick="validate(2)"
                ></sipsder-btn>
                 <sipsder-btn
                    v-if="projectIndex == 2 || state.value != 4"
                    btnType="add"
                    :text="$t('proyectTool.projects.create.savePublish')"
                    @onClick="validate(3)"
                ></sipsder-btn>
            </div>
        </div>
        <b-modal ref="errorEvent" :title="$t( 'proyectTool.concepts.alert' )"
            @ok="closeModal('errorEvent')"
            @cancel="closeModal('errorEvent')"
            >
            <b-row class="w-100 center">
                <div class="w-100 red" v-html="error">
                </div>
            </b-row>
        </b-modal>
        <b-modal ref="errorEvent2" :title="$t( 'proyectTool.concepts.alert' )"
        @ok="$router.go(-1)"
        @cancel="closeModal('errorEvent2')"
        >
            <b-row class="w-100 center">
                <div class="w-100 red" v-html="$t( 'proyectTool.announcement.create.discart' )"></div>
            </b-row>
        </b-modal>

        <b-modal ref="errorEvent3" :title="$t( 'proyectTool.concepts.alert' )"
        @ok="create"
        @cancel="closeModal('errorEvent3')"
        >
            <div v-if="state.value == 3">
                <b-row class="w-100 center">
                    <div class="w-100 red" v-html="$t( 'proyectTool.projects.create.saveF' )"></div>
                    <div class="w-100 red">
                         <b-form-group
                        :label-cols="4"
                        label-class="font-weight-bold"
                        :label="$t( 'proyectTool.announcement.create.reason' )+asterisk"
                        >
                            <b-form-textarea
                                id="textarea2"
                                v-model="project.saveText"
                                :placeholder="$t( 'proyectTool.announcement.create.reason' )"
                                :rows="3"
                                :max-rows="6"
                            ></b-form-textarea>
                        </b-form-group>
                    </div>
                </b-row>
            </div>
            <div v-else-if="state.value == 2">
                <b-row class="w-100 center">
                    <div class="w-100 red" v-html="$t( 'proyectTool.projects.create.refusedM' )"></div>
                    <div class="w-100 red">
                         <b-form-group
                        :label-cols="4"
                        label-class="font-weight-bold"
                        :label="$t( 'proyectTool.announcement.create.reason' )+asterisk"
                        >
                            <b-form-textarea
                                id="textarea2"
                                v-model="project.saveText"
                                :placeholder="$t( 'proyectTool.announcement.create.reason' )"
                                :rows="3"
                                :max-rows="6"
                                no-resize
                            ></b-form-textarea>
                        </b-form-group>
                    </div>
                </b-row>
            </div>
           <div v-else>
                <b-row class="w-100 center">
                    <div class="w-100 red" v-html="$t( 'proyectTool.projects.create.edit' )"></div>
                    <div class="w-100 red">
                         <b-form-group
                        :label-cols="4"
                        label-class="font-weight-bold"
                        :label="$t( 'proyectTool.announcement.create.reason' )+asterisk"
                        >
                            <b-form-textarea
                                id="textarea2"
                                v-model="project.saveText"
                                :placeholder="$t( 'proyectTool.announcement.create.reason' )"
                                :rows="3"
                                :max-rows="6"
                                no-resize
                            ></b-form-textarea>
                        </b-form-group>
                    </div>
                </b-row>
            </div>
        </b-modal>
        <b-modal ref="errorEvent4" :title="$t( 'proyectTool.concepts.alert' )"
             @ok="closeModal('errorEvent4')"
            @cancel="closeModal('errorEvent4')"
            >
            <b-row class="w-100 center">
                <div class="w-100 red" v-html="error">
                </div>
            </b-row>
        </b-modal>
        <b-modal ref="addImageModal" id="addImageModal"  size="lg" class="image-modal" centered :title="$t('audiovisual_media.index.title_modal')" hide-footer>
            <audiovisualmedia @created_image="created_image($event)" @cancel="closeModal('addImageModal')" :allowSelection="true"  :media-options="mediaOptions"></audiovisualmedia>
        </b-modal>
         <b-modal ref="errorEvent5" :title="$t( 'proyectTool.concepts.alert' )"
            @ok="redirect()"
            @cancel="redirect()"
            >
            <b-row class="w-100 center">
                <div class="w-100 red" v-html="error">
                </div>
            </b-row>
        </b-modal>
          <b-modal ref="errorEvent6" :title="$t( 'proyectTool.concepts.alert' )"
            @ok="redirect2()"
            @cancel="redirect2()"
            >
            <b-row class="w-100 center">
                <div class="w-100 red" v-html="error">
                </div>
            </b-row>
        </b-modal>
    </div>
</template>

<script>
import Audiovisualmedia from '../../audiovisual_media/AudioVisualIndex.vue';
import VueBootstrapTypeahead from 'vue-bootstrap-typeahead'
import Treeselect from '@riophae/vue-treeselect';
import vSelect from "vue-select";
import VAPI from '../../../../http_common';
import RichText from '../../../shared/RichText.vue'
import { SERVICE_NAMES,HTTP_STATUS } from '../../../../sipsder_constants';
import { GEOGRAPHY_TYPE, PERMISSIONS_TYPES, FUNDING_SOURCE_TYPE,  MODULES, ATTACHMENT_TYPE} from '../../../../domain_constants'
import S_UTIL from "../../../../util/sipsder_util";
import Datepicker from "vuejs-datepicker";
import * as lang from "vuejs-datepicker/src/locale";
import moment from 'moment';

export default {
    components:{
        "v-select": vSelect,
        VueBootstrapTypeahead,
        Treeselect,
        RichText,
        datepicker: Datepicker,
        Audiovisualmedia
    },
     computed:{
        isAdministrator() {   
            return this.$store.getters.isAuthenticated && this.$store.getters.hasPermission( PERMISSIONS_TYPES.ADMIN ) 
        },
        onlyControl(){
            return this.$store.getters.isAuthenticated && this.$store.getters.hasPermission( PERMISSIONS_TYPES.CONTROL )
        },
        geoLocal(){
            return this.$store.getters.getGeoLocal
        },
        institutions(){
             return this.$store.getters.getInstitutionsF
        },
        isLogged(){
            return this.$store.getters.isAuthenticated
        },
        currentUser(){
            return this.$store.state.session.currentUser
        },
        qSplit(){
            return this.qProduct.split(',')
        }
    },
    data() {
        return {
            pId: 0,
            asterisk: "<span style='color: red'>*</span>",
            projectTitle: [
                this.$t( 'proyectTool.projects.create.one' ),
                this.$t( 'proyectTool.projects.create.two' ),
                this.$t( 'proyectTool.projects.create.three' ),
            ],
            projectIndex: 0,
            isNew: true,
            project:{
                id : '',
                enabled: true,
                reason: '',
                idStatus: '',
                statusName: '',
                name: '',
                summary: '',
                description: '',
                time: '',
                resources: '',
                tags: '',
                idUser: '',
                idInstitution: '',
                institutionName: '',
                userName: '',
                userLastName: '',
                userType: '',
                saveText: '',
                isEnding: '',
                products:  [],
                ruralModel:  [],
                images:  [],
                announcements:  [],
                fundingSources:  [],
                procedures: [],
                geographies: []
            },
            tags:[],
            tag:'',
            institution: {},
            state:{
                label: this.$t( 'proyectTool.announcement.create.editing' ),
                value: 4
            },
            stateOps:[
                {
                    label: this.$t( 'proyectTool.announcement.create.publish' ),
                    value: 1
                },
                {
                    label: this.$t( 'proyectTool.announcement.create.refused' ),
                    value: 2
                },
                {
                    label: this.$t( 'proyectTool.announcement.create.waiting' ),
                    value: 3
                },
                {
                    label: this.$t( 'proyectTool.announcement.create.editing' ),
                    value: 4
                }
            ],
             fields:{
                product: [{
                    key: "name",
                    label: this.$t( 'proyectTool.projects.create.product' ),
                    sortable: true
                },
                {
                    key: "type",
                    label: this.$t( 'proyectTool.projects.create.typeP' ),
                    sortable: true
                },
                {
                    key: 'principal',
                    label: this.$t('document.admin.tableTitles.ruralModel.main'),
                    sortable: true,
                },
                {
                    key: "actions",
                    label: ""
                }],
                
                funding: [{
                    key: "name",
                    label: this.$t( 'proyectTool.announcement.create.funding' ),
                    sortable: true
                },
                {
                    key: "actions",
                    label: ""
                }],
                announcement: [{
                    key: "name",
                    label: this.$t( 'proyectTool.announcement.title' ),
                    sortable: true
                },
                {
                    key: "actions",
                    label: ""
                }],

                procedure: [{
                    key: "name",
                    label: this.$t( 'proyectTool.projects.create.procedure' ),
                    sortable: true
                },
                {
                    key: "actions",
                    label: ""
                }],
            },
            mediaOptions: [
                {value: ATTACHMENT_TYPE.PUBLIC_IMAGE, text: this.$t("audiovisual_media.imageOption")},
                {value: ATTACHMENT_TYPE.VIDEO, text: this.$t("audiovisual_media.videoOption")},
            ],
            procedures: [],
            procedure: {},
            procedureSel: [],
            emptyPrMessage: this.$t( 'proyectTool.projects.create.emptyPrMessage' ),
            announcements: [],
            announcement: {},
            announcementSel: [],
            emptyAMessage: this.$t( 'proyectTool.projects.create.emptyAMessage' ),
            fundings: [],
            funding: {},
            fundingSel: [],
            emptyFMessage: this.$t( 'proyectTool.announcement.create.emptyFMessage' ),
            rurals: [],
            products: [],
            product: {
                id: null,
                idType: null,
                name: "",
                type: "",
                typePlusName: ""
            },
            selectedLocality: null,
            selectedNeighborhood: null,
            allLocality: true,
            localities: [],
            localityIds: [],
            subLocalityIds: [],
            autocomplets: {
                localities: [],
                neighborhood: []
            },
            actionop: 0,
            pIndex : 0,
            qProduct: '',
            productSel: [],
            selectedQueryModel:undefined,
            oldModel : [],
            selectImage:{},
            oldState: null,
            oldEnabled: null,
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
            error: '',
            notProduct: ''
        }
    },
     watch:{
        qProduct: _.debounce(function(product) { 
            if(product.length <= 0){
                this.product =  {
                    id: null,
                    idType: null,
                    name: "",
                    type: "",
                    typePlusName: ""
                }
            }
        }, 500),
        'selectedLocality.id': function (newVal, oldVal){
            if(newVal)
                this.loadNeighborhoods(newVal);
        },
    },
    async created(){
        this.$store.dispatch( 'getGeoLocal');
        this.$store.dispatch( 'getInstitutionsF');
    },
    async beforeMount() {
        try{
            let response = await VAPI.get(`/${SERVICE_NAMES.PROYECT_TOOL}/funding-source/select`)
            if(response.status == 200){
                this.fundings= response.data.data;
                
            }
        }
        catch( error ) {
            console.log( 'Error fetching funding sources', error );
        }
         try{
            let response = await VAPI.get(`/${SERVICE_NAMES.PROYECT_TOOL}/announcements/select`)
            if(response.status == 200){
                this.announcements= response.data.data;
                
            }
        }
        catch( error ) {
            console.log( 'Error fetching announcements', error );
        }
         try{
            let response = await VAPI.get(`/${SERVICE_NAMES.PROCEDURE}/select`)
            if(response.status == 200){
                this.procedures= response.data.data;
                
            }
        }
        catch( error ) {
            console.log( 'Error fetching procedures', error );
        }
        try {
            let path = `/${SERVICE_NAMES.RURAL_MODEL}/tree`
            let response = await VAPI.get( path );
            if (response.status == HTTP_STATUS.OK){
                this.rurals = this.toRuralFormat(response.data.data);
            }
        } catch (error) {
            console.error("Fallo al obtener Modelos rurales", error);
        }
        try{
                let response = await VAPI.get(`${SERVICE_NAMES.PROJECTS}/products`);
                if(response.status == 200){
                    this.products= response.data;
                }
            }
            catch( error ) {
                console.log( 'Error fetching Products', error );
            }
        //GET LOCALITIES
        try {
            let path = `${SERVICE_NAMES.GEOGRAPHY}?type=${GEOGRAPHY_TYPE.LOCALIDAD}`;
            let response = await VAPI.get( path );
            if (response.status == HTTP_STATUS.OK){
                this.autocomplets.localities = response.data;
            }
        } catch (error) {
            console.info("Fallo al obtener Localidades", error);
        }
        if(this.$route.params.id !==null && this.$route.params.id !==undefined )
        {
            this.isNew = false
            this.pId = this.$route.params.id
            let id = this.$route.params.id
            try{
                let response = await VAPI.get(`${SERVICE_NAMES.PROJECTS}/proyect/one/${id}`);
                if(response.status == 200){
                    this.project= response.data;
                    if((this.project.idUser !== this.currentUser.id) && !this.isAdministrator) this.$router.push({name: 'ProyectToolProyectIndex'})
                    this.oldState = this.project.idStatus
                    this.oldEnabled = this.project.enabled
                    this.state = {
                        label: this.project.statusName,
                        value: this.project.idStatus
                    }
                    // console.log(this.state)
                    this.institution = {
                        name: this.project.institutionName,
                        id: this.project.idInstitution
                    }
                    if(this.project.images.length>0){
                        this.selectImage.index=0
                        this.selectImage.id=this.project.images[0].id
                        this.selectImage.url=this.project.images[0].url
                        this.selectImage.idType=this.project.images[0].idType
                        this.selectImage.principal=this.project.images[0].principal
                    }
                    this.announcementSel = JSON.parse(JSON.stringify(this.project.announcements))
                    this.procedureSel = JSON.parse(JSON.stringify(this.project.procedures))
                    this.productSel = JSON.parse(JSON.stringify(this.project.products))
                    this.fundingSel = JSON.parse(JSON.stringify(this.project.fundingSources))
                    this.oldModel = JSON.parse(JSON.stringify(this.project.ruralModels))
                    if(this.project.geographies.length>0){
                        this.project.geographies.forEach(e=>{
                            if(e.nameParent != null && e.typeParent == GEOGRAPHY_TYPE.LOCALIDAD){
                                this.localities.push({
                                    locality: e.nameParent,
                                    subLocality: e.name ? e.name: 'TODA',
                                    localityId: e.idParent,
                                    subLocalityId: e.id ? e.id : 0
                                })
                            }else{
                                this.localities.push({
                                    locality: e.name,
                                    subLocality: 'TODA',
                                    localityId: e.id,
                                    subLocalityId:  0
                                })
                            }
                        })
                        
                    }
                    //if(this.project.ruralModels.length>0)
                    this.selectedQueryModel = this.project.ruralModels[0].id
                    var tagsArr = this.project.tags.split(",")
                    this.tags=tagsArr.map(tag => ({
                            text: tag
                    }));
                }
                if(this.$route.params.page !==null && this.$route.params.page !==undefined ){
                    this.goToIndex(this.$route.params.page+1)
                }
            }
            catch( error ) {
                console.log( 'Error fetching Project', error );
            }
        }
        if(this.isNew && this.currentUser.institutions[0] != undefined)
            this.institution ={
                id: this.currentUser.institutions[0].id,
                name: this.currentUser.institutions[0].name
            }
        
    },
    methods: {
        toRuralFormat(ruralList) {
                
            ruralList.forEach(level1=>{

                // level1.theme = level1.label;
                if (level1.children){
                    level1.children.forEach(level2 => {
                        
                        level2.structure = level2.label;
                        if (level2.children){

                            level2.children.forEach(level3 => {
                                level3.structure = level2.label;
                                level3.component = level3.label;

                                if (level3.children){

                                    level3.children.forEach(level4 => {
                                        level4.structure = level2.label;
                                        level4.component = level3.label;
                                        level4.subComponent = level4.label;
                                    });
                                }
                            });
                        }
                    });
                }
            });

            return ruralList;
        },
        async loadNeighborhoods(locality){
            //GET NEIGHBORHOOD
            try {
                let path = `${SERVICE_NAMES.GEOGRAPHY}/parent/${this.selectedLocality.id}`;
                let response = await VAPI.get( path );
                if (response.status == HTTP_STATUS.OK){
                    this.autocomplets.neighborhood = response.data;
                }
            } catch (error) {
                console.info("Fallo al obtener Veredas", error);
            }
        },
        created_image(response){
            this.closeModal('addImageModal')
            let image = _.find(this.project.images, { 'id': response[0]});
            if(!image){
                
                this.project.images.push({
                    action:1,
                    id:response[0],
                    idType: response[3],
                    principal: false,
                    url: response[1]
                })

                if(this.project.images.length === 1) {
                    this.selectImage.index=0
                    this.selectImage.id=this.project.images[0].id
                    this.selectImage.url=this.project.images[0].url
                    this.selectImage.idType=this.project.images[0].idType
                    this.project.images[0].principal = true
                    this.selectImage.principal=this.project.images[0].principal
                }else {
                }
            }
        },
        setSelectImage(index){
            this.selectImage.index=index
            this.pIndex = index
            this.selectImage.id=this.project.images[index].id
            this.selectImage.url=this.project.images[index].url
            this.selectImage.idType=this.project.images[index].idType
            this.selectImage.principal=this.project.images[index].principal
        },
        setImagePrincipal(){
            for(var i=0;i<this.project.images.length;i++){
                this.project.images[i].principal = false
                this.project.images[i].action = 1
            }
            this.project.images[this.selectImage.index].principal = true
            this.selectImage.principal=true
        },
        deleteImage(){
            if(this.selectImage.principal==true){
                this.error=""
                this.error="No puede eliminar el anexo principal."
                this.showModal("errorEvent4")
            }
            else{
                if(this.project.images[this.selectImage.index].action==1){
                    this.project.images.splice(this.selectImage.index,1)
                    this.selectImage.index=0
                    this.selectImage.id=this.project.images[0].id
                    this.selectImage.url=this.project.images[0].url
                    this.selectImage.idType=this.project.images[0].idType
                    this.selectImage.principal=this.project.images[0].principal
                }
                else{
                    let deleteI = JSON.parse(JSON.stringify(this.project.images[this.selectImage.index]))
                    deleteI.action = 2
                    this.project.images.splice(this.selectImage.index,1)
                    this.selectImage.index=0
                    this.selectImage.id=this.project.images[0].id
                    this.selectImage.url=this.project.images[0].url
                    this.selectImage.idType=this.project.images[0].idType
                    this.selectImage.principal=this.project.images[0].principal
                    this.project.images.push(deleteI)
                }
            }
        },
        getYTvideoCode(url){
            if(url.search("youtube")>0){
                var res = url.split("/")
                var rel = res[4].split("?")
                return "https://img.youtube.com/vi/"+rel[0]+"/hqdefault.jpg"
            }
            else{
                return this.getImgURL(url);
            }
        },
        scroll_left() {
            let content = document.querySelector(".scroll");
            content.scrollLeft -= 70;
        },
        scroll_right() {
            let content = document.querySelector(".scroll");
            content.scrollLeft += 70;
        },
        getImgURL (url) {
            return S_UTIL.getImgURL(url);
        },
        showModal(ref){
            this.$refs[ref].show();
        },
        closeModal(ref){
            this.$refs[ref].hide();
        },
        changeValueDescription(value){
            this.project.description = value
        },
         changeValueTime(value){
            this.project.time = value
        },
         changeValueResources(value){
            this.project.resources = value
        },
        goToIndex(i){
            if(i==0)  this.projectIndex = 0
            if(this.isNew == false && i == 1){
                this.projectIndex = i
            }
            if(this.isNew == false && i == 2 && this.project.images.length>0){
                this.projectIndex = i
            }
        },
        showModal(ref){
            this.$refs[ref].show();
        },
        closeModal(ref){
            this.$refs[ref].hide();
        },
        returnBack(){
            this.showModal('errorEvent2')
        },
        async addSelectedP(){
            if(this.qProduct == '') return
            self = this
            let insert =true
            if(this.productSel.length <= 0) {this.product.principal = true}
            else {this.product.principal = false}

            this.productSel.forEach(e=>{
               if(e.id == self.product.id ){
                   insert= false
               }
            })
            if(this.product.id === undefined) insert= false
            if(this.product.id === null && this.qProduct.length > 0) insert= true
            if(this.product.id === null && this.qProduct.length > 0) {
                if(this.qSplit[1] === undefined || this.qSplit[0] === undefined){
                    insert = false
                    this.notProduct = this.$t( 'proyectTool.projects.create.notProduct' )
                    return
                }
                this.product.typePlusName = this.qProduct
                this.product.name = this.qSplit[0].trim()
                this.product.type = this.qSplit[1].trim()
            }
            if( insert){
                this.notProduct = ''
                this.productSel.push(this.product)
                let productT = {
                    id: this.product.id,
                    name: this.product.name,
                    type: this.product.type,
                    principal:  this.product.principal,
                    action: 1,
                }
                this.project.products.push(productT)
                this.qProduct = ''
            }
        },
        removeElementP(element){
            let deletev = false
            this.productSel.forEach(e=>{
               if(e.id == element.id){
                   deletev = true
               }
            })
            if(deletev){
                const idx = this.productSel.indexOf(element);
                this.productSel.splice(idx, 1);

                const idz = this.project.products.findIndex(e=>{
                    return e.id === element.id
                });
                if(this.project.products[idz].action === 1){
                    this.project.products.splice(idz, 1);
                }
                else{
                     this.project.products[idz].action = 2
                }
                
                if( this.productSel.length>0){
                    this.productSel[0].principal=true
                }
                if( this.project.products.length>0){
                    this.project.products[0].principal=true
                }
            }
        },
        changeProductPrincipal(i) {
            this.productSel.forEach(e=>{
              e.principal = false
              if(e.id === i){
                  e.principal = true
              }
            })
            this.productSel = JSON.parse(JSON.stringify(this.productSel))
             this.project.products.forEach(e=>{
                if(e.action == 0)  e.action = 1
                e.principal = false
                if(e.id === i){
                    e.principal = true
                }
            })
        },
         addSelectedF(){
            self = this
            let insert =true
            this.fundingSel.forEach(e=>{
               if(e.id == self.funding.id){
                   insert= false
               }
            })
            if(this.funding.id === undefined) insert= false
            if( insert){
                this.fundingSel.push(this.funding)
                let fundingT = {
                    id: this.funding.id,
                    name: this.funding.name,
                    action: 1,
                }
                this.project.fundingSources.push(fundingT)
            }
        },
        removeElementF(element){
            let deletev = false
            this.fundingSel.forEach(e=>{
               if(e.id == element.id){
                   deletev = true
               }
            })
            if(deletev){
                const idx = this.fundingSel.indexOf(element);
                this.fundingSel.splice(idx, 1);

                const idz = this.project.fundingSources.findIndex(e=>{
                    return e.id === element.id
                });
                if(this.project.fundingSources[idz].action === 1){
                    this.project.fundingSources.splice(idz, 1);
                }
                else{
                     this.project.fundingSources[idz].action = 2
                }
                   
            }
        },
        addSelectedA(){
            self = this
            let insert =true
            this.announcementSel.forEach(e=>{
               if(e.id == self.announcement.id){
                   insert= false
               }
            })
            if(this.announcement.id === undefined) insert= false
            if( insert){
                this.announcementSel.push(this.announcement)
                let announcementT = {
                    id: this.announcement.id,
                    name: this.announcement.name,
                    action: 1,
                }
                this.project.announcements.push(announcementT)
            }
        },
        removeElementA(element){
            let deletev = false
            this.announcementSel.forEach(e=>{
               if(e.id == element.id){
                   deletev = true
               }
            })
            if(deletev){
                const idx = this.announcementSel.indexOf(element);
                this.announcementSel.splice(idx, 1);

                const idz = this.project.announcements.findIndex(e=>{
                    return e.id === element.id
                });
                if(this.project.announcements[idz].action === 1){
                    this.project.announcements.splice(idz, 1);
                }
                else{
                     this.project.announcements[idz].action = 2
                }
                   
            }
        },
        addSelectedPr(){
            self = this
            let insert =true
            this.procedureSel.forEach(e=>{
               if(e.id == self.procedure.id){
                   insert= false
               }
            })
            if(this.procedure.id === undefined) insert= false
            if( insert){
                this.procedureSel.push(this.procedure)
                let procedureT = {
                    id: this.procedure.id,
                    name: this.procedure.name,
                    action: 1,
                }
                this.project.procedures.push(procedureT)
            }
        },
        removeElementPr(element){
            let deletev = false
            this.procedureSel.forEach(e=>{
               if(e.id == element.id){
                   deletev = true
               }
            })
            if(deletev){
                const idx = this.procedureSel.indexOf(element);
                this.procedureSel.splice(idx, 1);

                const idz = this.project.procedures.findIndex(e=>{
                    return e.id === element.id
                });
                if(this.project.procedures[idz].action === 1){
                    this.project.procedures.splice(idz, 1);
                }
                else{
                     this.project.procedures[idz].action = 2
                }
                   
            }
        },
        validate(action){
            let isError = false
            if(this.projectIndex == 0 && this.isNew){
                isError = this.validatefirstForm()
            }
            else{
                isError == false ? isError = this.validatefirstForm() : isError = true
                isError == false ? isError = this.validateImages() : isError = true 
            }
            if(isError ){
                this.showModal("errorEvent")
            }
            else{
                if(this.state.value == this.stateOps[1].value){
                    this.project.enabled = false
                    this.project.saveText = "Rechazado"
                }
                if(action == 1){
                    this.actionop = 1
                    this.create(1)
                    this.isNew = false
                }
                if(action == 2){
                    this.actionop=2
                    this.create(2)
                }
                if(action == 3){
                    this.actionop=3
                    if(this.isAdministrator && this.state.value == 4) this.state.value = 1
                    if(!this.isAdministrator && this.state.value == 4) this.state.value = 3
                    if(((this.isNew && this.isAdministrator) ||  ((this.oldEnabled != this.project.enabled || this.oldState != this.state.value) && this.isAdministrator) || (this.project.idUser == this.currentUser.id && this.isAdministrator) || this.isAdministrator) && this.state.value != this.stateOps[1].value ) {
                        this.create(3)
                    }
                    /*else if (this.state.value == this.stateOps[1].value && this.isAdministrator){
                        this.create(3)
                    }*/
                    else {
                        this.showModal("errorEvent3")
                    } 
                }
            }
            
        },
        addLocality(){
            if(this.selectedNeighborhood){
                if(!this.subLocalityIds.includes(this.selectedNeighborhood.id)){
                    this.subLocalityIds.push(this.selectedNeighborhood.id);
                    this.localityIds.push(this.selectedNeighborhood.id);
                    let geoT = {
                        id: this.selectedNeighborhood.id,
                        name: this.selectedNeighborhood.name,
                        action: 1,
                    }
                    this.project.geographies.push(geoT)
                    this.localities.push({
                        locality: this.selectedLocality.name,
                        subLocality: this.selectedNeighborhood ? this.selectedNeighborhood.name : 'TODA',
                        localityId: this.selectedLocality.id,
                        subLocalityId: this.selectedNeighborhood ? this.selectedNeighborhood.id : 0
                    })
                }
            }else if(!this.localityIds.includes(this.selectedLocality.id)){
                this.localityIds.push(this.selectedLocality.id);
                let geoT = {
                    id: this.selectedLocality.id,
                    name: this.selectedLocality.name,
                    action: 1,
                }
                this.project.geographies.push(geoT)
                this.localities.push({
                    locality: this.selectedLocality.name,
                    subLocality: this.selectedNeighborhood ? this.selectedNeighborhood.name : 'TODA',
                    localityId: this.selectedLocality.id,
                    subLocalityId: this.selectedNeighborhood ? this.selectedNeighborhood.id : 0
                })
            }
            this.selectedLocality = null;
            this.selectedNeighborhood = null;
            this.allLocality = true;
        },
        deleteLocality(index){
            this.localities.splice(index, 1)
            if(this.project.geographies[index].action === 1){
                this.project.geographies.splice(index, 1);
            }
            else{
                this.project.geographies[index].action = 2
            }
        },
        validatefirstForm(){
            this.error = this.$t('proyectTool.home.error')+'<br>'
            this.project.tags = this.tags.map(tag => tag.text).join(',');
            this.project.ruralModels = []
            this.project.ruralModels.push({
                id:this.selectedQueryModel,
                name: '',
                action: 1
                })
            if(this.oldModel.length>0){
                if(this.oldModel[0].id != this.project.ruralModels[0].id){
                    this.oldModel[0].action=2
                    this.project.ruralModels.push(this.oldModel[0])
                }
            }
            let isError = false
            if(this.state.value === 2){
                this.project.enabled = false
                this.project.reason = "Rechazada"
            }
            if(this.project.enabled == false || this.project.enabled == 'false'){
                if(this.project.reason == null || this.project.reason==""){
                    this.error+= this.$t('proyectTool.methodology.errorStart')+this.$t('proyectTool.methodology.disableReason')+this.$t('proyectTool.methodology.errorEnd')
                    this.error+= '<br>'
                    isError = true
                }
                if(this.project.reason.length>120){
                    this.error+= this.$t('proyectTool.methodology.errorStart')+this.$t('proyectTool.methodology.disableReason')+this.$t('proyectTool.methodology.limit')
                    this.error+= '<br>'
                    isError = true
                }
            }
            if(this.state== null || this.state == undefined){
                this.error+= this.$t('proyectTool.methodology.errorStart')+this.$t( 'proyectTool.announcement.create.state' )+this.$t('proyectTool.methodology.errorEnd')
                this.error+= '<br>'
                isError = true
            }
            if(this.institution.id ==undefined){
                this.error+= this.$t('proyectTool.methodology.errorStart')+this.$t( 'proyectTool.projects.create.institution')+this.$t('proyectTool.methodology.errorEnd')
                this.error+= '<br>'
                isError = true
            }
            if(this.project.name.length<1){
                this.error+= this.$t('proyectTool.methodology.errorStart')+this.$t( 'proyectTool.announcement.name' )+this.$t('proyectTool.methodology.errorEnd')
                this.error+= '<br>'
                isError = true
            }
            if(this.project.name.length>120){
                this.error+= this.$t('proyectTool.methodology.errorStart')+this.$t( 'proyectTool.announcement.name' )+this.$t('proyectTool.methodology.limit')
                this.error+= '<br>'
                isError = true
            }
            if(this.project.summary.length<1){
                this.error+= this.$t('proyectTool.methodology.errorStart')+this.$t( 'proyectTool.announcement.create.summary' )+this.$t('proyectTool.methodology.errorEnd')
                this.error+= '<br>'
                isError = true
            }
            if(this.project.summary.length>280){
                this.error+= this.$t('proyectTool.methodology.errorStart')+this.$t( 'proyectTool.announcement.create.summary' )+this.$t('proyectTool.methodology.limit')
                this.error+= '<br>'
                isError = true
            }
            if(this.project.description.length<1){
                this.error+= this.$t('proyectTool.methodology.errorStart')+this.$t( 'proyectTool.projects.create.description' )+this.$t('proyectTool.methodology.errorEnd')
                this.error+= '<br>'
                isError = true
            }
            if(this.project.time.length<1){
                this.error+= this.$t('proyectTool.methodology.errorStart')+this.$t( 'proyectTool.projects.create.time' )+this.$t('proyectTool.methodology.errorEnd')
                this.error+= '<br>'
                isError = true
            }
            if(this.project.resources.length<1){
                this.error+= this.$t('proyectTool.methodology.errorStart')+this.$t( 'proyectTool.projects.create.resources' )+this.$t('proyectTool.methodology.errorEnd')
                this.error+= '<br>'
                isError = true
            }
            if(this.project.ruralModels.length<1){
                this.error+= this.$t('proyectTool.methodology.errorStart')+this.$t( 'proyectTool.announcement.create.ruralS' )+this.$t('proyectTool.methodology.errorEnd')
                this.error+= '<br>'
                isError = true
            }
            if(this.project.products.length<1){
                this.error+= this.$t('proyectTool.methodology.errorStart')+this.$t( 'proyectTool.projects.create.product' )+this.$t('proyectTool.methodology.errorEnd')
                this.error+= '<br>'
                isError = true
            }
            if(this.project.tags<3){
                this.error+= this.$t('proyectTool.methodology.errorStart')+this.$t('news.create.tags')+this.$t('proyectTool.methodology.errorEnd')
                this.error+= '<br>'
                isError = true
            }
            if(this.project.tags>100){
                this.error+= this.$t('proyectTool.methodology.errorStart')+this.$t('news.create.tags')+this.$t('proyectTool.methodology.limit')
                this.error+= '<br>'
                isError = true
            }
            return isError
        },
        validateImages(){
            let isError = false
            if(this.project.images.length<1){
                this.error+= this.$t('proyectTool.methodology.errorStart')+this.$t('proyectTool.projects.create.imageLabel')+this.$t('proyectTool.methodology.errorEnd')
                this.error+= '<br>'
                isError = true
                this.projectIndex = 1
            }
            if(this.project.geographies.length<1){
                this.error+= this.$t('proyectTool.methodology.errorStart')+this.$t('prototype.create.form.locality')+this.$t('proyectTool.methodology.errorEnd')
                this.error+= '<br>'
                isError = true
                this.projectIndex = 1
            }
            return isError
        },
        async create(actionop){
            this.project.idStatus = this.state.value
            this.project.idInstitution =  this.institution.id
            if(actionop==1) this.goToIndex( this.projectIndex+1 )
            if(this.isNew){
                try {
                    let path = `${SERVICE_NAMES.PROJECTS}/proyect`
                    let response = await VAPI.post( path, this.project);
                    if (response.status == HTTP_STATUS.OK){
                        this.getOne(response.data)
                        if(this.actionop == 2 && this.projectIndex ==2){
                            this.error= this.$t( 'proyectTool.projects.create.partial' )
                        }
                        else{
                            this.error= this.$t( 'proyectTool.projects.create.saved' )
                            if(this.actionop==2)  this.error += '<br><br>' + this.$t( 'proyectTool.projects.create.later' )
                            else if(this.actionop==1)  this.error +=  '<br><br>' + this.$t( 'proyectTool.projects.create.continue' )
                        }
                        if(this.actionop==2 || this.actionop ==3)
                            this.showModal('errorEvent6')
                        else
                            this.showModal('errorEvent5')
                        //if(this.actionop==2 || this.actionop ==3) this.$router.push({name: 'ProyectToolProyectIndex'})
                        
                    }
                } catch (error) {
                    console.error("Fallo al salvar proyecto tipo", error);
                }
            }
            else{
                try {
                    let path = `${SERVICE_NAMES.PROJECTS}/proyect`
                    let response = await VAPI.put( path, this.project);
                    if (response.status == HTTP_STATUS.OK){
                        this.getOne(response.data)
                        this.error=  this.$t( 'proyectTool.projects.create.updated' ) 
                        if(this.actionop == 2 && this.projectIndex ==2){
                            this.error= this.$t( 'proyectTool.projects.create.partial' )
                        }
                        else{
                            this.error= this.$t( 'proyectTool.projects.create.saved' )
                            if(this.actionop==2)  this.error += '<br><br>' + this.$t( 'proyectTool.projects.create.later' )
                            else if(this.actionop==1)  this.error +=  '<br><br>' + this.$t( 'proyectTool.projects.create.continue' )
                        }
                        if(this.actionop==2 || this.actionop ==3)
                            this.showModal('errorEvent6')
                        else
                            this.showModal('errorEvent5')
                        //if(this.actionop==2 || this.actionop ==3) this.$router.push({name: 'ProyectToolProyectIndex'})
                    }
                } catch (error) {
                    console.error("Fallo al salvar proyecto tipo", error);
                }
            }
        },
        async getOne(id){
            this.pId = id
            
            try{
                let response = await VAPI.get(`${SERVICE_NAMES.PROJECTS}/proyect/one/${id}`);
                if(response.status == 200){
                    this.project= response.data;

                    this.oldState = this.project.idStatus
                    this.oldEnabled = this.project.enabled
                    this.state = {
                        label: this.project.statusName,
                        value: this.project.idStatus
                    }
                    console.log(this.state)
                    this.institution = {
                        name: this.project.institutionName,
                        id: this.project.idInstitution
                    }
                    if(this.project.images.length>0){
                        this.selectImage.index=0
                        this.selectImage.id=this.project.images[0].id
                        this.selectImage.url=this.project.images[0].url
                        this.selectImage.idType=this.project.images[0].idType
                        this.selectImage.principal=this.project.images[0].principal
                    }
                    this.announcementSel = JSON.parse(JSON.stringify(this.project.announcements))
                    this.procedureSel = JSON.parse(JSON.stringify(this.project.procedures))
                    this.productSel = JSON.parse(JSON.stringify(this.project.products))
                    this.fundingSel = JSON.parse(JSON.stringify(this.project.fundingSources))
                    this.oldModel = JSON.parse(JSON.stringify(this.project.ruralModels))
                    //if(this.project.ruralModels.length>0)
                    this.selectedQueryModel = this.project.ruralModels[0].id
                    var tagsArr = this.project.tags.split(",")
                    this.tags=tagsArr.map(tag => ({
                            text: tag
                    }));
                    window.scrollTo({
                    top: 100,
                    left: 0,
                    behavior: 'smooth'
                    })
                }
            }
            catch( error ) {
                console.log( 'Error fetching Project', error );
            }
        },
        redirect(){
            if(this.$route.params.id ==null && this.$route.params.id ==undefined) {
                this.$router.push({name: 'ProyectToolProyectAdmin', params: {id : this.pId, page: this.projectIndex}})
            }
        },
        redirect2(){
            this.$router.push({name: 'ProyectToolProyectIndex'})
        },
    },
}
</script>

<style lang="sass" scoped>
@import '../../../../stylesheets/style.sass'

.dot 
    height: 16px
    width: 16px
    border-radius: 50%
    display: inline-block

.feed-title
    position: relative
    display: inline-block
    color: #fff
    background: url(../../../../assets/title/barra_sola_6.png)
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
    a
        text-decoration: none
        color: #fff
.col-90
    width: 80%
    margin-left: auto
    margin-right: auto
    background: #fff

.state-grid
    display: grid
    grid-template-columns: 1fr 1fr
.enabled-grid
    display: grid
    grid-template-columns: 1fr
.wizard
    display: grid
    grid-template-columns: repeat(3,30%) 5%
    margin-top: 20px
    margin-bottom: 20px
    .item
        cursor: pointer
        height: 80px
        padding: 12px
        background:  #1554b0aa
        color: #fff
        position: relative
        margin-left: 46px
        transition: all .2s ease-in-out
        .text
            overflow: hidden
            text-overflow: ellipsis
        &:after
            transition: all .2s ease-in-out
            content: ''
            position: absolute
            left: 100%
            top: 0
            width: 0
            height: 0
            border-top: 40px solid transparent
            border-bottom: 40px solid transparent
            border-left: 40px solid #1554b0aa
            clear: both
        &:before
            transition: all .2s ease-in-out
            content: ""
            position: absolute
            top: 0
            right: 100%
            border-top: 40px solid #1554b0aa
            border-bottom: 40px solid #1554b0aa
            border-left: 40px solid transparent
            border-right: 1px solid #1554b0aa
        &:nth-of-type(1)
            &:before
                content: ""
                position: absolute
                top: 0
                right: 100%
                border-top: 40px solid #1554b0aa
                border-bottom: 40px solid #1554b0aa
                border-left: 40px solid #1554b0aa
                border-right: 1px solid #1554b0aa
        &:hover
            transform: scale(0.95)

    .focus
        background:  #1554b0 !important
        transform: scale(0.95)
        &:after
            border-left: 40px solid #1554b0 !important
        &:before
            border-top: 40px solid #1554b0 !important
            border-bottom: 40px solid #1554b0 !important
            border-right: 1px solid #1554b0 !important
        &:nth-of-type(1)
            &:before
                border-top: 40px solid #1554b0 !important
                border-bottom: 40px solid #1554b0 !important
                border-left: 40px solid #1554b0 !important
                border-right: 1px solid #1554b0 !important
.activeSlide
  box-shadow: 0px 0px 5px #333
.divE
    padding-left: 15px
    .carrousel
      display: grid
      grid-template-columns: 1fr
      grid-gap: 15px
    .bigOne
      height: 315px
      width: 560px
      text-align: center
      margin-left: auto
      margin-right: auto
      overflow: hidden
      div
        height: 315px
        width: 560px
        img
          height: 100%
        iframe
          height: 100%
          width: 100%
    .scroll
      display: grid
      grid-auto-flow: column
      align-content: center
      grid-gap: 15px
      height: 200px
      width: 80%
      overflow: hidden
      scroll-behavior: smooth
      margin-left: auto
      margin-right: auto
      .slide
        padding: 0
        height: 150px
        width: 250px
        margin-left: auto
        margin-right: auto
        background-color: #ccc
        cursor: pointer
        img
          height: 100%
          width: 100%
    .carrouselOptions
       display: grid
       grid-template-columns: 1fr 3fr 1fr
       div
        button
          color: #6c757d
          background-color: #fff
          border: 1px solid #dee2e6
       div:nth-child(1)
          text-align: left
       div:nth-child(2)
          text-align: center
          display: grid
          grid-template-columns: 1fr 1fr
          div:nth-child(1)
            text-align: right
            button
              height: 100%
              cursor: pointer
          div:nth-child(2)
            text-align: left
          button
            margin-left: 5px
            color: #6c757d
            background-color: #fff
            border: none
       div:nth-child(3)
          text-align: right
    
</style>