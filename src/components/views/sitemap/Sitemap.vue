<template>
  <div id="app">
    <b-container class='container-form col-90'>
      <b-form>
        <b-row>
          <b-col>
            <sipsder-title 
              :title="$t('sitemap.tittle').toUpperCase()"
              :text="$t('sitemap.initialText')"
              type="user"
              section="sitemap">
            </sipsder-title>  
          </b-col>
        </b-row>
        <b-row align-h="center">
          <b-col cols="12" md="10">
            <router-link :to="{name: 'Home'}" tag="div" class="tittle-link"> 
              <i class="fa fa-home" aria-hidden="true"></i> 
              {{$t('sitemap.linkTitles.home')}}
            </router-link>  
            <b-row>
              <b-col cols="12" md="6">
                <ul class="tree">
                  <li>
                    <div class="main-link">
                      <i class="fas fa-hands-helping"></i>
                      {{$t('sitemap.linkTitles.mainServices')}}
                    </div>
                    <ul>
                      <template v-for="link of getMainMenu()"> 
                        <li v-bind:key="link.id" 
                          v-if="link.hasPermission && link.status"
                          v-bind:class="{'last': link.last}">
                          <router-link :to="{name: getPage(link)}" tag="div" class="link"> 
                            <i class="fas fa-link"></i> {{link.name}}
                          </router-link> 
                          <ul v-if="link.children.length !== 0">
                            <template v-for="link2 of link.children">                    
                              <li v-bind:key="link2.id"
                                v-if="link2.hasPermission && link2.status"
                                v-bind:class="{'last': link2.last}">
                                <router-link :to="{name: getPage(link2)}" tag="div" class="sub-link"> 
                                  <i class="fas fa-link"></i> {{link2.name}}
                                </router-link> 
                              </li>
                            </template>
                          </ul>
                        </li>
                      </template>
                    </ul> 
                  </li>
                  <li class="last"  v-if="!isLogged()"> 
                    <div class="main-link">
                      <i class="fas fa-sign-in-alt"></i>
                      {{$t('sitemap.linkTitles.userTools')}}
                    </div>
                    <ul>
                      <li>                          
                        <div v-b-modal.login class="link">
                          <i class="fas fa-sign-in-alt"></i>
                          {{ $t("header.userOptions.signIn") }}
                        </div> 
                      </li>
                      <li class="last">                          
                        <router-link :to="{name: 'UserRegistration'}" tag="div" class="link">
                          <i class="fas fa-user-plus"></i>
                          {{ $t("header.userOptions.registering") }}
                        </router-link> 
                      </li>
                    </ul> 
                  </li>
                  <li class="last" v-if="isLogged()"> 
                    <div class="main-link">
                      <i class="fas fa-user-circle"></i>
                      {{$t('sitemap.linkTitles.authenticatedUser')}}
                    </div>
                    <ul>
                      <li>                          
                        <router-link :to="{name: 'UserProfile'}" tag="div" class="link">
                          <i class="fas fa-user-circle"></i>
                          {{$t("header.userOptions.profile")}}
                        </router-link> 
                      </li>
                      <li>                          
                        <router-link :to="{name: 'change-password'}" tag="div" class="link">
                          <i class="fas fa-key"></i>
                          {{$t("header.userOptions.changePassword")}}
                        </router-link> 
                      </li>
                      <li>                          
                        <router-link :to="{name: 'AudioVisualAdmin'}" tag="div" class="link">
                          <i class="fas fa-images"></i>
                          {{$t("header.userOptions.audiovisual")}}
                        </router-link> 
                      </li>
                      <li class="last">                          
                        <div v-on:click="signOut()" class="link">
                          <i class="fas fa-sign-out-alt"></i>
                          {{$t("header.userOptions.logout")}}
                        </div> 
                      </li>
                    </ul> 
                  </li>
                </ul>
              </b-col>
              <b-col cols="12" md="6">
                <template v-if="isResponsive()">
                  <br/>
                  <router-link :to="{name: 'Layout'}" tag="div" class="tittle-link"> 
                    <i class="fa fa-home" aria-hidden="true"></i> 
                    {{$t('sitemap.linkTitles.home')}}
                  </router-link>  
                </template>
                <ul class="tree">
                                    <li> 
                    <div class="main-link">
                      <i class="fas fa-users-cog"></i>
                      {{$t('sitemap.linkTitles.otherServices')}}
                    </div>
                    <ul>
                      <template v-for="link of getSidebarMenu()">
                        <li v-bind:key="link.id"
                          v-if="link.hasPermission && link.status"
                          v-bind:class="{'last': link.last}" >                          
                          <router-link :to="{name: getPage(link)}" tag="div" class="link"> 
                            <i class="fas fa-link"></i> {{link.name}}
                          </router-link> 
                          <ul v-if="link.children.length !== 0">
                            <template v-for="link2 of link.children">
                              <li v-bind:key="link2.id"
                                v-if="link2.hasPermission && link2.status"
                                v-bind:class="{'last': link2.last}">
                                <router-link :to="{name: getPage(link2)}" tag="div" class="sub-link"> 
                                  <i class="fas fa-link"></i> {{link2.name}}
                                </router-link> 
                              </li>
                            </template>
                          </ul>
                        </li>
                      </template>
                    </ul> 
                  </li>
                  <li class="last">
                    <div class="main-link">
                      <i class="fas fa-bars"></i>
                      {{$t('sitemap.linkTitles.lateral')}}
                    </div>
                    <ul>
                      <template v-for="link of getLateralMenu()"> 
                        <li v-bind:key="link.menu.id"
                          v-if="link.menu.hasPermission"
                          v-bind:class="{'last': link.menu.last}">
                          <router-link :to="{name: getPage(link.menu)}" tag="div" class="link link-sidebar"
                            :style="[{'--optionBackground': link.color}]" > 
                            <i v-bind:class="link.icon"></i>
                            {{link.menu.name}}
                          </router-link> 
                          <ul v-if="link.menu.children.length !== 0">
                            <template v-for="link2 of link.menu.children">                    
                              <li v-bind:key="link2.id"
                                v-if="link2.hasPermission"
                                v-bind:class="{'last': link2.last}">
                                <router-link :to="{name: getPage(link2)}" tag="div" class="sub-link"> 
                                  <i v-if="link2.hasIcon" v-bind:class="link2.iconUrl"></i>
                                  <i v-else class="fas fa-link"></i>
                                  {{link2.name}}
                                </router-link> 
                              </li>
                            </template>
                          </ul>
                        </li>
                      </template>
                    </ul> 
                  </li>
                </ul>
              </b-col>
            </b-row>
          </b-col>
        </b-row>
      </b-form>
      <div style="text-align:center"><sipsder-btn btnType="back" @onClick="$router.go(-1)"></sipsder-btn></div>
    </b-container>
  </div>
