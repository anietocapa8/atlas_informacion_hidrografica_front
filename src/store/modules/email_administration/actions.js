import VAPI from '../../../http_common'
import { SERVICE_NAMES } from '@/sipsder_constants';

// TODO: Validate usage of this actions

const getEmailAdministrationPages = ({ commit, state }, query) => {
  let query_string = '?';
  let cont = 1;
    query['page'] = query['page'] - 1;
  Object.keys(query).forEach(function (key) { 
    var value = query[key];
    if (key !== 'drop' && value !== null){
        query_string += key + '=' + value;

      if ( Object.keys(query).length - 1 !== cont){
        query_string += '&'
      }
      cont++;
    }
  });

  if( state['EmailAdministrationPages'][query['page']] === undefined ){
    VAPI.get(SERVICE_NAMES.SMTP_SERVER + query_string).then((output) => {
      commit('getEmailAdministrationPages', { data: output.data, page: query['page'] });
      commit('getEmailAdministration', { data: output.data });
        commit('getEmailAdministrationMeta', {data: output.data});
        //commit('setEmailAdministrationRegistersPerPage', {data: output.data.length});
    }).catch((e) => {
      console.log(e);
    });
  }else{
    commit('getEmailAdministration', { data: state['EmailAdministrationPages'][query['page']] });
  }
}

const getEmailAdministrationQuery = ({ commit }, query) => {

  if( query['drop'] ){
    commit('resetEmailAdministrationPages');
  }
  query['drop'] = false;
  commit('getEmailAdministrationQuery', { query: query });

}

const setEmailAdministration = ({ commit }, payload) => {
    VAPI.get(SERVICE_NAMES.SMTP_SERVER).then(response => {
        commit('setEmailAdministration', { data:  response.data.data });
    }).catch((e) => {
        console.log(e);
    });
}

const getEmailValidationStatus = ({commit}, query) => {
    // consult the Api
    let data = '';
    let query_string = '?';
    let cont = 0;
    Object.keys(query).forEach(function (key) {
        var value = query[key];
        if (key !== 'drop' && value !== null){
            query_string += key + '=' + value;

            if ( Object.keys(query).length - 1 !== cont){
                query_string += '&'
            }
            cont++;
        }
    });
    // console.log(query_string);
    VAPI.get(SERVICE_NAMES.SMTP_SERVER + query_string).then((output) => {
            data = output.status;
            commit('getEmailValidationStatus', {data:output.status});
        }
    ).catch(e => {
        console.log("failed validation", e);
    });
}

export default {
  getEmailAdministrationPages,
  getEmailAdministrationQuery,
    setEmailAdministration,
    getEmailValidationStatus
}