import VAPI from '../../../http_common';
import { SERVICE_NAMES, HTTP_STATUS } from '../../../sipsder_constants';

function removeProcedure ({ commit, state }) {
  commit('removeProcedure');
}

function setProcedureId ({ commit, state }, id) {
  commit('setProcedure', {id: id});
}

async function getProcedure ({ commit, state }, id) {
  commit('removeProcedure');
  try {
    const response = await VAPI.get('/' + SERVICE_NAMES.PROCEDURE + '/' + id);
    if (response && response.status === HTTP_STATUS.OK) {
      commit('setProcedure', response.data);
    } else {
      throw new Error("Error loading Procedure");
    }
  } catch (e) {
    console.error(e);
  }
}

export default {
  getProcedure,
  setProcedureId,
  removeProcedure,
}
