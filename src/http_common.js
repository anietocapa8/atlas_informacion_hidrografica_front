import axios from 'axios';
import { URI, HTTP_STATUS } from './sipsder_constants'
import store from './store'

const VAPI = axios.create({
  baseURL: URI,
  timeout: 120000,
})

VAPI.defaults.withCredentials = true;

VAPI.interceptors.request.use(function(config) {
  store.dispatch('setLoading');
  return config
})

VAPI.interceptors.response.use(function(response) {
  store.dispatch('clearLoading');
  return Promise.resolve(response)
}, function(error) {
  store.dispatch('clearLoading');
  if (error.response) {
    if (error.response.status === HTTP_STATUS.INTERNAL_SERVER_ERROR ||
      error.response.status === HTTP_STATUS.BAD_REQUEST || error.response.status === HTTP_STATUS.CONFLICT) {
      console.log('INTERNAL_SERVER_ERROR OR BAD_REQUEST');
      store.dispatch("setErrorCode", error.response.data.code);
    }
    
    if (store.getters.isAuthenticated && (error.response.status === HTTP_STATUS.FORBIDDEN ||
      error.response.status === HTTP_STATUS.UNAUTHORIZED)) {
      console.log('FORBIDDEN');
      store.dispatch("signOut");
    } 
    return Promise.reject(error);
  }
})

export default VAPI;