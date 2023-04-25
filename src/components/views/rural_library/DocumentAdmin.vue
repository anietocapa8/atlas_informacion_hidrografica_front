<template>
    <div id="rural_document">
        <b-container class="container-form">
            <sipsder-title v-if="trackingBulletin"
                :title="$t('rural_library.titleRuralIndicators').toUpperCase()"
            ></sipsder-title>

            <sipsder-title v-else
                :title="$t('rural_library.title').toUpperCase()"
                :text="$t('rural_library.titleMsg')"
            ></sipsder-title>

            <!-- Seccion de edicion de estado-->
            <b-form @submit.prevent="editState" v-if="editMode && hasAdminPermission">
                <b-row>
                    <b-col>
                        <h3 class="font-weight-bold"> {{$t('rural_library.publishSection').toUpperCase()}} </h3>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col cols="4">
                        <b-form-group
                            :label="$t('rural_library.editSection.state') + TEMPLATES.MANDATORY_SYMBOL"
                            :invalid-feedback="errors.first('state')">
                            <b-form-select 
                                name='state'
                                :data-vv-as="$t('rural_library.editSection.state')"
                                v-validate="{required: true}"
                                :state="validateState('state')"
                                :options="autocomplets.documentStates"
                                v-model="document_status"
                                v-if="prevStatus && prevStatus.id == documentStates.AWAITED"
                            ></b-form-select>
                            <b-form-input v-else-if="document_status"
                                :value="document_status.value"
                                disabled
                            ></b-form-input>
                            <!-- {{prevStatus}} {{documentStates}} {{prevStatus.id == documentStates.AWAIT}} {{document.status}} -->
                        </b-form-group>
                    </b-col>
                    <b-col cols="4">
                        <b-form-group
                            :label="$t('rural_library.editSection.userUpload')"
                        >
                            <b-form-input
                                :disabled = "true"
                                :data-vv-as="$t('rural_library.editSection.userUpload')"
                                v-model="editDocument.userCreate"
                            ></b-form-input>
                        </b-form-group>
                    </b-col>

                    <b-col cols="4" class="mt-5">
                        <div class="form-group">
                            <b-form-checkbox id="checkEnabled" v-model="document_enabled">
                            </b-form-checkbox>  
                            <label>
                                {{$t('rural_library.editSection.enable')}}<span style='color:red'>*</span> 
                            </label>
                        </div>
                    </b-col>
                </b-row>
                
                <b-row v-if="document_status && ( !document_enabled || document_status.id == documentStates.REJECTED )">
                    <b-col>
                        <b-form-group
                            :label="$t('rural_library.editSection.cause')"
                            :invalid-feedback="errors.first('cause')"
                        >
                            <b-form-textarea 
                                v-model="editDocument.cause"
                                :rows="4"
                                :max-rows="6"
                                :no-resize="true"
                                :placeholder="$t('rural_library.editSection.causePlaceholder')" 
                                name="cause"
                                v-validate="{required:true, max: 500}"
                                :data-vv-as="$t('rural_library.editSection.cause')"                                
                                :state="validateState('cause')"
                            ></b-form-textarea>
                        </b-form-group>
                    </b-col>
                </b-row>
            </b-form>

            <hr/>
            <!-- seccion carga de documento -->
            <div>
                <b-row>
                    <b-col>
                        <h3 class="font-weight-bold"> {{$t('rural_library.documentBasicSection.uploadDocument').toUpperCase()}} </h3>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col cols="4">
                        <b-row>
                            <b-col cols="12">
                                <b-form-group
                                    :label="$t('rural_library.documentBasicSection.descriptionMsg')"
                                    :invalid-feedback="$t('rural_library.documentBasicSection.errorMsg')"
                                >
                                    <b-form-file v-if="!editMode || hasAdminPermission"
                                        type="file"
                                        class="input-file"
                                        name="documentFile"
                                        v-model="uploadFile"
                                        accept="application/pdf" 
                                        :placeholder="$t('rural_library.documentBasicSection.btnMsg')"
                                        :drop-placeholder="$t('rural_library.documentBasicSection.btnDropMsg')"
                                        v-validate="{mimes:['application/pdf'], size:10000}"
                                        :data-vv-as="$t('rural_library.documentBasicSection.fileField')"
                                        :state="validateState('documentFile')"                                
                                    ></b-form-file>
                                    <div v-else v-b-tooltip.hover :title="$t('rural_library.documentBasicSection.no_update_file')" style="display: inline-flex">
                                    <b-form-file disabled
                                        type="file"
                                        class="input-file"       
                                    ></b-form-file>
                                    </div>
                                </b-form-group>
                            </b-col>
                        </b-row>
                    </b-col>
                    
                    <b-col cols="4" v-if="hasAdminPermission">
                        <b-form-group
                            :label="$t('rural_library.documentBasicSection.oficialDocument') + TEMPLATES.MANDATORY_SYMBOL"
                        >
                            <b-form-checkbox
                                v-model="document.official"
                                :value="true"
                                :unchecked-value="false"
                                switch
                                :disabled="trackingBulletin"
                                name="official"
                            >
                            {{$t('rural_library.documentBasicSection.oficialDocumentText')}}

                            <i class="fa fa-question-circle" v-b-tooltip.hover :title="$t('rural_library.documentBasicSection.tooltip')"></i>
                            </b-form-checkbox>
                        </b-form-group>
                    </b-col>

                    <b-col cols="4" class="mt-4" v-if="(isOwner && !hasAdminPermission) || (!editMode || !hasAdminPermission)">
                    <!-- && document_status && document_status.id == documentStates.PUBLISH"> -->
                        <div class="form-group mt-5">
                            <b-form-checkbox id="checkEnabled" v-model="document_enabled">
                            </b-form-checkbox>  
                            <label>
                                {{$t('rural_library.editSection.enable')}}<span style='color:red'>*</span> 
                            </label>
                        </div>
                    </b-col>
                    
                </b-row>

                <b-row v-if="document_status && (!editMode || !hasAdminPermission) && (!document_enabled || document_status.id == documentStates.REJECTED )">
                    <b-col>
                        <b-form-group
                            :label="$t('rural_library.editSection.cause')"
                            :invalid-feedback="errors.first('cause')"
                        >
                            <b-form-textarea 
                                v-model="editDocument.cause"
                                :rows="4"
                                :max-rows="6"
                                :no-resize="true"
                                :placeholder="$t('rural_library.editSection.causePlaceholder')" 
                                name="cause"
                                v-validate="{required:true, max: 500}"
                                :data-vv-as="$t('rural_library.editSection.cause')"                                
                                :state="validateState('cause')"
                            ></b-form-textarea>
                        </b-form-group>
                    </b-col>
                </b-row>
                
                <b-row class="mt-4">
                    <b-col>
                        <b-form-group 
                            :label="$t('rural_library.documentBasicSection.summary') + TEMPLATES.MANDATORY_SYMBOL"
                            :invalid-feedback="errors.first('summary')"
                        >
                            <b-form-textarea :placeholder="$t('rural_library.documentBasicSection.summary_plho')"
                                            v-model="document.summary"
                                            :rows="4"
                                            :max-rows="6"
                                            :no-resize="true"
                                            name="summary"
                                            v-validate="{max: 500, required: true}"
                                            :data-vv-as="$t('rural_library.documentBasicSection.summary')"
                                            :state="validateState('summary')"
                            >
                            </b-form-textarea>
                        </b-form-group>
                    </b-col>
                </b-row>
                <b-row v-show="!trackingBulletin">
                    <b-col>
                        <b-form-group
                            :label="$t('rural_library.documentBasicSection.documentType') + TEMPLATES.MANDATORY_SYMBOL"
                            :invalid-feedback="errors.first('docTypes')"
                        >
                            <b-form-select
                                label="type"
                                :options="autocomplets.documentTypes" 
                                v-model="document.type"
                                name="docTypes"
                                :data-vv-as="$t('rural_library.documentBasicSection.documentType')"
                                v-validate="{required: true}"
                                :state="validateState('docTypes')"
                            >
                                <option :value="null" disabled>{{ $t('util.select_option') }}</option>
                            </b-form-select>
                        </b-form-group>
                    </b-col>
                </b-row>
            </div>
            <hr/>
            
            <div v-if="document.type != null">
                <!-- seccion de datos basicos del documento -->
                <div>
                    <b-row>
                        <b-col>
                            <h3 class="font-weight-bold"> {{$t('document.admin.documentData').toUpperCase()}} </h3>
                        </b-col>
                    </b-row>
                    <b-row v-if="showContainerTitle" key="title-container-first">
                        <b-col>
                            <b-form-group
                                :label="getTitle + TEMPLATES.MANDATORY_SYMBOL"
                                :invalid-feedback="errors.first('title')"
                            >
                                <b-form-input
                                    name='title'
                                    v-model="document.containerTitle"
                                    :data-vv-as="$t('document.admin.title')"
                                    v-validate="{required: true, max: 150}"
                                    :state="validateState('title')"
                                ></b-form-input>
                            </b-form-group>
                        </b-col>
                    </b-row> 
                    <b-row v-else key="title-first">
                        <b-col>
                            <b-form-group
                                :label="getTitle + TEMPLATES.MANDATORY_SYMBOL"
                                :invalid-feedback="errors.first('title')"
                            >
                                <b-form-input
                                    name='title'
                                    v-model="document.title"
                                    :data-vv-as="$t('document.admin.title')"
                                    v-validate="{required: true, max: 150}"
                                    :state="validateState('title')"
                                ></b-form-input>
                            </b-form-group>
                        </b-col>
                    </b-row>

                    <b-row>
                        <b-col cols="12" md="6" v-show="isMagazine">
                            <b-form-group                                 
                                :label="$t('document.admin.magazine.publicationPlace') + TEMPLATES.MANDATORY_SYMBOL"
                                :invalid-feedback="errors.first('magazineNumber')"
                            >
                                <b-form-input
                                    name='magazineNumber'
                                    v-model="document.magazineNumber"
                                    :data-vv-as="$t('document.admin.magazine.publicationPlace')"
                                    v-validate="{required: true, numeric: true, max_value: limits.maxNumeric5}"
                                    :state="validateState('magazineNumber')"
                                ></b-form-input>
                            </b-form-group>

                        </b-col>

                        <b-col cols="12" md="6" v-show="showPublicationPlace">
                            <b-form-group                                 
                                :label="$t('document.admin.publicationPlace') + TEMPLATES.MANDATORY_SYMBOL"
                                :invalid-feedback="errors.first('publicationPlace')"
                            >
                                <b-form-input
                                    name='publicationPlace'
                                    v-model="document.publicationPlace"
                                    :data-vv-as="$t('document.admin.publicationPlace')"
                                    v-validate="{required: true, max:120}"
                                    :state="validateState('publicationPlace')"
                                ></b-form-input>
                            </b-form-group>
                        </b-col>

                        <b-col cols="12" md="6">
                            <b-form-group                                 
                                :label="getDate + TEMPLATES.MANDATORY_SYMBOL"
                                :invalid-feedback="errors.first('dateDocument')"
                            >

                                <datepicker :placeholder="$t('util.insertDate')" 
                                            class="date-picker"
                                            :calendar-button = "true"
                                            v-model="document.date"
                                            :language = "languages[language]"
                                            calendar-button-icon = "fa fa-calendar"
                                            :clear-button = "true"
                                            name="dateDocument"
                                            :data-vv-as="$t('document.admin.date')"
                                            v-validate="{required: true}"
                                            :state="validateState('dateDocument')"
                                            >
                                </datepicker>
                            </b-form-group>
                        </b-col>
                    </b-row>

                    <b-row v-if="showContainerTitle" key="title-container-second">
                        <b-col>
                            <b-form-group
                                :label="getContainerTitle + TEMPLATES.MANDATORY_SYMBOL"
                                :invalid-feedback="errors.first('containerTitle')"
                            >
                                <b-form-input
                                    name='containerTitle'
                                    v-model="document.title"
                                    :data-vv-as="$t('document.admin.title')"
                                    v-validate="{required: true, max: 150}"
                                    :state="validateState('containerTitle')"
                                ></b-form-input>
                            </b-form-group>
                        </b-col>
                    </b-row>

                    <b-row v-show="showPages">
                        <b-col cols="6">
                            <b-form-group
                                :label="$t('document.admin.startPage') + TEMPLATES.MANDATORY_SYMBOL"
                                :invalid-feedback="errors.first('startPage')"
                            >
                                <b-form-input
                                    name='startPage'
                                    v-model="document.startPage"
                                    :data-vv-as="$t('document.admin.startPage')"
                                    v-validate="{required: true, numeric: true, max_value: limits.maxNumeric4}"
                                    :state="validateState('startPage')"
                                ></b-form-input>
                            </b-form-group>
                        </b-col>
                        <b-col cols="6">
                            <b-form-group
                                :label="$t('document.admin.endPage') + TEMPLATES.MANDATORY_SYMBOL"
                                :invalid-feedback="errors.first('endPage')"
                            >
                                <b-form-input
                                    name='endPage'                                    
                                    v-model="document.endPage"
                                    :data-vv-as="$t('document.admin.endPage')"
                                    v-validate="{required: true, numeric: true, max_value: limits.maxNumeric4}"
                                    :state="validateState('endPage')"
                                ></b-form-input>
                            </b-form-group>
                        </b-col>
                    </b-row>

                    <b-row v-show="showUrl">
                        <b-col>
                            <b-form-group
                                :label="$t('document.admin.url') + TEMPLATES.MANDATORY_SYMBOL"
                                :invalid-feedback="errors.first('url')"
                            >
                                <b-form-input
                                    name='url'                                    
                                    v-model="document.urlSource"
                                    :data-vv-as="$t('document.admin.url')"
                                    v-validate="{required: true, url: {require_protocol: false}}"
                                    :state="validateState('url')"
                                ></b-form-input>
                            </b-form-group>
                        </b-col>
                    </b-row>

                    <!-- secciones especiales -->
                    <b-row v-show="showEditorial">
                        <b-col>
                            <b-form-group
                                :label="$t('document.admin.book.editorial') + TEMPLATES.MANDATORY_SYMBOL"
                                :invalid-feedback="errors.first('editorial')"
                            >
                                <b-form-input
                                    name='editorial'                                    
                                    v-model="document.editorial.value"
                                    :data-vv-as="$t('document.admin.editorial')"
                                    v-validate="{required: true, max:120}"
                                    :state="validateState('editorial')"
                                ></b-form-input>
                            </b-form-group>
                        </b-col>
                    </b-row>
                    
                    <b-row v-show="showThesisType">
                        <b-col >
                            <b-form-group
                                :label="$t('document.admin.thesis.type') + TEMPLATES.MANDATORY_SYMBOL"
                                :invalid-feedback="errors.first('thesisType')"
                            >
                                <b-form-select
                                    name='thesisType'                                    
                                    v-model="document.thesisType"
                                    :data-vv-as="$t('document.admin.thesis.type')"
                                    :options="autocomplets.thesisTypes"
                                    v-validate="{required: true}"
                                    :state="validateState('thesisType')"
                                ></b-form-select>
                            </b-form-group>
                        </b-col>
                    </b-row>
                    
                </div>
                
                <!-- seccion de datos Comunes entre documentos del documento -->
                <!-- aca se coloca el autor, editor, entidad he info de la revista. -->
                <div>
                    <b-row v-if="showAuthor">
                        <b-col>
                            <hr class="w-80">
                            <s-table-select
                                v-model="documentList.author"
                                :placeholder="$t('document.admin.editorPlaceholder')"
                                :label="$t('document.admin.listLabels.author') + TEMPLATES.MANDATORY_SYMBOL"
                                labelSelect="value"
                                :taggable="true"
                                :options="autocomplets.author"
                                :tableFields="documentListFields.author"
                            ></s-table-select>           
                        </b-col>
                    </b-row>

                    <b-row v-if="showInstitution">
                        <b-col>
                            <hr class="w-80">
                            <s-table-select
                                v-model="documentList.institution"
                                :label="$t('document.admin.listLabels.institution')"
                                labelSelect="value"
                                :options="autocomplets.institution"
                                :tableFields="documentListFields.institution"
                            ></s-table-select>           
                        </b-col>
                    </b-row>

                    <b-row v-if="showEditor">
                        <b-col>
                            <hr class="w-80">
                            <s-table-select
                                v-model="documentList.editor"
                                :placeholder="$t('document.admin.editorPlaceholder')"
                                :label="$t('document.admin.listLabels.editor') + TEMPLATES.MANDATORY_SYMBOL"
                                labelSelect="value"
                                :taggable="true"
                                :options="autocomplets.editor"
                                :tableFields="documentListFields.editor"
                            ></s-table-select>           
                        </b-col>
                    </b-row>

                </div>

                <!-- seccion de elementos generales, tematicas y tags -->
                <div>
                    <b-row>
                        <b-col>
                            <hr class="w-80">
                            <s-table-select
                                v-model="documentList.ruralTheme"
                                :label="$t('document.admin.listLabels.ruralModel') + TEMPLATES.MANDATORY_SYMBOL"
                                labelSelect="texto"
                                :treeselect="true"
                                :options="autocomplets.ruralTheme"
                                :tableFields="documentListFields.ruralTheme"
                                :disableBranch="true"
                            ></s-table-select>           
                        </b-col>
                    </b-row>
                    
                    <b-row>
                        <b-col>
                            <b-form-group
                                :label="'Tags' + TEMPLATES.MANDATORY_SYMBOL"
                                :invalid-feedback="$t('rural_indicators.admin.tags_error')"
                                :state="tagsValidation"
                            >
                                <tags-input
                                    name="tags"
                                    v-model="tag"
                                    :placeholder="$t('norm.create.form.tags_enter')"
                                    :tags="document.tags"                       
                                    @tags-changed="newTags => document.tags = newTags"
                                ></tags-input>
                            </b-form-group>
                        </b-col>
                    </b-row>
                </div>
            </div>
            <!-- seccion botones -->
            <hr>
            <div>
                <b-row>
                    <b-col cols="12" class="d-flex justify-content-center">
                        <sipsder-btn btnType="back" @onClick="showModal('backModal')">
                        </sipsder-btn>
                        
                        <sipsder-btn v-if="!editMode && hasAdminPermission" btnType="save" @onClick="saveDocument">
                        </sipsder-btn>
                        
                        <sipsder-btn v-if="!editMode && !hasAdminPermission" btnType="save" @onClick="showModal('addModal')">
                        </sipsder-btn>
                        
                        <sipsder-btn v-if="editMode && hasAdminPermission" btnType="save" @onClick="saveEditDocument">
                        </sipsder-btn>
                        
                        <sipsder-btn v-if="editMode && !hasAdminPermission" btnType="save" @onClick="showModal('editModal')">
                        </sipsder-btn>
                    </b-col>
                </b-row>
            </div>

            <!-- seccion de popups -->
            <b-modal ref="backModal" size="md" :title="$t('rural_library.backModal.title')" centered hideFooter>
                <b-row>
                    <b-col class="d-flex justify-content-center">
                        {{$t('rural_library.backModal.text')}}
                    </b-col>
                </b-row>
                <b-row>
                    <b-col class="text-right">
                        
                        <sipsder-btn  btnType="accept" @onClick="$router.go(-1)">
                        </sipsder-btn>

                    </b-col>
                    <b-col class="text-left">

                        <sipsder-btn btnType="cancel" @onClick="hideModal('backModal')">
                        </sipsder-btn>

                    </b-col>
                </b-row>
            </b-modal>
            
            <b-modal ref="editModal" size="md" :title="$t('rural_library.editModal.title')" centered hideFooter>
                <b-row>
                    <b-col >
                        {{$t('rural_library.editModal.text')}}
                    </b-col>
                </b-row>
                <b-row>
                    <b-col>
                        <b-form-group
                            label-size="lg"
                            :label="$t('rural_library.editModal.cause') + TEMPLATES.MANDATORY_SYMBOL"
                            :invalid-feedback="errors.first('causeModal')"
                        >
                            <b-form-textarea 
                                v-model="modals.editCause"
                                :rows="4"
                                :max-rows="6"
                                :no-resize="true"
                                :placeholder="$t('rural_library.editModal.causePlaceholder')" 
                                name="causeModal"
                                v-validate="{required:true, max: 500}"
                                :data-vv-as="$t('rural_library.editModal.cause')"                                
                                :state="validateState('causeModal')"
                            ></b-form-textarea>
                        </b-form-group>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col cols="12" class="d-flex justify-content-center">
                        
                        <sipsder-btn  btnType="accept" @onClick="saveEditDocument" :disabled="!modals.editCause || modals.editCause.length < 1">
                        </sipsder-btn>

                    </b-col>
                </b-row>
            </b-modal>

            <b-modal ref="addModal" size="md" :title="$t('rural_library.addModal.title')" centered hideFooter>
                <b-row>
                    <b-col >
                        {{$t('rural_library.addModal.textMain')}}
                    </b-col>
                </b-row>
                <b-row>
                    <b-col >
                        {{$t('rural_library.addModal.textField')}}
                    </b-col>
                </b-row>
                <b-row>
                    <b-col>
                        <b-form-group
                            label-size="lg"
                            :label="$t('rural_library.addModal.cause') + TEMPLATES.MANDATORY_SYMBOL"
                            :invalid-feedback="errors.first('causeAddModal')"
                        >
                            <b-form-textarea 
                                v-model="modals.addCause"
                                :rows="4"
                                :max-rows="6"
                                :no-resize="true"
                                :placeholder="$t('rural_library.editModal.causePlaceholder')" 
                                name="causeAddModal"
                                v-validate="{required:true, max: 500}"
                                :data-vv-as="$t('rural_library.addModal.cause')"                                
                                :state="validateState('causeAddModal')"
                            ></b-form-textarea>
                        </b-form-group>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col cols="12" class="d-flex justify-content-center">
                        
                        <sipsder-btn  btnType="accept" @onClick="saveDocument" :disabled="!modals.addCause || modals.addCause.length < 1">
                        </sipsder-btn>

                    </b-col>
                </b-row>
            </b-modal>

            <b-modal ref="success" :title="$t('rural_library.success.title')" 
                :no-close-on-esc="true"
                :no-close-on-backdrop="true"
                :hide-header-close="true"
                hideFooter>
                <p> {{$t('rural_library.success.text')}} </p>
                
                <br>
                <sipsder-btn btnType="accept"
                            @onClick="successAction()"
                ></sipsder-btn>
            </b-modal>

            <b-modal ref="adminError" :title="$t('rural_library.adminError.title')" hideFooter>
                <p> {{$t('rural_library.adminError.text')}} </p>
                
                <br>
                <sipsder-btn btnType="accept"
                            @onClick="hideModal('adminError')"
                ></sipsder-btn>
            </b-modal>

            <b-modal ref="validationError" :title="$t('profile.validationError.title')" hideFooter >
                <i class="fas fa-exclamation-triangle error-msg"></i>
                {{$t('profile.validationError.text')}}
                <br>
                <sipsder-btn btnType="accept"
                            @onClick="hideModal('validationError')"
                ></sipsder-btn>
            </b-modal>
            
        </b-container>
    </div>
