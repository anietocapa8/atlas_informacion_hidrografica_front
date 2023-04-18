<template>
  <div id="contenedor" class="div-90">
    <!-- Begin of Unsaved Changes Modal-->
    <b-modal ref="unsavedChanges" :title="$t( 'rural_model.admin.back_warning_title' )" hideFooter>      
      <b-row align-v="center" align-h="center">
        <div class="w-75">
          {{ $t( 'rural_model.admin.back_warning' ) }}
        </div>          
          <sipsder-btn btnType="accept" :text="$t( 'rural_model.admin.ok' )" @onClick="back">
          </sipsder-btn>     
          <sipsder-btn btnType="cancel" :text="$t( 'rural_model.admin.cancel' )" @onClick="closeModal( 'unsavedChanges' )">
          </sipsder-btn>
      </b-row>
    </b-modal>
    <!-- End of Unsaved Changes Modal-->

    <!-- Begin of Success Modal-->
    <b-modal ref="successConfirmation" :title="$t( 'rural_model.admin.success_title' )" hideFooter>      
      <b-row align-v="center" align-h="center">
        <div class="w-75">
          {{ $t( 'rural_model.admin.success' ) }}
        </div>          
          <sipsder-btn btnType="accept" :text="$t( 'rural_model.admin.ok' )" @onClick="success">
          </sipsder-btn>
      </b-row>
    </b-modal>
    <!-- End of Success Modal-->

    <!-- Begin of Error Modal-->
    <b-modal ref="errorConfirmation" :title="$t( 'rural_model.admin.error_title' )" hideFooter>      
      <b-row align-v="center" align-h="center">
        <div class="w-75 required">
          <div>
            {{ $t( 'rural_model.admin.error' ) }}
          </div><br>
          <div>
            <ul>
              <li v-for="item in validationErrors" :key="item">{{item}}</li>
            </ul>
          </div>          
        </div>          
          <sipsder-btn btnType="accept" :text="$t( 'rural_model.admin.ok' )" @onClick="closeModal( 'errorConfirmation' )">
          </sipsder-btn>
      </b-row>
    </b-modal>
    <!-- End of Error Modal-->

    <b-container class='container-form'>
      <b-row>
        <b-col>
            <sipsder-title :title="$t( 'rural_model.admin.popup' )" type="admin"></sipsder-title>
        </b-col>
      </b-row>
      <b-row>
        <b-form @submit.prevent="onSubmit">
          <b-container>
            <b-row>
              <div v-html="$t( 'rural_model.admin.claim_html' )"></div>
            </b-row>
            <b-row align-h="end">
              <sipsder-btn btnType="add" 
                :text="$t( 'rural_model.admin.add' )"
                @onClick="addRuralModel">
              </sipsder-btn>
            </b-row>
              <b-row align-h="center" align-v="center">
                <div class="inline-title label13">{{ $t( 'rural_model.admin.filter' ) }}</div>
                <treeselect 
                    v-model="selectedRuralModel"
                    name="filterRuralModel"
                    class="w-75"
                    :load-options="getRuralModelTree"
                    :options="ruralModels"
                    :auto-load-root-options="false"                                    
                    :multiple="false"
                    :placeholder="$t( 'rural_model.admin.filter_placeholder' )"
                    :clearable="true"
                    :default-expand-level="1"
                    :show-count="true">
                  <label slot="option-label" slot-scope="{ node, shouldShowCount, count, labelClassName, countClassName }" :class="labelClassName">
                    <img v-if="node.raw.url != null" :src="getImgURL(node.raw.url)" height="16" width="16">
                    <span> {{ node.label.split('/')[0] }} </span>
                    <span class="grey-label-text" v-if="node.label.split('/')[1] !== undefined"> {{ ' / ' + node.label.split('/')[1] }} </span>
                    <span v-if="shouldShowCount" :class="countClassName">({{ count }})</span>
                  </label>
                  <!-- <div slot="value-label" slot-scope="{ node }">{{ node.label | truncate10chars }}</div> -->
                </treeselect>
              </b-row>
              <hr class="faded">
              <b-row align-h="center" align-v="center">
                <div class="title">{{ $t( 'rural_model.admin.attrs_title' ) }}</div>
              </b-row>
              <b-row class="">
                <b-col cols="10">
                  <div class="text-justify">{{ $t( 'rural_model.admin.claim2' ) }}</div>
                </b-col>
                <b-col cols="2">
                  <b-row align-v="center" align-h="end">                                
                    <b-form-checkbox id="ruralModelEnabled"
                      class="inline-control"
                      v-model="currentRuralModel.status"
                      :value="true"
                      :unchecked-value="false">
                    </b-form-checkbox>
                    <div class="inline-title">{{ $t( 'rural_model.admin.enable' ) }}</div>
                  </b-row>
                </b-col>
              </b-row>
              <b-row class="pt-5 pb-3">
                <b-col>
                  <b-row align-v="center" v-if="pageStatus == 'addRuralModel'">
                    <div class="inline-title">{{ $t( 'rural_model.admin.has_father' ) }}</div>
                    <b-form-radio-group id="ruralModelHasFather" 
                      class="inline-control"
                      :options="yesNo" 
                      v-model="ruralModelHasFather"
                      name="ruralModelHasFather">
                    </b-form-radio-group>
                  </b-row>
                </b-col>
              </b-row>
              <div class="form-container">   
                <b-row align-h="center" align-v="center" class="pb-4" v-if="!currentRuralModel.status">
                  <b-col cols="2">
                    <div class="inline-title">{{ $t( 'rural_model.admin.reason' ) }}<span class="required">*</span></div>
                  </b-col>
                  <b-col cols="10">
                    <b-form-textarea name="ruralModelDisabledReason"
                      class="inline-control"
                      v-model="currentRuralModel.reason"
                      v-validate="{ required: !currentRuralModel.status, max: 280 }"
                      :rows="3"
                      :max-rows="6"
                      :data-vv-as="$t( 'rural_model.admin.reason' )">
                    </b-form-textarea>
                    <span v-if="errors.has( 'ruralModelDisabledReason' )" class="error-msg">
                      {{ errors.first( 'ruralModelDisabledReason' ) }}
                    </span>
                  </b-col>
                </b-row>

                <b-row align-h="center" align-v="center" class="pb-4" v-if="currentRuralModel.level != 0">
                  <b-col cols="2">
                    <div class="inline-title">{{ $t( 'rural_model.admin.category' ) }}<span class="required">*</span></div>
                  </b-col>
                  <b-col cols="10">
                    <vue-select :options="ruralModelCategories" 
                      name="ruralModelCategory" 
                      v-model="selectedRuralModelCategory"
                      class="bg-white"
                      v-validate="{ required: !ruralModelHasFather }"
                      :disabled="ruralModelHasFather "
                      :data-vv-as="$t( 'rural_model.admin.category' )">
                    </vue-select>
                    <span v-if="errors.has( 'ruralModelCategory' )" class="error-msg">
                      {{ errors.first( 'ruralModelCategory' ) }}
                    </span>
                  </b-col>
                </b-row>
                <b-row align-h="center" align-v="center" class="pb-4" v-if="!(pageStatus == 'editRuralModel' && currentRuralModel.level == 1) && (ruralModelHasFather || currentRuralModel.parent != null)">
                  <b-col cols="2">
                    <div class="inline-title">{{ $t( 'rural_model.admin.parent' ) }}<span class="required">*</span></div>
                  </b-col>
                  <b-col cols="10">
                    <vue-select :options="ruralModelParents" 
                      name="ruralModelParent" 
                      v-model="selectedRuralModelParent"
                      class="bg-white"
                      v-validate="{ required: ruralModelHasFather }"
                      :data-vv-as="$t( 'rural_model.admin.parent')">
                    </vue-select>
                    <span v-if="errors.has( 'ruralModelParent' )" class="error-msg">
                      {{ errors.first( 'ruralModelParent' ) }}
                    </span>
                  </b-col>
                </b-row>

                <b-row align-h="center" align-v="center" class="pb-4">
                  <b-col cols="2">
                    <div class="inline-title">{{ $t( 'rural_model.admin.level' ) }}</div>
                  </b-col>
                  <b-col cols="10">
                    <b-form-group>
                      <b-form-input v-model="currentRuralModel.level" 
                        name="ruralModelLevel"
                        disabled>
                      </b-form-input>
                    </b-form-group>
                  </b-col>
                </b-row>

                <b-row align-h="center" align-v="center" class="pb-4">
                  <b-col cols="2">
                    <div class="inline-title">{{ $t( 'rural_model.admin.name' ) }}<span class="required">*</span></div>
                  </b-col>
                  <b-col cols="10">
                    <b-form-group>
                      <b-form-input v-model="currentRuralModel.name" 
                        name="ruralModelName"
                        required
                        v-validate="'required|max:70'"
                        :data-vv-as="$t( 'rural_model.admin.name' )">
                      </b-form-input>
                    </b-form-group>
                    <span v-if="errors.has( 'ruralModelName' )" class="error-msg">
                      {{ errors.first('ruralModelName') }}
                    </span>
                  </b-col>
                </b-row>

                <b-row align-h="center" align-v="center" class="pb-4">
                  <b-col cols="2">
                    <div class="inline-title">{{ $t( 'rural_model.admin.type' ) }}<span class="required">*</span></div>
                  </b-col>
                  <b-col cols="10">
                    <vue-select :options="ruralModelTypes" 
                      name="ruralModelType" 
                      v-model="selectedRuralModelType"
                      class="bg-white"
                      v-validate="'required'"
                      :data-vv-as="$t( 'rural_model.admin.type' )">
                    </vue-select>
                    <span v-if="errors.has( 'ruralModelType' )" class="error-msg">
                      {{ errors.first( 'ruralModelType' ) }}
                    </span>
                  </b-col>
                </b-row>

                <b-row align-h="center" align-v="center" class="pb-4">
                  <b-col cols="2">
                    <div class="inline-title">{{ $t( 'rural_model.admin.summary' ) }}<span class="required" v-if="currentRuralModel.level == 1">*</span></div>
                  </b-col>
                  <b-col cols="10">
                    <b-form-textarea name="ruralModelSummary"
                      class="inline-control"
                      v-model="currentRuralModel.summary"
                      :rows="3"
                      :max-rows="6"
                      v-validate="{ required: currentRuralModel.level == 1, max: 280 }"
                      :data-vv-as="$t( 'rural_model.admin.summary' )">
                    </b-form-textarea>
                    <span v-if="errors.has( 'ruralModelSummary' )" class="error-msg">
                      {{ errors.first( 'ruralModelSummary' ) }}
                    </span>
                  </b-col>
                </b-row>

                <b-row align-h="center" align-v="center" class="pb-4" v-show="currentRuralModel.level != 0">
                    <b-col cols="2">
                      <div class="inline-title">{{ $t( 'rural_model.admin.icon' ) }}</div>
                    </b-col>
                    <b-col cols="10">
                      <b-row align-v="center">
                        <b-col cols="6">
                          <b-row align-h="center" align-v="end">
                            <img id="preview" 
                              :src="getImgURL(url)" 
                              v-if="url != null"
                              width="128"
                              height="128"/>
                            <div class="img-placeholder" v-else>
                              {{ $t( 'rural_model.admin.empty_logo') }}
                            </div>
                            <i id="image-help" class="far fa-question-circle"></i>
                            <b-tooltip target="image-help" 
                              :title="$t( 'rural_model.admin.logo_tooltip' )">           
                            </b-tooltip>
                          </b-row>
                        </b-col>
                        <b-col cols="6">
                          <b-row align-h="center" align-v="start">
                            <input type="file"
                              name="ruralModelIcon" 
                              @change="previewImage(errors.has( 'ruralModelIcon' ), $event)"
                              v-validate="'mimes:image/*|size:200'" 
                              ref="ruralModelUploadIcon"
                              :style="'visibility: hidden'"
                              data-vv-as="icono"/>
                            <span>
                              <sipsder-btn btnType="uploadImage" 
                                :text="$t( 'rural_model.admin.change_logo' )"
                                @onClick="$refs.ruralModelUploadIcon.click()">                                            
                              </sipsder-btn>
                              <sipsder-btn btnType="delete" 
                                :text="$t( 'rural_model.admin.delete_logo' )"
                                @onClick="previewImage(undefined, undefined)"
                                >                                            
                              </sipsder-btn>
                            </span>
                          </b-row>
                          <b-row align-h="center" align-v="center">
                            <div v-if="errors.has( 'ruralModelIcon' )" class="error-msg">
                              {{ $t('rural_model.admin.logo_err') }}
                            </div>
                          </b-row>                                        
                        </b-col>
                      </b-row>
                    </b-col>
                </b-row>

                <b-row align-h="center" align-v="center" class="pb-4" v-show="currentRuralModel.level != 0">
                  <b-col cols="2">
                    <div class="inline-title">{{ $t( 'rural_model.admin.color' ) }}<span class="required">*</span></div>
                  </b-col>
                  <b-col cols="5">
                    <b-form-group>
                      <b-form-input v-model="currentRuralModel.color" 
                        name="ruralModelColor"
                        :placeholder="$t( 'rural_model.admin.color_placeholder' )"
                        v-validate="{required: currentRuralModel.level != 0, regex: rgbRegex}"
                        :data-vv-as="$t( 'rural_model.admin.color_simple' )"
                        :disabled="currentRuralModel.level != 1">
                      </b-form-input>
                    </b-form-group>
                    <span v-if="errors.has( 'ruralModelColor' )" class="error-msg">
                      {{ errors.first('ruralModelColor') }}
                    </span>
                  </b-col>
                  <b-col cols="5">
                    <div :style="{ backgroundColor: currentRuralModel.color }" class="color-sample"/>
                  </b-col>
                </b-row>                                
              </div>
              <b-row align-h="center">                
                <sipsder-btn btnType="back" :text="$t( 'rural_model.admin.back' )" @onClick="backToMainPage">
                </sipsder-btn>
                <sipsder-btn btnType="accept" type="submit" :text="$t( 'rural_model.admin.save' )">
                </sipsder-btn>
              </b-row>
          </b-container>
        </b-form>
      </b-row>
    </b-container>
  </div>
