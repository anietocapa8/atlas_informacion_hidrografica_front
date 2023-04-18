import VAPI from '../../../http_common'
import { SERVICE_NAMES } from '@/sipsder_constants'

const getTimeLinesPages = ({ commit, state }, query) => {
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

  if( state['timeLinesPages'][query['page']] === undefined ){
    VAPI.get(`${SERVICE_NAMES.RURAL_HOUSING}/timeline${query_string}`).then((output) => {
      commit('getTimeLinesPages', { data: output.data, page: query['page'] });
      commit('getTimeLines', { data: output.data });
      commit('getTimeLinesMeta', { data: output.data })
    }).catch((e) => {
      console.log(e);
    });
  }else{
    commit('getTimeLines', { data: state['timeLinesPages'][query['page']] });
  }
}

const getTimeLinesQuery = ({ commit }, query) => {
  
  if( query['drop'] ){
    commit('resetTimeLinesPages');
  }
  query['drop'] = false
  commit('getTimeLinesQuery', { query: query });

}

const setContestId = ({ commit }, id) => {
  commit('setContestId', id);
}

const removeContestId = ({ commit }) => {
  commit('setContestId', undefined);
}

export default {
  getTimeLinesPages,
  getTimeLinesQuery,
  setContestId,
  removeContestId,
}