import VAPI from '../../../http_common';
import { SERVICE_NAMES, HTTP_STATUS } from '../../../sipsder_constants';

const getInstitutionsPages = ({ commit, state }, query) => {
  let query_string = '?'
  let cont = 1
  query['page'] = query['page'] - 1
  Object.keys(query).forEach(function (key) {
    var value = query[key]
    if (key !== 'drop' && value !== null && value !== '') {
      query_string += key + '=' + value
      if (Object.keys(query).length - 1 !== cont) {
        query_string += '&'
      }
      cont++
    }
  })
  query_string += '&sort=name,asc'

  if (state['InstitutionsPages'][query['page']] === undefined) {
    VAPI.get('/' + SERVICE_NAMES.INSTITUTION + '/' + query_string )
      .then(output => {
        if (output.status === 204) {
          commit('getInstitutions', { data: {'data': null} })
          commit('getInstitutionsMeta', { data: {'meta': {'totalElements': 0}}  })
          return null;
        }
        output.data.data.map(inst => {
          inst.instName = inst.name;
          delete inst.name;
          return inst;
        });
        commit('getInstitutionsPages', {
          data: output.data,
          page: query['page']
        })
        commit('getInstitutions', { data: output.data })
        commit('getInstitutionsMeta', { data: output.data })
      })
      .catch(e => {
        console.error(e)
      })
  } else {
    commit('getInstitutions', {
      data: state['InstitutionsPages'][query['page']]
    })
  }
}

const getInstitutionsQuery = ({ commit }, query) => {
  if (query['drop']) {
    commit('resetInstitutionsPages')
  }
  query['drop'] = false
  commit('getInstitutionsQuery', { query: query })
}

async function getInstitution ({ commit, state }, id) {
  if (id === undefined) {
    commit('resetInstitution');
  } else {
    try {
      const response = await VAPI.get('/' + SERVICE_NAMES.INSTITUTION + '/' + id);
      if (response && response.status === HTTP_STATUS.OK) {
        commit('setInstitution', response.data);
      } else {
        throw new Exception("Error loading Institution");
      }
    } catch (e) {
      console.error(e);
    }
  }
}

function saveInstitution ({ commit, state }, inst) {
  for (let office of inst.offices) {
    office.contacts = [...inst.contacts
      .filter(c => c.office === office)
      .map(c => {
        delete c.office;
        return c;
      })];
  }
  let request;
  if (inst.id === undefined) {
    request = VAPI.post("/" + SERVICE_NAMES.INSTITUTION, inst);
  } else {
    request = VAPI.put("/" + SERVICE_NAMES.INSTITUTION + '/' + inst.id, inst);
  }
  request
    .then(response => {
      commit('setInstitution', response);
    })
    .catch(e => {
      console.error(e);
    });
}

function resetInstitution ({ commit, state }) {
  commit('resetInstitution');
}

function removeInstitution ({ commit, state }) {
  commit('removeInstitution');
}

export default {
  getInstitutionsPages,
  getInstitutionsQuery,
  getInstitution,
  saveInstitution,
  resetInstitution,
  removeInstitution,
}
