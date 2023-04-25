import VAPI from '../../../http_common'
import {SERVICE_NAMES} from '../../../sipsder_constants';
import {LOGO_TYPE} from '../../../domain_constants'

const setLogosColors = async ({ commit }, payload) => {
  try{
    let response = await VAPI.get(`/logo-link-color/active`);
    if(response && response.status !== 204){
      commit('setLogosColors', { data:  response.data.data });
    }
  } catch (error) {
    console.error(error)
    // res = error;
  }
    
}

export default {
  setLogosColors
}