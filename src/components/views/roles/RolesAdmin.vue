<template>

<div class="container container-form">
    <!-- SUCCESS MODAL -->
    <b-modal ref="success_modal" :title="$t('audiovisual_media.admin.alert')" hide-footer
      :no-close-on-backdrop="true" :no-close-on-esc="true" hide-header-close>
        <b-row>
          <b-col cols="12">
            {{$t('roles.success_modal')}}
            <br><br>
            <sipsder-btn btnType="accept" @onClick="$router.go(0)"></sipsder-btn>
          </b-col>
        </b-row>
    </b-modal>
    <!-- ADD ROLE MODAL -->
    <b-modal ref="addRoleModal" :title="rolesPopupTitle(addRole)" 
        :no-close-on-esc="true"
        :no-close-on-backdrop="true"
        :hide-header-close="true"
        hideFooter>
        <p>{{$t('roles.popup_add_role.claim')}}</p>
        <br>
        <b-row class="row">
            <b-col cols="5"><p>{{$t('roles.popup_add_role.input')}}<span v-html="asterisk"></span></p></b-col>
            <b-col cols="7"><b-form-input v-model="addRole.name" maxlength="120"></b-form-input></b-col>
        </b-row>
        <p v-show="addRole.name.length < 4" class="red">{{$t('roles.errors.role_name')}}</p>
        <p v-show="roleNameExists" class="red">{{$t('roles.errors.existing_role')}}</p>
        <b-row class="row">
            <b-col cols="5"><p>{{$t('roles.popup_add_role.input_ldap')}}<span v-if="!disableRoleLdap(addRole)" v-html="asterisk"></span></p></b-col>
            <b-col cols="7"><b-form-input v-model="addRole.sdpCode" maxlength="120" :disabled="disableRoleLdap(addRole)"></b-form-input></b-col>
        </b-row>
        <p v-show="errorLdap" class="red">{{$t('roles.errors.role_ldap')}}</p>
        <p v-show="!disableRoleLdap(addRole) && roleLdapExists" class="red">{{$t('roles.errors.existing_role')}}</p>
        
        <br>
        <b-row class="row">
            <b-col cols="5"><p>{{$t('roles.popup_add_role.summary')}}<span v-html="asterisk"></span></p></b-col>
            <b-col cols="7">
                <b-form-textarea v-model="addRole.summary"
                :rows="3" :max-rows="6" maxlength="280"/>
            </b-col>
        </b-row>
        <p v-if="addRole.summary.length < 10" class="red">{{$t('roles.errors.role_summary')}}</p>
        <br>
        <div v-if="addRole.error" class="mg-top-10 red">
            <p>{{$t('roles.popup_add_role.error')}}</p>
            <br>
        </div>
        <b-form-checkbox v-model="addRole.inherit" :disabled="disableInherit">{{$t('roles.popup_add_role.check')}}</b-form-checkbox>
        <b-row v-if="addRole.inherit" class="row mg-top-30">
            <b-col cols="7"><p>{{$t('roles.popup_add_role.select')}}</p></b-col>
            <b-col cols="5">
                <b-form-select v-model="addRole.inheritRole">
                    <option v-for="(role,i) in autocomplets.roles" :key="i" :value="role.value.id">{{role.text}}</option>
                </b-form-select>
            </b-col>
        </b-row>
        <b-row class="mg-top-30" style="text-align: center">
            <b-col>
                <sipsder-btn btnType="cancel" :text="$t('roles.popup_add_role.cancel')" @onClick="cancelAddRole()" />
            </b-col>
            <b-col class="center-text">
                <sipsder-btn btnType="accept" :text="$t('roles.popup_add_role.create')" @onClick="saveAddRole()" 
                    :disabled="errorLdap || roleLdapExists || roleNameExists || addRole.name.length < 4 || addRole.summary.length < 10" />
            </b-col>
        </b-row>
    </b-modal>
    <!-- MOD PERMISSION MODAL -->
    <b-modal ref="modifyPermisionModal" :title="$t('roles.popup_mod_permision.title')" 
        :no-close-on-esc="true"
        :no-close-on-backdrop="true"
        :hide-header-close="true"
        hideFooter>
        <p> <span style="font-weight: bold"> {{$t('roles.popup_mod_permision.module')}} </span> {{selectedModule.module}}</p>
        <p>{{$t('roles.popup_mod_permision.claim')}}</p>
        <div class="row mg-top-30" style="margin-left: 30px">
            <div class="col-md-1"><b-form-checkbox v-model="selectedModule.consult" 
                :disabled="selectedModule.consult==null || disabledByAdmin || disabledByParticipate || disabledByControl"></b-form-checkbox></div>
            <div class="col-md-4"><p>{{$t('roles.popup_mod_permision.read')}}</p></div>
        </div>
        <div class="row" style="margin-left: 30px">
            <div class="col-md-1"><b-form-checkbox v-model="selectedModule.participate" 
                :disabled="selectedModule.participate==null || disabledByAdmin || disabledByControl"></b-form-checkbox></div>
            <div class="col-md-4"><p>{{$t('roles.popup_mod_permision.participate')}}</p></div>
        </div>
        <div class="row" style="margin-left: 30px">
            <div class="col-md-1"><b-form-checkbox v-model="selectedModule.download" 
                :disabled="selectedModule.download==null || disabledByAdmin"></b-form-checkbox></div>
            <div class="col-md-4"><p>{{$t('roles.popup_mod_permision.download')}}</p></div>
        </div>
        <div class="row" style="margin-left: 30px">
            <div class="col-md-1"><b-form-checkbox v-model="selectedModule.control" 
                :disabled="selectedModule.control==null || disabledByAdminControl"></b-form-checkbox></div>
            <div class="col-md-4"><p>{{$t('roles.popup_mod_permision.control')}}</p></div>
        </div>
        <div class="row" style="margin-left: 30px">
            <div class="col-md-1"><b-form-checkbox v-model="selectedModule.admin"
                :disabled="selectedModule.admin==null"></b-form-checkbox></div>
            <div class="col-md-4"><p>{{$t('roles.popup_mod_permision.admin')}}</p></div>
        </div>
        <b-row class="mg-top-30" style="text-align: center">
            <b-col>
                <sipsder-btn btnType="back" :text="$t('roles.popup_mod_permision.cancel')" @onClick="cancelModPermision()" />
            </b-col>
            <b-col>
                <sipsder-btn btnType="accept" :text="$t('roles.popup_mod_permision.save')" @onClick="saveModPermision()" />
            </b-col>
        </b-row>
    </b-modal>
    <!-- EDIT LATERAL MENU MODAL -->
    <b-modal ref="editLateralMenuModal" :title="$t('roles.popup_lateral_menu.title')" 
        :no-close-on-esc="true"
        :no-close-on-backdrop="true"
        :hide-header-close="true"
        hideFooter>
        <p>{{$t('roles.popup_lateral_menu.claim')}}</p>
        <div class="row mg-top-30" style="margin-left: 30px">
            <div class="col-md-4"><p style="font-weight: bold">{{$t('roles.popup_lateral_menu.sidebar')}}<span style='color: red'>*</span></p></div>
            <div class="col-md-5">
                <v-select v-model="lateralMenu.name" @input="setLateralMenu" label="name" :options="autocomplets.lateralMenus"></v-select>
            </div>
            <div v-show="lateralMenu.id" class="flex-around2">
                <b-form-checkbox v-model="lateralMenu.status"></b-form-checkbox>
                <p>{{$t('roles.popup_lateral_menu.active')}}</p>
            </div>
        </div>
        <div v-show="lateralMenu.id">
            <div v-if="lateralMenu.menu" class="row mg-top-10" style="margin-left: 30px">
                <div class="col-md-4"><p style="font-weight: bold">{{$t('roles.popup_lateral_menu.name')}}</p></div>
                <div class="col-md-6"><b-form-input v-model="lateralMenu.menu.name" disabled></b-form-input></div>
            </div>
            <div class="row mg-top-30" style="margin-left: 30px">
                <div class="col-md-4"><p style="font-weight: bold">{{$t('roles.popup_edit_menu.parent')}}<span style='color: red'>*</span></p></div>
                <div class="col-md-6">
                    <b-form-select v-model="lateralMenu.idMenu">
                        <option v-for="(parent,i) in autocomplets.lateralParents" :key="i" :value="parent.id">{{parent.name}}</option>
                    </b-form-select>
                </div>
            </div>
            <div class="row mg-top-10" style="margin-left: 30px">
                <div class="col-md-4"><p style="font-weight: bold">{{$t('roles.popup_lateral_menu.color')}}<span style='color: red'>*</span></p></div>
                <div class="col-md-5"><input v-model="lateralMenu.color" type="color"></div>
                <p v-show="!lateralMenu.color" class="red">{{ $t('roles.popup_lateral_menu.color_error') }}</p>
            </div>
            <div class="row mg-top-10" style="margin-left: 30px">
                <div class="col-md-4"><p style="font-weight: bold">{{$t('roles.popup_lateral_menu.icon')}}<span style='color: red'>*</span></p></div>
                <div class="col-md-6">
                    <v-select v-model="lateralMenu.icon" @input="setLateralIcon" :options="autocomplets.icons">
                        <template slot="option" slot-scope="option">
                            <span :class="option.value"></span>
                            {{ option.label }}
                        </template>
                    </v-select>
                </div>
                <div class="col-md-2"><div :class="lateralMenu.icon"></div></div>
                <p v-show="!lateralMenu.icon || lateralMenu.icon.length < 3" class="red">{{ $t('roles.popup_lateral_menu.icon_error') }}</p>
            </div>
        </div>
        <b-row class="mg-top-10" style="text-align: center">
            <b-col>
                <sipsder-btn btnType="back" :text="$t('roles.popup_mod_permision.cancel')" @onClick="cancelEditLateralMenu()" />
            </b-col>
            <b-col>
                <sipsder-btn btnType="accept" :text="$t('roles.popup_mod_permision.save')" @onClick="saveEditLateralMenu()" />
            </b-col>
        </b-row>
    </b-modal>

    <!-- EDIT MENU MODAL -->
    <b-modal ref="editMenuModal" :title="$t('roles.popup_edit_menu.title')" 
        :no-close-on-esc="true"
        :no-close-on-backdrop="true"
        :hide-header-close="true"
        hideFooter>
        <p>{{$t('roles.popup_edit_menu.claim')}}</p>
        <div class="row mg-top-30" style="margin-left: 30px">
            <div class="col-md-4"><p style="font-weight: bold">{{$t('roles.popup_edit_menu.parent')}}<span style='color: red'>*</span></p></div>
            <div class="col-md-5">
                <b-form-select v-model="selectedMenu.parent.id" @change="changedParent($event)"
                    :disabled="selectedMenu.page.id == null">
                    <option v-for="(parent,i) in autocomplets.parents" :key="i" :value="parent.id">{{parent.name}}</option>
                </b-form-select>
            </div>
            <div class="flex-around2">
                <b-form-checkbox v-model="selectedMenu.status"></b-form-checkbox>
                <p>{{$t('roles.popup_lateral_menu.active')}}</p>
            </div>
        </div>
        <div class="row mg-top-10" style="margin-left: 30px">
            <div class="col-md-4"><p style="font-weight: bold">{{$t('roles.popup_lateral_menu.name')}}<span style='color: red'>*</span></p></div>
            <div class="col-md-6"><b-form-input v-model="selectedMenu.name" maxlength="180"></b-form-input></div>
            <p v-show="!selectedMenu.name ||selectedMenu.name.length < 4" class="red">{{ $t('roles.popup_lateral_menu.name_error') }}</p>
        </div>
        <div class="row mg-top-10" style="margin-left: 30px">
            <div class="col-md-4"><p style="font-weight: bold">{{$t('roles.popup_edit_menu.page')}}<span style='color: red'>*</span></p></div>
            <div class="col-md-6"><b-form-input v-model="selectedMenu.page.name" :disabled="true"></b-form-input></div>
        </div>
        <div v-if="selectedMenu.page.id == null && selectedMenu.capacity > 1" class="row mg-top-10" style="margin-left: 30px">
            <div class="col-md-4"><p style="font-weight: bold">{{$t('roles.popup_edit_menu.order')}}<span style='color: red'>*</span></p></div>
            <div class="col-md-6">
                <b-form-select v-model="selectedMenu.orderBy">
                    <option v-for="(order,i) in autocomplets.orderBy" :key="i" :value="order.value">{{order.name}}</option>
                </b-form-select>
            </div>
        </div>
        <div v-if="!(selectedMenu.parent.id == null || selectedMenu.parent.id == 0 || parentChange)" class="row mg-top-10" style="margin-left: 30px">
            <div class="col-md-4"><p style="font-weight: bold">{{$t('roles.popup_edit_menu.position')}}<span style='color: red'>*</span></p></div>
            <div class="col-md-4"><v-select v-model="selectedMenu.priority" label="text" :options="autocomplets.priorities"></v-select></div>
        </div>
        <div class="row mg-top-10" style="margin-left: 30px">
            <div class="col-md-4"><p style="font-weight: bold">{{$t('roles.popup_lateral_menu.has_icon')}}</p></div>
            <div class="col-md-2"><b-form-checkbox v-model="selectedMenu.hasIcon"></b-form-checkbox></div>
        </div>
        <div v-if="selectedMenu.hasIcon" class="row mg-top-10" style="margin-left: 30px">
            <div class="col-md-4"><p style="font-weight: bold">{{$t('roles.popup_lateral_menu.icon')}}<span style='color: red'>*</span></p></div>
            <div class="col-md-6">
                <v-select v-model="selectedMenu.iconUrl" @input="setMenuIcon" :options="autocomplets.icons">
                    <template slot="option" slot-scope="option">
                        <span :class="option.value"></span>
                        {{ option.label }}
                    </template>
                </v-select>
            <p style='color: red'>{{$t('roles.icon_claim')}}</p>
            </div>
            <div class="col-md-2"><i :class="selectedMenu.iconUrl"></i></div>
            <p v-show="!selectedMenu.iconUrl || selectedMenu.iconUrl.length < 3" class="red">{{ $t('roles.popup_lateral_menu.icon_error') }}</p>
        </div>
        <div v-else class="row mg-top-10" style="margin-left: 30px">
            <div class="col-md-4"><p style="font-weight: bold">{{$t('roles.popup_lateral_menu.image')}}<span style='color: red'>*</span></p></div>
            <div class="col-md-6">
                    <div class="row">
                        <div v-if="selectedMenu.attachment.url || previewImage" class="col-md-5 social-logo">
                            <img v-if="previewImage" :src="previewImage" alt="Image" style="heigth: 60px; width: 60px">
                            <img v-else-if="selectedMenu.attachment.url" :src="getImgURL(selectedMenu.attachment.url)" alt="Image" style="heigth: 60px; width: 60px">
                            <img v-else src="https://placehold.co/50x50" style="heigth: 60px; width: 60px">
                        </div>
                        <div class="col-md-6 mt-3">
                            <input type="file"
                                    accept="image/*"
                                    name="register_template"
                                    @change="loadIconFile($event)" 
                                    ref="uploadFile"
                                    style="display: none"/>
                            <div class="row" @click="$refs.uploadFile.click()">
                                <div class="col-md-1"><i class="fas fa-edit"></i></div>
                                <div class="col-md-8" style="cursor: pointer">
                                    <p>{{$t('roles.popup_lateral_menu.change_icon')}}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-11 text-muted">
                        <p v-if="filename && !fileError" class="mt-3"> {{`${$t('social_network.selected_file')}: ${filename}`}} </p>
                        <p v-if="filename == null && !fileError && selectedMenu.attachment.url == null" class="error mt-3">{{$t('social_network.no_file')}}</p>
                        <p v-if="fileSizeError" class="mt-2 error">{{$t('social_network.file_error_size')}}</p>
                        <p v-if="fileExtError" class="mt-2 error">{{$t('social_network.file_error_type')}}</p>
                    </div>
            </div>
        </div>
        
        <b-row class="mg-top-10" style="text-align: center">
            <b-col>
                <sipsder-btn btnType="back" :text="$t('roles.popup_mod_permision.cancel')" @onClick="cancelEditMenu()" />
            </b-col>
            <b-col>
                <sipsder-btn btnType="accept" :text="$t('roles.popup_mod_permision.save')" @onClick="saveEditMenu()" />
            </b-col>
        </b-row>
    </b-modal>

    <!-- TITLE -->
    <sipsder-title :title="$t('roles.title')" :text="''" type="admin"></sipsder-title>

    <div class="ruralModel">
        <div class="divA">
            <div class="tab-design" :class="{active : tabIndex==0 }" @click="setTabIndex(0)"><div><span>{{$t('roles.tab_roles.title')}}</span></div></div>
            <div class="tab-design" :class="{active : tabIndex==1 }" @click="setTabIndex(1)"><div><span>{{$t('roles.tab_menus.title')}}</span></div></div>
        </div>
        <div class="divB">
            <!-- ROLES TAB -->
            <div class="containRuralModel" v-show="tabIndex==0">
                <!-- <sipsder-btn btnType="accept" :text="$t('roles.tab_roles.security_button')" @onClick="reloadSecurityService()" /> -->
                <div class="text-center mt-4 mb-4">
                    <i class="fas fa-exclamation-circle" style="display: inline; font-size: 1.2em"></i>
                    <p class="ml-3 mr-3" style="display: inline; font-size: 1.2em">{{$t('roles.tab_roles.message')}}</p>
                    <!-- <i class="fas fa-exclamation-circle" style="display: inline"></i> -->
                </div>
                <div class="flex-around">
                    <p>{{$t('roles.tab_roles.role_select')}}</p>
                    <b-col cols="4"><v-select v-model="roleFilter" :placeholder="$t('roles.tab_roles.role')"  label="text"  :options="autocomplets.roles"></v-select></b-col>
                    <sipsder-btn btnType="edit_pen" :text="''" @onClick="createRole(true)" :disabled="!this.roleFilter.text" />
                    <sipsder-btn btnType="add" :text="$t('roles.tab_roles.add_role')" @onClick="createRole(false)" />
                </div>
                <div>
                    <b-form-group :label="$t('roles.tab_roles.search_module')" class="mg-top-30" style="font-weight: bold"/>
                    <b-form-input v-model="searchModule" :placeholder="$t('roles.tab_roles.module')" class="col-md-6"></b-form-input>
                </div>
                <div class="table-menus borderer mg-top-30">
                    <div style="text-align: center">
                        <p v-if="loading" style="padding: 15px">{{$t('roles.loading')}}...</p>
                        <p v-else-if="!roleFilter.text" style="padding: 15px">{{$t('roles.choose_role')}}</p>
                        <p v-else-if="!moduleSearched.length && roleFilter.text" style="padding: 15px">{{$t('roles.no_records')}}</p>
                    </div>
                    <b-table v-if="moduleSearched.length" class="my-table-scroll"
                        :sort-by.sync="rolesSortBy"
                        :sort-desc.sync="sortDesc"
                        :fields="[
                            {key: 'module', label: `${$t('roles.tab_roles.module')}`, sortable: true},
                            {key: 'consult', label: `${$t('roles.popup_mod_permision.read')}`},
                            {key: 'participate', label: `${$t('roles.popup_mod_permision.participate')}`},
                            {key: 'download', label: `${$t('roles.popup_mod_permision.download')}`},
                            {key: 'control', label: `${$t('roles.popup_mod_permision.control')}`},
                            {key: 'admin', label: `${$t('roles.popup_mod_permision.admin')}`},
                            {key: 'actions', label: `${$t('roles.tab_menus.action')}`}
                            ]" :items="moduleSearched">
                        <template slot="consult" slot-scope="row">
                            <div style="text-align: center">
                                <p v-if="row.item.consult == null" class="fa fa-ban"></p>
                                <b-form-checkbox v-else v-model="row.item.consult" disabled></b-form-checkbox>
                            </div>
                        </template>
                        <template slot="participate" slot-scope="row">
                            <div style="text-align: center">
                                <p v-if="row.item.participate == null" class="fa fa-ban"></p>
                                <b-form-checkbox v-else v-model="row.item.participate" disabled></b-form-checkbox>
                            </div>
                        </template>
                        <template slot="download" slot-scope="row">
                            <div style="text-align: center">
                                <p v-if="row.item.download == null" class="fa fa-ban"></p>
                                <b-form-checkbox v-else v-model="row.item.download" disabled></b-form-checkbox>
                            </div>
                        </template>
                        <template slot="control" slot-scope="row">
                            <div style="text-align: center">
                                <i v-if="row.item.control == null" class="fa fa-ban"></i>
                                <b-form-checkbox v-else v-model="row.item.control" disabled></b-form-checkbox>
                            </div>
                        </template>
                        <template slot="admin" slot-scope="row">
                            <div style="text-align: center">
                                <p v-if="row.item.admin == null" class="fas fa-ban"></p>
                                <b-form-checkbox v-else v-model="row.item.admin" disabled></b-form-checkbox>
                            </div>
                        </template>
                        <template slot="actions" slot-scope="row">
                            <div style="text-align: center">
                                <sipsder-btn btnType="edit_pen" :text="''" @onClick="modifyPermision(row.item)" />
                            </div>
                        </template>
                    </b-table>
                </div>
                <div class="mg-top-30" style="text-align: center">
                    <sipsder-btn btnType="back" @onClick="$router.go(-1)" :text="$t('prototype.create.form.back')" ></sipsder-btn>
                </div>
            </div>
            <!-- MENUS TAB -->
            <div class="containRuralModel" v-show="tabIndex==1">
                <p class="mg-top-10">{{$t('roles.tab_menus.claim')}}</p>
                <sipsder-btn btnType="edit" @onClick="modifyLateralMenu()" :text="$t('roles.tab_menus.lateral_button')" ></sipsder-btn>
                <div>
                    <b-form-group :label="$t('roles.tab_menus.search_menu')" class="mg-top-30" style="font-weight: bold"/>
                    <b-form-input v-model="searchMenu" :placeholder="$t('roles.tab_menus.menu')" class="col-md-6"></b-form-input>
                </div>
                <div class="table-menus borderer mg-top-30">
                    <div style="text-align: center">
                        <p v-if="loading" style="padding: 15px">{{$t('roles.loading')}}...</p>
                        <p v-else-if="!menuSearched.length" style="padding: 15px">{{$t('roles.no_records')}}</p>
                    </div>
                    <b-table v-if="menuSearched.length" 
                        :sort-by.sync="menusSortBy"
                        :sort-desc.sync="sortDesc"
                        :fields="[
                            {key: 'name', label: `${$t('roles.tab_menus.menu')}`, sortable: true},
                            {key: 'parent', label: `${$t('roles.tab_menus.parent')}`},
                            {key: 'page', label: `${$t('roles.tab_menus.page')}`},
                            {key: 'status', label: `${$t('roles.tab_menus.active')}`},
                            {key: 'actions', label: `${$t('roles.tab_menus.action')}`}
                            ]" :items="menuSearched">
                        <template slot="parent" slot-scope="row">
                            <div>
                                <p>{{row.item.parent.name}}</p>
                            </div>
                        </template>
                        <template slot="page" slot-scope="row">
                            <div>
                                <p v-if="row.item.page.name != null">{{$t(`route.${row.item.page.name}`)}}</p>
                            </div>
                        </template>
                        <template slot="status" slot-scope="row">
                            <div style="text-align: center">
                                <p v-if="row.item.status">{{$t('roles.tab_menus.yes')}}</p>
                                <p v-else>{{$t('roles.tab_menus.no')}}</p>
                            </div>
                        </template>
                        <template slot="actions" slot-scope="row">
                            <div style="text-align: center">
                                <sipsder-btn btnType="edit_pen" :text="''" @onClick="modifyMenu(row.item)" />
                            </div>
                        </template>
                    </b-table>
                </div>
                <div class="mg-top-30" style="text-align: center">
                    <sipsder-btn btnType="back" @onClick="$router.go(-1)" :text="$t('prototype.create.form.back')" ></sipsder-btn>
                </div>
            </div>
        </div>
    </div>

