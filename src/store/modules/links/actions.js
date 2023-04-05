import VAPI from '../../../http_common'
import { SERVICE_NAMES } from '@/sipsder_constants';

const setActiveLinks = ({ commit }, payload) => {
  VAPI.get(`${SERVICE_NAMES.LOGOS_LINKS_COLORS}/links/active`).then(response => {
    if(response.status !== 204){
      commit('setActiveLinks', { data:  response.data.data });
    }
  }).catch((e) => {
    console.log(e);
  });
}

const getLinksPages = ({ commit, state }, query) => {
  let query_string = '?';
  if( query['page'] == null ) {
    query['page'] = 0;
  }
  else {
    query['page'] = query['page'] - 1
  }
  query_string += `page=${query['page']}&size=5`

  VAPI.get(`${SERVICE_NAMES.LOGOS_LINKS_COLORS}/links${query_string}`).then((output) => {
    const values = output.data.data.map(link => {
      return { ...link, shownName: link.name, active: link.active ? "Activo" : "Inactivo" };
    });
    output.data.data = values
    commit('getLinksPages', { data: output.data, page: query['page'] });
    commit('getLinks', { data: output.data });
    commit('getLinksMeta', { data: output.data })
  }).catch((e) => {
    console.error(e);
  });
}

const getLinksQuery = ({ commit }, query) => {
  
  if( query['drop'] ){
    commit('getLinksPages');
  }
  query['drop'] = false
  commit('getLinksQuery', { query: query });

}

export default {
  setActiveLinks,
  getLinksPages,
  getLinksQuery
}