</template>

<script>
import TableSelect from "@/components/shared/TableSelect";
import VAPI from "../../../http_common";
import { SERVICE_NAMES, HTTP_STATUS, DOMAINS, TEMPLATES } from '../../../sipsder_constants';
import { DOCUMENT_TYPES, PERMISSIONS_TYPES, DOCUMENT_STATES } from '../../../domain_constants';
import Datepicker from 'vuejs-datepicker';
import * as lang from "vuejs-datepicker/src/locale"; //importar locale
import Vue from  'vue'

export default {
    name: "CreateAndEditDocument",
    props: {
        trackingBulletin: {
            type: Boolean,
            default: false
        }
    },
    data: function() {
        return {
            TEMPLATES: TEMPLATES,
            document_enabled: true,
            document_status: {},
            idDocument: null,          
            autocomplets: {
                state: null,
                documentTypes: [],
                thesisTypes: [],
                ruralTheme: [],
                institutions: [],
                editor: [],
                author: [],
            },
            editDocument: {
                state: null,
                userCreate: null,
                cause: null,                
            },
            document: {
                id : null,
                type : null,
                title: null,
                date: null,
                magazineNumber: null,
                publicationPlace: null,
                containerTitle: null,
                startPage: null,
                endPage: null,
                urlSource: null,
                editorFirstName: null,
                editorLastName: null,
                editorial: {
                    id: null,
                    value: null
                },
                thesisType: null,
                summary: null,
                tags: [],
                status: null,
            },
            documentList: {
                author: [],
                ruralTheme: [],
                institution: [],
                editor: [],
            },
            prevDocumentList: {
                author: [],
                ruralTheme: [],
                institution: [],
                editor: [],
            },
            documentListFields: {
                ruralTheme: [
                    {
                        key: 'structure',
                        label: this.$t('document.admin.tableTitles.ruralModel.structure'),
                        sortable: true,
                    },
                    {
                        key: 'component',
                        label: this.$t('document.admin.tableTitles.ruralModel.component'),
                        sortable: true,
                    },
                    {
                        key: 'subComponent',
                        label: this.$t('document.admin.tableTitles.ruralModel.subcomponent'),
                        sortable: true,
                    },
                    {
                        key: 'status',
                        label: this.$t('document.admin.tableTitles.ruralModel.main'),
                        sortable: true,
                    },
                    {
                        key: 'actions',
                        label: ""
                    }
                ],
                institution: [
                    {
                        key: 'value',
                        label: this.$t('document.admin.tableTitles.institution.institution'),
                        sortable: true,
                    },
                    {
                        key: 'actions',
                        label: ""
                    }
                ],
                editor: [
                     {
                        key: 'firstname',
                        label: this.$t('document.admin.tableTitles.editor.firstName'),
                        sortable: true,
                        formatter: (value, key, item) => {
                            var fullName = item['value'].split(",");

                            return fullName[0];
                        }
                    },
                    {
                        key: 'lastname',
                        label: this.$t('document.admin.tableTitles.editor.lastName'),
                        sortable: true,
                        formatter: (value, key, item) => {
                            var fullName = item['value'].split(",");
                            var ret = "";
                            if (fullName && fullName.length > 1) {
                                ret = fullName[1];
                            }
                            return ret;
                        }
                    },
                    {
                        key: 'actions',
                        label: ""
                    }
                ],
                author: [
                     {
                        key: 'firstname',
                        label: this.$t('document.admin.tableTitles.author.firstName'),
                        sortable: true,
                        formatter: (value, key, item) => {
                            var fullName = item['value'].split(",");

                            return fullName[0];
                        }
                    },
                    {
                        key: 'lastname',
                        label: this.$t('document.admin.tableTitles.author.lastName'),
                        sortable: true,
                        formatter: (value, key, item) => {
                            var fullName = item['value'].split(",");
                            var ret = "";
                            if (fullName && fullName.length > 1) {
                                ret = fullName[1];
                            }
                            return ret;
                        }
                    },
                    {
                        key: 'actions',
                        label: ""
                    }
                ],
            },
            modals: {
                editCause: null,
                addCause: null,
            },
            limits: {
                maxNumeric4: 100000,
                maxNumeric5: 1000000,
            },
            tag: '',
            tags: [],
            documentsGroups: null,
            frontTextByType: null,
            eDocuments: null,
            pagesDocuments: null,
            editorDocuments: null,
            thesisTypeDocuments: null,
            authorDocuments: null,
            institutionDocuments: null,            
            // editorDocuments: null,
            languages: lang,
            language: this.$i18n.locale,
            uploadFile: null,
            prevStatus: null,
            userId: null
        }
    },
    components: {
        "datepicker": Datepicker,
        "s-table-select": TableSelect,
    },
    computed: {
        // showAsterisk(){
        //     let value = this.document.type.id == DOCUMENT_TYPES.BULLETIN ? TEMPLATES.MANDATORY_SYMBOL : ''
        //     return value
        // },
        isOwner(){
            if( Number(this.userId) == Number(this.$store.getters.getCurrentUser.id) ){
                return true
            }
            return false
        },
        tagsValidation(){
            return this.document.tags.length > 0 ? true : false
        },
        documentStates() {
            return DOCUMENT_STATES;
        },
        getTitle() {
            var title = this.$t('document.admin.title');
            if (this.document.type) {
                title = this.getField('title');
            }
            return title;
        },
        getContainerTitle() {
            var title = "";
            if (this.document.type) {
                title= this.getField('containerTitle');
            }
            return title;
        },
        getDate() {
            var date = this.$t('document.admin.date');
            if (this.document.type) {
                date = this.getField('date');
            }
            return date;
        },
        isMagazine() {
            var res = null;
            if (this.document.type) {
                if (this.documentsGroups.magazine 
                    && this.documentsGroups.magazine.includes(this.document.type.id)) {
                    res = true;
                } else {
                    res = false;
                }
            }
            return res;
        },
        showContainerTitle() {
            var res = null;
            if (this.document.type) {
                if ( (this.isMagazine && this.document.type.id != DOCUMENT_TYPES.MAGAZINE)
                    || (this.document.type.id === DOCUMENT_TYPES.PRINTED_CHAPTER_BOOK)) {
                    res = true;
                } else {
                    res = false;
                }
            }
            return res;
        },
        showUrl() {
            return this.showField('eDocuments');
        },
        showPages() {
            return this.showField('pagesDocuments');
        },
        showEditor() {
            return this.showField('editorDocuments');
        },
        showEditorial() {
            return this.showField('editorialDocuments');
        },
        showThesisType() {
            return this.showField('thesisTypeDocuments');
        },
        showEditor() {
            return this.showField('editorDocuments');
        },
        showAuthor() {
            return this.showField('authorDocuments');
        },
        showInstitution() {
            return this.showField('institutionDocuments');
        },
        showPublicationPlace() {
            return !this.isMagazine && this.document && this.document.type && this.document.type.id != DOCUMENT_TYPES.E_BOOK;
        },
        editMode() {
            return this.idDocument != null;
        },
        hasAdminPermission () {
            return this.$store.getters.hasPermission( PERMISSIONS_TYPES.ADMIN );
        },
        isCommunityPage() {
        return (this.$route.meta.community);
        }
    },
    methods: {
        successAction(){
            this.hideModal('success')
            this.$router.go(-1)
        },
        validateState(name) {
            if (this.veeFields[name] && (this.veeFields[name].dirty || this.veeFields[name].validated)) {                
                return !this.errors.has(name);
            }
            return null;
        },
        hideModal(modal) {
            this.$refs[modal].hide();
        },
        showModal(modal) {
            this.$refs[modal].show();
        },
        getField(field) {
            var value = "";
            for (var docType in this.documentsGroups) {
                if ( this.documentsGroups[docType].includes(this.document.type.id) ) {
                    value = this.frontTextByType[docType][field];
                    break;
                }
            }
            return value;
        },
        toDomainList (lista) {
            var res = [];

            lista.forEach(element => {
                var id = element.id;
                var value = element.value;

                res.push({id, value});
            });

            return res;
        },
        toIntList (lista) {
            var res = [];

            lista.forEach(element => {
                res.push(element.id);
            });

            return res;
        },
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
        showField(field) {
            var res = null;
            
            if (this.document.type) {
                if (this[field].includes(this.document.type.id)) {
                    res = true;
                } else {
                    res = false;
                }
            }

            return res;
        },
        entityToWDO (entity) {
            this.document.id = entity.id;
            this.document.type = entity.type;
            this.document.date = entity.publicationDate;
            this.document.magazineNumber = entity.number;
            this.document.publicationPlace = entity.placePublication;
            this.document.containerTitle = entity.containerTitle;
            this.document.startPage = entity.startPage;
            this.document.endPage = entity.endPage;
            this.document.urlSource = entity.document.urlSource;
            this.document.thesisType = entity.subType;
            this.document.summary = entity.summary;
            if(entity.editorial){
                this.document.editorial = entity.editorial;
            }
            if (entity.enabled) {
                this.document.enabled = entity.enabled;
                this.document_enabled = entity.enabled;
            } else {
                this.document.enabled = false;
                this.document_enabled = false;
            }
            this.document.status = entity.status;
            this.document_status = entity.status;
            this.document.official = entity.official;

            this.editDocument.cause = entity.reason;

            if(entity.document) {
                this.document.title = entity.document.title;
                if (entity.document.tags) {
                    // this.document.tags =  entity.document.tags;
                    entity.document.tags.split(",").forEach(tag => {
                        this.document.tags.push({
                            "text": tag,
                            "tiClasses": [
                                "ti-valid"
                            ]
                            });
                    });

                } else {
                    this.document.tags = [];
                }
            }
        },
        async handleDocument () {

            let valid = true;
            let validators = [
                this.$validator.validate('title'),
                this.$validator.validate('dateDocument'),
                // this.$validator.validate('documentFile'),
                this.$validator.validate('docTypes'),
                this.$validator.validate('summary'),
            ]
            // console.info("tags", this.document.tags, this.document.tags.map(tag => tag.text).join(','));
            let doc = {
                'id': this.document.id,
                'publicationDate' : this.document.date,
                'document' : {
                    'title': this.document.title,
                    // 'tags' : this.document.tags.map(tag => tag.text).join(','),
                },
                'type': this.document.type,
                'summary': this.document.summary,
                'official': this.document.official,
                'enabled' : this.document_enabled,
            };

            if (this.document.tags) {
                doc.document.tags = this.document.tags.map(tag => tag.text).join(',');
            }

            if (this.document.status) {
                doc.status = this.document.status;
            }

            if (this.showContainerTitle) {
                // console.info("VALIDATOR TITLE: ", this.$validator.validate('containerTitle'))
                validators.push(
                    this.$validator.validate('containerTitle'),
                );
                doc.containerTitle = this.document.containerTitle;
            }

            if (this.isMagazine) {
                validators.push(
                    this.$validator.validate('magazineNumber'),
                );
                doc.number = this.document.magazineNumber;
            }

            if (this.showPublicationPlace) {
                validators.push(
                    this.$validator.validate('publicationPlace'),
                );
                doc.placePublication = this.document.publicationPlace;
            }

            if (this.showPages) {
                validators.push(
                    this.$validator.validate('startPage'),
                );
                validators.push(
                    this.$validator.validate('endPage'),
                );

                doc.startPage = this.document.startPage;
                doc.endPage = this.document.endPage;
            }

            if (this.showUrl) {
                validators.push(
                    this.$validator.validate('url'),
                );
                doc.document.urlSource = this.document.urlSource;
            }

            if (this.showEditorial) {
                validators.push(
                    this.$validator.validate('editorial'),
                );
                doc.editorial = this.document.editorial;
            }

            if (this.showThesisType) {
                validators.push(
                    this.$validator.validate('thesisType'),
                );
                doc.subType = this.document.thesisType;
            }

            var lists = {};
            if (this.showAuthor) {
                valid = valid && (this.documentList.author.length > 0);
                lists['authorAdded'] = this.toDomainList(this.documentList.author);
            }
            if (this.showInstitution) {
                // if(this.document.type.id != DOCUMENT_TYPES.BULLETIN){
                    // valid = valid && (this.documentList.institution.length > 0);
                    lists['institutionAdded'] = this.toDomainList(this.documentList.institution);
                // }
            }
            if (this.showEditor) {
                valid = valid && (this.documentList.editor.length > 0);
                lists['editorAdded'] = this.toDomainList(this.documentList.editor);
            }

            valid = valid && (this.documentList.ruralTheme.length > 0);
            let rurals = this.documentList.ruralTheme.map(rural => {
                return {
                    id: rural.id,
                    name: rural.label,
                    color: rural.color,
                    level: rural.level,
                    status: rural.status != null ? rural.status : 0
                }
            })

            lists['ruralThemeAddedIds'] = rurals

            const valresults = Promise.all(validators);

            let areValid = (await valresults).every(isValid => isValid);

            valid = valid && areValid && this.tagsValidation;

            doc.document.reason = this.editDocument.cause
            doc.reason = this.editDocument.cause

            return {'document': doc, 'lists': lists, 'validator': valid};
        },
        async assemblePayloadCreate () {
            let formData = new FormData();

            let ruralDocument = await this.handleDocument();
            if (!ruralDocument.validator) {
                // alert("Campos sin diligenciar.");
                this.showModal("validationError");
                return {'validator': ruralDocument.validator}
            }

            formData.append('document', JSON.stringify(ruralDocument.document));
            
            Object.keys(ruralDocument.lists).forEach(value =>{
                formData.append(value, JSON.stringify(ruralDocument.lists[value]));
            });

            if(this.modals.addCause && this.modals.addCause.length > 1){
                formData.append('justification', this.modals.addCause);
            }else{
                formData.append('justification', this.$t('rural_library.notifications.created'));
            }
            
            if (this.uploadFile != null) {
                formData.append('file', this.uploadFile);
            }

            return {'formdata': formData, 'validator': ruralDocument.validator};
        },
        getRemovedAndAddedElements(prev, current, type="id") {
            // asume que llegan 2 listas.
            let added = [];
            let removed = [];
            let prevTam = prev.length;
            let currTam = current.length;
            
            for (let idxP = 0; idxP < prevTam; idxP++) {
                let found = false;
                for (let idxC = 0; idxC < currTam; idxC++) {
                    if (type === 'object' && prev[idxP] === current[idxC]) {
                        found = true;
                        break;
                    } else if (type === 'id') {
                        if (current[idxC].id && prev[idxP].id == current[idxC].id) {
                            found = true;
                            break;
                        }
                        if (current[idxC].value && prev[idxP].value == current[idxC].value) {
                            found = true;
                            break;
                        }
                    }
                }
                if (!found) {
                    removed.push(prev[idxP]);
                }
            }

            for (let idxC = 0; idxC < currTam; idxC++) {
                let found = false;
                for (let idxP = 0; idxP < prevTam; idxP++) {
                    if (type === 'object' && prev[idxP] === current[idxC]) {
                        found = true;
                        break;
                    } else if (type === 'id') {
                        if (current[idxC].id && prev[idxP].id == current[idxC].id) {
                            found = true;
                            break;
                        }
                        if (current[idxC].value && prev[idxP].value == current[idxC].value) {
                            found = true;
                            break;
                        }
                    }
                }
                if (!found) {
                    added.push(current[idxC]);
                }
            }

            return {added: added, removed: removed};
        },
        findInTree(node, id){
            if (node.id == id) {
                return node;
            }

            var res = null;
            
            for (var idx = 0;node.children && idx < node.children.length; idx++) {
                var nNode = node.children[idx];
                let val = this.findInTree(nNode, id);
                if (val) {
                    res = val;
                    break;
                }
            }

            return res;
        },
        findRuralModel (rural) {
            if(!rural || !this.autocomplets.ruralTheme)
                return rural;

            let models = [];
            
            rural.forEach(item => {
                this.autocomplets.ruralTheme.forEach(node => {
                    let value = this.findInTree(node, item.id);
                    if (value){
                        value["status"] = item.status
                        models.push(value);
                    }
                });
            })

            return models;
        },
        async assemblePayloadUpdate () {
            let formData = new FormData();

            let ruralDocument = await this.handleDocument();
            if (!ruralDocument.validator) {
                this.showModal("validationError");
                // alert("Campos sin diligenciar.");
                return {'validator': ruralDocument.validator}
            }
            
            formData.append('document', JSON.stringify(ruralDocument.document));
            //Change list
            Object.keys(ruralDocument.lists).forEach(value =>{
                if (value != 'ruralThemeAddedIds') {

                    let name = value.replace('Added', '');
                    let changes = this.getRemovedAndAddedElements(this.prevDocumentList[name], ruralDocument.lists[value]);
                    formData.append(value, JSON.stringify(changes.added));
                    
                    let remName = name + "Removed";
                    formData.append(remName, JSON.stringify(changes.removed));
                } else {

                    let prevList = this.prevDocumentList['ruralTheme'].map(rural => rural.id);
                    
                    let changes = this.getRemovedAndAddedElements(prevList, ruralDocument.lists[value], "object");

                    formData.append(value, JSON.stringify(changes.added));

                    let remName = "ruralThemeRemovedIds";//name + "Removed";
                    formData.append(remName, JSON.stringify(changes.removed));
                }
            });

            if(this.modals.editCause && this.modals.editCause.length > 1){
                formData.append('justification', this.modals.editCause);
            }else{
                if(!this.document_enabled){
                    formData.append('justification', this.editDocument.cause);
                }else if(!this.hasAdminPermission && 
                    ( !this.document_enabled && ( (this.prevStatus.id != this.document_status.id) && this.document_status.id == this.documentStates.PUBLISH) ) ){
                        formData.append('justification', this.$t('rural_library.notifications.disabled'));
                }else if( this.document_enabled && ( (this.prevStatus.id != this.document_status.id) && this.document_status.id == this.documentStates.PUBLISH) ) {
                        formData.append('justification', this.$t('rural_library.notifications.published'));
                }else{
                    formData.append('justification', this.$t('rural_library.notifications.updated'));
                }
            }

            if (this.uploadFile != null) {
                formData.append('file', this.uploadFile);
            }

            return {'formdata': formData, 'validator': ruralDocument.validator};
        },
        clearFields() {
            this.document.type = null;
            this.document.title = null;
            this.document.date = null;
            this.document.magazineNumber = null;
            this.document.publicationPlace = null;
            this.document.containerTitle = null;
            this.document.startPage = null;
            this.document.endPage = null;
            this.document.urlSource = null;
            this.document.editorFirstName = null;
            this.document.editorLastName = null;
            this.document.editorial = null;
            this.document.thesisType = null;
            this.document.summary = null;
            this.uploadFile = null;
            
            this.documentList.author= [];
            this.documentList.ruralTheme= [];
            this.documentList.institution= [];
            this.documentList.editor= [];
            this.tags=[];

            this.$validator.reset();
        },
        async saveEditDocument () {
            
            var path;
            var response;
            this.hideModal('editModal');

            let payload = await this.assemblePayloadUpdate();
            
            try {
                if(this.isCommunityPage){
                    path = `${SERVICE_NAMES.RURAL_DOCUMENTS}/update-community`;
                } else if( this.trackingBulletin ) {
                    path = `${SERVICE_NAMES.RURAL_DOCUMENTS}/update-tracking-bulletin`;
                } else {
                    path = `${SERVICE_NAMES.RURAL_DOCUMENTS}/update-library`;
                } 
                if (!payload.validator) {
                    //Popup validacion.
                    return;
                }
                let param = payload.formdata;
                response = await VAPI.post(path, param);
                if (response.status === HTTP_STATUS.OK) {
                    this.showModal("success");
                } else {
                    this.showModal("adminError");
                }
            } catch (error) {
                this.showModal("adminError");
                console.info("Fallo al modificar documentos ", error);
            }
        },
        async saveDocument () {
            var path; 
            var response;
            this.hideModal('addModal');
            try { // Creacion
                
                if(this.isCommunityPage){
                    path = `${SERVICE_NAMES.RURAL_DOCUMENTS}/upload-community`;
                } else if( this.trackingBulletin ) {
                    path = `${SERVICE_NAMES.RURAL_DOCUMENTS}/upload-tracking-bulletin`;
                } else {
                    path = `${SERVICE_NAMES.RURAL_DOCUMENTS}/upload-library`;
                } 

                let payload = await this.assemblePayloadCreate();
                if (!payload.validator) {
                    return;
                }

                let param = payload.formdata;
                response = await VAPI.post(path, param);

                if (response.status == HTTP_STATUS.OK) {
                    this.showModal("success");
                    this.clearFields();
                } else {
                    this.showModal("adminError");
                    console.info("Fallo al Crear documentos ", error);
                }
                
            }  catch (error) {
                this.showModal("adminError");
                console.info("Fallo al modificar documentos ", error);
            }
            
        },
    },
    async created() {
        this.documentsGroups = {
            magazine: [DOCUMENT_TYPES.E_MAGAZINE, DOCUMENT_TYPES.PRINTED_MAGAZINE, DOCUMENT_TYPES.MAGAZINE],
            primer: [DOCUMENT_TYPES.PRIMER],
            bulletin: [DOCUMENT_TYPES.BULLETIN],
            book: [DOCUMENT_TYPES.PRINTED_CHAPTER_BOOK, DOCUMENT_TYPES.E_BOOK, DOCUMENT_TYPES.PRINTED_BOOK, DOCUMENT_TYPES.PRINTED_AUTHOR_BOOK, DOCUMENT_TYPES.PRINTED_EDITOR_BOOK],
            guidebook: [DOCUMENT_TYPES.GUIDEBOOK],
            report: [DOCUMENT_TYPES.REPORT],
            thesis: [DOCUMENT_TYPES.THESIS],
            indicator: [DOCUMENT_TYPES.RURAL_INDICATOR_BULLETIN]
        };

        this.frontTextByType = {
            magazine: {
                title: this.$t('document.admin.magazine.title'), 
                date: this.$t('document.admin.magazine.date'),
                containerTitle:  this.$t('document.admin.magazine.containerTitle'),
            },
            primer: {
                title: this.$t('document.admin.primer.title'), 
                date: this.$t('document.admin.primer.date') 
            },
            bulletin: {
                title: this.$t('document.admin.bulletin.title'), 
                date: this.$t('document.admin.bulletin.date') 
            },
            indicator: {
                title: this.$t('document.admin.indicator.title'), 
                date: this.$t('document.admin.indicator.date') 
            },
            book: {
                title: this.$t('document.admin.book.title'), 
                date: this.$t('document.admin.book.date'),
                containerTitle:  this.$t('document.admin.book.containerTitle'),
            },
            guidebook: {
                title: this.$t('document.admin.guidebook.title'), 
                date: this.$t('document.admin.guidebook.date') 
            },
            report: {
                title: this.$t('document.admin.report.title'), 
                date: this.$t('document.admin.report.date') 
            },
            thesis: {
                title: this.$t('document.admin.thesis.title'), 
                date: this.$t('document.admin.thesis.date') 
            },
        }

        this.eDocuments = [
            DOCUMENT_TYPES.E_MAGAZINE, 
            DOCUMENT_TYPES.BULLETIN,
            DOCUMENT_TYPES.RURAL_INDICATOR_BULLETIN,
            DOCUMENT_TYPES.PRIMER,
            DOCUMENT_TYPES.GUIDEBOOK,
            DOCUMENT_TYPES.REPORT,
            DOCUMENT_TYPES.E_BOOK,
            DOCUMENT_TYPES.THESIS,
        ];

        this.pagesDocuments = [
            DOCUMENT_TYPES.E_MAGAZINE,
            DOCUMENT_TYPES.PRINTED_MAGAZINE, 
            DOCUMENT_TYPES.PRINTED_CHAPTER_BOOK,
        ];

        this.editorDocuments = [
            DOCUMENT_TYPES.PRINTED_EDITOR_BOOK,
            DOCUMENT_TYPES.PRINTED_CHAPTER_BOOK
        ];

        this.editorialDocuments = [
            DOCUMENT_TYPES.PRINTED_CHAPTER_BOOK,
            DOCUMENT_TYPES.PRINTED_BOOK,
            DOCUMENT_TYPES.PRINTED_AUTHOR_BOOK,
            DOCUMENT_TYPES.PRINTED_EDITOR_BOOK,
        ];

        this.thesisTypeDocuments = [
            DOCUMENT_TYPES.THESIS,
        ];

        
        this.authorDocuments = [
            DOCUMENT_TYPES.E_MAGAZINE,
            DOCUMENT_TYPES.PRINTED_MAGAZINE,
            DOCUMENT_TYPES.BULLETIN,
            DOCUMENT_TYPES.RURAL_INDICATOR_BULLETIN,
            DOCUMENT_TYPES.PRINTED_CHAPTER_BOOK,
            DOCUMENT_TYPES.PRIMER,
            DOCUMENT_TYPES.GUIDEBOOK,
            DOCUMENT_TYPES.REPORT,
            DOCUMENT_TYPES.E_BOOK,
            DOCUMENT_TYPES.PRINTED_BOOK,
            DOCUMENT_TYPES.THESIS
        ];
        
        this.institutionDocuments = [
            DOCUMENT_TYPES.BULLETIN,
            DOCUMENT_TYPES.RURAL_INDICATOR_BULLETIN,
            DOCUMENT_TYPES.PRIMER,
            DOCUMENT_TYPES.GUIDEBOOK,
            DOCUMENT_TYPES.PRINTED_AUTHOR_BOOK,
            DOCUMENT_TYPES.REPORT,
        ];

        try{
            
            // var path = `${SERVICE_NAMES.RURAL_DOCUMENTS}/all?types=true`;
            let path = `/${SERVICE_NAMES.DOMAINS}/${DOMAINS.RURAL_DOCUMENT_TYPE}`
            var response = await VAPI.get(path);
            
            if (response && response.status == HTTP_STATUS.OK) {
                this.autocomplets.documentTypes = [];
                response.data.data.forEach(types => {
                    if( types.id != DOCUMENT_TYPES.RURAL_INDICATOR_BULLETIN && !this.trackingBulletin ) {
                        this.autocomplets.documentTypes.push({text: types.value, value: types});
                    }
                    else if( types.id == DOCUMENT_TYPES.RURAL_INDICATOR_BULLETIN && this.trackingBulletin ) {
                        this.autocomplets.documentTypes.push({text: types.value, value: types});
                    }
                });
            }

        } catch (error) {
            console.info("Fallo al obtener tipos", error);
        }
        
        try {
            let path = `/${SERVICE_NAMES.RURAL_MODEL}/tree`
            let response = await VAPI.get( path );
            if (response.status == HTTP_STATUS.OK){
                this.autocomplets.ruralTheme = this.toRuralFormat(response.data.data);
            }
        } catch (error) {
            console.info("Fallo al obtener Modelos rurales", error);
        }

        try {
            let path = `/${SERVICE_NAMES.INSTITUTION}/all`
            let response = await VAPI.get( path );
            if (response.status == HTTP_STATUS.OK){
                this.autocomplets.institution = response.data.data.map( inst => {return {id: inst.id, value: inst.name}});
            }
        } catch (error) {
            console.info("Fallo al obtener Instituciones", error);
        }

        try {
            let path = `/${SERVICE_NAMES.DOMAINS}/${DOMAINS.RURAL_DOCUMENT_AUTHOR}`
            let response = await VAPI.get( path );
            if (response.status == HTTP_STATUS.OK){
                this.autocomplets.author = response.data.data;
            }
        } catch (error) {
            console.info("Fallo al obtener author", error);
        }

        try {
            let path = `/${SERVICE_NAMES.DOMAINS}/${DOMAINS.RURAL_DOCUMENT_EDITOR}`
            let response = await VAPI.get( path );
            if (response.status == HTTP_STATUS.OK){
                this.autocomplets.editor = response.data.data;
            }
        } catch (error) {
            console.info("Fallo al obtener editor", error);
        }

        try {
            let path = `/${SERVICE_NAMES.DOMAINS}/${DOMAINS.RURAL_DOCUMENT_SUBTYPES}`
            let response = await VAPI.get( path );
            if (response.status == HTTP_STATUS.OK){
                this.autocomplets.thesisTypes = response.data.data.map(type => {return {text: type.value, value:type}});
            }
        } catch (error) {
            console.info("Fallo al Sub Types: ", error);
        }
        if(!this.idDocument && this.$route && this.$route.params) {
            this.idDocument = this.$route.params.id;
        }
        if (this.idDocument != null || this.$route.params.id) {
            try {
                let path = `/${SERVICE_NAMES.DOMAINS}/${DOMAINS.RURAL_DOCUMENT_STATES}`;
                let response = await VAPI.get( path );
                if (response.status == HTTP_STATUS.OK){
                    this.autocomplets.documentStates = response.data.data.map(state => { return {text: state.value, value: state}} );
                }
            } catch (error) {
                console.info("Fallo al obtener estados: ", error);
            }

            let path = `/${SERVICE_NAMES.RURAL_DOCUMENTS}/${this.idDocument}`
            try {
                let response = await VAPI.get(path);

                if (response.status == HTTP_STATUS.OK) {
                    this.documentList.author = response.data.authors;
                    this.prevDocumentList.author = response.data.authors.slice();
                    
                    this.documentList.ruralTheme = this.findRuralModel(response.data.ruralModels);
                    this.prevDocumentList.ruralTheme = this.documentList.ruralTheme.slice();

                    this.documentList.institution = response.data.institutions;
                    this.prevDocumentList.institution = response.data.institutions.slice();

                    this.documentList.editor = response.data.editors;
                    this.prevDocumentList.editor = response.data.authors.slice();

                    this.entityToWDO(response.data.document);
                    
                    this.editDocument.userCreate = response.data.document.username + " " + response.data.document.lastname;

                    this.userId = response.data.document.userId
                    
                    this.prevStatus = this.document.status;
                    // console.info("Estado de los elementos:> ",this.document.status, response.data.document.status);
                } else {
                    alert("Documento no encontrado.");
                }
            } catch (error) {
                console.info("Problemas al consumir servicio.", error);
            }
        } else {

            this.document.enabled = true
            
            if (this.$route.params && this.$route.params.initialOfficial != null) {
                this.document.official = false;
            } else {                
                this.document.official = true;
            }
        }

        if( this.trackingBulletin ) {
            let bulletinType = this.autocomplets.documentTypes.find( type => {
                return type.value.id == DOCUMENT_TYPES.RURAL_INDICATOR_BULLETIN
            })
            Vue.set( this.document, 'type', { value: bulletinType.text, id: bulletinType.value.id } );            
        }

        
    },
    watch: {
        'document.type': function(newType){
            this.$validator.reset();
        },
        document_enabled: function(newVal) {
            if(this.$route.params.id){
                this.document.enabled = newVal;
            }else{
                this.document.enabled = true
            }
        },
        document_status : function(newVal){
            this.document.status = newVal;
            if (newVal.id == DOCUMENT_STATES.REJECTED || this.document.enabled == false) {
                this.document.enabled = false;
                this.document_enabled = false;
            }else if(!this.hasAdminPermission){
                this.document.enabled = true;
                this.document_enabled = true;
            }           
        } 
    }
}
</script>

<style lang="scss" scoped>
.alert-msg {
    color: #F00;
}
.error-msg {
    color: #F00;
    font-size: 12px;
}
.input-file {
    font-size: 1.2rem;
}

.custom-file-input:lang(en) ~ .custom-file-label::after {
  content: 'Buscar';
}

.w-80 {
    width: 80%;
}
</style>