</div>
    
</template>

<script>
import { SERVICE_NAMES, HTTP_STATUS, ICON } from '../../../sipsder_constants'; 
import { ROLES } from '../../../domain_constants'; 
import { PERMISSIONS_LEVELS, PERMISSIONS_TYPES, MENU_ORDER, MENUS, ATTACHMENT_TYPE } from '../../../domain_constants';
import VAPI from "../../../http_common";
import vSelect from "vue-select";
import Audiovisualmedia from "@/components/views/audiovisual_media/AudioVisualIndex.vue";
import fontAwesome from '@/assets/menu/fontAwesome.json';
import S_UTIL from "../../../util/sipsder_util";

export default {
    components: {
        "v-select": vSelect,
        Audiovisualmedia,
    },
    data(){
        return {

            file: {},
            filename: null,
            fileSizeError: false,
            fileExtError: false,
            fileError: false,
            previewImage: null,

            menusSortBy: 'parent.name',
            rolesSortBy: 'module',
            sortDesc: false,

            permissionLevels: null,
            permissionTypes: null,
            menuOrders: null,
            tabIndex: 0,
            disabledByAdmin: false,
            disabledByControl: false,
            disabledByAdminControl: false,
            disabledByParticipate: false,

            iconsJson: fontAwesome.dataArray,
            asterisk: "<span style='color: red'>*</span>",
            oldParentId: null,
            parentChange: false,

            selectedModule: {},
            selectedMenu: {
                name: "",
                iconUrl: "",
                page: {},
                parent: {},
                attachment: {}
            },

            roleFilter: {},

            menuFilter: {},

            oldRoleName: null,
            oldRoleSdp: null,

            searchModule: null,
            searchMenu: null,
            isEditingRole: false,

            autocomplets: {
                roles: [], 
                permisions: {},
                menus: [],
                lateralMenus: [],
                lateralParents: [],
                parentMenu: [],
                parents: [],
                icons: [],
                orderBy: [{
                        name: "Alfabetico",
                        value: MENU_ORDER.ALPHABETIC
                    }, 
                    {
                        name: "Prioridad",
                        value: MENU_ORDER.PRIORITY
                    }],
                priorities: []
            },


            disableInherit: false,
            
            addRole: {
                id: null,
                name: "",
                sdpCode: "",
                summary: "",
                inherit: false,
                inheritRole: null,
            },

            lateralMenu: {
                id: null,
                status: null,
                name: "",
                parent: null,
                color: null,
                icon: "",
            },

            showEditMenuModal: false,

            loading: false,

            message: this.$t("news.create.message"),
            mediaOptions: [
                {value: ATTACHMENT_TYPE.PUBLIC_IMAGE, text: this.$t("audiovisual_media.imageOption")},
                {value: ATTACHMENT_TYPE.VIDEO, text: this.$t("audiovisual_media.videoOption")}
            ],
            includeImageOptions: [
                { value: false, text: this.$t("news.createt.exc") },
                { value: true, text: this.$t("news.createt.inc") }
            ],
        }
    },
    watch: {
        'roleFilter.text': function(newVal) {
            this.searchModule = null
        },
        'selectedModule.admin': function(newVal){
            if(newVal == true || this.selectedModule.admin){
                if(this.selectedModule.consult != null) this.selectedModule.consult = true;
                if(this.selectedModule.participate != null) this.selectedModule.participate = true;
                if(this.selectedModule.download != null) this.selectedModule.download = true;
                if(this.selectedModule.control != null) this.selectedModule.control = true;
                this.disabledByAdmin = true
                this.disabledByAdminControl = true
            }else{
                this.disabledByAdmin = false
                this.disabledByAdminControl = false
                if(this.selectedModule.control) this.disabledByControl = true
            } 

        },
        'selectedModule.control': function(newVal){
            if(newVal == true || this.selectedModule.control){
                if(this.selectedModule.consult != null) this.selectedModule.consult = true;
                if(this.selectedModule.participate != null) this.selectedModule.participate = true;
                this.disabledByControl = true
            }else{
                this.disabledByControl = false
                if(this.selectedModule.admin){
                    this.disabledByAdmin = true
                }else{
                    this.disabledByAdmin = false
                }
            }      
        },
        'selectedModule.participate': function(newVal){
            if(newVal == true || this.selectedModule.participate){
                if(this.selectedModule.consult != null) this.selectedModule.consult = true;
                this.disabledByParticipate = true
            }else{
                this.disabledByParticipate = false
                if(this.selectedModule.download) this.disabledByParticipate = true
            }  
        },
        'selectedModule.download': function(newVal){
            if(newVal == true || this.selectedModule.download){
                if(this.selectedModule.consult != null) this.selectedModule.consult = true;
                this.disabledByParticipate = true
            }else {
                this.disabledByParticipate = false  
                if(this.selectedModule.participate) this.disabledByParticipate = true
            }
        },
    },
    computed: {
        errorLdap(){
            if( this.addRole.id != ROLES.CITIZEN && this.addRole.id != ROLES.PUBLIC ){
                if( !this.addRole.sdpCode || this.addRole.sdpCode.length < 4 ){ 
                    return true
                }
            }
            return false
        },
        roleLdapExists(){
            let exists = false
            if(this.addRole.sdpCode){
                this.autocomplets.roles.forEach(role => {
                    if(role.sdpCode && this.addRole.sdpCode.replace(/ /g,'').toLowerCase() == role.sdpCode.toLowerCase()){
                        // console.info("ROLE: ", role.sdpCode)
                        // console.info("VALUE: ", this.addRole.sdpCode)
                        exists = true
                    }
                })
                if(this.isEditingRole && exists && this.oldRoleSdp == this.addRole.sdpCode){
                    return false
                }
                return exists
            }
        },
        roleNameExists(){
            let exists = false
            if(this.addRole.name){
                this.autocomplets.roles.forEach(role => {
                    if(!this.isEditingRole && this.addRole.name.replace(/ /g,'').toLowerCase() == role.text.toLowerCase()){
                        exists = true
                    }else if(this.isEditingRole && this.addRole.name.replace(/ /g,'').toLowerCase() != this.roleFilter.text.toLowerCase()
                                && this.addRole.name.replace(/ /g,'').toLowerCase() == role.text.toLowerCase()){
                        exists = true
                    }
                })
                if(this.isEditingRole && exists && this.oldRoleName == this.addRole.name){
                    return false
                }
                return exists
            }
        },
        moduleSearched(){
            if(!this.roleFilter.text){
                return []
            }
            if(!this.searchModule){
                return this.autocomplets.permisions[this.roleFilter.text]
            }
            let finded = this.autocomplets.permisions[this.roleFilter.text].filter((permision) => {
                return permision.module.toLowerCase().match(this.searchModule.toLowerCase())
            });
            return finded
        },
        menuSearched(){
            if(!this.searchMenu){
                return this.autocomplets.menus
            }
            return this.autocomplets.menus.filter((menu) => {
                return menu.name.toLowerCase().match(this.searchMenu.toLowerCase())
            });
        }
    },
    methods: {
        showModal(ref) {
            this.$refs[ref].show();
        },
        closeModal(ref) {
            this.$refs[ref].hide();
        },
        getImgURL (url) {
            return S_UTIL.getImgURL(url);
        },
        showMenuModal(ref) {
            this.showEditMenuModal = true;
            this.$refs[ref].show();
        },
        closeMenuModal(ref) {
            this.showEditMenuModal = false;
            this.$refs[ref].hide();
        },
        async setTabIndex(index){
            this.tabIndex = index
            if(this.tabIndex == 1 ){
                await this.loadMenusData()
            }else if(this.tabIndex == 0){
                await this.loadRolesData()
            }
        },
        loadIconFile(e) {
            if(e.target.files[0].type === "image/gif" || e.target.files[0].type === "image/jpeg" 
                || e.target.files[0].type === "image/png" || e.target.files[0].type === "image/svg+xml" ){
                if(e.target.files[0].size <= ICON.MAX_SIZE){
                    this.file = e.target.files[0];
                    this.filename = e.target.files[0].name;
                    //Preview the image
                    const reader = new FileReader();
                    reader.readAsDataURL(this.file);
                    reader.onload = e =>{
                        this.previewImage = e.target.result;
                    };
                    //Errors on file
                    this.fileSizeError = false;
                    this.fileExtError = false;
                    this.fileError = false;
                }else{
                    this.fileSizeError = true;
                }
            }else{
                this.fileExtError = true;
                this.fileError = true;
            }
        },
        changedParent(event){
            if(this.oldParentId != event){
                this.parentChange = true;
            }else{
                this.parentChange = false;
            }
        }, 
        setLateralMenu(selected){
            if(selected){
                this.lateralMenu = JSON.parse(JSON.stringify(selected))
            }
        },
        setLateralIcon(selected){
            if(selected){
                this.lateralMenu.icon = selected.value
            }
        },
        setMenuIcon(selected){
            if(selected){
                this.selectedMenu.iconUrl = selected.value
            }
        },
        reloadSecurityService(){
            
        },
        //For roles
        rolesPopupTitle(role){
            if (role.id != null){
                return this.$t('roles.popup_add_role.title_2')
            }
            return this.$t('roles.popup_add_role.title_1')
        },
        disableRoleLdap(role){
            if( role.id == ROLES.CITIZEN || role.id == ROLES.PUBLIC ){
                return true
            }
            return false
        },
        createRole(isEditing){
            // console.info("ROLE FILTER: ", this.roleFilter)
            if(isEditing){
                this.isEditingRole = true
                this.disableInherit = true
                this.addRole.id = this.roleFilter.value.id
                this.addRole.sdpCode = this.roleFilter.value.sdpCode
                this.addRole.name = this.roleFilter.value.role
                this.addRole.summary = this.roleFilter.value.summary
            }else{
                this.disableInherit = false;
                this.isEditingRole = false
            }
            this.oldRoleName = this.addRole.name
            this.oldRoleSdp = this.addRole.sdpCode
            this.showModal('addRoleModal')
        },
        modifyPermision(moduleSel){
            this.selectedModule = JSON.parse(JSON.stringify(moduleSel))
            this.showModal('modifyPermisionModal')
        },  
        modifyMenu(menuSel){
            this.parentChange = false
            this.autocomplets.priorities = []
            this.oldParentId = null
            this.selectedMenu = JSON.parse(JSON.stringify(menuSel))
            for(var i=1 ; i<menuSel.parent.children ; i++){
                this.autocomplets.priorities.push(i)
            }
            this.oldParentId = menuSel.parent.id
            this.showMenuModal('editMenuModal')
        },
        async saveAddRole(){
            if((this.addRole.name && this.addRole.summary) 
                && (this.addRole.name.length >= 4 && this.addRole.summary.length >= 10) ){
                if(this.addRole.id){
                    let response = await VAPI.put(`/${SERVICE_NAMES.PERMISSION}/roles/${this.addRole.id}`, this.addRole);
                    if(response.status == HTTP_STATUS.OK){
                        this.showModal('success_modal')
                    }
                }else{
                    let response = await VAPI.post(`/${SERVICE_NAMES.PERMISSION}/new-role`, this.addRole)
                    if(response.status == HTTP_STATUS.OK){
                        this.showModal('success_modal')
                    }
                }
            }
            this.selectedModule = {}
            await this.loadRolesData()
        },
        cancelAddRole(){
            this.addRole = {
                name: "",
                sdpCode: "",
                summary: "",
                inherit: false,
                inheritRole: null,
            },
            this.selectedModule = {}
            this.closeModal('addRoleModal')
        },
        async saveModPermision(){
            let response = await VAPI.post(`/${SERVICE_NAMES.PERMISSION}/edit`, this.selectedModule);
            if(response.status == HTTP_STATUS.OK){
                let response = await VAPI.put(`/${SERVICE_NAMES.PERMISSION}/apply-changes`);
                if(response.status == HTTP_STATUS.OK){
                    this.closeModal('modifyPermisionModal')
                    await this.loadRolesData()
                }
            }
        },
        cancelModPermision(){
            this.selectedModule = {}
            this.closeModal('modifyPermisionModal')
        },

        //For menus
        modifyLateralMenu(){  
            this.showModal('editLateralMenuModal')
        },
        async saveEditLateralMenu(){
            if(this.lateralMenu.icon.length >= 3 && this.lateralMenu.color){
                let response = await VAPI.put(`/${SERVICE_NAMES.MENU}/lateral/${this.lateralMenu.id}`, {
                    id: this.lateralMenu.id,
                    icon: this.lateralMenu.icon,
                    status: this.lateralMenu.status,
                    color: this.lateralMenu.color,
                    menuId: this.lateralMenu.idMenu
                });
                if(response.status == HTTP_STATUS.OK){
                    this.closeMenuModal('editLateralMenuModal')
                    this.searchMenu = null
                    this.lateralMenu = {
                        id: null,
                        name: "",
                        status: null,
                        parent: null,
                        color: null,
                        icon: "",
                    }
                    this.$store.dispatch("getMenus", true);
                    await this.loadMenusData()
                }
            }
        },
        assemblePayload() {

            let formData = new FormData();
            formData.append( 'id', this.selectedMenu.id)
            formData.append( 'capacity', this.selectedMenu.capacity)
            if(this.selectedMenu.orderBy != null){
                formData.append( 'orderBy', this.selectedMenu.orderBy)
            }
            formData.append( 'name', this.selectedMenu.name)
            formData.append( 'status', this.selectedMenu.status)
            formData.append( 'priority', this.selectedMenu.priority)
            formData.append( 'hasIcon', this.selectedMenu.hasIcon)
            formData.append( 'iconUrl', this.selectedMenu.iconUrl)
            formData.append( 'parentId', this.selectedMenu.parent.id)
            
            if(this.filename != null && !this.selectedMenu.hasIcon){
                formData.append( 'file',  this.file );
            }
            return formData
        },
        async saveEditMenu(){
            if((this.selectedMenu.hasIcon && this.selectedMenu.iconUrl.length >= 3) || (!this.selectedMenu.hasIcon && this.selectedMenu.name.length >= 4)){
                let assembled = this.assemblePayload()
                let response = await VAPI.post(`/${SERVICE_NAMES.MENU}`, assembled, { headers: { 'Content-Type': 'multipart/form-data' } })
                if(response.status == HTTP_STATUS.OK){
                    this.closeMenuModal('editMenuModal')
                    this.file = {}
                    this.filename = null
                    this.fileSizeError = false
                    this.fileExtError = false
                    this.fileError = false
                    this.previewImage = null
                    this.selectedMenu = {
                        name: "",
                        iconUrl: "",
                        page: {},
                        parent: {},
                        attachment: {}
                    }
                    this.$store.dispatch("getMenus", true);
                    await this.loadMenusData()
                }
            }
        },
        cancelEditMenu(){
            this.file = {}
            this.filename = null
            this.fileSizeError = false
            this.fileExtError = false
            this.fileError = false
            this.previewImage = null
            this.selectedMenu = {
                name: "",
                iconUrl: "",
                page: {},
                parent: {},
                attachment: {}
            },
            this.autocomplets.priorities = []
            this.closeMenuModal('editMenuModal')
        },
        cancelEditLateralMenu(){
            this.lateralMenu = {}
            this.closeModal('editLateralMenuModal')
        },
        cancelModMenu(){
            this.selectedMenu = {
                name: "",
                iconUrl: "",
                page: {},
                parent: {},
                attachment: {}
            },
            this.closeLateralModal('editLateralMenu')
        },
        async loadMenusData(){
            this.loading = true
            this.autocomplets.menus = []
            this.autocomplets.lateralMenus = []
            this.autocomplets.lateralParents = []
            this.searchMenu = null
            try{
                let response2 = await VAPI.get(`/${SERVICE_NAMES.MENU}/lateral`);
                if(response2.status == HTTP_STATUS.OK){
                    this.autocomplets.lateralMenus = response2.data;
                    this.autocomplets.lateralMenus.map(e => {
                        e.hasIcon == null ? e.hasIcon = false : e.hasIcon = e.hasIcon 
                        if(!e.parent){
                            e.parent = {id: 0}
                        }                
                    })
                }
                let response1 = await VAPI.get(`/${SERVICE_NAMES.MENU}/all`);
                if(response1.status == HTTP_STATUS.OK){
                    this.autocomplets.menus = response1.data;
                    this.autocomplets.menus.map(e => {
                        e.hasIcon == null ? e.hasIcon = false : e.hasIcon = e.hasIcon 
                        if(!e.parent.id){
                            e.parent = {id: 0}
                        }                
                    })
                }
                this.autocomplets.parents = this.autocomplets.menus.filter(menu => {
                    if(!menu.page.id && menu.capacity > 1) return menu
                })
                this.autocomplets.lateralParents = this.autocomplets.menus.filter(menu => {
                    if(!menu.page.id && menu.capacity > 1 && menu.id != MENUS.ROOT) return menu
                })
                this.loading = false
            }catch(e){
                console.log(e)
            }
        },
        async loadRolesData(){
            this.loading = true
            let oldRoleFilter = JSON.parse(JSON.stringify(this.roleFilter))
            this.autocomplets.roles = []
            this.autocomplets.permisions = {}
            this.searchModule = null
            try{
                let response1 = await VAPI.get(`/${SERVICE_NAMES.PERMISSION}/roles`);
                if(response1.status == HTTP_STATUS.OK){
                    this.autocomplets.roles = response1.data.data.map(role => {
                        return {
                            text: role.role, 
                            value: role,
                            sdpCode: role.sdpCode
                        };
                    });
                }

                let response = await VAPI.get(`/${SERVICE_NAMES.PERMISSION}/all`);
                if(response.status == HTTP_STATUS.OK){
                    this.autocomplets.roles.forEach(role => {
                        this.autocomplets.permisions[role.text] = []
                        response.data.data.map(permission => {
                            if(permission.role == role.text){
                                this.autocomplets.permisions[role.text].push({
                                    idModule: permission['idModule'],
                                    idRole: permission['idRole'], 
                                    module: permission['module'],
                                    role: permission['role'],
                                    priority: permission['priority'],
                                    admin: permission['admin'] == 0 ? false : permission['admin'] == 1 ? true : null,
                                    consult: permission['read'] == 0 ? false : permission['read'] == 1 ? true : null,
                                    control: permission['control'] == 0 ? false : permission['control'] == 1 ? true : null,
                                    download: permission['download'] == 0 ? false : permission['download'] == 1 ? true : null,
                                    participate: permission['participate'] == 0 ? false : permission['participate'] == 1 ? true : null
                                })
                            }
                        })
                    })
                }
                this.roleFilter = oldRoleFilter
                this.loading = false
            }catch(e){
                console.log(e)
            }
        },
    },
    async beforeMount(){

        await this.loadRolesData();

        this.permissionLevels = PERMISSIONS_LEVELS
        this.permissionTypes = PERMISSIONS_TYPES
        this.menuOrders = MENU_ORDER

        this.autocomplets.icons = this.iconsJson.map(icon => {
            return {
                label: "" + icon.attributes.id,
                value: icon.attributes.prefix + " " + icon.type + "-" + icon.attributes.id   
            }
        })
    }
}
</script>

