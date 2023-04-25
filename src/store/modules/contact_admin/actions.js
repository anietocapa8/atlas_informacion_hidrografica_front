import VAPI from '../../../http_common'
import { SERVICE_NAMES } from '@/sipsder_constants';

const getRequestsPages = ({ commit, state }, query) => {
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
  query_string +=`&sort=creationDate,desc`

  if( state['requestsPages'][query['page']] === undefined ){
    VAPI.get(SERVICE_NAMES.REQUEST + query_string).then((output) => {
      commit('getRequestsPages', { data: output.data, page: query['page'] });
      commit('getRequests', { data: output.data });
      commit('getRequestsMeta', { data: output.data })
    }).catch((e) => {
      console.log(e);
    });
  }else{
    commit('getRequests', { data: state['requestsPages'][query['page']] });
  }
}

const getRequestsQuery = ({ commit }, query) => {
  
  if( query['drop'] ){
    commit('resetRequestsPages');
  }
  query['drop'] = false
  commit('getRequestsQuery', { query: query });

}


export default {
  getRequestsPages,
  getRequestsQuery
}