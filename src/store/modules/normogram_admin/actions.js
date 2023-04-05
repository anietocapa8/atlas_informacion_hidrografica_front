import VAPI from '../../../http_common'
import Router from "../../../router/router";
import { PERMISSIONS_TYPES} from '../../../domain_constants'
import { SERVICE_NAMES, HTTP_STATUS } from '../../../sipsder_constants';


const getNormsPages = ({ commit, state, rootState }, query) => {
  let query_string = '?';
  let cont = 1;
  query['page'] = query['page'] ? query['page'] - 1 : 0;
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

  //let path = '/norms/active'
  //let admin_check = false
  
  let path = `/${SERVICE_NAMES.NORMS_ACTIVE}`
  let admin_check = false
  let session = rootState;
  
  if (rootState.session.currentPermissions && rootState.session.currentPermissions[Router.currentRoute.name]) {
    if(_.includes(rootState.session.currentPermissions[Router.currentRoute.name], PERMISSIONS_TYPES.ADMIN)){
      path = `/${SERVICE_NAMES.NORMS}`
      admin_check = true
    }
  }

  if( state['normsPages'][query['page']] === undefined ){
    VAPI.get(path + query_string).then((output) => {
      if(output.status === HTTP_STATUS.OK){
        let response = output.data
        let admin_unique = []
        let admin = {}
        for( const prop in response.data ){
          if( admin_check ){  
            admin[response.data[prop].userId] = response.data[prop].userName
          }
        }
        if( state.norm_users == null && admin_check){
          for( const id in admin ){
            admin_unique.push( {id: id, name: admin[id] } )
          }
          
          commit('getUsers', { data: admin_unique });
        }
        commit('getNormsPages', { data: response.data, page: query['page'] });
        commit('getNorms', { data: response.data });
        commit('getNormsMeta', { data: output.data });
      }else{
        commit('getNormsPages', { data: {}, page: query['page'] });
        commit('getNorms', { data: [] });
        commit('getNormsMeta', { data: { meta: { totalElements: 0 } } });
      }
      
    }).catch((e) => {
      console.error(e);
    });
  }else{
    commit('getNorms', { data: state['normsPages'][query['page']] });
  }
}

const getNormsQuery = ({ commit }, query) => {
  
  if( query['drop'] ){
    commit('resetNormsPages');
  }
  query['drop'] = false
  commit('getNormsQuery', { query: query });

}


export default {
  getNormsPages,
  getNormsQuery
} 