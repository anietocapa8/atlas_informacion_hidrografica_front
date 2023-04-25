import VAPI from '../../../http_common';
import { SERVICE_NAMES, HTTP_STATUS } from '../../../sipsder_constants';

async function getHelp({ commit, state }) {
  commit('removeHelp');
  try {
    const response = await VAPI.get(`/${SERVICE_NAMES.HELP}`);
    if (response && response.status === HTTP_STATUS.OK) {
      commit('setHelp', response.data);
    } else {
      throw new Error("Response error");
    }
  } catch (e) {
    console.error("An error has occurred loading Help " + e.toString());
  };
}

function setHelp({ commit, state }, help) {
  commit('setHelp', Object.assign({}, state.help, help));
}

export default {
  getHelp,
  setHelp,
}