<style lang="css">

table.my-table-scroll,
table.my-table-scroll>thead,
table.my-table-scroll>tbody,
table.my-table-scroll>tfoot,
table.my-table-scroll>tbody>tr,
table.my-table-scroll>thead>tr {
  width: 100%;
  display: block;
}


table.my-table-scroll>tbody,
table.my-table-scroll>tfoot {
  display: block;
  width: 100%;
  overflow-y: scroll;
}

table.my-table-scroll>thead,
table.my-table-scroll>tfoot {
  height: auto;
}

table.my-table-scroll>tbody {
  max-height: 350px;
}

table.my-table-scroll>tbody>tr>td{
    border-right: 0px;
    border-left: 0px;
}

table.my-table-scroll>thead>tr>th,
table.my-table-scroll>thead>tr>td,
table.my-table-scroll>tbody>tr>th,
table.my-table-scroll>tbody>tr>td,
table.my-table-scroll>tfoot>tr>th,
table.my-table-scroll>tfoot>tr>td {
  display: inline-block;
  width: 14.285%;
}


</style>

<style lang="sass" scoped>
@import '../../../stylesheets/style.sass'

.error
    color: red
    font-size: 0.9em
    font-weight: normal

.borderer
    border: 1px solid #a19d9e
    border-radius: 5px
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 3px 10px 0 rgba(0, 0, 0, 0.19)
.red
    color: red

