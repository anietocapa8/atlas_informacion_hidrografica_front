import VAPI from "../../../http_common";
import { SERVICE_NAMES } from "@/sipsder_constants";
import router from "../../../router/router.js";

export const actions = {
  async getMenus({commit}, payload) {
    try {
      var main = await VAPI.get(`${SERVICE_NAMES.MENU}/main`, {params: {update: payload}});
      var sidebar = await VAPI.get(`${SERVICE_NAMES.MENU}/sidebar`, {params: {update: payload}});
      let lateral = await VAPI.get(`${SERVICE_NAMES.MENU}/lateral`, {params: {update: payload}});
      commit('setMain', main.data);
      commit('setSidebar', sidebar.data);
      commit('setLateral', lateral.data);
    } catch (error) {
      console.error(error)
    }
  },
  async signIn({commit, dispatch}, payload) {
    let data = {
      username: payload.email,
      password: payload.password,
      userAuthType: payload.userType,
    }
    try {
      await VAPI.post(SERVICE_NAMES.LOGIN, data);
      commit('setAuthenticated', true);
      commit('setError', null);
      dispatch('fetchCurrentUser');
    } catch (error) {
      dispatch('clear'); 
      dispatch('fetchPublicPermissions');
      commit('setError', error);
    }
  },
  async signOut({commit, dispatch}) {
    $cookies.remove('COOKIE-BEARER');
    try {
      await VAPI.post(SERVICE_NAMES.LOGOUT);
      commit('setError', null);
      dispatch('clear');
      await dispatch('fetchPublicPermissions');
      router.push({name:'Logout', query: { view: router.currentRoute.fullPath }});
    } catch (error) {
      commit('setError', error);
    } 
  },
  async fetchPublicPermissions({commit, dispatch}) {
    try {
      let result = await VAPI.get(`${SERVICE_NAMES.LOGIN}/current-user`);
      commit('setCurrentRoles', result.data.roles);
      commit('setCurrentPermissions', result.data.permissions);
      dispatch('getMenus');
    } catch (error) {
      commit('setError', error);
    }
  },
  async fetchCurrentUser({commit, dispatch}) {
    try {
      let result = await VAPI.get(`${SERVICE_NAMES.LOGIN}/current-user`);
      let user = result.data.user
      user.institutions = result.data.institutions
      commit('setCurrentUser', user);
      commit('setCurrentRoles', result.data.roles);
      commit('setCurrentPermissions', result.data.permissions);
      dispatch('getMenus');
      if (result.data.user.status <= 1) {
        router.push({name:'userProfile'});
      }
      // reload the window to load the data in the current window of the logged user
      window.location.reload();
    } catch (error) {
      dispatch('clear');
      commit('setError', error);
    }
  },
  clear({commit}) {
    commit('setAuthenticated', false);
    commit('setCurrentUser', null);
    commit('setCurrentRoles', null); 
    commit('setCurrentPermissions', null); 
  },
  clearLoading({commit}) {
    commit('decreaseLoading');
  },
  setLoading({commit}) {
    commit('increaseLoading');
  },
  setCurrentUser({commit}, payload) {
    commit('setCurrentUser', payload);
  },
  clearNotificationEvent({commit}) {
    commit('setNotificationEvent', false);
  },
  setNotificationEvent({commit}) {
    commit('setNotificationEvent', true);
  },
  clearIdle({commit}) {
    commit('setIdle', false);
  },
  setIdle({commit}) {
    commit('setIdle', true);
  },
  setErrorCode({commit}, payload) {
    commit('setErrorCode', payload);
  },
  clearErrorCode({commit}) {
    commit('setErrorCode', null);
  }
}