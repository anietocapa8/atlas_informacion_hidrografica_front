<template>
    <div>
        <b-container class="container-form">
            
            <sipsder-title :title="$t('profile.title').toUpperCase()"
                      :text="$t('profile.initialText')"
            ></sipsder-title>

            <b-row>
                <b-col cols="10" offset="1">

                    <b-card no-body class="overflow-hidden">
                        <b-row no-gutters>
                            <b-col md="9" class="vl">
                                <b-card-body>

                                    <b-row>
                                        <!-- parte izquierda de los datos del usuario al registrarse -->
                                        <b-col cols="12" md="6"> 
                                            <b-row>
                                                <b-col class="font-weight-bold d-flex justify-content-center">
                                                    {{$t('profile.basicData')}}
                                                </b-col>
                                            </b-row>
                                            <br>
                                            <b-form-group horizontal
                                                label-class="font-weight-bold"
                                                label-cols="3"
                                                label-size="lg"
                                                :label="$t('profile.email') + TEMPLATES.MANDATORY_SYMBOL"
                                                :invalid-feedback="errors.first('emailInput')"
                                            >
                                                <b-form-input 
                                                    v-if="editMode" 
                                                    v-model="user.email"
                                                    name ="emailInput"
                                                    :data-vv-as="$t('profile.email')"
                                                    v-validate="'required|max:90|email'"
                                                    :state="validateState('emailInput')"
                                                >
                                                </b-form-input>
                                                <div v-else>
                                                    <label style="padding-top: 5px">
                                                        {{user.email}}
                                                    </label>
                                                </div>
                                            </b-form-group>

                                            <div v-for="key in arrKeys" :key="key">
                                                <b-form-group horizontal
                                                    label-class="font-weight-bold"
                                                    label-cols="3"
                                                    label-size="lg"
                                                    :label="$t('profile[\'' + key +'\']') + TEMPLATES.MANDATORY_SYMBOL"
                                                    :invalid-feedback="errors.first(key)"
                                                >
                                                    <b-form-input 
                                                        v-if="editMode" 
                                                        v-model="user[key]"
                                                        :name ="key"
                                                        :data-vv-as="$t('profile[\'' + key +'\']')"
                                                        v-validate="{required: true, max: 90}"
                                                        :state="validateState(key)"
                                                    >
                                                    </b-form-input>
                                                    <div v-else>
                                                        <label style="padding-top: 5px">
                                                            {{user[key]}}
                                                        </label>
                                                    </div>
                                                </b-form-group>
                                            </div>
                                            
                                            <b-form-group horizontal
                                                label-class="font-weight-bold"
                                                label-cols="3"
                                                label-size="lg"
                                                :label="$t('profile.sex') + TEMPLATES.MANDATORY_SYMBOL"
                                                :invalid-feedback="errors.first('selectSex')"
                                            >
                                                <b-form-select 
                                                    v-if="editMode" 
                                                    :options="autocomplets.sex" 
                                                    v-model="user['sex']" 
                                                    label="value"
                                                    name="selectSex"
                                                    :data-vv-as="$t('profile.sex')"
                                                    v-validate="{required: true}"
                                                    :state="validateState('selectSex')"
                                                />
                                                <div v-else>
                                                    <label style="padding-top: 5px" v-if="user['sex']">
                                                        {{user['sex'].value}}
                                                    </label>
                                                </div>
                                            </b-form-group>
                                            
                                        </b-col>
                                        <!-- parte derecha de los datos del usuario al registrarse -->
                                        <b-col cols="12" md="6">
                                            <b-row>
                                                <b-col class="font-weight-bold d-flex justify-content-center">
                                                    {{$t('profile.locationData')}}
                                                </b-col>
                                            </b-row>
                                            <br>
                                            <b-form-group horizontal
                                                label-class="font-weight-bold"
                                                label-cols="4"
                                                label-size="lg"
                                                :label="$t('profile.country') + TEMPLATES.MANDATORY_SYMBOL"
                                                :invalid-feedback="errors.first('country')"
                                                :description="getSpecialFieldsError('country')"
                                            >
                                                <!-- <b-form-input v-if="editMode" v-model="user.country" transition class="s-slide">
                                                </b-form-input> -->

                                                <vue-select 
                                                    required 
                                                    :state="validateState('country')"
                                                    v-if="editMode" v-model="user.country" 
                                                    name="country"
                                                    :data-vv-as="$t('profile.country')"
                                                    v-validate="{required: true}"
                                                    label="text" :options="autocomplets.countries" class="s-slide">
                                                </vue-select>

                                                <div v-else-if="user['country']" class="s-slide">
                                                    {{user['country'].text}}
                                                </div>
                                            </b-form-group>
                                            
                                            <b-form-group horizontal
                                                label-class="font-weight-bold"
                                                label-cols="4"
                                                label-size="lg"
                                                :label="$t('profile.department')"
                                            >
                                                <vue-select 
                                                    required v-if="editMode" 
                                                    v-model="user.department" label="text" 
                                                    :options="getDepartments()" 
                                                    :disabled="!showDepartmentField">
                                                </vue-select>

                                                <div v-else-if="user['city']">
                                                    <span>{{user['city'].text}}</span>
                                                </div>
                                            </b-form-group>

                                            <b-form-group horizontal
                                                label-class="font-weight-bold"
                                                label-cols="4"
                                                label-size="lg"
                                                :label="$t('profile.city')"
                                            >
                                                <vue-select 
                                                    required v-if="editMode" 
                                                    v-model="user.city" label="text" 
                                                    :options="getCities()" :disabled="!showCityField">
                                                </vue-select>

                                                <div v-else-if="user['city']">
                                                    <span>{{user['city'].text}}</span>
                                                </div>
                                            </b-form-group>

                                            <b-form-group horizontal
                                                label-class="font-weight-bold"
                                                label-cols="4"
                                                label-size="lg"
                                                :label="$t('profile.localidad')"
                                            >
                                                <!-- <b-form-input v-if="editMode" v-model="user.localidad">
                                                </b-form-input> -->

                                                <vue-select required v-if="editMode" v-model="user.localidad" 
                                                    label="text" :options="getLocalidad()" :disabled="!showLocalidadField()">
                                                </vue-select>

                                                <div v-else-if="user.localidad">
                                                    <span>{{user.localidad.text}}</span>
                                                </div>
                                            </b-form-group>

                                            <!-- <b-row class="text-right">
                                                <b-col cols="12" v-if="!editMode">
                                                    <sipsder-btn @onClick="changeMode(true)" text="" btnType="edit_pen">

                                                    </sipsder-btn>

                                                </b-col>
                                                <b-col cols="12" v-if="editMode">
                                                    <sipsder-btn @onClick="updateSelected" text="" btnType="accept">

                                                    </sipsder-btn>

                                                    <sipsder-btn @onClick="cancelSelected" text="" btnType="cancel" style="margin-left: 1rem;">

                                                    </sipsder-btn>
                                                </b-col>
                                            </b-row> -->

                                        </b-col>
                                    </b-row>
                                    
                                </b-card-body>
                            </b-col>
                            <b-col md="3" class="align-self-center">
                                
                                <div class="img-container">
                                    <b-card-img :src="getProfileImage" alt="Imagen de perfil" >
                                    </b-card-img>
                                    <input type="file"
                                        name="profileImage" 
                                        @change="saveImage('profileImage', $event)"
                                        v-validate="{mimes:['image/*'], size:2000}" 
                                        ref="profileImage"
                                        :style="'visibility: hidden'"
                                        :data-vv-as="$t('profile.profilePictureField')"/>
                                    <sipsder-btn btnType="uploadImage" 
                                        :text="$t( 'profile.changeProfilePicture' )" class="aux-class"
                                        @onClick="$refs.profileImage.click()">                                            
                                    </sipsder-btn>
                                    <span v-if="errors.has('profileImage')" class="error-msg">
                                        {{ imageErrors }}
                                    </span>
                                </div>
                                
                            </b-col>
                        </b-row>
                    </b-card>
                </b-col>
            </b-row>
                <!-- <b-col cols="12" md="4" class="text-center">
                    <img src="@/assets/profile.png"/>
                </b-col> -->
            
            <!-- mas informacion del usuario -->
            <hr />
            <!-- locacion / lugar de vivienda -->
            <b-form @submit.prevent="onSubmit">
                <b-row>
                    <b-col cols="12" md="6">
                        <b-form-group 
                            label-size="lg"
                            :label="$t('profile.address')"
                            :invalid-feedback="errors.first('address')"
                        >
                            <b-form-input 
                                name='address'
                                :data-vv-as="$t('profile.address')"
                                v-validate="{max: 120}"
                                :state="validateState('address')"
                                v-model="user.address">
                            </b-form-input>
                        </b-form-group>
                    </b-col>
                    <b-col cols="12" md="6">
                        <b-form-group 
                            label-size="lg"
                            :label="$t('profile.birthDate')"
                            :invalid-feedback="errors.first('birthDate')"
                            :description="getSpecialFieldsError('birthDate')"
                        >
                            <!-- <b-form-input type="date" v-model="user.birthDate">
                            </b-form-input> -->
                            <datepicker :placeholder="$t('util.insertDate')" 
                                        class="date-picker"
                                        :calendar-button = "true"
                                        v-model="user.birthDate"
                                        :language = "languages[language]"
                                        calendar-button-icon = "fa fa-calendar"
                                        :clear-button = "true"
                                        :disabledDates="disabledDates"
                                        name="birthDate"
                                        :data-vv-as="$t('profile.birthDate')"
                                        v-validate="{required: true}"
                                        :state="validateState('birthDate')"
                                        >
                            </datepicker>
                        </b-form-group>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col cols="12" md="6">
                        <b-form-group
                            label-cols="4"
                            label-size="lg"
                            :label="$t('profile.gender') + TEMPLATES.MANDATORY_SYMBOL"
                            :invalid-feedback="errors.first('gender')"
                        >
                            <b-form-select 
                                name='gender'
                                :data-vv-as="$t('profile.gender')"
                                v-validate="{required: true}"
                                :state="validateState('gender')"
                                :options="autocomplets.gender" 
                                v-model="user.gender"
                            >
                                <option :value="null" disabled>{{$t('util.select_option')}}</option>
                            </b-form-select>
                        </b-form-group>
                    </b-col>
                </b-row>
                <hr />
                <b-row>
                    <b-col cols="12" md="6">
                        <b-form-group 
                            label-size="lg"
                            :label="$t('profile.livedInRuralZone')  + TEMPLATES.MANDATORY_SYMBOL"
                            :invalid-feedback="errors.first('radioRuralZone')"
                        >
                            <b-form-radio-group 
                                id="radio_rural_zone" 
                                v-model="options.ruralZone" 
                                :options="booleanParOptions" 
                                name="radioRuralZone"
                                v-validate="{required: true}"
                                :data-vv-as="$t('profile.livedInRuralZone')"
                                :state="validateState('radioRuralZone')"
                            >
                            </b-form-radio-group>

                        </b-form-group>
                    </b-col>
                    <b-col cols="12" md="6" v-if="options.ruralZone != null">
                        <b-form-group 
                            label-size="lg"
                            :label="((options.ruralZone) ? $t('profile.howMuchmobilizeUrban') :$t('profile.howMuchMobilize'))  + TEMPLATES.MANDATORY_SYMBOL"
                            :invalid-feedback="errors.first('transfered')"
                        >
                            <b-form-select :options="autocomplets.moveAmount" 
                                v-model="user.moveAmount" 
                                name="transfered"
                                v-validate="{required: true}"
                                :data-vv-as="$t('profile.transfered')"
                                :state="validateState('transfered')"
                            >
                                <option :value="null" disabled>{{$t('util.select_option')}}</option>
                            </b-form-select>
                        </b-form-group>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col v-if="user.city && user.city.value.id == GEOGRAPHY_SPECIAL.BOGOTA">
                        <b-form-group 
                            label-size="lg"
                            :label="$t('profile.workLocalidad') + TEMPLATES.MANDATORY_SYMBOL"
                            :invalid-feedback="errors.first('workLocalidad')"
                            :description="getSpecialFieldsError('workLocalidad')"
                        >
                            <vue-select v-if="autocomplets.localidad" 
                                v-model="user.geoWork"
                                label="text"
                                :options="autocomplets.localidad"
                                name="workLocalidad"
                                v-validate="{required: true}"
                                :data-vv-as="$t('profile.workLocalidad')"
                                :state="validateState('workLocalidad')"
                            >
                            </vue-select>
                        </b-form-group>
                    </b-col>
                </b-row>
                <hr />
                <!-- academica y laboral -->
                <b-row>
                    <b-col>
                        <b-form-group 
                            label-size="lg"
                            :label="$t('profile.academicLevel') + TEMPLATES.MANDATORY_SYMBOL"
                            :invalid-feedback="errors.first('selectAcademicLevel')"
                        >
                            <b-form-select 
                                :options="autocomplets.academicLevel" 
                                v-model="user.academicLevel"
                                name="selectAcademicLevel"
                                v-validate="{required: true}"
                                :data-vv-as="$t('profile.academicLevel')"
                                :state="validateState('selectAcademicLevel')"
                            />
                        </b-form-group>
                    </b-col>
                    <b-col>
                        <b-form-group 
                            label-size="lg"
                            :label="$t('profile.occupation') + TEMPLATES.MANDATORY_SYMBOL"
                            :invalid-feedback="errors.first('occupation')"
                        >
                            <b-form-input 
                                name='occupation'
                                :data-vv-as="$t('profile.occupation')"
                                v-validate="{required: true, max: 80}"
                                :state="validateState('occupation')"
                                v-model.trim="user.profession"
                            >
                            </b-form-input>
                        </b-form-group>
                    </b-col>
                </b-row>
                <hr />
                <!-- discapacidades y etnicas -->
                <b-row>
                    <b-col>
                        <b-form-group
                            label-size="lg"
                            :label="$t('profile.disability') + TEMPLATES.MANDATORY_SYMBOL"
                            :invalid-feedback="errors.first('radioDisability')"
                        >
                            <b-form-radio-group 
                                id="radio_disability" 
                                v-model="options.disability" 
                                :options="booleanParOptions"
                                name="radioDisability"
                                v-validate="{required: true}"
                                :data-vv-as="$t('profile.disability')"
                                :state="validateState('radioDisability')"
                            >
                            </b-form-radio-group>
                        </b-form-group>
                    </b-col>
                </b-row>
                <b-row v-if="options.disability">
                    <b-col>
                        <b-form-group 
                            label-size="lg"
                            :label="$t('profile.disabilityType') + TEMPLATES.MANDATORY_SYMBOL"
                            :invalid-feedback="errors.first('selectDisType')"
                        >   
                            <b-form-select 
                                v-model="userDisability"
                                :options="autocomplets.disability" 
                                class="mb-3"
                                name="selectDisType"
                                :data-vv-as="$t('profile.disabilityType')"
                                :state="validateState('selectDisType')"
                            >
                                <template slot="first">
                                    <option :value="null" >{{$t('profile.otherOption')}}</option>
                                </template>
                            </b-form-select>
                        </b-form-group>
                    </b-col>
                    <b-col v-if="userDisability == null">
                        <b-form-group 
                            label-size="lg"
                            :label="$t('profile.otherOptionText') + TEMPLATES.MANDATORY_SYMBOL"
                            :invalid-feedback="errors.first('disability')"
                        >
                            <b-form-input 
                                name='disability'
                                v-model="user.disabilityOther"
                                :data-vv-as="$t('profile.disabilityType')"
                                v-validate="{required: true, max: 30}"
                                :state="validateState('disability')"
                            >
                            </b-form-input>
                        </b-form-group>
                    </b-col>
                </b-row>
                <hr />
                <b-row>
                    <b-col>
                        <b-form-group 
                            label-size="lg"
                            :label="$t('profile.ethnic') + TEMPLATES.MANDATORY_SYMBOL"
                            :invalid-feedback="errors.first('radioEthnic')"
                        >
                            <b-form-radio-group id="radio_ethnic" 
                                v-model="options.ethnic"
                                name="radioEthnic"
                                v-validate="{required: true}"
                                :data-vv-as="$t('profile.ethnic')"
                                :state="validateState('radioEthnic')"
                                :options="booleanParOptions">
                            </b-form-radio-group>
                        </b-form-group>
                    </b-col>
                    <b-col v-if="options.ethnic">
                        <b-form-group 
                            label-size="lg"
                            :label="$t('profile.ethnicCommunity') + TEMPLATES.MANDATORY_SYMBOL"
                        >   
                            <b-form-select 
                                v-model="user.ethnic"
                                label="text"
                                :options="autocomplets.ethnic"
                                name="selectEthnic"
                                v-validate="{required: true}"
                                :data-vv-as="$t('profile.ethnicCommunity')"
                                :state="validateState('selectEthnic')"
                            />
                        </b-form-group>
                    </b-col>
                </b-row>
                <hr />
                <!-- areas de interes -->
                <b-row>
                    <b-col>
                        <b-form-group 
                            label-size="lg"
                            :label="$t('profile.motivation')"
                            :description="motivationMessage"
                            :invalid-feedback="errors.first('textMotivation')"
                        >
                            <b-form-textarea placeholder="Escribe tu respuesta"
                                            v-model="user.motivation"
                                            :rows="4"
                                            :max-rows="6"
                                            :no-resize="true"
                                            name="textMotivation"
                                            v-validate="{max: 500}"
                                            :data-vv-as="$t('profile.motivation')"
                                            :state="validateState('textMotivation')"
                            >
                            </b-form-textarea>
                        </b-form-group>
                    </b-col>
                </b-row>
                <hr />
                <b-row>
                    <b-col>
                        <label class="font-larger">{{$t('profile.interests')}}</label>
                    </b-col>
                </b-row>
                <div id= "interests_options">
                    <treeselect v-model="userPreferences" 
                        :multiple="true" 
                        :options="ruralModels"
                        :searchable="true"
                        :open-on-focus="true"
                        :openDirection="'below'"
                        :placeholder="$t( 'profile.selectInterest' )"
                        :clearable="true"
                        :disable-branch-nodes="true"
                        :default-expand-level="2">
                        <label slot="option-label" slot-scope="{ node, shouldShowCount, count, labelClassName, countClassName}" 
                        :class="labelClassName">
                            <img v-if="node.raw && node.raw.url != null" 
                                :src="getImgURL(node.raw.url)" 
                                height="16" width="16">
                            <span v-else class="dot" :style="{backgroundColor: node.raw.color}"></span>
                            {{ node.label }}
                            <span v-if="shouldShowCount" :class="countClassName">({{ count }})</span>
                        </label>
                        <div slot="value-label" slot-scope="{ node }">{{node.label}}</div>
                    </treeselect>
                    
                </div>
                <hr />
                <!-- tipo y organizacion  -->
                <b-row>
                    <b-col>
                        <b-form-group horizontal
                            label-size="lg"
                            :label="$t('profile.userType') + TEMPLATES.MANDATORY_SYMBOL"
                        >
                            <!-- <vue-select v-if="autocomplets.userType" 
                                v-model="user.userType"
                                label="text"
                                :options="autocomplets.userType">
                            </vue-select> -->
                             <b-form-select v-if="autocomplets.userType" 
                                v-model="user.userType"
                                :options="userTypeOptions"
                                :disabled="isSDPOficial"
                            />
                        </b-form-group>
                    </b-col>
                </b-row>
                <b-row v-if="user.userType && userTypeIds.indexOf(user.userType.id) < 0">
                    <b-col v-show="!isCitizen">
                        <b-form-group horizontal
                            label-size="lg"
                            :label="$t('profile.organizationName')"
                        >
                            
                            <vue-select required v-model="userInstitution" 
                                :placeholder="$t('profile.otherOption')"
                                label="name" :options="getInstitutions" 
                                :disabled="isSDPOficial"
                            >
                            </vue-select>

                        </b-form-group>
                    </b-col>

                    <b-col v-if="userInstitution == null">
                        <b-form-group horizontal
                            label-size="lg"
                            :label="isCitizen?$t('profile.organizationName'):$t('profile.otherOptionText')"
                        >
                            <b-form-input size="lg"
                                v-model="user.institutionOther"
                                name='organization'
                                :data-vv-as="$t('profile.organizationName')"
                                v-validate="{required: true, max: 30}"
                                :state="validateState('organization')"
                            >
                            </b-form-input>
                        </b-form-group>
                    </b-col>
                </b-row>

                <!-- botones -->
                <b-row >
                    <b-col class="text-right">
                        
                        <sipsder-btn  btnType="back" @onClick="showModal('unsavedChanges')">
                        </sipsder-btn>

                    </b-col>
                    <b-col class="text-left">

                        <sipsder-btn type="submit" btnType="save">
                        </sipsder-btn>

                    </b-col>
                </b-row>
          </b-form>
          <hr />
        </b-container>

        <b-modal ref="welcome" size="xl" :title="$t('profile.welcome.title')" centered hideFooter>
            <div>
            <b-row>
                <b-col cols="12">
                    {{ $t('profile.welcome.textEdit') }}
                    <br>
                    <br>
                    {{ $t('profile.welcome.textLogout') }}
                    <br>
                    <br>
                </b-col>
            </b-row>
            </div>
            <div>
            <b-row>
                <b-col class="text-center">
                    <sipsder-btn @onClick="closeWelcomeAndLogout" btnType="back" :text="$t('profile.welcome.btnLogout')">
                    </sipsder-btn>
                </b-col>
                <b-col class="text-center">
                    <sipsder-btn @onClick="closeWelcome" btnType="edit_pen" :text="$t('profile.welcome.btnEdit')">
                    </sipsder-btn>
                </b-col>
            </b-row>
            </div>
        </b-modal>
        <b-modal ref="success" :title="$t('profile.success.title')" hideFooter>
            <p> {{$t('profile.success.text')}} </p>
            <div v-if="msgUpdateEmail">
                <p class="info-msg"> {{$t('profile.success.updateEmail')}} </p>
            </div>
            <br>
            <sipsder-btn btnType="accept"
                         @onClick="goHome()"
            ></sipsder-btn>
        </b-modal>

        <b-modal ref="emailError" :title="$t('profile.validationError.title')" hideFooter >
            <i class="fas fa-exclamation-triangle error-msg"></i>
            {{$t('profile.validationError.text')}}
            <br>
            <sipsder-btn btnType="accept"
                         @onClick="hideModal('emailError')"
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

        <b-modal ref="unsavedChanges" :title="$t( 'survey.form.popup.alert_title' )" hideFooter>
            <b-row align-v="center" align-h="center">
                <div class="w-100 required pt-2 pb-4" align="center">
                <strong>{{ $t( 'survey.form.popup.discard_alert' ) }}</strong>
                </div>          
                <sipsder-btn btnType="accept" 
                    :text="$t( 'survey.form.popup.ok_btn' )" 
                    @onClick="$router.go(-1)">
                </sipsder-btn>     
                <sipsder-btn btnType="cancel" 
                    :text="$t( 'survey.form.popup.cancel_btn' )" 
                    @onClick="hideModal( 'unsavedChanges' )">
                </sipsder-btn>
            </b-row>
        </b-modal>

    </div>
