<template>
    <div>
        <div class="feed-title">{{$t( 'proyectTool.projects.title' )}}</div>
        <div class="col-90 container-form" v-if="project != null">
            <div>
                <span v-html="getStatus(project)+getEnabled(project)" v-if="isAdministrator"></span><span v-if="currentUser != null"><sipsder-btn btnType="edit_pen" :text="$t( 'proyectTool.projects.detail.edit' )" v-if="onlyAdmin || project.idUser === currentUser.id" style="float: right;" @onClick="$router.push({ name: 'ProyectToolProyectAdmin', params:{id: project.id}})"></sipsder-btn></span><br> 
                <div ><h2><b>{{project.name}}</b></h2></div>
                <br>
                <div><b>{{$t( 'library.visor.addFor' )}}</b>&nbsp; <i class="fas fa-user"></i> {{project.userName}} {{project.userLastName}}, {{project.userType}}</div>
                <div><b>{{$t( 'proyectTool.projects.create.creationDate' )}}</b>&nbsp; {{project.creationDateT| moment("DD MMM YYYY - h:mm a")}}</div>
                <br><br>
            </div>
           <div class="grid-image">
               <div class="gallery" v-if="project.images[imageI] != undefined">
                   <div class="image" :style="{'border-color': project.ruralModels[0].color, 'border-style': 'solid','border-width': '7px' }">
                        <div class="buttons" :class="{'disabled': imageI == 0}" @click="goLeft">
                            <i class="fas fa-caret-left"></i>
                        </div>
                        <div v-if="project.images[imageI].idType==3">
                            <iframe  :src="project.images[imageI].url" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                        </div>
                        <div v-else>
                            <img :src="getImgURL(project.images[imageI].url)">
                        </div>
                        <div class="buttons" :class="{'disabled': imageI == project.images.length-1}" @click="goRight">
                            <i class="fas fa-caret-right"></i>
                        </div>
                   </div>
                   <span>
                       <b>{{project.images[imageI].name}}</b><br>
                       {{$t( 'proyectTool.projects.detail.author' )}}: {{project.images[imageI].user}}
                   </span>
                   <div class="colors-container" >
                        <div class="colors" v-for="(r, j) in project.ruralModels" :key="j"
                            :style="{'background-color': r.color}" v-b-tooltip.hover :title="r.name">
                        </div>
                    </div>  
               </div>
               <div class="summary">{{project.summary}}</div>
           </div>
           <br><br>
           <div class="box">
                <social-networks-share ></social-networks-share>
                <report-component :contentId="project.id" :content-type="REPORT_CONTENT_TYPES.PROJECTS"></report-component>
                <div v-if="isLogged">
                    <print-component >
                        <div>
                            <span v-html="getStatus(project)+getEnabled(project)" v-if="isAdministrator"></span><span v-if="currentUser != null"><sipsder-btn btnType="edit_pen" :text="$t( 'proyectTool.projects.detail.edit' )" v-if="onlyAdmin || project.idUser === currentUser.id" style="float: right;" @onClick="$router.push({ name: 'ProyectToolProyectAdmin', params:{id: project.id}})"></sipsder-btn></span><br> 
                            <div ><h2><b>{{project.name}}</b></h2></div>
                            <br>
                            <div><b>{{$t( 'library.visor.addFor' )}}</b>&nbsp; <i class="fas fa-user"></i> {{project.userName}} {{project.userLastName}}, {{project.userType}}</div>
                            <br><br>
                        </div>
                        <div class="grid-image">
                            <div class="gallery" v-if="project.images[imageI] != undefined">
                                <div class="image" :style="{'border-color': project.ruralModels[0].color, 'border-style': 'solid','border-width': '7px' }">
                                        <div class="buttons" :class="{'disabled': imageI == 0}" @click="goLeft">
                                            <i class="fas fa-caret-left"></i>
                                        </div>
                                        <div v-if="project.images[imageI].idType==3">
                                            <iframe  :src="project.images[imageI].url" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                                        </div>
                                        <div v-else>
                                            <img :src="getImgURL(project.images[imageI].url)">
                                        </div>
                                        <div class="buttons" :class="{'disabled': imageI == project.images.length-1}" @click="goRight">
                                            <i class="fas fa-caret-right"></i>
                                        </div>
                                </div>
                                <span>
                                    <b>{{project.images[imageI].name}}</b><br>
                                    {{$t( 'proyectTool.projects.detail.author' )}}: {{project.images[imageI].user}}
                                </span>
                                <div class="colors-container" >
                                        <div class="colors" v-for="(r, j) in project.ruralModels" :key="j"
                                            :style="{'background-color': r.color}" v-b-tooltip.hover :title="r.name">
                                        </div>
                                    </div>  
                            </div>
                            <div class="summary">{{project.summary}}</div>
                        </div>
                        <br><br>
                        <div class="box">
                                <social-networks-share ></social-networks-share>
                                <report-component :contentId="project.id" :content-type="REPORT_CONTENT_TYPES.PROJECTS"></report-component>
                                <score-component :idContent="project.id" :idType="SCORE_CONTENT_TYPE.PROJECTS" :likes="project.likes" :dislikes="project.dislikes"></score-component>
                            </div>
                            <br><br>
                            <div class="tabs">
                                <div class="A">
                                    <div class="tab-design" :class="{active : tabIndex==0 }" @click="setTabIndex(0)"><div><span>{{$t( 'proyectTool.projects.detail.description' )}}</span></div></div>
                                    <div class="tab-design" :class="{active : tabIndex==1 }" @click="setTabIndex(1)"><div><span>{{$t( 'proyectTool.projects.detail.time' )}}</span></div></div>
                                    <div class="tab-design" :class="{active : tabIndex==2 }" @click="setTabIndex(2)"><div><span>{{$t( 'proyectTool.projects.detail.resources' )}}</span></div></div>
                                    <div class="tab-design" :class="{active : tabIndex==3 }" @click="setTabIndex(3)"><div><span>{{$t( 'proyectTool.projects.detail.localization' )}}</span></div></div>
                                    <div class="tab-design" :class="{active : tabIndex==4 }" @click="setTabIndex(4)"><div><span>{{$t( 'proyectTool.projects.detail.otherTopics' )}}</span></div></div>
                                </div>
                                <div v-if="tabIndex==0" class="B">
                                    <div class="scroll">
                                        <rich-text-preview class="description" :content="project.description" />
                                    </div>
                                </div>
                                <div v-if="tabIndex==1" class="B">
                                    <div class="scroll">
                                        <rich-text-preview class="description" :content="project.time" />
                                    </div>
                                </div>
                                <div v-if="tabIndex==2" class="B">
                                    <div class="scroll">
                                        <rich-text-preview class="description" :content="project.resources" />
                                    </div>
                                </div>
                                <div v-if="tabIndex==3" class="B">
                                    <div v-for="(loc, i) in project.geographies" :key="i">

                                        <ul>
                                            <li v-if="loc.typeParent == GEOGRAPHY_TYPE.LOCALIDAD"><b>{{$t('prototype.create.form.locality')}}:</b> {{loc.nameParent}} - <b>{{$t('prototype.create.form.sub_locality')}}:</b> {{loc.name}}</li>
                                            <li><b>{{$t('prototype.create.form.locality')}}:</b> {{loc.name}} - <b>{{$t('prototype.create.form.sub_locality')}}:</b> {{$t( 'proyectTool.projects.detail.all' )}}</li>
                                        </ul>
                                    </div>
                                </div>
                                <div v-if="tabIndex==4" class="B">
                                    <div class="stories" v-if="this.stories.length>0">
                                        <div class="button">
                                            <sipsder-btn btnType="add" :text="$t('proyectTool.projects.detail.addStory')" v-if="isLogged"  style="float: right;" @onClick="$router.push({ name: 'CommunityStoryCreate'})"></sipsder-btn>
                                            <sipsder-btn btnType="add" :text="$t('proyectTool.projects.detail.addStory')" v-else v-b-tooltip.hover :title="$t('prototype.detail.log_in')"   style="float: right;"></sipsder-btn>
                                        </div>
                                        <div class="title">{{$t('proyectTool.projects.detail.stories')}}</div>
                                        <br>
                                        <div class="lists">
                                            <div class="mosaic">
                                                <div v-for="(story, i) in stories" :key="i" class="story">
                                                    <div class="img" v-if="story.attachmentType=='Video'">
                                                        <img :src="getYTvideoCode(story.attachment)" alt="">
                                                    </div>
                                                    <div class="img" v-else>
                                                        <img :src="getImgURL(story.attachment)" alt="">
                                                    </div>
                                                    <div>
                                                        <i class="fas fa-user"></i> {{story.userName}} <br>
                                                        {{story.name}}<br>
                                                        <router-link :to="{ name: 'CommunityStoryDetail', params: { id: story.encryptedId }}">{{$t('proyectTool.projects.detail.see')}}</router-link>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="links">
                                                <div class="image-big">
                                                    <img src="../../../assets/historia.png" alt=""><br>
                                                    <router-link :to="{name:'CommunityStoryIndex', query:{idProject: project.idNoH }}">
                                                        {{$t('proyectTool.projects.detail.seeMore')}}
                                                    </router-link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="stories" v-else>
                                        <div class="button">
                                            <sipsder-btn btnType="add" :text="$t('proyectTool.projects.detail.addStory')" v-if="isLogged"  style="float: right;" @onClick="$router.push({ name: 'CommunityStoryCreate'})"></sipsder-btn>
                                            <sipsder-btn btnType="add" :text="$t('proyectTool.projects.detail.addStory')" v-else  v-b-tooltip.hover :title="$t('prototype.detail.log_in')"   style="float: right;" ></sipsder-btn>
                                        </div>
                                        <div class="noStory">
                                            {{$t('proyectTool.projects.detail.noStory')}}
                                            <div class="links">
                                                <div class="image-small">
                                                    <img src="../../../assets/historia.png" alt="">
                                                    <router-link :to="{name:'CommunityStoryIndex', query:{idProject: project.idNoH }}">
                                                        {{$t('proyectTool.projects.detail.moreStory')}}
                                                    </router-link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="collapse-bar">
                                        <div class="collapse-title collapse-title1" @click="toogleCollapsedBar1">{{ $t('proyectTool.projects.detail.announcement')}}</div>
                                        <div class="collapse-button" @click="toogleCollapsedBar1"><i v-if="!collapsedBar1" class="fas fa-angle-down"></i><i v-else class="fas fa-angle-right"></i></div>
                                        <div class="collapse-body" v-if="!collapsedBar1">
                                            <div class="no-legend" v-if="project.announcements.length <1">
                                                {{$t('proyectTool.projects.detail.no_announcement')}}
                                            </div>
                                            <div class="no-legend" v-else v-for="(announ, i) in project.announcements" :key="i">
                                                <b>{{announ.name}}</b>
                                            </div>
                                            <div style="text-align: right;padding: 20px" v-if="project.announcements.length>=1">
                                                <router-link :to="{ name: 'ProyectToolAnnouncementIndex' }">{{$t('proyectTool.projects.detail.more_announcement')}}</router-link>                  
                                            </div>
                                        </div>
                                    </div>
                                    <div class="collapse-bar">
                                        <div class="collapse-title collapse-title2" @click="toogleCollapsedBar2">{{$t('proyectTool.projects.detail.fundingSource')}}</div>
                                        <div class="collapse-button" @click="toogleCollapsedBar2"><i v-if="!collapsedBar2" class="fas fa-angle-down"></i><i v-else class="fas fa-angle-right"></i></div>
                                        <div class="collapse-body" v-if="!collapsedBar2">
                                            <div class="no-legend" v-if="project.fundingSources.length <1">
                                                {{$t('proyectTool.projects.detail.no_fundingSource')}}
                                            </div>
                                            <div class="no-legend" v-else v-for="(funding, i) in project.fundingSources" :key="i">
                                                <b>{{funding.name}}</b>
                                            </div>
                                            <div style="text-align: right;padding: 20px" v-if="project.fundingSources.length>=1">
                                                <router-link :to="{ name: 'ProyectToolFundingSource' }">{{ $t('proyectTool.projects.detail.more_fundingSource') }}</router-link>                  
                                            </div>
                                        </div>
                                    </div>
                                    <div class="collapse-bar">
                                        <div class="collapse-title collapse-title1" @click="toogleCollapsedBar3">{{ $t('proyectTool.projects.detail.procedure') }}</div>
                                        <div class="collapse-button" @click="toogleCollapsedBar3"><i v-if="!collapsedBar3" class="fas fa-angle-down"></i><i v-else class="fas fa-angle-right"></i></div>
                                        <div class="collapse-body" v-if="!collapsedBar3">
                                            <div class="no-legend" v-if="project.procedures.length <1">
                                                {{ $t('proyectTool.projects.detail.no_procedure') }}
                                            </div>
                                            <div class="no-legend" v-else v-for="(procedure, i) in project.procedures" :key="i">
                                                <b>{{procedure.name}}</b>
                                            </div>
                                            <div style="text-align: right;padding: 20px" v-if="project.procedures.length>=1">
                                                <router-link :to="{ name: 'ProcedureIndex' }">{{ $t('proyectTool.projects.detail.more_procedure') }}</router-link>                  
                                            </div>
                                        </div>
                                    </div>
                                    <div class="collapse-bar">
                                        <div class="collapse-title collapse-title2" @click="toogleCollapsedBar4">{{ $t('proyectTool.projects.detail.products') }}</div>
                                        <div class="collapse-button" @click="toogleCollapsedBar4"><i v-if="!collapsedBar4" class="fas fa-angle-down"></i><i v-else class="fas fa-angle-right"></i></div>
                                        <div class="collapse-body" v-if="!collapsedBar4">
                                            <div class="no-legend" v-if="project.products.length <1">
                                                {{ $t('proyectTool.projects.detail.no_products') }}
                                            </div>
                                            <div class="no-legend" v-else v-for="(product, i) in project.products" :key="i">
                                                <b>{{product.name}}</b> - {{product.type}}
                                            </div>
                                        </div>
                                    </div>
                                    <div class="collapse-bar">
                                        <div class="collapse-title collapse-title1" @click="toogleCollapsedBar5">{{ $t('rural_model.detail.links') }}</div>
                                        <div class="collapse-button" @click="toogleCollapsedBar5"><i v-if="!collapsedBar3" class="fas fa-angle-down"></i><i v-else class="fas fa-angle-right"></i></div>
                                        <div class="collapse-body" v-if="!collapsedBar5">
                                            <div v-if="links != null || links.length > 0 || actionLink==false " >
                                                <div v-for="(link,i) in links" :key="i" >

                                                    <div v-if="!isAdministrator">
                                                        <div class="no-legend">
                                                            <span><i class="fas fa-globe-americas"></i>&nbsp; <a :href="link.url" v-b-tooltip.hover :title="link.description">{{link.name}}</a></span> <span> - {{link.description}}</span> 
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
                                            <div v-if="links == null || links.length == 0 || actionLink">
                                                <div class="no-legend"> <i class="fas fa-globe-americas"></i> &nbsp; {{ $t('rural_model.detail.no_links') }}</div>
                                            </div>
                                            <div v-if="isAdministrator && isLogged" style="text-align: right">
                                                <sipsder-btn :text="$t('rural_model.detail.new')" btnType="add" @onClick="newLink()" :disabled="links.length > 4"></sipsder-btn>
                                                <sipsder-btn :text="$t('button.save')" btnType="accept" :disabled="!withoutSave || isEditingLinks" @onClick="saveLink"></sipsder-btn> 

                                                <sipsder-btn btnType="export" text="" :disabled="selectLink == null  || selectLink == 0" @onClick="moveLink(selectLink, selectLink-1)"></sipsder-btn>
                                                <sipsder-btn btnType="download" text="" :disabled="selectLink == null  || selectLink == links.length -1 " @onClick="moveLink(selectLink, selectLink+1)"></sipsder-btn>
                                                <sipsder-btn btnType="delete" :text="$t('rural_model.detail.delete')" :disabled="selectLink == null" @onClick="deleteSelectedLink()"></sipsder-btn>
                                            </div> 
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <br>
                            <note-sipsder :module="MODULES.PROYECT_TOOL" :keyVal="'projects-detail'" :showEdition="onlyAdmin" :textPenEdition="$t( 'proyectTool.concepts.edit' )"></note-sipsder>
                            <br>
                            <div>
                                <s-comment :parentId="project.idNoH" typeParent="projects"></s-comment>
                            </div>
                            <div class="projects-carousel1" v-if="latestProjects.length>0">
                                <div class="grid-related">
                                    <div class="item-related" v-for="(relatedN,i) in latestProjects" :key="i">
                                        <div class="image-related" v-if="relatedN.attachment.typePrincipalAttachment== ATTACHMENT_TYPE.VIDEO">
                                            <img :style="{'border-color': relatedN.ruralModels[0].color, 'border-style': 'solid','border-width': '7px' }" :src="getYTvideoCode(relatedN.attachment)">
                                        </div>
                                        <div class="image-related" v-else>
                                            <img  :style="{'border-color': relatedN.ruralModels[0].color, 'border-style': 'solid','border-width': '7px' }" :src="getImgURL(relatedN.attachment.urlPrincipalAttachment)">
                                        </div>
                                        <div class="colors-container" >
                                            <div class="colors" v-for="(r, j) in relatedN.ruralModels" :key="j"
                                                :style="{'background-color': r.color}" v-b-tooltip.hover :title="r.name">
                                            </div>
                                        </div> 
                                        <div class="title-related"><router-link :to="{name: 'ProyectToolProyectDetail', params:{id: relatedN.id}}"><h2><b>{{relatedN.name}}</b></h2></router-link></div>
                                        <div class="description-related">{{relatedN.summary}}</div>
                                    </div>
                                </div>
                                <button class="previmg" @click="scroll_left()"><i class="fas fa-caret-left"></i></button>
                                <button class="nextimg" @click="scroll_right()"><i class="fas fa-caret-right"></i></button>
                            </div>
                            <div style="text-align: center;">
                                <sipsder-btn btnType="back" @onClick="$router.go(-1)"></sipsder-btn>
                                <sipsder-btn
                                    btnType="back"
                                    :text="$t('proyectTool.projects.detail.goIndex')"
                                    @onClick="$router.push({name: 'ProyectToolProyectIndex'})"
                                ></sipsder-btn>
                            </div>
                    </print-component >
                </div>
                <score-component :idContent="project.id" :idType="SCORE_CONTENT_TYPE.PROJECTS" :likes="project.likes" :dislikes="project.dislikes"></score-component>
            </div>
            <br><br>
            <div class="tabs">
                <div class="A">
                    <div class="tab-design" :class="{active : tabIndex==0 }" @click="setTabIndex(0)"><div><span>{{$t( 'proyectTool.projects.detail.description' )}}</span></div></div>
                    <div class="tab-design" :class="{active : tabIndex==1 }" @click="setTabIndex(1)"><div><span>{{$t( 'proyectTool.projects.detail.time' )}}</span></div></div>
                    <div class="tab-design" :class="{active : tabIndex==2 }" @click="setTabIndex(2)"><div><span>{{$t( 'proyectTool.projects.detail.resources' )}}</span></div></div>
                    <div class="tab-design" :class="{active : tabIndex==3 }" @click="setTabIndex(3)"><div><span>{{$t( 'proyectTool.projects.detail.localization' )}}</span></div></div>
                    <div class="tab-design" :class="{active : tabIndex==4 }" @click="setTabIndex(4)"><div><span>{{$t( 'proyectTool.projects.detail.otherTopics' )}}</span></div></div>
                </div>
                <div v-if="tabIndex==0" class="B">
                    <div class="scroll">
                        <rich-text-preview class="description" :content="project.description" />
                    </div>
                </div>
                <div v-if="tabIndex==1" class="B">
                    <div class="scroll">
                        <rich-text-preview class="description" :content="project.time" />
                    </div>
                </div>
                <div v-if="tabIndex==2" class="B">
                    <div class="scroll">
                        <rich-text-preview class="description" :content="project.resources" />
                    </div>
                </div>
                 <div v-if="tabIndex==3" class="B">
                    <div v-for="(loc, i) in project.geographies" :key="i">

                        <ul>
                            <li v-if="loc.typeParent == GEOGRAPHY_TYPE.LOCALIDAD"><b>{{$t('prototype.create.form.locality')}}:</b> {{loc.nameParent}} - <b>{{$t('prototype.create.form.sub_locality')}}:</b> {{loc.name}}</li>
                            <li v-else><b>{{$t('prototype.create.form.locality')}}:</b> {{loc.name}} - <b>{{$t('prototype.create.form.sub_locality')}}:</b> {{$t( 'proyectTool.projects.detail.all' )}}</li>
                        </ul>
                    </div>
                </div>
                 <div v-if="tabIndex==4" class="B">
                    <div class="stories" v-if="this.stories.length>0">
                        <div class="button">
                            <sipsder-btn btnType="add" :text="$t('proyectTool.projects.detail.addStory')" v-if="isLogged"  style="float: right;" @onClick="$router.push({ name: 'CommunityStoryCreate'})"></sipsder-btn>
                            <sipsder-btn btnType="add" :text="$t('proyectTool.projects.detail.addStory')" v-else v-b-tooltip.hover :title="$t('prototype.detail.log_in')"   style="float: right;"></sipsder-btn>
                        </div>
                        <div class="title">{{$t('proyectTool.projects.detail.stories')}}</div>
                        <br>
                        <div class="lists">
                            <div class="mosaic">
                                <div v-for="(story, i) in stories" :key="i" class="story">
                                    <div class="img" v-if="story.attachmentType=='Video'">
                                        <img :src="getYTvideoCode(story.attachment)" alt="">
                                    </div>
                                    <div class="img" v-else>
                                        <img :src="getImgURL(story.attachment)" alt="">
                                    </div>
                                    <div>
                                        <i class="fas fa-user"></i> {{story.userName}} <br>
                                        {{story.name}}<br>
                                        <router-link :to="{ name: 'CommunityStoryDetail', params: { id: story.encryptedId }}">{{$t('proyectTool.projects.detail.see')}}</router-link>
                                    </div>
                                </div>
                            </div>
                            <div class="links">
                                <div class="image-big">
                                    <img src="../../../assets/historia.png" alt=""><br>
                                    <router-link :to="{name:'CommunityStoryIndex', query:{idProject: project.idNoH }}">
                                        {{$t('proyectTool.projects.detail.seeMore')}}
                                    </router-link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="stories" v-else>
                        <div class="button">
                            <sipsder-btn btnType="add" :text="$t('proyectTool.projects.detail.addStory')" v-if="isLogged"  style="float: right;" @onClick="$router.push({ name: 'CommunityStoryCreate'})"></sipsder-btn>
                            <sipsder-btn btnType="add" :text="$t('proyectTool.projects.detail.addStory')" v-else  v-b-tooltip.hover :title="$t('prototype.detail.log_in')"   style="float: right;" ></sipsder-btn>
                        </div>
                        <div class="noStory">
                            {{$t('proyectTool.projects.detail.noStory')}}
                            <div class="links">
                                <div class="image-small">
                                    <img src="../../../assets/historia.png" alt="">
                                    <router-link :to="{name:'CommunityStoryIndex', query:{idProject: project.idNoH }}">
                                        {{$t('proyectTool.projects.detail.moreStory')}}
                                    </router-link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="collapse-bar">
                        <div class="collapse-title collapse-title1" @click="toogleCollapsedBar1">{{ $t('proyectTool.projects.detail.announcement')}}</div>
                        <div class="collapse-button" @click="toogleCollapsedBar1"><i v-if="!collapsedBar1" class="fas fa-angle-down"></i><i v-else class="fas fa-angle-right"></i></div>
                        <div class="collapse-body" v-if="!collapsedBar1">
                            <div class="no-legend" v-if="project.announcements.length <1">
                                {{$t('proyectTool.projects.detail.no_announcement')}}
                            </div>
                            <div class="no-legend" v-else v-for="(announ, i) in project.announcements" :key="i">
                                <b>{{announ.name}}</b>
                            </div>
                            <div style="text-align: right;padding: 20px" v-if="project.announcements.length>=1">
                                <router-link :to="{ name: 'ProyectToolAnnouncementIndex' }">{{$t('proyectTool.projects.detail.more_announcement')}}</router-link>                  
                            </div>
                        </div>
                    </div>
                    <div class="collapse-bar">
                        <div class="collapse-title collapse-title2" @click="toogleCollapsedBar2">{{$t('proyectTool.projects.detail.fundingSource')}}</div>
                        <div class="collapse-button" @click="toogleCollapsedBar2"><i v-if="!collapsedBar2" class="fas fa-angle-down"></i><i v-else class="fas fa-angle-right"></i></div>
                        <div class="collapse-body" v-if="!collapsedBar2">
                            <div class="no-legend" v-if="project.fundingSources.length <1">
                                {{$t('proyectTool.projects.detail.no_fundingSource')}}
                            </div>
                            <div class="no-legend" v-else v-for="(funding, i) in project.fundingSources" :key="i">
                                <b>{{funding.name}}</b>
                            </div>
                            <div style="text-align: right;padding: 20px" v-if="project.fundingSources.length>=1">
                                <router-link :to="{ name: 'ProyectToolFundingSource' }">{{ $t('proyectTool.projects.detail.more_fundingSource') }}</router-link>                  
                            </div>
                        </div>
                    </div>
                    <div class="collapse-bar">
                        <div class="collapse-title collapse-title1" @click="toogleCollapsedBar3">{{ $t('proyectTool.projects.detail.procedure') }}</div>
                        <div class="collapse-button" @click="toogleCollapsedBar3"><i v-if="!collapsedBar3" class="fas fa-angle-down"></i><i v-else class="fas fa-angle-right"></i></div>
                        <div class="collapse-body" v-if="!collapsedBar3">
                            <div class="no-legend" v-if="project.procedures.length <1">
                                {{ $t('proyectTool.projects.detail.no_procedure') }}
                            </div>
                            <div class="no-legend" v-else v-for="(procedure, i) in project.procedures" :key="i">
                                <b>{{procedure.name}}</b>
                            </div>
                            <div style="text-align: right;padding: 20px" v-if="project.procedures.length>=1">
                                <router-link :to="{ name: 'ProcedureIndex' }">{{ $t('proyectTool.projects.detail.more_procedure') }}</router-link>                  
                            </div>
                        </div>
                    </div>
                    <div class="collapse-bar">
                        <div class="collapse-title collapse-title2" @click="toogleCollapsedBar4">{{ $t('proyectTool.projects.detail.products') }}</div>
                        <div class="collapse-button" @click="toogleCollapsedBar4"><i v-if="!collapsedBar4" class="fas fa-angle-down"></i><i v-else class="fas fa-angle-right"></i></div>
                        <div class="collapse-body" v-if="!collapsedBar4">
                            <div class="no-legend" v-if="project.products.length <1">
                                {{ $t('proyectTool.projects.detail.no_products') }}
                            </div>
                            <div class="no-legend" v-else v-for="(product, i) in project.products" :key="i">
                                <b>{{product.name}}</b> - {{product.type}}
                            </div>
                        </div>
                    </div>
                    <div class="collapse-bar">
                        <div class="collapse-title collapse-title1" @click="toogleCollapsedBar5">{{ $t('proyectTool.projects.detail.links') }}</div>
                        <div class="collapse-button" @click="toogleCollapsedBar5"><i v-if="!collapsedBar3" class="fas fa-angle-down"></i><i v-else class="fas fa-angle-right"></i></div>
                        <div class="collapse-body" v-if="!collapsedBar5">
                            <div v-if="links != null || links.length > 0 || actionLink==false " >
                                <div v-for="(link,i) in links" :key="i" >

                                    <div v-if="!isAdministrator">
                                        <div class="no-legend">
                                            <span><i class="fas fa-globe-americas"></i>&nbsp; <a :href="link.url" v-b-tooltip.hover :title="link.description">{{link.name}}</a></span> <span> - {{link.description}}</span> 
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
                            <div v-if="links == null || links.length == 0 || actionLink">
                                <div class="no-legend"> <i class="fas fa-globe-americas"></i> &nbsp; {{ $t('proyectTool.projects.detail.no_links') }}</div>
                            </div>
                            <div v-if="isAdministrator && isLogged" style="text-align: right">
                                <sipsder-btn :text="$t('rural_model.detail.new')" btnType="add" @onClick="newLink()" :disabled="links.length > 4"></sipsder-btn>
                                <sipsder-btn :text="$t('button.save')" btnType="accept" :disabled="!withoutSave || isEditingLinks" @onClick="saveLink"></sipsder-btn> 

                                <sipsder-btn btnType="export" text="" :disabled="selectLink == null  || selectLink == 0" @onClick="moveLink(selectLink, selectLink-1)"></sipsder-btn>
                                <sipsder-btn btnType="download" text="" :disabled="selectLink == null  || selectLink == links.length -1 " @onClick="moveLink(selectLink, selectLink+1)"></sipsder-btn>
                                <sipsder-btn btnType="delete" :text="$t('rural_model.detail.delete')" :disabled="selectLink == null" @onClick="deleteSelectedLink()"></sipsder-btn>
                            </div> 
                        </div>
                    </div>
                </div>
            </div>
            <br>
            <note-sipsder :module="MODULES.PROYECT_TOOL" :keyVal="'projects-detail'" :showEdition="onlyAdmin" :textPenEdition="$t( 'proyectTool.concepts.edit' )"></note-sipsder>
            <br>
            <div>
                <s-comment :parentId="project.idNoH" typeParent="projects"></s-comment>
            </div>
            <div class="projects-carousel" >
                <div class="grid-related">
                    <div class="item-related" v-for="(relatedN,i) in latestProjects" :key="i">
                        <div v-if="relatedN.attachment != undefined">
                            <div class="image-related" v-if="relatedN.attachment.typePrincipalAttachment== ATTACHMENT_TYPE.VIDEO">
                                <img :style="{'border-color': relatedN.ruralModels[0].color, 'border-style': 'solid','border-width': '7px' }" :src="getYTvideoCode(relatedN.attachment)">
                            </div>
                            <div class="image-related" v-else>
                                <img  :style="{'border-color': relatedN.ruralModels[0].color, 'border-style': 'solid','border-width': '7px' }" :src="getImgURL(relatedN.attachment.urlPrincipalAttachment)">
                            </div>
                            <div class="colors-container" >
                                <div class="colors" v-for="(r, j) in relatedN.ruralModels" :key="j"
                                    :style="{'background-color': r.color}" v-b-tooltip.hover :title="r.name">
                                </div>
                            </div> 
                            <div class="title-related"><router-link :to="{name: 'ProyectToolProyectDetail', params:{id: relatedN.id}}"><h2><b>{{relatedN.name}}</b></h2></router-link></div>
                            <div class="description-related">{{relatedN.summary}}</div>
                        </div>
                        
                    </div>
                </div>
                <button class="previmg" @click="scroll_left()"><i class="fas fa-caret-left"></i></button>
                <button class="nextimg" @click="scroll_right()"><i class="fas fa-caret-right"></i></button>
            </div>
            <div style="text-align: center;">
                <sipsder-btn btnType="back" @onClick="$router.go(-1)"></sipsder-btn>
                <sipsder-btn
                    btnType="back"
                    :text="$t('proyectTool.projects.detail.goIndex')"
                    @onClick="$router.push({name: 'ProyectToolProyectIndex'})"
                ></sipsder-btn>
            </div>
        </div>
    </div>
