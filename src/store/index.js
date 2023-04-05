import Vue from 'vue'
import Vuex from 'vuex'

import about from './modules/about'
import terms from './modules/terms_and_conditions_admin'
import logos from './modules/logos/index'
import links from './modules/links/index'
import social_networks from './modules/social_networks'
import users from './modules/user_administration'
import help from './modules/help'
import emailAdministration from './modules/email_administration'
import institutionAdministration from './modules/institution_administration'
import emailDomain from './modules/email_domain'
import domain from './modules/domain'
import session from './modules/user_session'
import reports from './modules/reports'
import news from './modules/news'
import procedure from './modules/procedure'
import requests from './modules/contact_admin'
import notificationState from './modules/notification_state'
import faqsAdmin from './modules/faqs_admin'
import ruralModelAdmin from './modules/rural_model_admin'
import ruralHousing from './modules/rural-housing'
import userProperties from './modules/user_properties'
import normsAdmin from './modules/normogram_admin'
import story from './modules/story'
import metasearch from './modules/metasearch/index'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    screenWidth: 1440,
    isMenuFixed: false,
    isOpenMenuMobile: false,
    isOpenMenuDesktop: false,
    isOpenSearchDesktop: false,
    userTypes: [],
    pages: []
  },
  mutations: {
    setSidebarMobile: (state, payload) => {
      state.isOpenMenuMobile = payload
    },
    setSidebarDesktop: (state, payload) => {
      state.isOpenMenuDesktop = payload
    },
    setSearchDesktop: (state, payload) => {
      state.isOpenSearchDesktop = payload
    },
    setScreenWidth: (state,payload) => {
      state.screenWidth = payload
    },
    setMenuFixed: (state,payload) => {
      state.isMenuFixed = payload
    },
    setUserTypes: (state,payload) => {
      state.userTypes = payload
    },
    setPages: (state,payload) => {
      state.pages = payload
    }
  },
  actions: {
    setSidebarMobile: ({ commit }, payload) => {
      commit('setSidebarMobile',payload)
    },
    setSidebarDesktop: ({ commit }, payload) => {
      commit('setSidebarDesktop',payload)
    },
    setSearchDesktop: ({ commit }, payload) => {
      commit('setSearchDesktop',payload)
    },
    setScreenWidth: ({ commit }, payload) => {
      commit('setScreenWidth',payload.width)
    },
    setMenuFixed: ({ commit }, payload) => {
      commit('setMenuFixed', payload.fixed)
    },
    setPages: ({commit}, payload) => {
      let  values = []
      payload.pages.forEach(element => {
        values.push({value: element.id,text:element.page})
      })
      commit('setPages', values)
    },
    setUserTypes: ({commit}, payload) => {
      let  values = []
      payload.userTypes.forEach(element => {
        values.push({value: element.id,text: element.type})
      });
      commit('setUserTypes',values)
    }
  },
  getters: {
    getScreenWidth: (state) => {
      return state.screenWidth
    },
    getSidebarMobile: (state) => {
      return state.isOpenMenuMobile
    },
    getSidebarDesktop: (state) => {
      return state.isOpenMenuDesktop
    },
    getSearchDesktop: (state) => {
      return state.isOpenSearchDesktop
    },
    isResponsive: (state) => {
      return state.screenWidth <= 800
    },
    isMobile: (state) => {
      return state.screenWidth <= 400
    },
    isMenuFixed: (state) => {
      return state.isMenuFixed
    },
    getPages: (state) => {
      return state.pages
    },
    getUserTypes: (state) => {
      return state.userTypes
    }
  },
  modules: {
    about,
    terms,
    social_networks,
    users,
    emailAdministration,
    institutionAdministration,
    emailDomain,
    help,
    logos,
    links,
    session,
    procedure,
    reports,
    news,
    notificationState,
    requests,
    faqsAdmin,
    ruralModelAdmin,
    ruralHousing,
    domain,
    userProperties,
    normsAdmin,
    story,
    metasearch
  }
})