</template>

<script>
import Datepicker from 'vuejs-datepicker';
import * as lang from "vuejs-datepicker/src/locale"; //importar locale

import VAPI from "../../../http_common";
import vSelect from "vue-select";
import { SERVICE_NAMES, USER_DOMAINS, USER_DOMAINS_VAPI, HTTP_STATUS, TEMPLATES, INSTITUTION_IDS} from '../../../sipsder_constants';
import { GEOGRAPHY_TYPE, USER_SEX, GEOGRAPHY_SPECIAL, USER_TYPE, AUTHENTICATION_TYPE } from '../../../domain_constants';
import Treeselect from '@riophae/vue-treeselect';
import S_UTIL from "../../../util/sipsder_util";

export default {
  data: function() {
    return {
      TEMPLATES:TEMPLATES,
      GEOGRAPHY_SPECIAL: GEOGRAPHY_SPECIAL,
      welcomeModalEnabled: true,
      idBuscar: 0,
      lastUser: null,
      user: {
        id: null,
        email: "",
        firstName: "",
        lastName: "",
        sex: null,
        gender: null,
        country: null,
        department: null,
        city: null,
        localidad: null,
        userType: null,
        address: "",
        moveAmount: null,
        geoLive: {
          id: null,
          name: null
        },
        geoWork: {
            id: null,
            name: null
        },
        viewSelects: {
            cities: false,
            localidad: false,
        },
        academicLevel: null,
        disability: null,
        ethnic: null
      },
      options: {
        ruralZone: null,
        disability: null,
        ethnic: null,
      },
      selectedModels: [],
      ruralModels: [],
      editMode: true,
      arrKeys: ["firstName", "lastName"],
      autocomplets: {
        userType: [],
        countries: [],
        departments: [],
        localidad: [],
        academicLevel: [],
        gender: [],
        sex: [],
        ethnic: [],
        telephoneType: [],
        disability: [],
        moveAmount: [],
        institutions: []
      },
      booleanParOptions: [
        {text: this.$t('profile.booleanOptions.yes'), value: true},
        {text: this.$t('profile.booleanOptions.no'), value: false},
      ],
      userTypeIds: [USER_TYPE.URBAN, USER_TYPE.RURAL],
      userDisability : null,
      userPreferences: null,
      userPrevPreferences: null,
      userInstitution: null,
      languages: lang,
      language: this.$i18n.locale,
      msgUpdateEmail: false,
    };
  },
  methods: {
    getDepartments() {
        return  this.autocomplets.departments;          
    },
    getCities() {
        let arr = []
        if (this.autocomplets && this.autocomplets.cities && this.user.department) {
            arr = this.autocomplets.cities.filter(city => city.value.parentId == this.user.department.value.id);
        }
        return arr; 
    },
    getLocalidad(){
        let arr = []
        if (this.autocomplets && this.autocomplets.localidad && this.user.city)
            arr = this.autocomplets.localidad.filter(loc => loc.value.parentId == this.user.city.value.id);
        return arr;
    },
    getImgURL (url) {
        return S_UTIL.getImgURL(url);
    },
    getSpecialFieldsError (field) {
        let msg = "";
        if (this.errors.first(field)) {
            msg =`<span style='color:red'>${this.errors.first(field)}</span>`;
        }
        return msg;
    },
    goHome() {
        this.hideModal('success');
        this.$router.push({name: 'Home'});
    },
    getRemoveAndAddedIds(prev, current) {
        let added = [];
        let removed = [];
        
        prev = prev.sort((a, b) => {return a-b});
        current = current.sort((a, b) => {return a-b});

        let idxPrev, idxCurr, prevTam, currTam;
        prevTam = prev.length;
        currTam = current.length;

        for (idxPrev = idxCurr = 0; idxPrev < prevTam && idxCurr < currTam;) {
            if (prev[idxPrev] != current[idxCurr]) {
                if (prev[idxPrev] < current[idxCurr]) {
                    removed.push(prev[idxPrev]);
                    idxPrev++;
                } else {
                    added.push(current[idxCurr]);
                    idxCurr++;
                }
            } else {
                idxPrev++;
                idxCurr++;
            }
        }

        if (idxPrev < prevTam) {
            removed.push.apply(removed, prev.slice(idxPrev) );
        }

        if (idxCurr < currTam) {
            added.push.apply(added, current.slice(idxCurr) );
        }

        return {added: added, removed: removed};
    },
    closeWelcome(){
      this.$refs.welcome.hide();
    },
    closeWelcomeAndLogout(){
      this.$refs.welcome.hide();
      this.$store.dispatch("signOut");
    },
    updateSelected: async function() {
        var fields = ["firstName", "lastName", "selectSex", "country"]
        
        var valid = true;
        for (var idx= 0; idx < fields.length; idx++){
            var val = await this.$validator.validate(fields[idx]);
            valid &= val;
        }
        
        if ((valid != null && !valid)) {
            this.showModal('validationError');
            return;
        }

        // this.editMode = false;
        this.msgUpdateEmail = false;
        // console.info("CAmbio de email? ", this.msgUpdateEmail, this.lastUser.email, this.user.email, this.user.authType);
        if (this.lastUser.email != this.user.email && this.user.authType == AUTHENTICATION_TYPE.CITIZEN.value) {
            this.msgUpdateEmail = true;
        }

        let userId = this.$store.getters.getCurrentUser.id;
        let newUser = this.toBasicBackUser(this.lastUser, this.user);
        
        let param = {
            user: newUser,
            userPreferencesIds: null,
            disability: null,
            institution: null,
            basic: true,
        }

        try {
            let path = `${SERVICE_NAMES.USER_PROFILE}/current`
            let response = await VAPI.put(path, param);

            if (response && response.status == HTTP_STATUS.OK) {
                // alert("Usuario Actualizado");
                this.showModal('success');
                this.lastUser = response.data;
                this.$store.getters.getCurrentUser.firstName = this.lastUser.firstName;
                this.$store.getters.getCurrentUser.status = this.lastUser.status;
                //   this.$store.dispatch('setCurrentUser', response.data);
            } else {
                this.showModal('emailError');
                console.info("Error al Actualizar usuario Response: ", response);
            }

        } catch(error){
            console.info("Fallo: ", error);
        }
    },
    onSubmit: async function(event) {

        var fields = ["firstName", "lastName", "selectSex", "country"]

        let valid = await this.$validator.validate();
        var val1 = await this.$validator.validate('emailInput');
        valid &= val1;
        for (var idx= 0; idx < fields.length; idx++){
            var val = await this.$validator.validate(fields[idx]);
            valid &= val;
        }

        if (valid != null && !valid) {
            this.showModal('validationError');
            return;
        }

        // this.editMode = false;
        this.msgUpdateEmail = false;
        if (this.lastUser.email != this.user.email && this.user.authType == AUTHENTICATION_TYPE.CITIZEN.value) {
            this.msgUpdateEmail = true;
        }
        

        let newUser = this.toBackUser(this.lastUser, this.user);
        var res = this.getRemoveAndAddedIds(this.userPrevPreferences, this.userPreferences);
        // console.info("Preferencias",this.userPrevPreferences, this.userPreferences, res.added, res.removed);
        
        if (this.options.disability == false) {
            this.userDisability = null;
        }
        let userWTO = {
            user: newUser,
            institution: this.userInstitution,
            disability: this.userDisability,
            userPreferencesAddedIds: res.added,
            userPreferencesRemovedIds: res.removed,
            basic: false,
        }

        let path = `${SERVICE_NAMES.USER_PROFILE}/current`;
        // VAPI.put("/service/user/" + this.user.id, this.user)
        try {
            let response = await VAPI.put(path, userWTO);
            if (response.status == HTTP_STATUS.OK) {
                this.showModal('success');
                this.userPrevPreferences = this.userPreferences;
                this.lastUser = response.data;
                this.$store.getters.getCurrentUser.status = this.lastUser.status;
            } else {
                this.showModal('emailError');
            }
        } catch(error){
            console.info("Fallo: ", error);
        }
    },
    toBasicFrontUser(backUser){
        // console.info("BACK: ", backUser, this.user);
        if (backUser.firstName) {
            this.user.firstName = backUser.firstName;
        }
        if (backUser.lastName) {
            this.user.lastName= backUser.lastName;
        }
        if (backUser.sex) {
            if (backUser.sex.sex) {
                this.user.sex = {id: backUser.sex.id, value: backUser.sex.sex};
            } else {
                this.user.sex = {id: backUser.sex.id, value: backUser.sex.value};
            }

        }
        if (backUser.geoLive) {
            this.user.geoLive = backUser.geoLive;
        }

        return this.user;
    },
    toFrontUser(backUser) {
        let auxUser = JSON.parse(JSON.stringify(backUser));
        // console.info("User Pre: ", backUser);
        let mapFields = [//{front: "userType", back: "userType", second: "type"}
                    {front: "sex", back: "sex", second: "sex"},  {front: "academicLevel", back: "academicLevel", second: "academicLevel"}, {front: "disability", back: "disability", second: "disability"},
                    {front: "ethnic", back: "ethnicity", second: "ethnicCommunity"}, {front: "moveAmount", back: "moveAmount", second: "moveAmount"}]
        // console.info("User: ", backUser.userType);
        //Campos que se mapean a id, value
        // auxUser.userType = backUser.userType;
        mapFields.forEach(key => {
            if (backUser[key.back])
                auxUser[key.front] = {id: backUser[key.back].id, value: backUser[key.back].value} 
        });
        // console.info("User After: ", auxUser.userType);
        if(!backUser.birthDate) {
            auxUser.birthDate = new Date();
        }
        if (backUser.geoLive) {
            // console.info("Verificando el geolive", backUser.geoLive);
            if (backUser.geoLive.type.id == GEOGRAPHY_TYPE.LOCALIDAD) {
                // console.info("caso localidad");
                auxUser.country = {text: backUser.geoLive.parent.parent.parent.name, value: backUser.geoLive.parent.parent.parent};
                auxUser.department = {text: backUser.geoLive.parent.parent.name, value: backUser.geoLive.parent.parent};
                auxUser.city = {text: backUser.geoLive.parent.name, value: backUser.geoLive.parent};
                auxUser.localidad = {text: backUser.geoLive.name, value: backUser.geoLive};
            }
            if (backUser.geoLive.type.id == GEOGRAPHY_TYPE.MUNICIPIO) {
                // console.info("caso municipio");
                auxUser.country = {text: backUser.geoLive.parent.parent.name, value: backUser.geoLive.parent.parent};
                auxUser.department= {text: backUser.geoLive.parent.name, value: backUser.geoLive.parent};
                auxUser.city = {text: backUser.geoLive.name, value: backUser.geoLive};
            }
            if (backUser.geoLive.type.id == GEOGRAPHY_TYPE.DEPARTAMENTO) {
                // console.info("caso departamento");
                auxUser.country = {text: backUser.geoLive.parent.name, value: backUser.geoLive.parent};
                auxUser.department = {text: backUser.geoLive.name, value: backUser.geoLive};
            }
            if (backUser.geoLive.type.id == GEOGRAPHY_TYPE.PAIS) {
                // console.info("caso pais");
                auxUser.country = {text: backUser.geoLive.name, value: backUser.geoLive};
            }
        }

        if (backUser.geoWork) {
            auxUser.geoWork = {text: backUser.geoWork.name, value: backUser.geoWork};
        }

        if (backUser.gender) {
            auxUser.gender = {id: backUser.gender.id, value: backUser.gender.value}
        }

        if (backUser.ruralUser !== undefined && backUser.ruralUser !== null){
            this.options.ruralZone = (backUser.ruralUser) ? true : false;
            auxUser.ruralUser = backUser.ruralUser;
            auxUser.moveAmount = {id: backUser.moveAmount.id, value: backUser.moveAmount.value};
        }

        if (backUser.ethnicity) {
            this.options.ethnic = true;
            auxUser.ethnic = {id: backUser.ethnicity.id, value: backUser.ethnicity.value};
        } else {
            this.options.ethnic = false;
        }

        if (this.options.disability == false && auxUser.disabilityOther) {
            this.options.disability = true;
        }

        return auxUser;
    },
    toBasicBackUser(prevUser, newUser) {
        let auxUser = JSON.parse(JSON.stringify(prevUser));

        if (auxUser.email != newUser.email) {
            auxUser.email = newUser.email;
        }
        auxUser.firstName = newUser.firstName;
        auxUser.lastName = newUser.lastName;
        auxUser.sex = {id: newUser.sex.id, sex: newUser.sex.value};

        if (newUser.localidad) {
            auxUser.geoLive = newUser.localidad.value;
            if (!newUser.localidad.value.type.id) {
                auxUser.geoLive.type = {id: newUser.localidad.value.type};
            }
        } else if (newUser.city) {
            // console.info("City", newUser.city.value);
            auxUser.geoLive = newUser.city.value;
            
            if (!newUser.city.value.type.id) {
                auxUser.geoLive.type = {id: newUser.city.value.type};
            }
        } else if (newUser.country) {
            // console.info("Country", newUser.country.value);
            auxUser.geoLive = newUser.country.value;
            if (!newUser.country.value.type.id) {
                auxUser.geoLive.type = {id: newUser.country.value.type};
            }
        } else {
            console.log("Datos de ubicacion no validos.");
        }

        return auxUser;
    },
    //Los datos basicos aca no son actualizados.
    toBackUser(prevUser, newUser) {
        let auxUser = JSON.parse(JSON.stringify(prevUser));

        if (auxUser.email != newUser.email) {
            auxUser.email = newUser.email;
        }
        auxUser.firstName = newUser.firstName;
        auxUser.lastName = newUser.lastName;
        auxUser.sex = {id: newUser.sex.id, sex: newUser.sex.value};

        if (newUser.localidad) {
            // console.info("Localidad", newUser.localidad.value);
            auxUser.geoLive = newUser.localidad.value;
            if (!newUser.localidad.value.type.id) {
                auxUser.geoLive.type = {id: newUser.localidad.value.type};
            }
        } else if (newUser.city) {
            // console.info("City", newUser.city.value);
            auxUser.geoLive = newUser.city.value;
            
            if (!newUser.city.value.type.id) {
                auxUser.geoLive.type = {id: newUser.city.value.type};
            }
        } else if (newUser.country) {
            // console.info("Country", newUser.country.value);
            auxUser.geoLive = newUser.country.value;
            if (!newUser.country.value.type.id) {
                auxUser.geoLive.type = {id: newUser.country.value.type};
            }
        } else {
            console.log("Datos de ubicacion no validos.");
        }

        auxUser.address = newUser.address;
        auxUser.birthDate = newUser.birthDate;
        
        if (newUser.gender) {
            auxUser.gender = {id: newUser.gender.id, gender: newUser.gender.value}
        }
        if (this.options.ruralZone != null) {
            auxUser.ruralUser = this.options.ruralZone;
            auxUser.moveAmount = {id: newUser.moveAmount.id, moveAmount: newUser.moveAmount.value}
        }
        
        if (newUser.geoWork) {
            auxUser.geoWork = {id: newUser.geoWork.value.id, name: newUser.geoWork.value.name};
            auxUser.geoWork.type = {id: newUser.geoWork.value.type.id};
        }

        
        if (newUser.academicLevel) {
            auxUser.academicLevel = {id: newUser.academicLevel.id, academicLevel: newUser.academicLevel.value};
        }

        if (newUser.profession) {
            auxUser.profession = newUser.profession;
        }

        if ( this.options.disability ) {
            if (this.userDisability) {
                auxUser.disabilityOther = null;
            } else if (newUser.disabilityOther) {
                auxUser.disabilityOther = newUser.disabilityOther;
            }
        } else {
            auxUser.disabilityOther = null;
        }

        if (this.options.ethnic) {
            auxUser.ethnicity = {id: newUser.ethnic.id, ethnicCommunity: newUser.ethnic.value};
        } else {
            auxUser.ethnicity = null;
        }

        if (newUser.motivation) {
            auxUser.motivation = newUser.motivation;
        }

        if (newUser.userType) {
            auxUser.userType = {id: newUser.userType.id, type: newUser.userType.value}
        }
        // console.info("Otra institucion:> ", newUser.institutionOther);
        if (newUser.institutionOther) {
            auxUser.institutionOther = newUser.institutionOther;
        }

        // console.info("USUARIO BACK COMPLETO: ", auxUser);
        return auxUser;
    },
    async getUser() { //buscar Usuario
        var currUser = null;
        if (this.$store.getters.isAuthenticated) {

            let userId = this.$store.getters.getCurrentUser.id;
            try {
                let path = `${SERVICE_NAMES.USER_PROFILE}/current`;
                let response = await VAPI.get(path);
                
                if (response && response.status == HTTP_STATUS.OK) {
                    this.lastUser = response.data;
                    this.user = this.toFrontUser(response.data);
                    currUser = this.user;
                }
            } catch (error) {
                alert("Problemas al cargar el perfil, intente luego.");
                console.log("Error al buscar usuario", error);
            }
        }
        return currUser;
    },
    cancelSelected: function() {
    //   this.user = JSON.parse(JSON.stringify(this.preUser));
        this.user = this.toBasicFrontUser(this.lastUser);
        // this.user = this.toFrontUser(this.$store.getters.getCurrentUser);
        // this.editMode = false;
    },
    async saveImage(field, e) {
        let valid = await this.$validator.validate(field);
        if ((valid != null && !valid) || !e.target.files[0]) {
            console.info("Validacones no superadas.", e.target.files[0], this.errors);
            return;
        }
        let data = new FormData();
        
        data.append('image', e.target.files[0]);

        try{
            let userId = this.$store.getters.getCurrentUser.id;
            let path = `${SERVICE_NAMES.USER_PROFILE}/image`;
            let headers = { headers: { 'Content-Type': 'multipart/form-data' } } ;

            let response = await VAPI.put(path, data, headers);

            if (response.status == HTTP_STATUS.OK) {
                this.user.image = response.data;
                this.$store.getters.getCurrentUser.image = response.data;
            } else {
                console.log("Fallo al guardar imagen.");    
            }

        } catch (error) {
            console.info("Error al guardar imagen.", error);
            
        }
    },
    validateState(name) {

        if (this.veeFields[name] && (this.veeFields[name].dirty || this.veeFields[name].validated)) {
            
            return !this.errors.has(name);
        }
        return null;
    },
    // changeMode(val) {
    //     this.editMode = val;
    // },
    hideModal(modal) {
        this.$refs[modal].hide();
    },
    showModal(modal) {
        this.$refs[modal].show();
    },
    showLocalidadField() {
        // console.info("Show Localida Field: ", this.user, GEOGRAPHY_SPECIAL.BOGOTA, (this.user && this.user.city), (this.user && this.user.city && this.user.city.value.id === GEOGRAPHY_SPECIAL.BOGOTA));
        return (this.user && this.user.city && this.user.city.value.id === GEOGRAPHY_SPECIAL.BOGOTA) 
                || this.user.localidad;
    },
  },
  updated() {
    if (this.welcomeModalEnabled && this.$store.getters.isAuthenticated) {
        if (this.$store.getters.getCurrentUser && this.$store.getters.getCurrentUser.status < 2) {
            this.$refs.welcome.show();
        }
        this.welcomeModalEnabled = false;
    }
  },
  async created() {
    // pareja del tipo path(path del servicio), campo(campo del autocompletar)
    let parQuery = [
        // {domain: USER_DOMAINS_VAPI.USER_TYPE, getter: 'getUserType', field: 'userType'}, 
        {domain: USER_DOMAINS_VAPI.USER_SEX, getter: 'getUserSex', field: 'sex'}, 
        {domain: USER_DOMAINS_VAPI.USER_ETHNIC, getter: 'getUserEthnic', field: 'ethnic'},
        {domain: USER_DOMAINS_VAPI.USER_TELEPHONE_TYPE, getter: 'getUserPhoneType', field: 'telephoneType'},
        {domain: USER_DOMAINS_VAPI.ACADEMIC_LEVEL, getter: 'getAcademicLevel', field: 'academicLevel'},
        {domain: USER_DOMAINS_VAPI.USER_GENDER, getter: 'getUserGender', field: 'gender'},
        {domain: USER_DOMAINS_VAPI.DISABILITY, getter: 'getUserDisability', field: 'disability'},
        {domain: USER_DOMAINS_VAPI.MOVE, getter: 'getUserMoves', field: 'moveAmount'},
    ];

    booleanParOptions: [
        {text: this.$t('profile.booleanOptions.yes'), value: true},
        {text: this.$t('profile.booleanOptions.no'), value: false},
    ]

    parQuery.forEach(par => {
        
        if (this.$store.getters[par.getter] == null) {
            // console.info("No cargado", par);
            this.$store.dispatch('loadDomains', {domain: par.domain}).then( (response) =>{
                this.autocomplets[par.field] = this.$store.getters[par.getter];
            }).catch((error) => {
                console.info("Problema cargando dominio.", error);
            });
        } else {
            // console.info("Cargado", par);
            this.autocomplets[par.field] = this.$store.getters[par.getter];
        }
    });

    try {
        var path = `${SERVICE_NAMES.USER_TYPE}`;
        var response = await VAPI.get(path);
        // console.info("REspuesta de tipos de usuario: ", response);
        this.autocomplets.userType = [];
        if (response.data && response.data.data) {
            response.data.data.forEach(userType => {
                this.autocomplets.userType.push({text: userType.type, value: userType});
            });
        }
            
    } catch (ex) {
        console.info("Problemas al cargar Tipos de usuario: ", ex);
    }
    //Cambiar la parte de pais y localidad para usar vuex
    VAPI.get(`${SERVICE_NAMES.GEOGRAPHY}`, {params:{type: GEOGRAPHY_TYPE.PAIS}})
      .then(response => {
        // console.info('PAIS', response.data);
        this.autocomplets.countries = response.data.map(ubication => {
          return {text: ubication.name, value: ubication};
        });
      })
      .catch(function(error) {
        console.info("Error al Consumir servicio geografia: " + error);
      });

    VAPI.get(`${SERVICE_NAMES.GEOGRAPHY}`, {params:{type: GEOGRAPHY_TYPE.DEPARTAMENTO}})
      .then(response => {
        // console.info('Departamento: ', response.data);
        this.autocomplets.departments = response.data.map(ubication => {
          return {text: ubication.name, value: ubication};
        });

      }).catch(function(error) {
        console.info("Error al Consumir servicio geografia: ", error);
      });

    VAPI.get(`${SERVICE_NAMES.GEOGRAPHY}`, {params:{type: GEOGRAPHY_TYPE.MUNICIPIO}})
      .then(response => {
        // console.info('municipio', response.data);
        this.autocomplets.cities = response.data.map(ubication => {
          return {text: ubication.name, value: ubication};
        });

      }).catch(function(error) {
        console.info("Error al Consumir servicio geografia: ", error);
      });

    VAPI.get(`${SERVICE_NAMES.GEOGRAPHY}`, {params:{type: GEOGRAPHY_TYPE.LOCALIDAD}})
      .then(response => {
        // console.info('LOCALIDAD', response.data);
        this.autocomplets.localidad = response.data.map(ubication => {
          return {text: ubication.name, value: ubication};
        });

      }).catch(function(error) {
        console.info("Error al Consumir servicio geografia: ", error);
    });

    await this.getUser();
    // console.info("Pre-Usuario Actual: ", this.$store.getters.getCurrentUser);
    // this.user = this.toFrontUser(this.$store.getters.getCurrentUser);
    // console.info("USuario Actual: ", this.user);

    try {

        let path = `/${SERVICE_NAMES.RURAL_MODEL}/tree`
        let response = await VAPI.get( path );
        this.ruralModels = response.data.data;
        // console.info("modelo Rural" , this.ruralModels);
        path = `/${SERVICE_NAMES.INSTITUTION}/all?profile=true`
        response = await VAPI.get(path);
        //console.info('Institucion::> ', response);
        if (response.status == HTTP_STATUS.OK) {
            this.autocomplets.institutions  = response.data.data;
        }

        path = `${SERVICE_NAMES.USER_PROFILE}/detail`
        response = await VAPI.get(path)

        if (response.status == HTTP_STATUS.OK) {
            this.userDisability = response.data.disability;
            // console.info("ACA: LEN Insitution> ", response.data);
            // console.info("ACA: LEN> ", this.userDisability.length, this.userDisability)
            if (this.userDisability.length > 0) {
                
                this.options.disability = true;
                this.userDisability = {id: this.userDisability[0].disability.id, value: this.userDisability[0].disability.disability};
            } else {
                if (this.user.disabilityOther) {
                    this.options.disability = true;
                } else {
                    this.options.disability = false;
                }
                this.userDisability = null;
            }

            this.userInstitution = response.data.institution;
            
            if (this.userInstitution.length > 0) {
                this.userInstitution = {
                    id: this.userInstitution[0].institution.id, 
                    name: this.userInstitution[0].institution.name,
                };
            } else {
                this.userInstitution = null;
            }
            // console.info("Institucion final: ", this.userInstitution, this.autocomplets.institutions, this.autocomplets.institutions.find(x => x.id == INSTITUTION_IDS.SDP));

            if (!this.userInstitution && this.isSDPOficial) {
                this.userInstitution = this.autocomplets.institutions.find(x => x.id == INSTITUTION_IDS.SDP);
            }
            // console.info("Institucion final 2: ", this.userInstitution);
            
            this.userPreferences = response.data.preferences.map(pref => pref.ruralModelId);
            this.userPrevPreferences = response.data.preferences.map(pref => pref.ruralModelId);
            
        }
        
    } catch (error) {
        console.info("problemas al consumir servicio", error)
    }
  },
  components: {
    "vue-select": vSelect,
    "datepicker": Datepicker,
    Treeselect,
  },
  computed : {
    getProfileImage() {
        let user = this.user;
        if (user && user.image) {
            return S_UTIL.getImgURL(user.image.url);
        }
        
        if (user.sex && user.sex.id === USER_SEX.FEMALE) {
            if (user.ruralUser){
                return require('@/assets/profile/mujer_rural.png');
            } else {
                return require('@/assets/profile/mujer_ciudad.png');
            }
        } else if (user.ruralUser) {
            return require('@/assets/profile/hombre_ciudad.png');
        }

        return require('@/assets/profile/hombre_rural.png');
    },
    disabledDates() {
        return { from: new Date() };
    },
    showDepartmentField() {
        return (this.user && this.user.country && this.user.country.value.id === GEOGRAPHY_SPECIAL.COLOMBIA) 
                || this.user.city;
    },
    showCityField() {
        return (this.user && this.user.department && this.user.department.value.id === GEOGRAPHY_SPECIAL.BOGOTA_MUN) 
                || this.user.department;
    },
    getInstitutions() {

        var ret = this.autocomplets.institutions.filter(org => org.typeId === this.user.userType.id);
        return ret;
        // return this.autocomplets.institutions;
    },
    imageErrors() {
        if (this.errors.first( 'profileImage' ).indexOf('NaN') >= 0) {
            return this.$t('profile.imgSizeError')
        }
        return this.errors.first( 'profileImage' );
    },
    motivationMessage() {
        var msg = this.$t('profile.motivationCharacters');
        var tam = (this.user && this.user.motivation) ? this.user.motivation.length : 0;
        msg = msg.replace(":numchar", 500 - tam);
        return msg;
    },
    isSDPOficial () {
        return this.user.authType == AUTHENTICATION_TYPE.SDP_OFFICIAL.value;
    },
    isCitizen () {
        return this.user.authType == AUTHENTICATION_TYPE.CITIZEN.value;
    },
    userTypeOptions() {
        let options = []
        if (this.user.authType == AUTHENTICATION_TYPE.CITIZEN.value) {
            options = this.autocomplets.userType.filter(type => type.value.authType == AUTHENTICATION_TYPE.CITIZEN.value);
        } else if (this.user.authType == AUTHENTICATION_TYPE.SDP_OFFICIAL.value) {
            options = this.autocomplets.userType.filter(type => type.value.authType == AUTHENTICATION_TYPE.SDP_OFFICIAL.value);
        } else {
            options = this.autocomplets.userType.filter(type => type.value.authType == AUTHENTICATION_TYPE.SDP_AUTHORIZED.value);
        }
        return options;
    }
  },
  beforeCreate(){
    this.$scrollTo('.container-sipsder', 0)
  },
  watch: {
      'options.ruralZone' : function(newRuralZone){
          if (!this.isSDPOficial) {
            if (newRuralZone && this.user.userType && this.user.userType.id == USER_TYPE.URBAN) {
                this.user.userType = this.autocomplets.userType[USER_TYPE.RURAL - 1].value;
            }
            if (!newRuralZone && this.user.userType && this.user.userType.id == USER_TYPE.RURAL) {
                this.user.userType = this.autocomplets.userType[USER_TYPE.URBAN - 1].value;
            }
          }
      },
      'userDisability' : function(newUserDisability) {
          if (newUserDisability != null) {
            this.user.disabilityOther = null;
          }
      },
      'user.country' : function(newCountry) {
          if (!newCountry || newCountry.value.id != GEOGRAPHY_SPECIAL.COLOMBIA) {
            this.user.localidad = null;
            this.user.city = null;
            this.user.department = null;
          }
      },
      'user.department' : function(newDepartment) {
          if (!newDepartment) {
            this.user.localidad = null;
            this.user.city = null;
          }
      },
      'user.city' : function(newCity) {
          if (!newCity || newCity.value.id != GEOGRAPHY_SPECIAL.BOGOTA) {
            this.user.localidad = null;
          }
      },
      'user.userType' : function (newVal) {
          if (!this.isSDPOficial)
            this.userInstitution = null; 
      }
  }
};
</script>