</template>

<script>
import VAPI from '../../../http_common';
import NoteRichText from '../../shared/editableMessages/NoteRichText.vue'
import RichTextPreview from "../../shared/RichTextPreview";
import { SERVICE_NAMES,HTTP_STATUS, SCORE_CONTENT_TYPE, REPORT_CONTENT_TYPES} from '../../../sipsder_constants';
import {GEOGRAPHY_TYPE, PERMISSIONS_TYPES, FUNDING_SOURCE_TYPE,  MODULES, ATTACHMENT_TYPE, RURALMODEL} from '../../../domain_constants'
import SocialNetworksShare from '../../shared/social_networks_share/SocialNetworksShare.vue';
import ReportComponent from '../../shared/ReportComponent.vue';
import ScoreComponent from '../../shared/ScoreComponent.vue';
import PrintComponent from "../../shared/PrintComponent";
import CommentCmp from "../../shared/comment/CommentComponent.vue"
import S_UTIL from "../../../util/sipsder_util";
export default {
    components:{
        'note-sipsder':NoteRichText,
        RichTextPreview,
        SocialNetworksShare,
        ReportComponent,
        ScoreComponent,
        "s-comment" : CommentCmp,
        PrintComponent,
    },
    data() {
        return {
            ATTACHMENT_TYPE,
            MODULES,
            GEOGRAPHY_TYPE,
            SCORE_CONTENT_TYPE,
            REPORT_CONTENT_TYPES,
            project: null,
            links: [],
            selectLink: null,
            actionLink: false,
            linkAux:{
                name: '',
                url: '',
                description: ''
            },
            isEdit2:{
                link1:false,
                link2:false,
                link3:false,
                link4:false,
                link5:false
            },
            withoutSave: false,
            isEditingLinks: false,
            latestProjects: [],
            stories: [],
            imageI: 0,
            tabIndex: 0,
            collapsedBar1: true,
            collapsedBar2: true,
            collapsedBar3: true,
            collapsedBar4: true,
            collapsedBar5: true,
        }
    },
    async beforeMount() {
        if(this.$route.params.id !==null && this.$route.params.id !==undefined ){
            let id = this.$route.params.id
            try {
                let response = await VAPI.get(`${SERVICE_NAMES.PROJECTS}/proyect/detail/${id}`);
                if(response.status == 200){
                    this.project= response.data;
                    if(this.project.idStatus == 4) this.$router.push({name: 'ProyectToolProyectIndex'})
                }
            } catch (error) {
                console.log( 'Error fetching Projects', error );
            }
            try{
                let ur = 0
                if(this.onlyAdmin) ur = 0
                else if( this.isAdministrator) ur = 3
                else ur = 2
                let response = await VAPI.get(`${SERVICE_NAMES.PROJECTS}/proyect?page=0&size=12&status=1&enabled=true&onlyUser=false&user=false&ur=${ur}&sort=lastModifiedDate,desc`);
                if(response.status == 200){
                    this.latestProjects= response.data.data;
                }
            }
            catch( error ) {
                console.log( 'Error fetching Projects', error );
            }
            try {
                const response2 = await VAPI.get(`/${SERVICE_NAMES.LINK}/project/${id}`)
                this.links =  response2.data.data
            } catch (error) {
                console.log( 'Error fetching Links', error );
            }
            try {
                const response2 = await VAPI.get(`/${SERVICE_NAMES.STORY}?orderBy=date,desc&page=0&size=4&project=${this.project.idNoH}`)
                if( response2.data.data != undefined ) this.stories =  response2.data.data
            } catch (error) {
                console.log( 'Error fetching Links', error );
            }
        }
        else{
            this.$router.push({name: 'ProyectToolProyectIndex'})
        }

    },
    computed:{
        isAdministrator() {   
            return this.$store.getters.isAuthenticated && (this.$store.getters.hasPermission( PERMISSIONS_TYPES.ADMIN ) ||this.$store.getters.hasPermission( PERMISSIONS_TYPES.CONTROL ));
        },
        onlyAdmin(){
            return this.$store.getters.isAuthenticated && this.$store.getters.hasPermission( PERMISSIONS_TYPES.ADMIN )
        },
        institutions(){
             return this.$store.getters.getInstitutionsF
        },
        isLogged(){
            return this.$store.getters.isAuthenticated
        },
        currentUser(){
            return this.$store.state.session.currentUser
        }
    },
    methods: {
        getImgURL (url) {
            return S_UTIL.getImgURL(url);
        },
        goLeft(){
            if((this.imageI - 1) <0){
            }
            else{
                this.imageI-- 
            }
        },
        goRight(){
             if((this.imageI + 1) > this.project.images.length-1){
            }
            else{
                this.imageI++
            }
        },
        setTabIndex(e){
            this.tabIndex = e
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
        toogleCollapsedBar4(){
            this.collapsedBar4 = !this.collapsedBar4
        },
        toogleCollapsedBar5(){
            this.collapsedBar5 = !this.collapsedBar5
        },
        getYTvideoCode(item){
            let url =""
            if(item.typePrincipalAttachment == ATTACHMENT_TYPE.VIDEO){
                if(item.urlPrincipalAttachment.search("youtube")>0) {
                    url= item.urlPrincipalAttachment
                    var res = url.split("/")
                    var rel = res[4].split("?")
                    return "https://img.youtube.com/vi/"+rel[0]+"/hqdefault.jpg"
                } 
            }
            else{
                return this.getImgURL(item.urlPrincipalAttachment)
            }
        },
        getStatus(announcement){
            if(announcement.idStatus == 1){
                return "<span style='color: #5a5; font-weight: bold;'>"+this.$t( 'proyectTool.announcement.create.publish' ).toUpperCase()+"</span>"
            }
            else if(announcement.idStatus == 2){
                return "<span style='color: #e35; font-weight: bold;'>"+this.$t( 'proyectTool.announcement.create.refused' ).toUpperCase()+"</span>"
            }
            else if(announcement.idStatus == 3){
                return "<span style='color: #ea3; font-weight: bold;'>"+this.$t( 'proyectTool.announcement.create.waiting' ).toUpperCase()+"</span>"
            }
            else if(announcement.idStatus == 4){
                return "<span style='color: #00f; font-weight: bold;'>"+this.$t( 'proyectTool.announcement.create.editing' ).toUpperCase()+"</span>"
            }
            else{
                return ""
            }
        },
        getEnabled(announcement){
            if(announcement.enabled == true){
                return "<span style='color: #5a5; font-weight: bold;'>-"+this.$t( 'proyectTool.announcement.enabled' ).toUpperCase()+"</span>"
            }
            else if(announcement.enabled == false){
                return "<span style='color: #e35; font-weight: bold;'>-"+this.$t( 'proyectTool.announcement.disabled' ).toUpperCase()+"</span>"
            }
            else{
                return ""
            }
        },
        newLink(){
            var p = this.links.length
            this.links.push({
                id:null,
                name: '',
                description: '',
                url: '',
                action: 4,
                ruralId: this.project.id,
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
            var auxPriority = this.links[newI].priority
            this.links[newI].priority = this.links[i].priority
            this.links[i].priority =  auxPriority
            if(this.links[newI].action == 0){
                this.links[newI].action = 2
            }
            if(this.links[i].action == 0 ){
                this.links[i].action = 2
            }
            this.links.move(i,newI)
            this.selectLink = newI
            this.isEdit2['link'+(newI+1)] = this.isEdit2['link'+(i+1)]
            this.isEdit2['link'+(i+1)] = false
            this.withoutSave = true
        },
        editLink(i){
            this.linkAux.name =  this.links[i].name
            this.linkAux.url =  this.links[i].url
            this.linkAux.description =  this.links[i].description
            this.isEdit2['link'+(i+1)]=!this.isEdit2['link'+(i+1)]
            this.isEditingLinks = true
        },
        acceptEditLink(i){
            var validate = true
            var validateMessage = ''
            if(this.links[i].url =='' || this.links[i].url  == null ){
                validate = false
                validateMessage = this.$t('rural_model.detail.error_url')+'<br>';
            }
            if(this.links[i].url.indexOf("http://") == -1 && this.links[i].url.indexOf("https://") == -1  ){
                
                this.links[i].url= 'https://'+this.links[i].url

            }
                    
            if(this.links[i].name =='' || this.links[i].name  == null ){
                validate = false
                validateMessage = this.$t('rural_model.detail.error_name')+'<br>';
            }
            if(this.links[i].description =='' || this.links[i].description  == null ){
                validate = false
                validateMessage = this.$t('rural_model.detail.error_description')+'<br>';
            }
            if(this.links[i].url.length > 800){
                validate = false
                validateMessage += this.$t('rural_model.detail.error_url_length')+'<br>';
            }
            if(this.links[i].name.length > 180){
                validate = false
                validateMessage += this.$t('rural_model.detail.error_name_length')+'<br>';
            }
            if(this.links[i].description.length > 280){
                validate = false
                validateMessage += this.$t('rural_model.detail.error_description_length')+'<br>';
            }
            if(validate){
                if(this.links[i].id != null) this.links[i].action = 2
                else this.links[i].action = 1
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
            if(this.links[index].action === 4){
                this.selectLink = index;
                this.deleteSelectedLink()
            }
            else{
                this.links[index].name = this.linkAux.name
                this.links[index].url = this.linkAux.url
                this.links[index].description = this.linkAux.description 
                this.isEdit2['link'+(index+1)]=!this.isEdit2['link'+(index+1)]
                this.isEditingLinks = false
            }
        },
        deleteSelectedLink(){
            for(var i= this.selectLink ; i < this.links.length -1 ; i++){
                this.moveLink(i , i+1)
            }
            if(this.links[this.selectLink].action!=4 || this.withoutSave)
                this.withoutSave = true
            if(this.links[this.selectLink].action==1 || this.links[this.selectLink].action==4 ){
                for(var i = this.selectLink+1 ; i < this.links.length; i++ ){
                        this.links[i].priority= i-1
                }
                this.links.splice(this.selectLink, 1)
            }
            else if(this.links[this.selectLink].action== 0 || this.links[this.selectLink].action== 2){
                    for(var i = this.selectLink+1 ; i < this.links.length; i++ ){
                        this.links[i].priority= i-1
                }
                this.links[this.selectLink].action = 3
            }

            this.selectLink= null
            
            
            this.getActionLink()
            this.saveLink()
        },
        getActionLink(){
            var action = true
            this.links.forEach(link=>{
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
                linkList: this.links
            }
            const response = await VAPI.post(`/${SERVICE_NAMES.LINK}/project/save` , linkList);
            const response2 = await VAPI.get(`/${SERVICE_NAMES.LINK}/project/${this.project.id}`);
            this.links=response2.data.data
            this.withoutSave = false
            this.selectLink= null
        },
        scroll_left() {
            let content = document.querySelector(".projects-carousel>.grid-related");
            content.scrollLeft -= 400;
        },
        scroll_right() {
            let content = document.querySelector(".projects-carousel>.grid-related");
            content.scrollLeft += 400;
        },
    },
}
</script>

<style lang="sass" scoped>
@import '../../../stylesheets/style.sass'
$padding-const: 15px
$padding-offset: 60px
.dot 
    height: 16px
    width: 16px
    border-radius: 50%
    display: inline-block

.feed-title
    position: relative
    display: inline-block
    color: #fff
    background: url(../../../assets/title/barra_sola_6.png)
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
.colors-container
    float: right
    height: 30px
    .colors
        margin: 5px 0 0 5px
        width: 25px
        height: 25px
        border-radius: 50%
        float: left
.tabs
    display: grid
    grid-template-columns: 1fr
    grid-template-rows: 50px auto
    height: 700px
    .A
        margin-left: 15px
        display: inline-flex
    .B
        margin-top: -10px
        background: #fff
        box-shadow: 0px 0px 3px #555
        border-radius: 3px
        z-index: 3
        padding: 20px
        height: 600px
        border: 1px solid $colorTitle
        overflow: hidden
        overflow-y: auto 
        .scroll
            overflow: hidden
            overflow-y: auto 
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
.grid-image
    display: grid
    grid-template-columns: 48% 48%
    grid-gap: 2%
    align-items: center
    .gallery
        .image
            text-align: center
            display: grid
            grid-template-columns: 1fr 6fr 1fr
            height: 400px
            overflow: hidden
            img
                align-self: center
                height: 400px
                max-width: 100%
            iframe
                align-self: center
                height: 100%
                max-height: 400px
                width: 500px
                max-width: 100%
        .buttons
            font-size: 2.5rem
            cursor: pointer
            line-height: 400px
        .disabled
            cursor: auto
            color: #aaa
    .summary
        text-align: justify
.box
    display: flex
    align-items: center
    &>div
        margin-right: 15px
.stories
    margin-top: 50px
    margin-bottom: 15px
    padding: 10px
    border: 1px solid #555
    border-radius: 5px
    max-height: 500px
    position: relative
    .button
        position: absolute
        top: -70px
        right: 10px
    .title
        color: #02747c
        font-weight: bold
    .lists
        display: grid
        grid-template-columns: 68% 28%
        grid-gap: 2%
        align-items: center;
        height: 400px;
        .mosaic
            display: grid
            grid-template-columns: 48% 48%
            grid-gap: 20px
            .story
                display: grid
                grid-template-columns: 48% 48%
                grid-gap: 2%
                height: 150px
                .img
                    text-align: center
                    img
                        height: 100%
                        max-width: 100%
                        max-height: 150px
    .noStory
        display: grid
        grid-template-columns: 58% 38%
        grid-gap: 2%
        align-items: center;
    .links
        .image-big
            text-align: center
            img
                height: 200px
        .image-small
            img
                margin-right: 10px
                height: 50px 
.collapse-bar
    position: relative
    margin-top: 15px
    margin-bottom: 15px
    min-height: 50px
    box-shadow: 0px 0px 3px #aaa
    border: 2px solid #aaaa
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
            max-width: 40%
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
        background:#02747c
    .collapse-title2
        background:#0db8bb

.projects-carousel
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
        top: 0
        height: 100%
    .nextimg
        position: absolute
        right: -2.5%
        top: 0
        height: 100%
.projects-carousel1
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
        top: 0
        height: 100%
    .nextimg
        position: absolute
        right: -2.5%
        top: 0
        height: 100%
.grid-related 
    padding: 15px
    display: grid
    width: auto
    grid-template-columns:  repeat(12,33%)
    grid-auto-flow: column
    align-content: center
    justify-items: center
    grid-gap: $padding-const
    margin-top: $padding-const
    overflow: hidden
    scroll-behavior: smooth
    background: rgba(255,255,255,0.6)
    .item-related
      width: 400px
    img 
      max-width: 400px
      width: 400px
      max-height: 225px
      height: 225px
    .image-related
      text-align: center
    .clasification-related
      font-family:Palatino Linotype
      font-style: italic
      font-size: 1.5rem
    .date-related
      color: #6d6e71
      font-size: 1.25rem
    .title-related, .description-related
      font-size: 1.5rem
      color: #555
      a
        color: #000
        text-decoration: none
        &:hover 
          text-decoration: underline
    .description-related
      overflow: hidden
      text-overflow: ellipsis
      white-space: nowrap

@media screen  and (max-width: $widthTablet)
    .col-90
        width: 80% !important
    .grid-image
         grid-template-columns: 100% !important
    .tab-design 
        font-size: 0.8rem !important
@media screen  and (max-width: $widthMobile)
    .tabs
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
    .col-90
        width: 80% !important
    .feed-title
        padding-left: calc(10% + 40px) !important
        font-size: 20px !important
        margin-top: 50px
    .grid-related 
      grid-template-columns: auto  !important
      max-width: 560px !important
      .item-related
        width: 300px !important
      img 
        max-width: 300px !important
        width: 300px !important
        max-height: 169px !important
        height: 169px !important
    .news-carousel
        .previmg
            left: -5% !important
        .nextimg
            right: -5% !important

@media screen  and (max-width: 1600px) and (min-width: $widthMobile)
    .grid-related 
      grid-template-columns: auto  !important
      max-width: 1200px !important
      .item-related
        width: 300px !important
      img 
        max-width: 300px !important
        width: 300px !important
        max-height: 169px !important
        height: 169px !important
</style>