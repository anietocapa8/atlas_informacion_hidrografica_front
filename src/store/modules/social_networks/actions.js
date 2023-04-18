import VAPI from '../../../http_common';
import { SERVICE_NAMES} from '../../../sipsder_constants';
import {LOGO_TYPE} from '../../../domain_constants';

const setSocialNetworks = ({ commit }, payload) => {
  VAPI.get(`/${SERVICE_NAMES.SOCIAL_NETWORK}/active`).then(response => {
    if(response.status !== 204){
      commit('setSocialNetworks', { data:  response.data.data });
    }else {
      commit('setSocialNetworks', { data:  [] });
    }
  }).catch((e) => {
    console.log(e);
  });
}

const setActiveSocialNetworks = ({ commit }, payload) => {
  VAPI.get(`/${SERVICE_NAMES.SOCIAL_NETWORK}/active`).then(response => {
    if(response.status !== 204){
      commit('setActiveSocialNetworks', {data: response.data.data})
    }else {
      commit('setActiveSocialNetworks', {data: []})
    }
  }).catch(e => {
    console.log(e)
  })
}

export default {
  setSocialNetworks,
  setActiveSocialNetworks
}