<style lang="scss" scoped>
.span-button {
  color: white;
  font-size: 1.5rem;
}

.font-larger {
    font-size: larger;
}

.vl {
    // border-left: 6px solid green;
    border-right: 6px solid green;
    border-radius: 5px;
    margin-top: 1rem;
    margin-bottom: 1rem;
}

.error-msg {
    color: #F00;
    font-size: 12px;
}

.img-container {
    position: relative;
    width: 100%;
    // max-width: 500px;
    img {
        width: 100%;
        height: auto;
    }
    .btn {
        position: absolute;
        top: 50%;
        left: 55%;
        transform: translate(-50%, -50%);
        -ms-transform: translate(-50%, -50%);
        // background-color: #555;
        color: white;
        font-size: 16px;
        padding: 12px 24px;
        border: none;
        cursor: pointer;
        border-radius: 5px;
        text-align: center;

    }
    .aux-class {
        opacity: 0;
        -webkit-transition: opacity 1s ease-in-out;
        -moz-transition: opacity 1s ease-in-out;
        -ms-transition: opacity 1s ease-in-out;
        -o-transition: opacity 1s ease-in-out;
        transition: opacity 1s ease-in-out;
        &:hover {
            zoom: 1;
            filter: alpha(opacity=50);
            opacity: 0.8;
        }
    }
    .s-slide {
        .v-enter {
            // transition: all .3s ease;
            transform: translateX(10px);
            opacity: 0;
        }
        .v-leave {
            transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
        }
    }
}
.dot {
  height: 16px;
  width: 16px;
  border-radius: 50%;
  display: inline-block;
}

.info-msg {
    color: rgb(68, 146, 247);
}
</style>
