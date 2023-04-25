import VAPI from '../../../http_common'
import {SERVICE_NAMES} from "../../../sipsder_constants";


const getEmailDomainPages = ({ commit, state }, query) => {
  let query_string = '?';
  let cont = 1;
    // console.log("Actual page " + query['page']);
    query['page'] = query['page'] - 1;
  Object.keys(query).forEach(function (key) { 
    var value = query[key];
      if (key !== 'drop' && key !== 'size' && value !== null) {
      query_string += key + '=' + value;

      if ( Object.keys(query).length - 1 !== cont){
        query_string += '&'
      }
      cont++;
    }
  });
    // console.log("Query page " + query['page']);
    // console.log("Query string " + query_string);

  if( state['EmailDomainPages'][query['page']] === undefined ){
      VAPI.get('/' + SERVICE_NAMES.EMAIL_DOMAIN + query_string).then(output => {
          if (output.status === 200) {
              // data
              commit('getEmailDomainAll', {data: output.data});
              commit('getEmailDomainMeta', {data: output.data});
              //commit('getEmailDomainPages', {data: [], page: query['page']});
              commit('safePagination', {data: output.data.data, size: "5", currentPage: query['page']});
              commit('getEmailDomain', {data: state['EmailDomainPages'][query['page']]});
          } else if (output.status === 204) {
              //empty
              commit('getEmailDomainAll', {data: []});
              let meta = {
                  "totalPages": 1,
                  "totalElements": 0,
                  "elementsPage": 5,
                  "query": query_string
              };
              commit('getEmailDomainMeta', {data: {meta}});
              commit('getEmailDomainPages', {data: [], page: query['page']});
          }
    }).catch((e) => {
      console.log(e);
    });
  }else{
      // console.log("Page origin " + query['page']);
      // console.log("Data selected ", state['EmailDomainPages'][query['page']]);
    commit('getEmailDomain', { data: state['EmailDomainPages'][query['page']] });
  }
};

const getEmailDomainQuery = ({ commit }, query) => {

  if( query['drop'] ){
    commit('resetEmailDomainPages');
  }
  query['drop'] = false;
  commit('getEmailDomainQuery', { query: query });

}

const setEmailDomain = ({ commit }, playload) => {
  commit('setEmailDomain', playload)
}

const deleteEmailAdded = ({commit}) => {
  commit('clearEmailDomainAdded')
}

const deleteDomain = ({commit}, playload) => {
    commit('deleteEmailDomain', playload)
}


export default {
  getEmailDomainPages,
  getEmailDomainQuery,
    setEmailDomain,
    deleteEmailAdded,
    deleteDomain
}