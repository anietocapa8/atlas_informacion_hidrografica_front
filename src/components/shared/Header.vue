
<template>
  <div class="header-container">
    <div class="header-gov">
      <a href="https://www.gov.co/" target="_blank">
        <img alt="Logo Gov.co" src="../../assets/logo_govco.svg">
      </a>
    </div>
    <div class="header fixed" v-if="!isResponsive && fixedMenu">
      <div class="super-header">
        <div class="menu">
          <div class="image-container bigger" >
            <div class="greeting smaller">
              {{ $t("message.hello") }}, {{ $t("message.day")}} {{ date }}
            </div>
            <div class="image stick">
              <div v-if="header != null">
                <router-link to="/" v-if="header.logos.sipsder == null ">
                  <img src="../../assets/sipsder_logo_ancho.png" class="smaller">
                </router-link>
                 <router-link to="/" v-else>
                  <img v-if="header.logos.sipsder.logoUrl !== null" :src="getImgURL(header.logos.sipsder.logoUrl)" class="smaller"  @error="getPlaceHolderSipsder">
                  <img v-else src="../../assets/sipsder_logo_ancho.png">
                </router-link>
              </div>
              <router-link to="/" v-else>
                <img src="../../assets/sipsder_logo_ancho.png" class="smaller">
              </router-link>
            </div>
          </div>
          <div class="content bigger">
            <div class="options-container bigger">
              <div class="options-menu">
                <template v-for="link of getMainMenu()">
                  <div class="option" v-bind:key="link.id" 
                    v-if="link.children.length === 0" v-bind:class="{'middle-menu': !link.last}">
                    <router-link :to="{name: getPage(link)}" tag="div" class="link">
                      {{link.name}}
                    </router-link>
                  </div>
                  <b-dropdown v-if="link.children.length !== 0 && link.hasPermission"
                    no-caret
                    variant="link"
                    v-bind:key="link.id" class="option" v-bind:class="{'middle-menu': !link.last}">
                    <template slot="button-content">
                      <div class="option-dropdown">{{link.name}}</div>
                    </template>
                    <template v-for="link2 of link.children">
                      <b-dropdown-item
                        v-bind:key="link2.id"
                        v-if="link2.hasPermission && getPage(link2) !== 'CommunityLibrary'"
                        :to="{name: getPage(link2)}">
                        {{link2.name}}
                      </b-dropdown-item>
                      <b-dropdown-item
                        v-bind:key="link2.id"
                        v-else-if="link2.hasPermission"
                        :to="{name: getPage(link2), params:{community : 'community'}}">
                        {{link2.name}}
                      </b-dropdown-item>
                    </template>
                  </b-dropdown>
                </template>
              </div>
              <div class="options-user bigger">
                <div class="profile" v-if="isLogged">
                  <b-dropdown no-caret class="option-dropdown profile-options" variant="link">
                    <template slot="button-content">
                      <div class="profile-image">
                        <img :src="getProfileImage()"/>
                      </div>
                      <span class="profile-name">{{getUserName()}}</span>
                    </template>
                    <b-dropdown-item :to="{name: 'UserProfile'}">
                      <i class="fas fa-user-circle"></i>
                      {{$t("header.userOptions.profile")}}
                    </b-dropdown-item>
                    <b-dropdown-item >
                      <i class="fas fa-key"></i>
                      <span v-b-modal.password-modal>
                        {{$t("header.userOptions.changePassword")}}
                      </span>
                    </b-dropdown-item>
                    <b-dropdown-item :to="{name: 'AudioVisualAdmin'}">
                      <i class="fas fa-images"></i>
                      {{$t("header.userOptions.audiovisual")}}
                    </b-dropdown-item>
                    <b-dropdown-item v-on:click="signOut()">
                      <i class="fas fa-sign-out-alt"></i>
                      {{$t("header.userOptions.logout")}}
                    </b-dropdown-item>
                  </b-dropdown>
                </div>
                <div class="profile" v-else>
                  <div class="profile-image">
                    <img src="../../assets/profile.png">
                  </div>
                  <div class="profile-name">
                    <span class="sign-in" v-b-modal.login>{{ $t("header.userOptions.signIn") }}</span>
                    <span> {{ $t("header.userOptions.disjunction") }} </span>
                    <router-link :to="{name: 'UserRegistration'}" tag="span" class="sign-in">
                      {{ $t("header.userOptions.registering") }}
                    </router-link>
                  </div>
                </div>
                <div class="notification" v-if="isLogged">
                  <router-link :to="{name: 'Notification'}">
                    <img src="../../assets/notification.png">
                    <div
                      class="chip"
                      v-if="isLogged"
                      v-bind:class="{ 'chip-alert': notificationsCount > 0 }"
                    >
                      <div class="text">{{notificationsCount}}</div>
                    </div>
                  </router-link>
                </div>
              </div>
              <div class="mayor-logo">
                <div v-if="header!=null">
                  <router-link to="/" v-if="header.logos.mayor == null ">
                    <img src="../../assets/logo_bogota2.png">
                  </router-link>
                  <a :href="header.logos.mayor.clickUrl" target="_blank"  v-else>
                    <img v-if="header.logos.mayor.logoUrl !== null" :src="getImgURL(header.logos.mayor.logoUrl)"  @error="getPlaceHolderMayor">
                    <img v-else src="../../assets/logo_bogota2.png">
                  </a>
                </div>
                <router-link to="/" v-else>
                  <img src="../../assets/logo_bogota2.png">
                </router-link>
              </div>
            </div>
          </div>
        </div>
          <el-breadcrumb class="app-breadcrumb" separator="/">
            <el-breadcrumb-item key="1" to="/">   
              <i styles="color:fff" class="fa fa-home" aria-hidden="true"></i>
            </el-breadcrumb-item>
            <el-breadcrumb-item v-for="item in levelList" :key="item.name" :to="item.path">
              {{ item.title }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <b-modal ref="sessionTimeoutModal" :title="$t('session.idle.modalTitle')" :hide-footer="true">
          {{$t('session.idle.modalMessage')}}
          <br>
          <sipsder-btn :text="$t('button.accept')" btnType="accept" @onClick="hideSessionTimeoutModal"></sipsder-btn>
        </b-modal>
        <app-login></app-login>
        <s-change-password> </s-change-password>
    </div>
      <!-- FIXED -->
    <div class="header" v-else-if="!isResponsive">
      <div class="super-header">
        <div class="menu">
          <div class="image-container" >
            <div class="greeting" >
              {{ $t("message.hello") }}, {{ $t("message.day")}} {{ today }}
            </div>
            <div class="image">
              <div v-if="header != null">
                <router-link to="/" v-if="header.logos.sipsder == null ">
                  <img src="../../assets/sipsder_logo_ancho.png">
                </router-link>
                <router-link to="/" v-else>
                  <img v-if="header.logos.sipsder.logoUrl !== null" :src="getImgURL(header.logos.sipsder.logoUrl)"  @error="getPlaceHolderSipsder">
                  <img v-else src="../../assets/sipsder_logo_ancho.png">
                </router-link>
              </div>
              <router-link to="/" v-else>
                <img src="../../assets/sipsder_logo_ancho.png">
              </router-link>
            </div>
          </div>
          <div class="content">
            <div class="search-container">
              <div class="language">
                <img class="language" src="../../assets/idioma.png">
                <select v-model="$i18n.locale">
                  <option v-for="(lang, i) in langs" :key="`Lang${i}`" :value="lang">{{ lang }}</option>
                </select>
              </div>
              <div class="search">
                <input v-model="query" v-b-tooltip.hover name="meta" :title="$t('metasearch.tooltip')" 
                :placeholder="placeholder" @keyup.enter="goMetasearchPage()"/>
                <i @click="goMetasearchPage()" class="fa fa-search"/>
              </div>
              <div class="social-network">
                <a
                  v-for="v in getActiveSocialNetworks"
                  :href="getValidUrl(v.logo.url)"
                  :key="v.id"
                  class="circle"
                  target="_blank"
                >
                  <img :src="getImgURL(v.logo.attachment.url)" v-if="v.logo.attachment.url != null">
                  <i class="circle fab" :class="getSocialNetwork(v.name)" v-else></i>
                </a>
              </div>
            </div>
            <div class="options-container">
              <div class="options-menu">
                <template v-for="link of getMainMenu()">
                  <div class="option" v-bind:key="link.id" 
                    v-if="link.children.length === 0" v-bind:class="{'middle-menu': !link.last}">
                    <router-link :to="{name: getPage(link)}" tag="div" class="link">
                      {{link.name}}
                    </router-link>
                  </div>
                  <b-dropdown v-if="link.children.length !== 0 && link.hasPermission"
                    no-caret
                    variant="link"
                    v-bind:key="link.id" class="option" v-bind:class="{'middle-menu': !link.last}">
                    <template slot="button-content">
                      <div class="option-dropdown">{{link.name}}</div>
                    </template>
                    <template v-for="link2 of link.children">
                      <b-dropdown-item
                        v-bind:key="link2.id"
                        v-if="link2.hasPermission && getPage(link2) !== 'CommunityLibrary'"
                        :to="{name: getPage(link2)}">
                        {{link2.name}}
                      </b-dropdown-item>
                      <b-dropdown-item
                        v-bind:key="link2.id"
                        v-else-if="link2.hasPermission"
                        :to="{name: getPage(link2), params:{community : 'community'}}">
                        {{link2.name}}
                      </b-dropdown-item>
                    </template>
                  </b-dropdown>
                </template>
              </div>
              <div class="options-user">
                <div class="profile" v-if="isLogged">
                  <b-dropdown no-caret class="option-dropdown profile-options" variant="link">
                    <template slot="button-content">
                      <div class="profile-image">
                        <img :src="getProfileImage()"/>
                      </div>
                      <span class="profile-name">{{getUserName()}}</span>
                    </template>
                    <b-dropdown-item :to="{name: 'UserProfile'}">
                      <i class="fas fa-user-circle"></i>
                      {{$t("header.userOptions.profile")}}
                    </b-dropdown-item>
                    <b-dropdown-item >
                      <i class="fas fa-key"></i>
                      <span v-b-modal.password-modal>
                        {{$t("header.userOptions.changePassword")}}
                      </span>
                    </b-dropdown-item>
                    <b-dropdown-item :to="{name: 'AudioVisualAdmin'}">
                      <i class="fas fa-images"></i>
                      {{$t("header.userOptions.audiovisual")}}
                    </b-dropdown-item>
                    <b-dropdown-item v-on:click="signOut()">
                      <i class="fas fa-sign-out-alt"></i>
                      {{$t("header.userOptions.logout")}}
                    </b-dropdown-item>
                  </b-dropdown>
                </div>
                <div class="profile" v-else>
                  <div class="profile-image">
                    <img src="../../assets/profile.png">
                  </div>
                  <div class="profile-name">
                    <span class="sign-in" v-b-modal.login>{{ $t("header.userOptions.signIn") }}</span>
                    <span> {{ $t("header.userOptions.disjunction") }} </span>
                    <router-link :to="{name: 'UserRegistration'}" tag="span" class="sign-in">
                      {{ $t("header.userOptions.registering") }}
                    </router-link>
                  </div>
                </div>
                <div class="notification" v-if="isLogged">
                  <router-link :to="{name: 'Notification'}">
                    <img src="../../assets/notification.png">
                    <div
                      class="chip"
                      v-if="isLogged"
                      v-bind:class="{ 'chip-alert': notificationsCount > 0 }"
                    >
                      <div class="text">{{notificationsCount}}</div>
                    </div>
                  </router-link>
                </div>
              </div>
              <div class="mayor-logo">
                <div v-if="header!=null">
                  <router-link to="/" v-if="header.logos.mayor == null ">
                    <img src="../../assets/logo_bogota2.png">
                  </router-link>
                  <a :href="header.logos.mayor.clickUrl" target="_blank"  v-else>
                    <img v-if="header.logos.mayor.logoUrl !== null" :src="getImgURL(header.logos.mayor.logoUrl)"  @error="getPlaceHolderMayor">
                    <img v-else src="../../assets/logo_bogota2.png">
                  </a>
                </div>
                <router-link to="/" v-else>
                  <img src="../../assets/logo_bogota2.png">
                </router-link>
              </div>
            </div>
          </div>
        </div>
        <el-breadcrumb class="app-breadcrumb" separator="/">
          <el-breadcrumb-item key="1" to="/">   
            <i styles="color:fff" class="fa fa-home" aria-hidden="true"></i>
          </el-breadcrumb-item>
          <el-breadcrumb-item v-for="item in levelList" :key="item.name" :to="item.path">
            {{ item.title }}
          </el-breadcrumb-item>
        </el-breadcrumb>
  
      </div>
      <b-modal ref="sessionTimeoutModal" :title="$t('session.idle.modalTitle')" :hide-footer="true">
        {{$t('session.idle.modalMessage')}}
        <br>
        <sipsder-btn :text="$t('button.accept')" btnType="accept" @onClick="hideSessionTimeoutModal"></sipsder-btn>
      </b-modal>
      <app-login></app-login>
      <s-change-password> </s-change-password>
    </div>
  
    <!-- MOBILE -->
    <div v-else class="header-mobile" :style="fixedMenuMobile ? 'top: 0' : ''"
    >
      <div class="super-header">
        <div class="options-menu" :class="{'is-open': isOpenMenuMobile}" v-if="toggleMenu">
          <div class="grid-op">
            <div class="title">
              <div v-if="header!=null">
                <router-link to="/" v-if="header.logos.sipsder == null ">
                  <img src="../../assets/sipsder_logo_ancho.png" class="smaller">
                </router-link>
                <router-link to="/" v-else>
                  <img v-if="header.logos.sipsder.logoUrl !== null" :src="getImgURL(header.logos.sipsder.logoUrl)" class="smaller"  @error="getPlaceHolderSipsder">
                  <img v-else src="../../assets/sipsder_logo_ancho.png">
                </router-link>
              </div>
               <router-link to="/" v-else>
                 <img src="../../assets/sipsder_logo_ancho.png" class="smaller">
              </router-link>
            </div>
            <div class="mayor-logo">
              <div v-if="header!=null">
                <router-link to="/" v-if="header.logos.mayor == null ">
                  <img src="../../assets/logo_bogota2.png">
                </router-link>
                <a :href="header.logos.mayor.clickUrl" target="_blank"  v-else>
                  <img v-if="header.logos.mayor.logoUrl !== null" :src="getImgURL(header.logos.mayor.logoUrl)"  @error="getPlaceHolderMayor">
                  <img v-else src="../../assets/logo_bogota2.png">
                </a>
              </div>
              <router-link to="/" v-else>
                <img src="../../assets/logo_bogota2.png">
              </router-link>
            </div>
          </div>
          <div class="grid-op">
              <div class="row log" v-if="isLogged">
                <b-dropdown no-caret class="option-dropdown profile-options" variant="link">
                  <template slot="button-content">
                    <div class="profile-image">
                      <img :src="getProfileImage()"/>
                    </div>
                    <span class="profile-name">{{getUserName()}}</span>
                  </template>
                  <b-dropdown-item :to="{name: 'UserProfile'}">
                    <i class="fas fa-user-circle"></i>
                    {{$t("header.userOptions.profile")}}
                  </b-dropdown-item>
                  <b-dropdown-item >
                    <i class="fas fa-key"></i>
                    <span v-b-modal.password-modal>
                      {{$t("header.userOptions.changePassword")}}
                    </span>
                  </b-dropdown-item>
                  <b-dropdown-item :to="{name: 'AudioVisualAdmin'}">
                    <i class="fas fa-images"></i>
                    {{$t("header.userOptions.audiovisual")}}
                  </b-dropdown-item>
                  <b-dropdown-item v-on:click="signOut()">
                    <i class="fas fa-sign-out-alt"></i>
                    {{$t("header.userOptions.logout")}}
                  </b-dropdown-item>
                </b-dropdown>
                <div class="notification" v-if="isLogged">
                <router-link :to="{name: 'Notification'}">
                  <img src="../../assets/notification.png">
                  <div
                    class="chip"
                    v-if="isLogged"
                    v-bind:class="{ 'chip-alert': notificationsCount > 0 }"
                  >
                    <div class="text">{{notificationsCount}}</div>
                  </div>
                </router-link>
                </div>
              </div>
              <div class="row log" v-else>
                <img src="../../assets/profile.png"/>
                <div class="text-login" v-b-modal.login @click="toggleMenu">
                  {{ $t("header.userOptions.signIn") }}
                </div>
                <div class="text">o</div>
                <div class="text-login" @click="toggleMenu">
                  <router-link :to="{name: 'UserRegistration'}">
                    {{ $t("header.userOptions.registering") }}
                  </router-link>
                </div>
              </div>
              <div class="language-t row">
                <img class="language" src="../../assets/idioma.png">
                <select v-model="$i18n.locale">
                  <option v-for="(lang, i) in langs" :key="`Lang${i}`" :value="lang">{{ lang }}</option>
                </select>
              </div>
          </div>
          <template v-for="link of getMainMenu()">
            <div class="option" v-bind:key="link.id" 
              v-if="link.children.length === 0" v-bind:class="{'middle-menu': !link.last}"  @click="toggleMenu">
              <router-link :to="{name: getPage(link)}" tag="div" class="link">
                {{link.name}}
              </router-link>
            </div>
            <div class="option" v-b-toggle="'accordion' + link.id" v-bind:key="link.id" 
              v-if="link.children.length !== 0" v-bind:class="{'middle-menu': !link.last}">
              <router-link :to="{name: getPage(link)}" tag="div" class="link">
                {{link.name}}
              </router-link>
            </div>
            <b-collapse
              :id="'accordion' + link.id"
              accordion="submenu-accordion"
              v-bind:key="'accordion' + link.id"
              class="submenu"
              v-if="link.children.length !== 0 && link.hasPermission"
            >
              <template slot="button-content">
                <div class="option-dropdown">{{link.name}}</div>
              </template>
              <template v-for="link2 of link.children">
                <div
                  v-bind:key="link2.id"
                  @click="toggleMenu"
                  v-if="link2.hasPermission"
                >
                  <router-link :to="{name: getPage(link2)}" tag="div" v-if="getPage(link2) !== 'CommunityLibrary'" class="option" @click="toggleMenu">{{link2.name}}</router-link>
                  <router-link :to="{name: getPage(link2),params:{community : 'community'}}" tag="div" v-else class="option" @click="toggleMenu">{{link2.name}}</router-link>
                </div>
              </template>
            </b-collapse>
          </template>
        </div>
  
        <div class="image-container">
         <div v-if="header!=null">
            <router-link to="/" v-if="header.logos.sipsder == null ">
              <img src="../../assets/sipsder_logo.png" class="smaller">
            </router-link>
            <router-link to="/" v-else>
              <img v-if="header.logos.sipsder.logoUrl !== null" :src="getImgURL(header.logos.sipsder.logoUrl)" class="smaller"  @error="getPlaceHolderSipsder">
              <img v-else src="../../assets/sipsder_logo.png">
            </router-link>
          </div>
            <router-link to="/" v-else>
              <img src="../../assets/sipsder_logo.png" class="smaller">
          </router-link>
          <div class="title-mobile" @click="$router.push({name:'Home'})">Bogotá Rural</div>
        </div>
        <!--<div class="search-container">
          <input :placeholder="placeholder">
        </div>-->
        <div class="menu-container" @click="toggleMenu" :class="{'is-open': isOpenMenuMobile}">
          <div class="line-1"></div>
          <div class="line-2"></div>
          <div class="line-3"></div>
        </div>
      </div>
      <el-breadcrumb class="app-breadcrumb" separator="/">
        <el-breadcrumb-item key=1 to="/">   
          <i styles="color:fff" class="fa fa-home" aria-hidden="true"></i>
        </el-breadcrumb-item>
        <el-breadcrumb-item v-for="item in levelList" :key="item.index" :to="item.path">
          {{ item.title }}
        </el-breadcrumb-item>
      </el-breadcrumb>
      <b-modal ref="sessionTimeoutModal" :title="$t('session.idle.modalTitle')" :hide-footer="true">
        {{$t('session.idle.modalMessage')}}
        <br>
        <sipsder-btn :text="$t('button.accept')" btnType="accept" @onClick="hideSessionTimeoutModal"></sipsder-btn>
      </b-modal>
      <app-login></app-login>
      <s-change-password> </s-change-password>
    </div>
  </div>
</template>
  
<script>
  import VueBootstrapTypehead from "vue-bootstrap-typeahead";
  import Login from "../views/user/Login.vue";
  import ChangePassword from "../views/user/ChangePassword.vue";
  import VAPI from "../../http_common";
  import { SERVICE_NAMES, METASEARCH } from "@/sipsder_constants";
  import { PERMISSIONS_TYPES } from "../../domain_constants";
  import _ from "lodash"; 
  import S_UTIL from "../../util/sipsder_util";
  
  export default {
    components: { 
      VueBootstrapTypehead
    },
    data() {
      return {
        fixedMenu: false,
        fixedMenuMobile: false,
        date: "",
        placeholder: "",
        isOpenMenuMobile: false,
        langs: ["es", "en"],
        mainMenuLinks: [],
        notificationsCount: 0,
        levelList: [],
        query: "",
        options: {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric"
        }
      };
    },
    computed: {
      today(){
        this.getBreadcrumb();
        return new Date().toLocaleDateString(this.$i18n.locale, this.options);
      },
      header(){
        return this.$store.getters.getLogosColors;
      },
      isResponsive() {
        return this.$store.getters.isResponsive;
      },
      getActiveSocialNetworks() {
        return this.$store.getters.getActiveSocialNetworks;
      },
      isLogged() {
        return this.$store.getters.isAuthenticated;
      },
      isNotificationEvent() {
        return this.$store.getters.isNotificationEvent;
      },
      isIdle() {
        return this.$store.getters.Idle;
      },
      searchQuery(){
        return this.$store.getters.getSearchQuery;
      }
    },
    watch: {
      header(newCount, oldCount){
        //console.log(`We have ${newCount} Logos`)
      },
      isNotificationEvent: function(notificationEvent) {
        if (notificationEvent) {
          this.$store.dispatch("clearNotificationEvent");
          if (this.isLogged) {
            this.getNotificationsCount();
          }
        }
      },
      $route() {
        this.getBreadcrumb();
        if (this.isLogged) {
          this.getNotificationsCount();
        }
      },
      isIdle: function(idle) {
        if (idle) {
          this.$refs.sessionTimeoutModal.show();
          this.$store.dispatch("clearIdle");
          this.$store.dispatch("signOut");
        }
      },
      searchQuery: function(){
        this.query = this.searchQuery
      },
      isLogged: function(newVal, OldVal) {
        if (newVal) {
          this.getNotificationsCount();
        }
      }
    },
    methods: {
      goMetasearchPage(){
        if(this.query && this.query.length >= METASEARCH.MIN_LENGTH){
          this.$store.dispatch("setSearchQuery", this.query);
          this.$router.push({ 
            path: '/' + SERVICE_NAMES.METASEARCH_PATH,
            query: { q: this.searchQuery }
          })
        }
      },
      getPlaceHolderMayor(e){
        e.target.src =  require('../../assets/logo_bogota2.png')
      },
      getPlaceHolderSipsder(e){
        e.target.src =  require('../../assets/sipsder_logo_ancho.png')
      },
      getTitle(route) {
        if (route.meta && route.meta.name) {
          return this.$t(`route.${route.meta.name}`)
        }
        return this.$t('route.Undefined')
      },
      getBreadcrumb() {
        var matched = this.$route.matched;
        var lastMatchedIndex = matched.length - 1;
        this.levelList = []
        var level = {};
        for (var i = 2; i < lastMatchedIndex; i++) {
          level = {index:i, path:matched[i].path, title:this.getTitle(matched[i])};
          this.levelList.push(level);
        }
        switch (this.$route.name) {
          case "SurveyForm":
          case "SurveyResult":
            var name = this.parseNews(this.$route.path, this.$route.path);
            level = {name:name, title:name};
            this.levelList.push(level);
            break;
          default:
            var title = this.$t(`route.${matched[i].name}`);
            if (this.isNotEmpty(title)) {
              level = {name:matched[lastMatchedIndex].name, title:title}
              this.levelList.push(level);
            }
            break;
        }
      },
      parseNews(str) {
        var hashSize = 13;
        var str2 = str.substring(str.lastIndexOf('/') + 1 , str.length - hashSize).replace(/-/g ,' ');
        return str2.charAt(0).toUpperCase() + str2.slice(1);
      },
      isNotEmpty(str) {
        return (str && 0 != str.length);
      },
      async getNotificationsCount() {
        try {
          let result = await VAPI.get(`${SERVICE_NAMES.NOTIFICATION}/count`);
          this.notificationsCount = result.data;
        } catch (error) {
          console.log(error);
          this.notificationsCount = 0;
        }
      },
      hideSessionTimeoutModal() {
        this.$refs.sessionTimeoutModal.hide();
      },
      signOut() {
        this.$store.dispatch("signOut");
        this.notificationsCount = 0;
      },
      getUserName() {
        let user = this.$store.getters.getCurrentUser;
        if (user) {
          return user.firstName;
        }
        return "...";
      },
      getImgURL (url) {
        return S_UTIL.getImgURL(url);
      },
      getProfileImage() {
        let user = this.$store.getters.getCurrentUser;
        if (user && user.image) {
          return S_UTIL.getImgURL(user.image.url);
        }
        return require("../../assets/profile.png");
      },
      getPage(link) {
        if (link.page) {
          return link.page.alias;
        }
        return "";
      },
      getValidUrl(url) {
        if (!url.includes("http")) {
          return "https://" + url;
        }
        return url;
      },
      getSocialNetwork(name) {
        let v = name.toLowerCase();
        let classObject = {
          "fa-facebook-f": v === "facebook",
          "fa-twitter": v === "twitter",
          "fa-youtube": v === "youtube",
          "fa-broadcast-tower": v === "radio",
          "fa-flickr": v === "flickr",
          "fa-instagram": v === "instagram",
          "fa-google": v === "google plus",
          "fa-pinterest": v === "pinterest",
          "fa-vimeo ": v === "vimeo"
        };
        return classObject;
      },
      toggleMenu() {
        this.isOpenMenuMobile = !this.isOpenMenuMobile;
      },
      handleScroll() {
        // desktop
        if (window.scrollY > 54) {
          this.fixedMenu = true;
          this.$store.dispatch("setMenuFixed", {
            fixed: true
          });
        } else {
          this.fixedMenu = false;
          this.$store.dispatch("setMenuFixed", {
            fixed: false
          });
        }
        // mobile
        if (window.scrollY > 36) {
          this.fixedMenuMobile = true;
        } else {
          this.fixedMenuMobile = false;
        }
      },
      getMainMenu() {
        var mainMenu = this.$store.getters.getMain.children;
        if (mainMenu && mainMenu.length > 0) {
          mainMenu[mainMenu.length - 1].last = true;
        }
        return mainMenu;
      }
    },
    components: {
      "app-login": Login,
      "s-change-password" : ChangePassword
    },
    onIdle() {
      if (this.isLogged) {
        this.$store.dispatch("signOut");
        this.$refs.sessionTimeoutModal.show();
      }
    },
    onActive() {
    },
    mounted() {
      this.placeholder = this.$t("message.searchPlaceholder");
      this.date = new Date().toLocaleDateString(this.$i18n.locale, this.options);
      this.$store.dispatch("setSearchQuery", null);
    },
    async created() {
      if (this.isLogged) {
        this.getNotificationsCount();
      }
      window.addEventListener("scroll", this.handleScroll);
      this.getBreadcrumb();
      this.$store.dispatch("setSearchQuery", null);
    },
    destroyed() {
      window.removeEventListener("scroll", this.handleScroll);
    }
  };
</script>
  
<style lang="sass" scoped>
  @import '../../stylesheets/style.sass'
  .header-container
    width: 100%
    position: relative
    background: $colorMenuBg
    max-width: 100%
    margin: 0
    padding: 0
  .header-gov
    background-color: #36c
    padding: 5px 0.7rem
    img
      height: 25px
  .fade-enter-active, .fade-leave-active
    transition: opacity .3s
  .fade-enter, .fade-leave-to 
    opacity: 0
  .fixed
    position: fixed
    top: 0
  .super-header
    z-index: 102
    width: 100%
  .header
    box-shadow: 0 0 5px #333
    z-index: 102
    width: 100%
    .app-breadcrumb
      background: #02747c;
      color: fff
      padding: 3px 0px 3px 2.5%
      font-size: 12px
    .menu
      width: 100%
      padding: 0.2% 1%
      +flexbox  
      +justify-content(space-between)
      +align-items(center)
      background: $colorMenuBg
      .image-container
        +flexbox
        +justify-content(flex-start)
        +align-items(flex-start)
        flex-direction: column
        width: 20%
        &.smaller
          width: 10%
        .greeting
          width: 100%
          font-size: 1rem
          font-family: $fontBody
          color: white
          &.smaller
            display: none
        .stick
          width: 60px !important
          min-height: 60px !important
          max-height: 70px !important
        .image
          margin-top: 0.5rem
          width: auto
          +flexbox
          +justify-content(flex-start)
          +align-items(center)
          transition: width .5s
          img
            height: 70px
            width: auto
            transition: width .5s
            &.smaller
              height: 50px !important
              width: auto !important
          .text-container
            +flexbox
            +justify-content(flex-start)
            +align-items(flex-start)
            +flex-wrap(wrap)
            position: relative
            cursor: pointer
            .message
              visibility: hidden
              width: 120px
              background-color: black
              color: #fff
              text-align: center
              padding: 10px
              border-radius: 6px
              position: absolute
              font-size: 1rem
              font-family: $fontBody
              color: $colorBodyBg
              top: 100%
            &:hover
              .message
                visibility: visible
            .title
              width: 100%
              font-size: 2.5rem
              font-weight: 600
              font-family: $fontBody
              color: $colorBodyBg
              padding: 0 2%
              transition: all .5s
              &.smaller
                font-size: 2.5rem
      .content
        width: 85%
        +flexbox
        +flex-direction(column)
        +justify-content(flex-start)
        +align-items(flex-start)
        +flex-wrap(wrap)
        transition: width .5s
        &.bigger
          width: 87%
        .options-container
          width: 100%
          margin-top: 2px
          +flexbox
          +justify-content(space-between)
          .mayor-logo
            width: 12%
            +flexbox
            +justify-content(flex-end)
            +align-items(center)
            img
              max-height: 45px
              max-width: 100%
          .options-user
            width: 20%
            padding: 2px
            +flexbox
            +justify-content(center)
            +align-items(center)
            &.bigger
              width: 17%
            .notification
              width: 35px
              width: 35px
              position: relative
              cursor: pointer
              img
                width: 35px
                height: 35px
              .chip
                position: absolute
                right: 0
                top: 0
                width: 17px
                height: 17px
                z-index: 1
                +flexbox
                +justify-content(center)
                +align-items(center)
                border-radius: 50%
                background-color: lighten(#555, 15%)
                .text
                  font-size: 0.8rem
                  color: white
                  font-weight: 600
              .chip-alert
                background-color: lighten(red, 15%)
                .text
                  font-size: 0.8rem
                  color: white
                  font-weight: 600
            .profile
              display: inline-flex
            .profile-options
              width: 150px
            .profile-image
              display: inline-block
              width: 50px
              height: 50px
              border-radius: 50%
              background-color: #666
              border: 2px solid #555;
              position: relative
              img
                width: 100%
                height: 100%
                border-radius: 50%
            .profile-name
              padding-left: 5px
              padding-top: 5px
              width: 95px
              font-size: 1rem
              font-weight: 600
              color: $colorBodyBg
              font-family: $fontBody
            .sign-in
              font-size: 1rem
              font-weight: 600
              color: $colorBodyBg
              font-family: $fontBody
              cursor: pointer
              &:hover
                text-decoration: underline
          .options-menu
            border-radius: 5px
            width: 70%
            margin: 2px 2px
            background: #000
            font-size: 1.1rem
            font-weight: 600
            +flexbox
            +justify-content(space-evenly)
            &.bigger
              width: 80%
            .middle-menu
              background-color: #000
              padding: 0 7px
            .btn 
              font-size: 1.1rem !important
              font-weight: 600 !important
            .btn-link
              font-size: 1.1rem !important
              font-weight: 600 !important
              &:hover
                text-decoration: none !important
            .option
              border-radius: 5px
              +flexbox
              +justify-content(center)
              +align-items(center)
              text-align: center
              padding: 1px 7px
              font-size: 1.1rem
              font-weight: 600
              font-family: $fontBody
              color: $colorBodyBg
              cursor: pointer
              background-color: #000
              &:last-child
                border-right: unset
              .link
                &:hover
                  opacity: 0.7
                  text-decoration: none
              .show
                  background-color: #6c757d
            .option-dropdown
              text-decoration: none
              color: $colorBodyBg
              font-size: 1.1rem !important
              font-weight: 600 !important
              &:hover
                text-decoration: none
                opacity: 0.7
              .dropdown-menu
                &:hover
                  text-decoration: none
                  opacity: 0.7
                .title
                  color: $colorBodyBg
                  font-size: 0.9rem
                  font-weight: 600
                  font-family: $fontBody
                  &:hover
                    text-decoration: none
                    opacity: 0.7
        .search-container
          height: 54px
          width: 100%
          padding: 5px 0
          +justify-content(space-between)
          +align-items(center)
          +flexbox
          .language
            height: 100%
            width: 15%
            +justify-content(flex-start)
            +align-items(center)
            +flexbox
            select
              height: 35px
              width: calc(100% - 70px)
              font-size: 1.5rem
              padding: 0.5% 5%
              border-radius: 25px
            img
              margin: 0 10px
              height: 40px
              width: 40px
          .social-network
            height: 100%
            width: 30%
            +flexbox
            +justify-content(space-evenly)
            +align-items(center)
            .circle
              height: 35px
              width: 35px
              +flexbox
              +justify-content(center)
              +align-items(center)
              border-radius: 50%
              cursor: pointer
              img
                height: 35px
                width: 35px
                border-radius: 50%
              &:hover
                opacity: 0.7
              &.fa-facebook-f
                font-size: 1.5rem
                color: white
                background: #3b5998
              &.fa-twitter
                font-size: 1.5rem
                color: white
                background: #1da1f2
              &.fa-youtube
                font-size: 1.5rem
                background: #ff0000
                color: white
              &.fa-broadcast-tower
                font-size: 1.5rem
                color: white
                background: #99cc33
              &.fa-flickr
                font-size: 1.5rem
                background: #f40083
                color: white
              &.fa-instagram
                font-size: 1.5rem
                color: white
                background: #f09433 !important
                background: -moz-linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%) !important 
                background: -webkit-linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%) !important
                background: linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%) !important
                filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#f09433', endColorstr='#bc1888',GradientType=1 ) !important
              &.fa-google 
                font-size: 1.5rem
                background: #dd4b39
                color: white
              &.fa-pinterest 
                font-size: 1.5rem
                background: #cb2027
                color: white
              &.fa-vimeo 
                font-size: 1.5rem
                background: #45bbff
                color: white      
          .search
            width: 55%
            +flexbox
            +align-items(center)
            +justify-content(center)
            position: relative
            padding-right: 20px
            input
              height: 38px
              width: 100%
              font-size: 1.5rem
              padding: 0.5% 5%
              border-radius: 25px
            i
              position: absolute
              color: $colorDefault
              font-size: 1.5rem
              right: 5%
  @media screen and (max-width: 1440px)
    .image-container
      width: 20% !important
      transition: width .5s
    .content
      width: 80% !important
  @media screen and (max-width: 800px)
    .header-container
      padding-bottom: 40px
    .header-mobile
      box-shadow: 0 0 5px #333
      position: fixed
      top: 34px
      width: 100%
      background: $colorMenuBg
      padding: 1% 85px
      z-index: 100
      &.relative
        position: relative
      .super-header
        display: grid
        grid-template-columns: 2fr 1fr
        grid-gap: 10px
      .options-menu
        font-size: 1.2rem
        position: absolute
        width: 100%
        height: 0
        top: 100%
        background-color: $colorMenuBg2
        color: #fff
        opacity: 0
        transition: 0.4s
        z-index: 10
        left: 0
        padding: 0 85px
        overflow: hidden
        +flexbox
        +justify-content(flex-start)
        +align-items(flex-start)
        +flex-direction(column)
        .option
          cursor: pointer
          font-size: 1.3rem
          font-weight: 600
          width: 100%
          text-align: center
          padding: 8px
          border-top: 1px solid #dddddd
          border-bottom: 1px solid #dddddd
          &:hover
            background-color: rgba(255,255,255,0.9)
            color: #333333
        .btn
          font-size: 1.2rem
        .submenu
          width: 100%
          border-top: 2px solid #dddddd
          border-bottom: 2px solid #dddddd
        .title
          padding: 7.5px 0
          font-size: 2rem
          font-weight: 600
          font-family: $fontBody
          text-align: center
          color: #fff
          text-transform: uppercase
          img
            height: 60px
        .log
          color: #fff
          padding: 10px 0 !important
          .notification
            width: 35px
            width: 35px
            position: relative
            cursor: pointer
            img
              width: 35px
              height: 35px
            .chip
              position: absolute
              right: 0
              top: 0
              width: 17px
              height: 17px
              z-index: 1
              +flexbox
              +justify-content(center)
              +align-items(center)
              border-radius: 50%
              background-color: lighten(#555, 15%)
              .text
                font-size: 0.8rem
                color: white
                font-weight: 600
            .chip-alert
              background-color: lighten(red, 15%)
              .text
                font-size: 0.8rem
                color: white
                font-weight: 600
          .profile
            display: inline-flex
          .profile-options
            width: 150px
          .profile-image
            display: inline-block
            width: 50px
            height: 50px
            border-radius: 50%
            background-color: #666
            border: 2px solid #555;
            position: relative
            img
              width: 100%
              height: 100%
              border-radius: 50%
          .profile-name
            padding-left: 5px
            padding-top: 5px
            width: 95px
            font-size: 1rem
            font-weight: 600
            color: $colorBodyBg
            font-family: $fontBody
        .language-t
          padding: 10px 0 !important
          select
            font-size: 1rem
            border-radius: 25px
        .mayor-logo
          padding: 10px
          img
            max-height: 45px
            max-width: 100%
        .grid-op
          display: grid
          grid-template-columns: 49% 49%
          grid-gap: 2%
          width: 100%
          &:last-child
            border-bottom: 2px solid #dddddd
        .row
          width: 100%
          padding: 2.5px
          +flexbox
          +justify-content(center)
          +align-items(center)
          select
            background: white
            width: 15vw
            height: 30px
            margin: 5px 0
          img
            width: 30px
            margin-right: 10px
          .text, .text-login
            font-size: 1.5rem
            font-family: $fontBody
            font-weight: 600
            color: #fff
            text-align: center
            cursor: pointer
            margin: 0 1.5px
          .text-login
            text-transform: uppercase
        &.is-open
          width: 100%
          height: auto
          max-height: 94vh
          overflow: auto
          opacity: .9
      .image-container
        cursor: pointer
        width: auto !important
        display: grid !important
        grid-template-columns: 1fr 1fr
        align-items: center
        justify-items: center
        +flexbox
        +justify-content(center)
        +align-items(center)
        +flex-direction(column)
        .title-mobile
          padding: 5px 0
          font-size: 1.4rem
          font-weight: 600
          font-family: $fontBody
          text-align: center
          color: white
          text-transform: uppercase
        img
          height: 42px
      .search-container
        +flexbox
        +justify-content(center)
        +align-items(center)
        input
          width: 100%
          font-size: 1.5rem
          padding: 2.5% 10%
          border-radius: 25px
      .menu-container
        cursor: pointer
        +flexbox
        +justify-content(flex-end)
        +align-items(center)
        +flex-direction(column)
        .line-1, .line-2, .line-3
          width: 30px
          height: 3px
          background-color: white
          margin: 3px 0
          transition: 0.4s
        &.is-open
          .line-1
            -webkit-transform: rotate(-45deg) translate(0px, 12px)
            transform: rotate(-45deg) translate(0px, 12px)
          .line-2
            opacity: 0
          .line-3
            -webkit-transform: rotate(45deg) translate(0px, -12px)
            transform: rotate(45deg) translate(0px, -12px)
      
  @media screen and (max-width: $widthMobile)
    .header-container
      padding-bottom: 40px
    .header-mobile
      padding: 1% 45px !important

  @media screen and (min-width: 780px) and (max-width: 799px)
    .header-container
      padding-bottom: 40px
    .header-mobile
      position: fixed
      top: 34px
      width: 100%
      background: $colorMenuBg
      padding: 1% 85px
      z-index: 100
      &.relative
        position: relative
      .super-header
        display: grid
        grid-template-columns: 1fr 2fr 1fr
        grid-gap: 10px
      .options-menu
        font-size: 1.2rem
        position: absolute
        width: 100%
        height: 0
        top: 100%
        background-color: $colorMenuBg2
        color: #fff
        opacity: 0
        transition: 0.4s
        z-index: 10
        left: 0
        padding: 0 85px
        overflow: hidden
        +flexbox
        +justify-content(flex-start)
        +align-items(flex-start)
        +flex-direction(column)
        .option
          cursor: pointer
          font-size: 1.3rem
          font-weight: 600
          width: 100%
          text-align: center
          padding: 8px
          border-top: 1px solid #dddddd
          border-bottom: 1px solid #dddddd
          &:hover
            background-color: rgba(255,255,255,0.9)
            color: #333333
        .btn
          font-size: 1.2rem
        .submenu
          width: 100%
          border-top: 2px solid #dddddd
          border-bottom: 2px solid #dddddd
        .title
          padding: 7.5px 0
          font-size: 2rem
          font-weight: 600
          font-family: $fontBody
          text-align: center
          color: #fff
          text-transform: uppercase
          img
            height: 60px
        .log
          color: #fff
          padding: 10px 0 !important
          .notification
            width: 35px
            width: 35px
            position: relative
            cursor: pointer
            img
              width: 35px
              height: 35px
            .chip
              position: absolute
              right: 0
              top: 0
              width: 17px
              height: 17px
              z-index: 1
              +flexbox
              +justify-content(center)
              +align-items(center)
              border-radius: 50%
              background-color: lighten(#555, 15%)
              .text
                font-size: 0.8rem
                color: white
                font-weight: 600
            .chip-alert
              background-color: lighten(red, 15%)
              .text
                font-size: 0.8rem
                color: white
                font-weight: 600
          .profile
            display: inline-flex
          .profile-options
            width: 150px
          .profile-image
            display: inline-block
            width: 50px
            height: 50px
            border-radius: 50%
            background-color: #666
            border: 2px solid #555;
            position: relative
            img
              width: 100%
              height: 100%
              border-radius: 50%
          .profile-name
            padding-left: 5px
            padding-top: 5px
            width: 95px
            font-size: 1rem
            font-weight: 600
            color: $colorBodyBg
            font-family: $fontBody
        .language-t
          padding: 10px 0 !important
          select
            font-size: 1rem
            border-radius: 25px
        .mayor-logo
          padding: 10px
          img
            max-height: 45px
            max-width: 100%
        .grid-op
          display: grid
          grid-template-columns: 49% 49%
          grid-gap: 2%
          width: 100%
          &:last-child
            border-bottom: 2px solid #dddddd
        .row
          width: 100%
          padding: 2.5px
          +flexbox
          +justify-content(center)
          +align-items(center)
          select
            background: white
            width: 15vw
            height: 30px
            margin: 5px 0
          img
            width: 30px
            margin-right: 10px
          .text, .text-login
            font-size: 1.5rem
            font-family: $fontBody
            font-weight: 600
            color: #fff
            text-align: center
            cursor: pointer
            margin: 0 1.5px
          .text-login
            text-transform: uppercase
        &.is-open
          width: 100%
          height: auto
          max-height: 94vh
          overflow: auto
          opacity: .9
      .image-container
        cursor: pointer
        width: auto !important
        +flexbox
        +justify-content(center)
        +align-items(center)
        +flex-direction(column)
        .title-mobile
          padding: 5px 0
          font-size: 1.4rem
          font-weight: 600
          font-family: $fontBody
          text-align: center
          color: white
          text-transform: uppercase
        img
          height: 65px
      .search-container
        +flexbox
        +justify-content(center)
        +align-items(center)
        input
          width: 100%
          font-size: 1.5rem
          padding: 2.5% 10%
          border-radius: 25px
      .menu-container
        cursor: pointer
        +flexbox
        +justify-content(flex-end)
        +align-items(center)
        +flex-direction(column)
        .line-1, .line-2, .line-3
          width: 50px
          height: 5px
          background-color: white
          margin: 6px 0
          transition: 0.4s
        &.is-open
          .line-1
            -webkit-transform: rotate(-45deg) translate(-15px, 6px)
            transform: rotate(-45deg) translate(-15px, 6px)
          .line-2
            opacity: 0
          .line-3
            -webkit-transform: rotate(45deg) translate(-18px, -8px)
            transform: rotate(45deg) translate(-18px, -8px)

</style>
