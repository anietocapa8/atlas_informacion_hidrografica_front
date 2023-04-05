import VAPI from '../../../http_common'
import {SERVICE_NAMES} from '../../../sipsder_constants'

const loadNotificationStates = ({ commit }, payload) => {
    let path = `${SERVICE_NAMES.NOTIFICATION_STATE}`;
    VAPI.get(path).then( response => {
        commit('setNotificationStates', response.data);
    }).catch( (error) => {
        console.log(error);
    });
}

export default {
    loadNotificationStates,
}