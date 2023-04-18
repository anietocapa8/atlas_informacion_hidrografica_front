<template>
  <b-container class="container-form col-90">
    <sipsder-title :title="$t('contact.title').toUpperCase()" section="Contáctenos">
      <div slot="content">
        <b-row class="edit-admin" v-if="isAdmin" >
          <b-col cols="2" >
            <sipsder-btn :text="$t('contact.index.enableEditionMode')"
                         btnType="edit_pen"
                         @onClick="editAdministrator"></sipsder-btn>
          </b-col>
          <b-col cols="10" class="d-flex justify-content-start  align-items-center">
            <h3 class="edit-admin-text" >{{$t('contact.editAdminText')}}</h3>
          </b-col>
        </b-row>
        <div class="description-container">
          <div class="about">
            <div class="about-heading">
              <img src="../../../assets/sipsder_logo.png" class="about-image">
              <div class="about-title">
                {{$t('util.bogotaRuralSDP')}}
              </div>
              <div class="about-title-edit" v-if="isAdmin && editAdmin">
                <sipsder-btn text=""
                              btnType="edit_pen"
                                    @onClick="editContactData"></sipsder-btn>
              </div>
            </div>
            <div class="about-content" v-if="!editAdminData && dataContact !== null">
              <div class="text">
                <b>{{$t('contact.address')}}</b>: {{dataContact.direction}}
              </div>
              <div class="text">
                <b>{{$t('contact.fax')}}</b>: {{dataContact.fax}}
              </div>
              <div class="text">
                <b>{{$t('contact.emailInstitution')}}</b>:
              </div>
              <div class="text" v-for="v in dataContact.email.split(',')" :key="v">
                {{v}}
              </div>
              <div class="text">
                <b>{{$t('contact.scheduleOfAttention')}}</b>: {{dataContact.schedule}} 
              </div>
            </div>
            <div class="about-content" v-if="editAdminData">
              <div class="text">
                <label class="edit-admin-text">{{$t('contact.address')}}</label>
                <input class="form-control edit-admin-text col" type="text" name="direction" data-vv-delay="100"  v-validate="'required'" v-model="dataContact.direction">
                <span  v-if="submitted && errors.has('description')" >{{ errors.first('description') }}</span>
              </div>
              <div class="text">
                <label class="edit-admin-text">{{$t('contact.fax')}}</label>
                <input class="form-control edit-admin-text col" type="text" name="fax" data-vv-delay="100"  v-validate="'required'" v-model="dataContact.fax">
                <span  v-if="submitted && errors.has('fax')" >{{ errors.first('fax') }}</span>
              </div>
              <div class="text">
                <label class="edit-admin-text">{{$t('contact.emailInstitution')}}:</label>
                <input class="form-control edit-admin-text col" type="text" name="email" data-vv-delay="100"  v-validate="'required'" v-model="dataContact.email">
                <span  v-if="submitted && errors.has('description')" >{{ errors.first('description') }}</span>
              </div>
              <div class="text">
                <label class="edit-admin-text">{{$t('contact.scheduleOfAttention')}}</label>
                <input class="form-control edit-admin-text col" type="text" name="schedule" data-vv-delay="100"  v-validate="'required'" v-model="dataContact.schedule">
                <span  v-if="submitted && errors.has('schedule')" >{{ errors.first('schedule') }}</span>
              </div>
              <div class="edit-action">
                <sipsder-btn text=""
                              btnType="cancel"
                                    @onClick="discardContact"></sipsder-btn>
                <sipsder-btn text=""
                              btnType="accept"
                                    @onClick="saveContactData"></sipsder-btn>
              </div>
            </div>
          </div>
          <div class="description" v-if="!editAdminDataRich">
            <div style="text-align: right" v-if="isAdmin && editAdmin">
              <sipsder-btn text=""
                            btnType="edit_pen"
                            @onClick="editContactDataRich"></sipsder-btn>
            </div>
            <div v-if="dataContact !== null" style="margin: 10px 10px">
              <div v-html="dataContact.contact"></div>
            </div>
          </div>
          <div class="description" v-if="editAdminDataRich">
            <rich-text :options="customToolbar" @changeValue="changeValue" :newContent="dataContact.contact"></rich-text>
            <div class="edit-action">
              <sipsder-btn text=""
                          btnType="cancel"
                          @onClick="discardContactData"></sipsder-btn>
              <sipsder-btn text=""
                          btnType="accept"
                          @onClick="saveContactData"></sipsder-btn>
            </div>
          </div>
        </div>
      </div>
    </sipsder-title>                
    <div class="content-form">
      <b-row v-if="!contactMessage" class="edit-admin-text text-justify">
        <b-col cols="8" offset="2">
          {{$t('contact.contactMsg')}}
        </b-col>
      </b-row>      
      <b-row class="title-container" v-if="isLogged && isntAdmin">
        <b-col>
          <div class="form-title">
            {{$t('contact.writeUs')}}
          </div>
          <span class="highlighted">
            {{$t('contact.updateDataText')}} <router-link :to="{name: 'UserProfile'}" class="text">{{$t('contact.profile')}}</router-link>
          </span>
        </b-col>
      </b-row>
      <b-row v-if="isLogged && currentUser !== null && isntAdmin">
        <b-col cols="12" md="6">
          <b-form-group :label="$t('contact.email')" horizontal >
            <b-input type="text" v-model="currentUser.email" disabled/>
          </b-form-group>
          <b-form-group :label="$t('contact.name')" horizontal >
            <b-input type="text" v-model="currentUser.firstName" disabled/>
          </b-form-group>
          <b-form-group :label="$t('contact.country')" horizontal >
            <b-input type="text" v-if="currentUser.geoLive" v-model="currentUser.geoLive.parent.name" disabled/>
          </b-form-group>
          <b-form-group :label="$t('contact.localidad')" horizontal >
            <b-input type="text" v-model="locality" disabled/>
          </b-form-group>
        </b-col>
        <b-col cols="12" md="6">
          <b-form-group :label="$t('contact.lastname')" horizontal >
            <b-input type="text" v-model="currentUser.lastName" disabled/>
          </b-form-group>
          <b-form-group :label="$t('contact.city')" horizontal >
            <b-input type="text" v-model="currentUser.geoLive.name" disabled/>
          </b-form-group>
        </b-col>
      </b-row>
      <div class="general-info-form" v-if="isLogged && currentUser !== null && isAdmin">
          <div class="part-one-admin filter-container">
            <b-row>
              <b-col>
                <h2 class="title-fitler">{{$t('contact.searcher')}}</h2>
              </b-col>
            </b-row>
            <b-row class="d-flex justify-content-end  align-items-center">
              <b-col cols="4">
                <br>
                <b-form-group >
                  <b-form-select v-model="search_type" :options="options_type" />
                </b-form-group>
                <b-form-group>
                  <b-form-select v-model="user_type" :options="type_users" />
                </b-form-group>
              </b-col>
              <b-col cols="4">
                <br>
                <b-form-group>
                  <b-form-select v-model="search_channel" :options="responseOptions" />
                </b-form-group>
                <b-form-group>
                  <b-form-input type="text" v-model="search_user" placeholder="Nombre de usuario">
                  </b-form-input>
                </b-form-group>
              </b-col>
              <b-col>
                <b-row>
                  <b-col cols="6" >
                    <b-form-group label-class="font-weight-bold"
                                  :label="$t('contact.index.from')" style="margin-top: 15px">
                      <datepicker :placeholder="$t('util.insertDate')" 
                                :calendar-button = "true"
                                class="date-picker"
                                calendar-button-icon = "fa fa-calendar"
                                :clear-button = "true"
                                :format="customFormatter"
                                v-model="searchDateStart"
                                style="color: black;"
                      ></datepicker>
                    </b-form-group>
                  </b-col>
                  <b-col cols="6">
                        <b-form-group label-class="font-weight-bold"
                                  :label="$t('contact.index.to')" style="margin-top: 15px">
                        <datepicker :placeholder="$t('util.insertDate')" 
                                    :calendar-button = "true"
                                    calendar-button-icon = "fa fa-calendar"
                                    class="date-picker"
                                    :clear-button = "true"
                                    v-model="searchDateEnd"
                                    :format="customFormatter"
                                    :disabledDates="searchenddisabledDates"
                                    style="color: black;"
                                    >
                          </datepicker>
                        </b-form-group>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col >
                    <b-form-group style="margin-top: 0">
                      <b-form-input type="text" v-model="search_user_email" :placeholder="$t('contact.index.email')">
                      </b-form-input>
                    </b-form-group>
                  </b-col>
                </b-row>
              </b-col>
              <b-col cols="12" class="d-flex justify-content-center">
                 <sipsder-btn 
                    btnType="search"
                    @onClick="search"></sipsder-btn>
                 <sipsder-btn 
                    btnType="clean"
                    @onClick="discardSearch"></sipsder-btn>
              </b-col>
              <div class="table">
                <filter-table :optionsTable="options_table" :perPage="requestsQuery['size']" :items="items" @action="action($event)" :externalQuery="requestsQuery" :fields="fields_t">
                </filter-table>
              </div>
            </b-row>
          </div>
      </div>
      <b-row v-if="isAdmin">
          <b-col cols="10" class="d-flex justify-content-end  align-items-center" style="margin: 100px 0px">
            <h3>{{$t('contact.downloadRegistry')}}</h3>
          </b-col>
          <b-col cols="2" class="d-flex justify-content-start  align-items-center">
            <!--<download-excel
                v-if="isAdmin"
                :fetch="getStatistics"
                :fields = "excelFields"
                :name = "excelName">
              <sipsder-btn btnType="download" text="Descargar">
              </sipsder-btn>
            </download-excel>-->
            <sipsder-btn v-if="isAdmin" btnType="download" @onClick="getStatistics">
            </sipsder-btn>
          </b-col>
      </b-row>
      <b-row class="login" v-if="!isLogged" style="background-image: url('../assets/home/buscadorweb.png');">
        <b-col>
          <h3>{{$t('contact.comunicationMsg')}} <a v-b-modal.login href="#">{{$t('contact.authentication')}}</a></h3>
        </b-col>
      </b-row>
      <b-row class="requesttypeform" v-if="isLogged && isntAdmin">
        <b-col>
          <b-form-group
            :label="$t('contact.typeOfRequest').toUpperCase() + TEMPLATES.MANDATORY_SYMBOL"
          >
            <div class="checkbox-container">
              <div class="group" v-for="v in requestTypes" :key="v.id">
                <input type="checkbox" :id="v.id" :value="v.id" v-model="requestOptions">
                <label for="consulta">{{v.type}}</label>
              </div>
            </div>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row class="requesttypeform" v-if="isLogged && isntAdmin">
        <b-col>
          <b-form-group
            :label="$t('contact.index.contentOfTheRequest').toUpperCase() + TEMPLATES.MANDATORY_SYMBOL"
            :description="`${$t('contact.index.lack')} ${characters} ${$t('contact.index.characters')}`"
          >
            <textarea rows="5" cols="50" v-model="content" 
                :class="{ error: errors.has('content') }" 
                @input="count" name="content" maxlength="4000" 
                required v-validate="'required'">
            </textarea>
          </b-form-group>
          <span  v-if="errors.has('content')" >{{ errors.first('content') }}</span>
        </b-col>
      </b-row>
      <!-- documentos -->
      <b-row class="requesttypeform" v-if="isLogged && isntAdmin">
        <b-col>
          <b-row>
            <b-col class="form-title">
                {{$t('contact.filesOrDocuments')}}
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-form-file 
                  type="file"
                  v-model="file"
                  @input="addNewFile"
                  class="input-file"
                  name="documentFile"
                  ref="addAttachment"
                  accept="application/pdf" 
                  :placeholder="$t('rural_library.documentBasicSection.btnMsg')"
                  :drop-placeholder="$t('rural_library.documentBasicSection.btnDropMsg')"
                  v-validate="{mimes:['application/pdf'], size:5000}"
                  :data-vv-as="$t('rural_library.documentBasicSection.fileField')"
              ></b-form-file>
            </b-col>
          </b-row>
          <b-row class="file" v-for="(f,i) in files" :key="i">
            <b-col cols="11">
              <b-input type="text" :value="`${f.name} (${f.size} B)`" disabled/>
            </b-col>
            <b-col cols="1">
              <i class="far fa-times-circle" @click="deleteFile(i)"></i>
            </b-col>
          </b-row>
          <span v-if="attachments.length > 0">{{`${$t('contact.index.countFilesMsg')} ${attachments.length} ${$t('contact.index.files')}`}}</span>
        </b-col>
      </b-row>
      <div class="requesttypeform" v-if="isLogged && isntAdmin">
        <div class="form-title">
          {{$t('contact.responseType')}} <span class="red">*</span>
        </div>
        <div class="select-group">
          <b-form-select v-model="responseType" :options="responseOptions" class="col-50" />
          <div class="form-group col-50" v-if="responseType === 2">
            <div class="label"> 
              {{$t('contact.index.address')}} <span class="red">*</span>
            </div>
            <b-input  type="text" v-model="currentUser.address" disabled/>
          </div>
        </div>
      </div>
      <br>
      <div class="form-title">
        {{$t('contact.termAndUse')}}
      </div>
      <div :class="{ error: errors.has('terminos'), border: true, requesttypeform: true }" v-if="isLogged && isntAdmin">
        <div class="message">
          {{termsAndCondition}}
        </div>
        <div class="group right">
          <input type="checkbox" id="terminos" name="terminos" value="terminos" v-model="acceptTerms" v-validate="'required'">
          <label for="felicitacion">{{$t('contact.index.terms_conditions')}}</label>
        </div>
        <span  v-if="errors.has('terminos')" >{{ errors.first('terminos') }}</span>
      </div>
      <div v-if="isLogged && isntAdmin" class="d-flex justify-content-center btn-container">
        <sipsder-btn @onClick="send" btnType="send" 
                :text="$t('contact.index.send')" :title="$t('contact.sendRequest')" 
                :disabled="errors.any()">
        </sipsder-btn>
      </div>
      <b-row>
        <b-col cols="12" class="d-flex justify-content-center">
          <sipsder-btn @onClick="back" btnType="back" title="Regresar">
          </sipsder-btn>
        </b-col>
      </b-row>
    </div>
    <b-modal ref="modification_success" :title="$t('contact.index.modification')" centered hideFooter>
        <div>
          <b-row>
            <b-col cols="12">
              <b><label > {{$t('contact.index.modificationMsg')}} </label></b>
            </b-col>
          </b-row>
        </div>
        <div>
          <b-row>
            <b-col class="text-center">
              <sipsder-btn @onClick="closeSuccessModal" btnType="accept" title="Entiendo">
              </sipsder-btn>
            </b-col>
          </b-row>
        </div>
      </b-modal>
      <b-modal ref="return" :title="$t('contact.index.systemAlert')" centered hideFooter>
        <div>
          <b-row>
            <b-col cols="12">
              <b><label > {{$t('contact.index.systemMsg')}} </label></b>
            </b-col>
          </b-row>
        </div>
        <div>
          <b-row>
            <b-col class="text-center">
              <sipsder-btn @onClick="closeReturnModal" btnType="cancel" title="Entiendo">
              </sipsder-btn>
              <sipsder-btn @onClick="redirect" btnType="accept" title="Entiendo">
              </sipsder-btn>
            </b-col>
          </b-row>
        </div>
      </b-modal>
      <b-modal ref="creation_success" :title="$t('contact.index.requestTitle')" centered hideFooter>
        <div>
          <b-row>

            <b-col cols="12">
              <b><label > {{$t('contact.index.requestMsg')}} </label></b>
            </b-col>

          </b-row>

        </div>
        <div>
          <b-row>
            <b-col class="text-center">
              <sipsder-btn @onClick="closeCreactionSuccessModal" btnType="accept" title="Entiendo">
              </sipsder-btn>
            </b-col>
          </b-row>
        </div>
      </b-modal>
      <b-modal ref="channel_error_success" :title="$t('contact.index.requestTitle')" centered hideFooter>
        <div>
          <b-row>

            <b-col cols="12">
              <b><label > {{$t('contact.index.errorMsg')}} </label></b>
            </b-col>

          </b-row>

        </div>
        <div>
          <b-row>
            <b-col class="text-center">
              <sipsder-btn @onClick="closeChannelErrorModal" btnType="accept" title="Entiendo">
              </sipsder-btn>
            </b-col>
          </b-row>
        </div>
      </b-modal>
      <b-modal ref="type_error_success" :title="$t('contact.index.requestTitle')" centered hideFooter>
        <div>
          <b-row>

            <b-col cols="12">
              <b><label > {{$t('contact.index.errorMsg2')}} </label></b>
            </b-col>

          </b-row>

        </div>
        <div>
          <b-row>
            <b-col class="text-center">
              <sipsder-btn @onClick="closeTypeErrorModal" btnType="accept" title="Entiendo">
              </sipsder-btn>
            </b-col>
          </b-row>
        </div>
      </b-modal>
      <b-modal ref="info" :title="$t('contact.information')" size="lg" centered hideFooter>
        <div>
          <b-row>

            <b-col cols="4">
              <h4>{{$t('contact.code')}}</h4>
              <h4 v-if="info != null">{{info.code}}</h4>
              <h4>{{$t('contact.date')}}</h4>
              <h4 v-if="info != null">{{info.startDate}}</h4>
            </b-col>
            <b-col cols="8">
              <div class="checkbox-container">
                <div class="group" v-for="v in requestTypesDetail" :key="v.id">
                  <input type="checkbox" :id="v.id" :value="v.id" disabled checked>
                  <label for="consulta">{{v.type}}</label>
                </div>
              </div>
            </b-col>

          </b-row>
          <br>
          <b-row>

            <b-col cols="12" style="text-align: center">
              <div class="modal-info">
                <h4>{{$t('contact.userType')}}</h4>
                <h4 v-if="info != null">{{info.typeName}}</h4>
              </div>
              <div class="modal-info">
                <h4>{{$t('contact.country')}}</h4>
                <h4 v-if="info != null">{{info.country}}</h4>
              </div>
              <div class="modal-info">
                <h4>{{$t('contact.city')}}</h4>
                <h4 v-if="info != null">{{info.geo}}</h4>
              </div>
              <div class="modal-info">
                <h4>{{$t('contact.localidad')}}</h4>
                <h4 v-if="info != null">{{info.geo}}</h4>
              </div>
            </b-col>
            
          </b-row>
          <br>
          <b-row>

            <b-col cols="4">
              <h4>{{$t('contact.email')}}</h4>
              <h4 v-if="info != null">{{info.userEmail}}</h4>
            </b-col>
            <b-col cols="8">
              <h4>{{$t('contact.userName')}}</h4>
              <h4 v-if="info != null">{{info.userFirstName + " " + info.userLastName}}</h4>
            </b-col>

          </b-row>
          <br>
          <b-row>

            <b-col cols="12" style="text-align: center">
              <div class="modal-info">
                <h4>{{$t('contact.state')}}</h4>
                <b-form-select v-model="state_selected_answer" :options="options_state_answer" />
              </div>
              <div class="modal-info">
                <h4>{{$t('contact.responseMedium')}}</h4>
                <h4 v-if="info != null">{{info.channel}}</h4>
              </div>
              <div class="modal-info">
                <h4>{{$t('contact.responseDate')}}</h4>
                <h4 v-if="info != null">{{info.geo}}</h4>
              </div>
              <div class="modal-info">
                <h4>{{$t('contact.responseUser')}}</h4>
                <h4 v-if="info != null">{{info.geo}}</h4>
              </div>
            </b-col>

          </b-row>

        </div>
        <div>
          <b-row>
            <b-col class="text-center">
              <sipsder-btn @onClick="closeInfoModal" btnType="accept" title="Entiendo">
              </sipsder-btn>
            </b-col>
          </b-row>
        </div>
      </b-modal>
    
      <!-- Add image modal -->
      <b-modal ref="addImageModal" id="addImageModal"  size="lg" class="image-modal" centered :title="$t('audiovisual_media.index.title_modal')" hide-footer>
        
        <audiovisualmedia @created_image="created_image($event)" :banner="false" 
          @cancel="hideNewImage" v-if="show"
          :media-options="mediaOptions" :allow-selection="false"
        ></audiovisualmedia>

      </b-modal>

  </b-container>
