import VAPI from '../../../http_common'
import { SERVICE_NAMES } from '@/sipsder_constants'


const getTimeLinePages = ({ commit, state }, query) => {
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

  if( state['timeLinePages'][query['page']] === undefined ){
    VAPI.get(`${SERVICE_NAMES.ABOUT}/events-page${query_string}`).then((output) => {
      commit('getTimeLinePages', { data: output.data, page: query['page'] });
      commit('getTimeLine', { data: output.data });
      commit('getTimeLineMeta', { data: output.data })
    }).catch((e) => {
      console.log(e);
    });
  }else{
    commit('getTimeLine', { data: state['timeLinePages'][query['page']] });
  }
}

const getTimeLineQuery = ({ commit }, query) => {
  
  if( query['drop'] ){
    commit('resetTimeLinePages');
  }
  query['drop'] = false
  commit('getTimeLineQuery', { query: query });

}


export default {
  getTimeLinePages,
  getTimeLineQuery
}