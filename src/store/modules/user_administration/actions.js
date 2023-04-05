import VAPI from '../../../http_common'
import {SERVICE_NAMES} from "../../../sipsder_constants";


const getUserPages = ({ commit, state }, query) => {
  let query_string = '?';
  let cont = 1;
  query['page'] = query['page'] - 1
  Object.keys(query).forEach(function (key) { 
    var value = query[key];
    if (key !== 'drop' && value !== null && value!==''){
      // console.info("ACA mirando el value:", value, value == "typeName");
      if (typeof value === 'string' || value instanceof String && value.includes("typeName")) {
        value = value.replace("typeName", "userType.type");
      }
      if (typeof value === 'string' || value instanceof String && value.includes("statusValue")) {
        value = value.replace("statusValue", "status");
      }
      if (1 !== cont){
        query_string += '&'
      }
      query_string += `${key}=${value}`;
      cont++;
    }
  })

  if( state['UserPages'][query['page']] === undefined ){
      // console.log('/user-admin' + query_string);
      VAPI.get('/' + SERVICE_NAMES.USER_ADMIN + query_string).then((output) => {
      commit('getUserPages', { data: output.data, page: query['page'] });
      commit('getUser', { data: output.data });
      commit('getUserMeta', { data: output.data })
    }).catch((e) => {
      console.log(e);
    });
  }else{
    commit('getUser', { data: state['UserPages'][query['page']] });
  }
}

const getUserQuery = ({ commit }, query) => {

  if( query['drop'] ){
    commit('resetUserPages');
  }
  query['drop'] = false;
  commit('getUserQuery', { query: query });

}


export default {
  getUserPages,
  getUserQuery
}