</template>

<script>
import VAPI from '../../../http_common'
import {SERVICE_NAMES, HTTP_STATUS, DOMAINS, TEMPLATES/*, RECAPTCHA_SITE_KEY*/} from "../../../sipsder_constants";
//import VueRecaptcha from 'vue-recaptcha'
import RichText from '../../shared/RichText.vue'
import FilterTable from '../../shared/FilterTable.vue'
import {PERMISSIONS_TYPES, ATTACHMENT_TYPE} from "../../../domain_constants";
import audiovisualmedia from '../audiovisual_media/AudioVisualIndex.vue';
import Datepicker from 'vuejs-datepicker';
import moment from 'moment'

export default {
  data(){
    return {
      TEMPLATES:TEMPLATES,
      email: '',
      name: '',
      country: '',
      lastname: '',
      city: '',
      locality: '',
      requestOptions: [],
      characters: 4000,
      submitted: true,
      content: '',
      file: null,
      files: [],
      filesLimit: 10,
      acceptTerms: [],
      address: '',
      responseType: null,
      responseOptions: [{
        value: null,
        text: 'Medio de respuesta'
      }],
      contact: null,
      idContact: null,
      direction: null,
      fax: null,
      schedule: null,
      telephone: null,
      email: null,
      editAdmin: false,
      editAdminData: false,
      dataContactdata: null,
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
      editAdminDataRich: false,
      user: null,
      termsAndConditionContact: null,
      options_table: {
        "detail": {
          "id": 0,
          "class": "btn-success",
          "label": "",
          "icon": 'search'
        }   
      },
      requestsQuery: {
        "size": 10
      },
      items: 'getRequests',
      fields_t: [
        {
          key: 'code',
          label: 'Codigo',
          sortable: true,
          'class': 'text-center'
        },
        {
          key: 'userFirstName',
          label: 'Nombre',
          sortable: true
        },
        {
          key: 'userLastName',
          label: 'Apellido',
          sortable: true
        },
        {
          key: 'typeName',
          label: 'Tipo de usuario',
        },
        {
          key: 'geo',
          label: 'Localidad',
          // sortable: true,
        },
        {
          key: 'startDate',
          label: 'Fecha de creación',
          sortable: true
        },
        {
          key: 'channel',
          label: 'Medio de respuesta',
        },
        {
          key: 'actions',
          label: 'Acción'
        }
      ],
      excelFields: {
        'Codigo': 'code',
        'Dia de solicitud': 'startDate',
        'Contenido': 'content',
        'Nombre usuario': 'userFirstName',
        'Apellido usuario': 'userLastName',
        'Email usuario': 'userEmail',
        'Tipo usuario': 'typeName',
        'Localizacion': 'geo',
        'Pais': 'country',
        'Canal de respuesta': 'channel',
        'Nombre administrador': 'adminFirstName',
        'Apellido administrador': 'adminLastName',
        'Dia de respuesta': 'replyDate'
      },
      requestTypes: null,
      requestTypesDetail: null,
      responseChannel: [],
      attachments: [],
      info: null,
      options_state_answer: [
          {
            value: null,
            text: 'Sin responder'
          },
          {
            value: 1,
            text: 'Respondido'
          }
      ],
      options_type: [
      {
        value: null,
        text: 'Tipo de solicitud'
      }],
      state_selected_answer: null,
      mediaOptions: [
        {value: ATTACHMENT_TYPE.CONTACT, text: "Contacto"}
      ],
      search_type: null,
      search_channel: null,
      search_user: null,
      search_email: null,
      search_user_email: null,
      show: false,
      type_users: [{
        value: null,
        text: 'Tipo usuario'
      }],
      user_type: null,
      searchDateStart: null,
      searchDateEnd: null,
      contactMessage: false,
      //captchaVerified: false
    }
  },
  computed: {
    /*siteKey() {
      return RECAPTCHA_SITE_KEY;
    },*/
    isMenuFixed(){
      return this.$store.getters.isMenuFixed
    },
    isResponsive(){
      return this.$store.getters.isResponsive
    },
    isMobile(){
      return this.$store.getters.isMobile
    },
    isLogged(){
      return this.$store.getters.isAuthenticated
    },
    isAdmin(){
      return this.$store.getters.hasPermission(PERMISSIONS_TYPES.ADMIN);
    },
    isntAdmin(){
      return !this.$store.getters.hasPermission(PERMISSIONS_TYPES.ADMIN);
    },
    currentUser(){
      return this.$store.getters.getCurrentUser
    },
    dataContact(){
      return this.dataContactdata
    },
    termsAndCondition(){
      return this.termsAndConditionContact
    },
    searchenddisabledDates() {
      return { to: new Date(this.searchDateStart) }  // Disable all dates after specific date
    },
    excelName( ) {
      let today = new Date( );
      return 'solicitudes_al_' + today.getDate( ) 
        + '_' + ( parseInt( today.getMonth( ) ) + 1 )  + '_' + today.getFullYear( );
    } 
    
    
  },
  methods: {
    prepareFormData() {
      let form = new FormData();
      form.append("date", JSON.stringify(Date.now()));
      form.append("content", JSON.stringify(this.content));
      form.append("responseChannelId", JSON.stringify(this.responseType));
      form.append("types", JSON.stringify(this.requestOptions));
      if (this.files && this.files.length > 0) {
        for (var i = 0; i < this.files.length; i++) {
          form.append("attachments", this.files[i]);
        }
      }
      return form;
    },
    send() {
      this.$validator.validate().then(valid => {
        if (valid) {
          if( this.requestOptions.length !== 0 ){
            if( this.responseType !== null ){
              let sendRequest = this.prepareFormData();

              VAPI.post(`${SERVICE_NAMES.REQUEST}`, sendRequest, { headers: { 'Content-Type': 'multipart/form-data' } }).then(response => {
                if (response.status === HTTP_STATUS.OK) {
                  this.$refs.creation_success.show()
                  this.content = null
                  this.requestOptions = []
                  this.responseType = null
                  this.attachments =  []
                  //this.captchaVerified = false
                  this.acceptTerms = []
                  //this.$refs.recaptcha.reset();
                  this.$validator.reset();
                } else {
                  alert("Error creando la solicitud");
                  console.info("Error creando la solicitud", response);
                }
              }).catch((e) => {
                alert("Error creando la solicitud")
              });
            }else{
              this.$refs.channel_error_success.show()
            }
          }else{
              this.$refs.type_error_success.show()
          }
        }
      });

      
    },
    customFormatter(date) {
      return moment(date).format('YYYY-MM-DD');
    },
    back(){
      this.$refs.return.show()
    },
    deleteFile(i){
      this.files.splice(i, 1);
    },
    addNewFile(e){
      
      if (!this.file || this.file.type !== "application/pdf")
          return;
      
      this.files.push(this.file);
      
      this.$refs.addAttachment.reset();
    },
    addFile(){
      this.files.push(null)
    },
    count(){
      this.characters = 4000 - this.content.length
    },
    editAdministrator(){
      this.editAdmin = true
    },
    editContactData(){
      this.editAdminData = true
    },
    async saveContactData(){
      try {
        let response = await VAPI.put(`${SERVICE_NAMES.SIPSDER}/${this.dataContact.id}`, this.dataContact);
        this.dataContactBackup = this.dataContactdata;
        this.$refs.modification_success.show();
        this.editAdminData = false;
        this.editAdminDataRich = false;
      } catch(e){
        console.info("Problemas al realizar la solicitud");
      }
    },
    discardContactData(){
      this.dataContactdata = this.dataContactBackup
      this.editAdminDataRich = false
    },
    discardContact(){
      this.dataContactdata = this.dataContactBackup
      this.editAdminData = false
    },
    changeValue(value){
      this.dataContactdata.contact = value
    },
    closeSuccessModal(){
      this.$refs.modification_success.hide()
    },
    closeReturnModal(){
      this.$refs.return.hide()
    },
    redirect(){      
      window.history.back();
    },
    closeCreactionSuccessModal(){
      this.$refs.creation_success.hide();
      this.$router.push({name:"Home"});
    },
    editContactDataRich(){
      this.editAdminDataRich = true
    },
    discardSearch() {
      this.search_type = null;
      this.search_channel = null;
      this.search_user = null;
      this.search_email = null;
      this.search_user_email = null;
      this.searchDateStart= null;
      this.searchDateEnd= null;
      this.requestsQuery = {
        "size": 10
      }
    },
    search(){
      if( this.searchDateStart === null && this.searchDateEnd !== null ){

        this.requestsQuery = {
          "size": 10,
          "type": this.search_type,
          "response": this.search_channel,
          "email": this.search_email,
          "end-date": moment(this.searchDateEnd).format('DD-MM-YYYY'),
          "user-email": this.search_user_email,
          "user-name": this.search_user,
          "user-type": this.user_type
        }

      }else if( this.searchDateStart !== null && this.searchDateEnd === null ){

        this.requestsQuery = {
          "size": 10,
          "type": this.search_type,
          "response": this.search_channel,
          "email": this.search_email,
          "start-date": moment(this.searchDateStart).format('DD-MM-YYYY'),
          "user-email": this.search_user_email,
          "user-name": this.search_user,
          "user-type": this.user_type
        }

      }else if( this.searchDateStart !== null && this.searchDateEnd !== null ){

        this.requestsQuery = {
          "size": 10,
          "type": this.search_type,
          "response": this.search_channel,
          "email": this.search_email,
          "start-date": moment(this.searchDateStart).format('DD-MM-YYYY'),
          "end-date": moment(this.searchDateEnd).format('DD-MM-YYYY'),
          "user-email": this.search_user_email,
          "user-name": this.search_user,
          "user-type": this.user_type
        }

      }else{

        this.requestsQuery = {
          "size": 10,
          "type": this.search_type,
          "response": this.search_channel,
          "email": this.search_email,
          "user-email": this.search_user_email,
          "user-name": this.search_user,
          "user-type": this.user_type
        }

      }
      
    },
    closeChannelErrorModal(){
      this.$refs.channel_error_success.hide()
    },
    closeTypeErrorModal(){
      this.$refs.type_error_success.hide()
    },
    closeInfoModal(){
      this.$refs.info.hide()
    },
    action(index){
      switch(index.id) {
          case 0:
              //localStorage.contact = index.item;
              // localStorage.setItem('contact', JSON.stringify(index.item));
              this.$router.push({ name: 'ContactDetail', params: { url: index.item.id } });
              break;
          default:
              console.log("ningun caso")
      }
    },
    addNewImage(){
      this.show = true
      this.$refs.addImageModal.show();
    },
    hideNewImage(){
      this.show = false
      this.$refs.addImageModal.hide();
    },
    created_image(response){
      this.attachments.push(response[0]);
      //this.current_image.imageId = ;
      this.hideNewImage()
    },
    sureBack(){
      window.history.back();
    },
    editContactMessage(){
      this.contactMessage = true
    },
    async getStatistics( ) {
      try{
        let response = await VAPI.get(`${SERVICE_NAMES.REQUEST}/download`, {
          responseType: "blob",
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "Reporte-solicitudes.xlsx");
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      }catch(error){
        console.log(error);
        this.errorMessage = error.response.data.message;
      }
      
    }
  },
  mounted(){
    
    VAPI.get(`${SERVICE_NAMES.POLICY_TOOL}/find-contact`)
    .then(response => {
        this.termsAndConditionContact = response.data.content
    }).catch(function(error) {
        console.log("Error al Consumir servicio Termns and conditions: " + error);
    });
    VAPI.get(`${SERVICE_NAMES.SIPSDER}`).then(response => {
      this.dataContactdata = response.data.data[0]
      this.dataContactBackup = Object.assign({}, response.data.data[0]);
    })
    if (this.isLogged) { 
      VAPI.get(`${SERVICE_NAMES.REQUEST}/types`).then(response => {
        this.requestTypes = response.data.data

        for ( var index in this.requestTypes) { 
          var types = this.requestTypes[index]
          var ob = {  
            "value": types.id,
            "text": types.type
          }  
          this.options_type.push( ob )
        }
      })
      VAPI.get(`${SERVICE_NAMES.RESPONSE_CHANNEL}`).then(response => {
        this.responseChannel = response.data.data

        for ( var index in this.responseChannel) { 
          var response_channel = this.responseChannel[index]
          var ob = {  
            "value": response_channel.id,
            "text": response_channel.channel
          }  
          this.responseOptions.push( ob )
        }
            
      })

      VAPI.get(`${SERVICE_NAMES.USER_TYPE}`)
      .then(response => {
          var respo = response.data
          for (var index_type in respo.data) {
            var temp1 = {
                "value": respo.data[index_type].id,
                "text": respo.data[index_type].type
            }
            this.type_users.push( temp1 );
          }
      })
    }
    this.requestsQuery = {
      "size": 10
    }
  },
  components: {
    //'vue-recaptcha': VueRecaptcha,
    RichText,
    FilterTable,
    audiovisualmedia,
    Datepicker
  }
}
</script>

<style lang="sass" scoped>
  @import '../../../stylesheets/style.sass'
  
  .modal-info
    display: inline-block
    min-width: 25%
  .btn-container
    margin: 25px
    +flexbox
    +justify-content(center)
    +align-items(center)
    flex-direction: row
    padding: 1%
    .btn
      margin: 1% 0
      font-size: 1.5rem
  .table
    font-size: 1.5rem
    text-align: center
    color: black
  .right
    margin: 10px 0
    align-self: flex-end !important
    input[type="checkbox"]
      margin-right: 10px
  .border
    border: 1px solid black
    padding: 1%
    height: 250px
    overflow-y: auto
    justify-content: flex-start !important
  .error
     border: 2px solid red !important
  .select-group
    width: 100%
    +flexbox
    +justify-content(flex-start)
    +align-items(center)
  .col-50
    width: 45% !important
    margin-right: 5%
  .red
    color: $colorDanger
  .contact-container
    width: 100%
    padding: 0 5%
    +flexbox
    +flex-direction(column)
    text-align: center
  .title
    text-align: center
    font-weight: 600
    text-transform: uppercase
  .content-form
    margin-top: 15px
    padding: 1%
    width: 100%
    +flexbox
    +justify-content(flex-start)
    +flex-direction(column)
  .description-container
    padding: 1%
    +flexbox
    +justify-content(center)
    +align-items(center)
  .description
    width: 40%
    margin-right: 5%
    font-weight: 200
  .about
    border: 1px solid black
    width: 55%
    font-weight: 200
  .about-heading
    padding: 1% 5%
    +flexbox
    +justify-content(center)
    +align-items(center)
  .about-image
    width: 50px
    height: 50px
  .about-title
    width: 80%
    font-size: 2rem
    font-weight: 400
    text-align: right
  .about-title-edit
    width: 10%
    font-size: 2rem
    font-weight: 400
    text-align: right
  .about-content
    padding: 1% 3.5%
    +flexbox
    +justify-content(flex-start)
    +align-items(flex-start)
    +flex-direction(column)
    .text
      +flexbox
      width: 100%
      .edit-admin-text
        min-width: 35%
      input
        margin-left: 10px
  .text
    font-size: 1.5rem
  .message
    margin-top: 15px
    font-size: 1.2rem
  .title-container
    margin-top: 20px
    +flexbox
    +justify-content(flex-start)
    +align-items(center)
  .form-title
    margin-right: 2.5%
    text-transform: uppercase
    font-weight: 400
  .highlighted
    color: $colorSidebarMobile
    font-size: 1.2rem
  .link
    cursor: pointer
    text-decoration: underline
    color: darken($colorSidebarMobile,10)
  .general-info-form
    margin-top: 15px
    width: 100%
    +flexbox
    +justify-content(flex-start)
    +align-items(center)
    .part-one
      +flexbox
      +justify-content(center)
      +align-items(center)
      +flex-direction(column)
      width: 47.5%
      margin-right: 2.5%
      input
        border-radius: 10px
    .part-two
      +flexbox
      +justify-content(center)
      +align-items(center)
      +flex-direction(column)
      margin-left: 2.5%
      width: 47.5%
      input
        border-radius: 10px
    .part-one-admin
      +flexbox
      +justify-content(flex-start)
      +align-items(flex-start)
      +flex-direction(column)
      width: 100%
      margin-left: 5%
    .search-admin
      +flexbox
      +justify-content(center)
      +align-items(center)
      +flex-direction(row)
      flex-wrap: wrap
      width: 100%
      .search-field
        +flexbox
        +justify-content(center)
        +align-items(center)
        +flex-direction(column)
        max-width: 30%
        width: 30%
        height: 100px
        margin: 10px 10px 10px 10px
      .row
        +flexbox
        +justify-content(center)
        +align-items(center)
        +flex-direction(column)
        width: 100%
        h4
          max-width: 50%
        .custom-select
          max-width: 50%
      .buttons
        +flexbox
        +justify-content(center)
        +align-items(center)
        +flex-direction(row)

  .login
    margin-top: 15px
    width: 100%
    height: 200px
    +flexbox
    +justify-content(center)
    +align-items(center)
  .form-group
    margin-top: 15px
    width: 100%
    +flexbox
    +justify-content(flex-start)
    +align-items(center)
    +flex-wrap(nowrap)
    .label
      width: 150px
      font-size: 1rem
      margin-right: 1%
    input
      padding: 5px
      width: 100%
      height: 4vh
      border-radius: unset
  .file
    +flexbox
    +justify-content(center)
    +align-items(flex-start)
    flex-wrap: nowrap
    margin: 10px 0
    input[type="file"]
      margin-right: 10px
    i
      font-size: 1.5rem
      color: $colorSubFooter
      cursor: pointer
      &:hover
        color: $colorDanger
  .requesttypeform
    margin-top: 15px
    width: 100%
    +flexbox
    +justify-content(center)
    +align-items(flex-start)
    +flex-direction(column)
    textarea
      margin-top: 5px
      width: 100%
      border-radius: unset
      padding: 1.5%
  .characters-count
    font-size: 1rem
    align-self: flex-end
  .checkbox-container
    width: 100%
    padding: 1.5%
    +flexbox
    +justify-content(flex-start)
    +align-items(center)
    +flex-wrap(wrap)
    .group
      margin-top: 5px
      width: 25%
      +flexbox
      +justify-content(flex-start)
      +align-items(center)
      flex-wrap: nowrap
      input[type="checkbox"]
        width: 1.2rem
        height: 1.2rem
        margin-right: 10px
      label
        padding: unset
        margin: unset
  .edit-admin
    text-align: right
  .edit-action
    width: 100%
    text-align: right
  @media screen and (max-width: $widthTablet)
    .col-90
      width: 80% !important
      margin: 0 auto
  @media screen and (min-width: $widthMobile) and (max-width: $widthTablet)
    .btn-container
      .btn
        font-size: 2rem
    .right
      input[type="checkbox"]
        width: 1.3rem
        height: 1.3rem
      label
        font-size: 1.3rem
    // .border
    .select-group
      flex-wrap: wrap
    .col-50
      width: 100% !important
    // .red
    // .contact-container
    .title
      font-size: 3.5rem
    // .content-form
    .description-container
      flex-wrap: wrap
    .description
      width: 90%
      margin: 1% 5%
      font-size: 2rem
    .about
      width: 90%
      margin: 1% 5%
      font-size: 2.0rem
    // .about-heading
    // .about-image
    .about-title
      font-size: 2.5rem
    // .about-content
    .text
      font-size: 2.0rem
    .message
      font-size: 1.7rem
    // .title-container
    .form-title
      font-size: 2.0rem
    .highlighted
      font-size: 1.5rem
    // .link
    .general-info-form
      flex-wrap: wrap
      .part-one
        width: 95%
        margin: 1% 2.5%
      .part-two
        width: 95%
        margin: 1% 2.5%
    .form-group
      .label
        font-size: 1.5rem
      input
        padding: 5px
        width: 100%
        height: 4vh
        border-radius: unset
    .file
      input[type="file"]
        margin-right: 10px
      i
        font-size: 2rem
    .requesttypeform
      textarea
        font-size: 1.5rem
      button
        font-size: 1.7rem
    .characters-count
      font-size: 1.5rem
    .checkbox-container
      .group
        width: 33%
        input[type="checkbox"]
          width: 1.7rem
          height: 1.7rem
        label
          font-size: 1.3rem
  @media screen and (max-width: $widthMobile)
    .btn-container
      .btn
        font-size: 1.5rem
    .right
      input[type="checkbox"]
        width: 1.3rem
        height: 1.3rem
      label
        font-size: 1.3rem
    // .border
    .select-group
      flex-wrap: wrap
    .col-50
      width: 100% !important
    // .red
    .contact-container
      padding: 1px
      margin-left: 0
      margin-right: 0
    .title
      font-size: 3rem
    // .content-form
    .description-container
      flex-wrap: wrap
    .description
      width: 98%
      margin: 1%
      font-size: 1.5rem
    .about
      width: 98%
      margin: 1%  
      font-size: 1.5rem
    // .about-heading
    // .about-image
    .about-title
      font-size: 1.5rem
    // .about-content
    .text
      font-size: 1.0rem
    .message
      font-size: 1.2rem
    // .title-container
    .form-title
      font-size: 1.5rem
    .highlighted
      font-size: 1.0rem
    // .link
    .general-info-form
      flex-wrap: wrap
      .part-one
        width: 95%
        margin: 1% 2.5%
      .part-two
        width: 95%
        margin: 1% 2.5%
    .form-group
      .label
        font-size: 1.5rem
      input
        padding: 5px
        width: 100%
        height: 4vh
        border-radius: unset
    .file
      input[type="file"]
        margin-right: 4px
      i
        font-size: 1.2rem
    .requesttypeform
      textarea
        font-size: 1.2rem
      button
        font-size: 1.3rem
    .characters-count
      font-size: 1.3rem
    .checkbox-container
      .group
        width: 100%
        input[type="checkbox"]
          width: 1.2rem
          height: 1.2rem
        label
          font-size: 1.3rem
  .filter-container
    width: 100%
    display: flex
    justify-content: center
    align-items: center
    flex-wrap: nowrap
    padding: 15px 15px 5px 15px
    border-radius: 10px
    background-color: $colorTitleDark
    color: white
    .title-fitler
      color: white
      font-style: italic
      color: white
      font-weight: bolder
      font-size: 2.5rem
</style>