</template>

<script>
    import Treeselect from '@riophae/vue-treeselect';
    import { LOAD_ROOT_OPTIONS } from '@riophae/vue-treeselect';
    import VueSelect from "vue-select";
    import VAPI from '../../../http_common';
    import { RURAL_MODEL_TYPES, PERMISSIONS_TYPES } from '../../../domain_constants';
    import { SERVICE_NAMES } from '../../../sipsder_constants'
    import S_UTIL from "@/util/sipsder_util";

    export default { 
      data( ) {
          return {
            RURAL_MODEL_TYPES,
            SERVICE_NAMES,
            rgbRegex: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/g,
            ruralModels: null,
            selectedRuralModel: null,
            currentRuralModel: {
              id: null,
              name: null,
              color: null,
              status: true,
              reason: null,
              summary: null,
              level: null,
              type: null,
              parent: null,
              image: null,
            },
            ruralModelCategories: [],
            ruralModelTypes: [],
            ruralModelParents: [],
            ruralModelHasFather: null,
            selectedRuralModelCategory: null,
            selectedRuralModelType: null,
            selectedRuralModelParent: null,
            file: null,
            url: null,
            validationErrors: []
          }
      },
      methods: {
          getImgURL (url) {
            return S_UTIL.getImgURL(url);
          },
          showModal( ref ){
              this.$refs[ ref ].show( );
          },
          closeModal( ref ){
              this.$refs[ ref ].hide( );
          },
          backToMainPage( ) {
            this.showModal( 'unsavedChanges' );
          },
          back( ) {
            this.$router.push( { name: 'RuralModel' } );
          },
          success( ){
            this.closeModal( 'successConfirmation' );
            this.back( );
          },
          async fetchRuralModelCategories( ) {
              try {
                  const response = await VAPI.get( SERVICE_NAMES.RURAL_MODEL + '/level/0' );
                  return response.data.data;
              }
              catch( err ) {
                  console.log( 'Error fetching rural model typed by categories', err );
              }
          },
          async getRuralModelCategories( ) {
              const raw = await this.fetchRuralModelCategories( );
              let categories = [];
              raw.forEach(ruralModel => {
                categories.push({
                  id: ruralModel.id,
                  label: ruralModel.name
                })
              });
              return categories;
          },
          async fetchRuralModelTypes( level ) {
              try {
                  const response = await VAPI.get( SERVICE_NAMES.RURAL_MODEL + '/types?level=' + level );
                  return response.data.data;
              }
              catch( err ) {
                  console.log( 'Error fetching rural model types corresponding to level ' + level, error );
              }
          },
          async getRuralModelTypes( level ) {
              const types = await this.fetchRuralModelTypes( level );
              return types;
          },
          async fetchRuralModelCategory( id ) {
              try {
                  const response = await VAPI.get( SERVICE_NAMES.RURAL_MODEL + `/${id}/category` );
                  return response.data;
              }
              catch( err ) {
                  console.log( 'Error fetching rural model types corresponding to ID ' + id, err );
              }
          },
          async getRuralModelCategory( id ) {
              const category = await this.fetchRuralModelCategory( id );
              return category;
          },
          async fetchRuralModelParents( level ) {
              let levels = [ ];
              if( this.pageStatus == 'addRuralModel' ) {
                  levels.push( 1, 2 );
              }
              else if( this.pageStatus == 'editRuralModel' ) {
                  if( level == 1 ) {
                      levels.push( 0 );
                  }
                  else  if( level == 2 ) {
                      levels.push( 1 );
                  }
                  else if( level == 3 ) {
                      levels.push( 2 );
                  }
                  else {
                      return [ ];
                  }
              }
              try {
                  const response = await VAPI.get( SERVICE_NAMES.RURAL_MODEL + '/level/' + levels.join( ',' ) );
                  return response.data.data;
              }
              catch( err ) {
                  console.log( 'Error fetching parents corresponding to levels ' + levels, err );
              }
          },
          async getRuralModelParents( level ) {
              const raw = await this.fetchRuralModelParents( level );
              let parents = [];
              raw.forEach(ruralModel => {
                parents.push({
                  id: ruralModel.id,
                  label: ruralModel.name,
                  url: ruralModel.url,
                  level: ruralModel.level,
                  color: ruralModel.color
                })
              });
              return parents;
          },
          async fetchCurrentRuralModel( id ) {
              try {
                  const response = await VAPI.get( SERVICE_NAMES.RURAL_MODEL + `/${id}` );
                  return response.data;
              } 
              catch( error ) {
                  console.log( 'Error fetching rural model with ID ' + id, error );
              }
          },
          async fetchRuralModelTree( ) {
              try {
                  const response = await VAPI.get( SERVICE_NAMES.RURAL_MODEL + '/tree?active=false' );
                  return response.data;    
              }
              catch( error ) {
                  console.log( 'Error fetching rural model tree', error );
              }
          },
          async getRuralModelTree( { action } ) {
              if ( action === LOAD_ROOT_OPTIONS ) {
                  let response = await this.fetchRuralModelTree( );
                  this.ruralModels = response.data;
              }
          },
          addRuralModel( ) {
              this.$store.dispatch( 'setRuralModelAdminStatus', 'addRuralModel' );
              this.resetModal( );
          },
          async setCurrentRuralModel( id ) {
              this.$validator.reset( );
              this.ruralModelHasFather = null;
              this.currentRuralModel = await this.fetchCurrentRuralModel( id );
              if( this.currentRuralModel.image != null )
                  this.url = this.currentRuralModel.image.url;
              else
                  this.url = null;
              this.ruralModelTypes = await this.getRuralModelTypes( this.currentRuralModel.level );
              this.selectedRuralModelType = this.ruralModelTypes.find((type)=>{
                  return type.id == this.currentRuralModel.type.id;
              });
              this.ruralModelParents = await this.getRuralModelParents( this.currentRuralModel.level );
              this.selectedRuralModelParent = this.ruralModelParents.find((parent)=>{
                  return parent.id == this.currentRuralModel.parent.id;
              });
          },
          resetModal( ) {
              this.currentRuralModel.id = null;
              this.currentRuralModel.name = null;
              this.currentRuralModel.color = null;
              this.currentRuralModel.status = true;
              this.currentRuralModel.reason = null;
              this.currentRuralModel.summary = null;
              this.currentRuralModel.level = null;
              this.currentRuralModel.type = null;
              this.currentRuralModel.parent = null;
              this.currentRuralModel.image = null;
              this.ruralModelCategories = [];
              this.ruralModelTypes = [];
              this.ruralModelParents = [];
              this.selectedRuralModelCategory = null;
              this.selectedRuralModel = null;
              this.selectedRuralModelType = null;
              this.selectedRuralModelParent = null;
              this.ruralModelHasFather = null;
              this.validationErrors = null;
              this.url = null;
              this.$validator.reset( );
          },
          previewImage(errors, e) {
              if (!e || !e.target || !e.target.files.length) {
                  this.file = null;
                  this.url = null;
                  return;
              }
              this.file = e.target.files[0];
              this.url = URL.createObjectURL(this.file);
          },
          validateForm( ) {
            let validation = true;
            let errorBag = [];
            //If element is disabled, reason must be provided
            if( !this.currentRuralModel.status ) {
              if( this.currentRuralModel.reason == null || this.currentRuralModel.reason == '' ) {
                errorBag.push( this.$t( 'rural_model.admin.validation_errors.one' ) );
                validation &= false;
              }
              else
                validation &= true;                
            }
            //If level is different from zero, selected category must not be null
            if( this.currentRuralModel.level != 0 && 
                this.selectedRuralModelCategory == null &&
                !this.ruralModelHasFather ) {
              errorBag.push( this.$t( 'rural_model.admin.validation_errors.ten' ) );
              validation &= false;
            }
            else
              validation &= true;  
            //Level is required
            if( this.currentRuralModel.level == null ) {
              errorBag.push( this.$t( 'rural_model.admin.validation_errors.two' ) );
              validation &= false;
            }
            else
              validation &= true;                
            //If level is different from one, selected parent must not be null
            if( this.currentRuralModel.level > 1 && 
                this.selectedRuralModelParent == null ) {
              errorBag.push( this.$t( 'rural_model.admin.validation_errors.three' ) );
              validation &= false;
            }
            else
              validation &= true;  
            //Name is required
            if( this.currentRuralModel.name == null ) {
              errorBag.push( this.$t( 'rural_model.admin.validation_errors.four' ) );
              validation &= false;
            }
            else
              validation &= true;  
            //Type is required
            if( this.selectedRuralModelType == null ) {
              errorBag.push( this.$t( 'rural_model.admin.validation_errors.five' ) );
              validation &= false;
            }
            else
              validation &= true;
            //If level is one, summary must not be null
            if( this.currentRuralModel.level == 1 && this.currentRuralModel.summary == null ||
                this.currentRuralModel.summary == '' ) {
              errorBag.push( this.$t( 'rural_model.admin.validation_errors.six' ) );
              validation &= false;
            }
            else
              validation &= true;
            if (this.errors && this.errors.items) {
                this.errors.items.forEach(error => {
                    if (error.field == "ruralModelIcon") {
                      errorBag.push( this.$t( 'rural_model.admin.logo_err' ) );
                      validation &= false;
                    }
                })
            } else
                validation &= true;
            //Color is required
            if( this.currentRuralModel.level != 0 && ( this.currentRuralModel.color == null || this.currentRuralModel.color == '' ) ) {
              errorBag.push( this.$t( 'rural_model.admin.validation_errors.nine' )  );
              validation &= false;
            }
            else
              validation &= true;

            return validation ? null : errorBag;
          },
          assemblePayload( ) {
            let formData = new FormData();
            formData.append( 'name', this.currentRuralModel.name );
            formData.append( 'summary', this.currentRuralModel.summary );
            formData.append( 'level', this.currentRuralModel.level );
            formData.append( 'color', this.currentRuralModel.color );
            formData.append( 'status', this.currentRuralModel.status );
            if( this.selectedRuralModelParent != null )
              formData.append( 'parentId', this.selectedRuralModelParent.id );
            else if( this.selectedRuralModelParent == null && this.currentRuralModel.level == 1 )
              formData.append( 'parentId', this.selectedRuralModelCategory.id );
            formData.append( 'typeId', this.selectedRuralModelType.id );
            if( this.file != null )
                formData.append( 'icon',  this.file );               
            if( !this.currentRuralModel.status )
              formData.append( 'reason', this.currentRuralModel.reason );
            return formData;
          },
          printFormData( formData ) {
            for (var pair of formData.entries()) {
              console.log(pair[0]+ ', ' + pair[1]); 
            }
          },
          onError( message, method, error ){
            console.log( 'Error ' + method + ' rural model ', error );
            this.validationErrors = message;
            this.showModal( 'errorConfirmation' );
          },
          async onSubmit( ) {
            let validationResult = this.validateForm( );
            if( validationResult == null ) {
              try {
                if( this.pageStatus == 'addRuralModel' ) {
                  let payload = this.assemblePayload( );
                  // this.printFormData( payload );
                  await VAPI.post(`${SERVICE_NAMES.RURAL_MODEL}`, payload, { headers: { 'Content-Type': 'multipart/form-data' } } )
                  .then( 
                    ( success ) => {
                      this.showModal( 'successConfirmation' );
                    }, ( error ) => {
                      let errorMsg = [ 'Error creando el modelo rural' ];
                      if( this.selectedRuralModelType.id == RURAL_MODEL_TYPES.SIPSDER )
                        errorMsg.push( 'Sólo puede haber un único modelo tipo SIPSDER.' );
                      this.onError( errorMsg, 'POST', error );
                    }
                  ); 
                }
                else if( this.pageStatus == 'editRuralModel' ) {
                  let payload = this.assemblePayload( );
                  // this.printFormData( payload );
                  await VAPI.post(`${SERVICE_NAMES.RURAL_MODEL}/${this.currentRuralModel.id}`, 
                    payload, { headers: { 'Content-Type': 'multipart/form-data' } } ).then( 
                    ( success ) => {
                      this.showModal( 'successConfirmation' );
                    }, ( error ) => {
                      let errorMsg = [ 'Error actualizando el modelo rural' ];
                      if( this.selectedRuralModelType.id == RURAL_MODEL_TYPES.SIPSDER )
                        errorMsg.push( 'Sólo puede haber un único modelo tipo SIPSDER.' );
                      this.onError( errorMsg, 'PUT', error );
                    }
                  ); 
                }      
              }
              catch( error ) {
                this.onError( 'Error del servidor', 'POST/PUT', error );
              }
            }
            else {
              this.validationErrors = validationResult;
              this.showModal( 'errorConfirmation' );
            }
          }
      },
      computed: {
          isAdministrator( ) {
            if( this.$store.getters.isAuthenticated &&
              this.$store.getters.hasPermission( PERMISSIONS_TYPES.ADMIN ) )
                return true;
            return false;
          },
          yesNo( ) {
            return [
              { text: this.$i18n.t( 'rural_model.admin.options.yes' ), value: true },
              { text: this.$i18n.t( 'rural_model.admin.options.no' ), value: false }
            ]
          },
          pageStatus( ) {
            return this.$store.getters.getRuralModelAdminStatus;
          }
      },
      watch: {
          selectedRuralModel( ) {
            if( this.selectedRuralModel != null ) {
              this.$store.dispatch( 'setRuralModelAdminStatus', 'editRuralModel' );
              this.setCurrentRuralModel( this.selectedRuralModel );
            }
          },
          async selectedRuralModelParent( ) {
              if( this.selectedRuralModelParent != null ) {
                if( this.pageStatus == 'addRuralModel' ) {
                  this.currentRuralModel.level = this.selectedRuralModelParent.level + 1;
                  this.selectedRuralModelType = null;
                }
                this.ruralModelTypes = await this.getRuralModelTypes( this.currentRuralModel.level );
                if( this.currentRuralModel.level != 1  ) {
                  this.currentRuralModel.color = this.selectedRuralModelParent.color;
                }
                let category = null;
                if( this.pageStatus == 'addRuralModel' ) {
                  category = await this.getRuralModelCategory( this.selectedRuralModelParent.id );
                }
                else {
                  category = await this.getRuralModelCategory( this.currentRuralModel.id );
                }
                this.ruralModelCategories = [ category ];
                this.selectedRuralModelCategory = category;
              }
          },
          async ruralModelHasFather( ) {
            if( this.ruralModelHasFather != null ) {
              this.selectedRuralModelParent = null;
              this.currentRuralModel.color = null;
              if( !this.ruralModelHasFather ) {
                this.currentRuralModel.level = 1;                    
                this.ruralModelTypes = await this.getRuralModelTypes( this.currentRuralModel.level );
                this.ruralModelCategories = await this.getRuralModelCategories( );
              }
              else {
                this.currentRuralModel.level = null;
                this.ruralModelTypes = [];
                this.selectedRuralModelCategory = null;
              }                
              this.ruralModelParents = await this.getRuralModelParents( this.currentRuralModel.level );
            }
          },
          selectedRuralModelType( ) {
            if( this.selectedRuralModelType != null ) {
              this.currentRuralModel.typeId = this.selectedRuralModelType.id;
            }
          },
          url( ) {
            if( this.url != null ) {
              if( this.$validator.errors.has( 'ruralModelIcon' ) ) {
                this.file = null;
                this.url = null;
              }
            }
          }
      },
      components: {
          Treeselect,
          VueSelect
      }
    }
