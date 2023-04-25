import VAPI from '../../../http_common'
import { SERVICE_NAMES } from '@/sipsder_constants';


const getTermsAndConditionsPages = ({ commit, state }, query) => {
  let query_string = '?';
  let cont = 1;
  query['page'] = query['page'] - 1
  Object.keys(query).forEach(function (key) { 
    var value = query[key];
    if (key !== 'drop' && value !== null){
      query_string += key + '=' + value 

      if ( Object.keys(query).length - 1 !== cont){
        query_string += '&'
      }
      cont++;
    }
  })

  if( state['termsAndConditionsPages'][query['page']] === undefined ){
    VAPI.get(SERVICE_NAMES.POLICY_TOOL + query_string).then((output) => {
      commit('getTermsAndConditionsPages', { data: output.data, page: query['page'] });
      commit('getTermsAndConditions', { data: output.data });
      commit('getTermsAndConditionsMeta', { data: output.data })
    }).catch((e) => {
      console.log(e);
    });
  }else{
    commit('getTermsAndConditions', { data: state['termsAndConditionsPages'][query['page']] });
  }
}

const getTermsAndConditionsQuery = ({ commit }, query) => {
  
  if( query['drop'] ){
    commit('resetTermsAndConditionsPages');
  }
  query['drop'] = false
  commit('getTermsAndConditionsQuery', { query: query });

}


export default {
  getTermsAndConditionsPages,
  getTermsAndConditionsQuery
}