.flex-around2
    display: flex
    justify-content: space-around

.flex-around
    display: flex
    justify-content: space-around
    align-items: center

.flex-end
    display: flex
    justify-content: flex-end
    align-items: center

.ruralModel
    grid-template-areas: "a b" !important
    grid-template-columns: 10% 90% !important
    max-height: 900px !important

.ruralModel
  display: grid
  grid-template-areas: "a b"
  grid-template-columns: 10% 90%
  width: 90%
  max-height: 850px
  margin-left: auto
  margin-right: auto
  overflow: hidden
  .divA
    height: 100%
    margin-top: 10px
    grid-area: a
  .divB
    z-index: 2
    div.containRuralModel
      grid-area: b
      background-color:#fff
      width: 99%
      z-index: 3
      border-left: 3px solid $colorTitleDark
      border-radius: 3px
      padding: 15px
      text-align: justify
      max-height: 900px
      overflow-y: auto
      border: solid gray

.tab-design  
  margin-right: -5px !important
  margin-bottom: 10px !important
  transform: rotate(3deg)
  width: 100%
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
      box-shadow: 0px 0px 3px #333
      background: $colorTitleDark
      color: white
      border-color: unset
      transition: 0.5s
  &:hover
    div
      box-shadow: 0px 0px 3px #333

.mg-top-10
  margin-top: 10px

.mg-top-30
  margin-top: 30px

.red
    color: red

</style>