</script>

<style lang="sass" scoped>
@import '../../../stylesheets/style.sass'
.div-90
    width: 90%
    margin-left: auto
    margin-right: auto
@media screen  and (max-width: 800px)
    .div-90
        width: 80% !important
@media screen  and (max-width: 425px)
    .div-90
        width: 85% !important
.error-msg 
  color: red;
  padding: 10px 15px 10px 15px;
.required
  color: red;
  padding: 0px 2px 0px 2px
.inline-title
  padding: 0px 15px 0px 5px
.label13
  font-size: 1.3em;
.inline-control
  display: inline-block
  margin-right: 0px
.title
  font-size: 1.5em;
  padding: 10px 0px 20px 0px
.faded
  border: 0;
  height: 3px;
  background: #fff;
  background: linear-gradient(to left, hsla(0,0%,0%,.1) 0%, hsla(0,0%,0%,.75) 50%, hsla(0,0%,0%,.1) 100%);
  +flexbox
.form-container
  padding: 40px 15px 20px 15px
.img-placeholder
  display: inline-block;
  border: 1px solid;
  padding: 10px 5px 10px 5px;
  width: 128px;
  height: 128px;
  word-wrap: break-word;
.color-sample
  width: 100%;
  height: 30px;
  border: 1px solid #000;
  margin-bottom: 10px;
  border-radius: 5px;
.grey-label-text
  color: grey;
</style>