</template>

<script>
import VAPI from '../../../http_common';
import { PERMISSIONS_TYPES } from '../../../domain_constants';

export default {
  data() {
    return {};
  },
  methods: {
    isResponsive() {
      return this.$store.getters.isResponsive;
    },
    isLogged() {
      return this.$store.getters.isAuthenticated;
    },
    signOut() {
      this.$store.dispatch("signOut");
    },
    getPage(link) { 
      if (link.page) {
        return link.page.alias;
      }
      return "";
    },
    getURL(link) {
      if (link.url) {
        return `${link.url}`;
      }
    },
    formatMenu(menu) {
      if (menu && menu.length > 0) {
        menu[menu.length - 1].last = true;
        for (var i = 0; i < menu.length; i++) {
          this.formatMenu(menu[i].children);
        }
      }
      return menu;
    },
    formatLateralMenu(menu) {
      if (menu && menu.length > 0) {
        menu[menu.length - 1].menu.last = true;
        for (var i = 0; i < menu.length; i++) {
          this.formatMenu(menu[i].menu.children);
        }
      }
      return menu;
    },
    getMainMenu() {
      return this.formatMenu(this.$store.getters.getMain.children);
    },
    getSidebarMenu() {
      return this.formatMenu(this.$store.getters.getSidebar.children);
    },
    getLateralMenu() {
      return this.formatLateralMenu(this.$store.getters.getLateral);
    }
  }
};
</script>

<style lang="sass" scoped>
@import '../../../stylesheets/style.sass'

ul.tree
  list-style-type: none
  background: url('../../../assets/sitemap/vline.png') repeat-y 
  margin: 0 
  padding: 0
ul.tree 
  ul
    list-style-type: none
    background: url('../../../assets/sitemap/vline.png') repeat-y 
    margin: 0 
    padding: 0
ul.tree 
  ul 
    margin-left: 14px
ul.tree 
  li 
    margin: 0
    padding-left: 14px
ul.tree 
  li
    margin: 0
    padding-left: 14px
    line-height: 20px
    background: url('../../../assets/sitemap/node.png') no-repeat
ul.tree 
  li.last
    background: #fff url('../../../assets/sitemap/lastnode.png') no-repeat
.link
    cursor: pointer
    background: $colorTitle
    margin-bottom: 8px
    padding: 10px  
    border-radius: 6px
    color: #fff
.main-link
    background: $colorTitleDark
    margin-bottom: 8px
    padding: 10px  
    border-radius: 6px
    color: #fff
.tittle-link
  cursor: pointer
  background: $colorSidebarDark
  margin-bottom: 8px
  padding: 10px  
  border-radius: 6px
  color: #fff
.sub-link
  cursor: pointer
  background: #fff
  margin-bottom: 8px
  padding: 10px  
  border: 2px solid $colorTitleDark;
  border-radius: 6px
  color: $colorTitleDark
.link-sidebar
  background-color: var(--optionBackground) !important

@media screen and (max-width: $widthTablet)
  .col-90
    width: 80% !important
    margin: 0 auto
</style>

