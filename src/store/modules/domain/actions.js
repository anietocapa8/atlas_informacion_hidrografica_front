import VAPI from '../../../http_common'
import {SERVICE_NAMES} from '../../../sipsder_constants'
import {GEOGRAPHY_TYPE} from '../../../domain_constants'

export default {
    async getGeoLocal({commit, dispatch}){
        try {
            let result = await VAPI.get(`${SERVICE_NAMES.GEOGRAPHY}/all`)
            commit('setGeoLocal', result.data.data);
            localStorage.setItem("geoLocal", JSON.stringify(result.data.data));
        } catch(e){
            dispatch('clear');
        }
    },
    async getInstitutionsF({commit, dispatch}){
        try{
            let result = await VAPI.get(`${SERVICE_NAMES.INSTITUTION}/all`)
            commit('setInstitutionsF', result.data.data);
            localStorage.setItem("institutions", JSON.stringify(result.data.data));
        } catch(e){
            dispatch('clear');
        }
    },
    async getGeoCountry({commit, dispatch}) {
        try {
            let path = `${SERVICE_NAMES.GEOGRAPHY}`
            let response = await VAPI.get(path, {params:{type: GEOGRAPHY_TYPE.PAIS}});
            commit('setGeoCountry', response.data);
        } catch (error) {
            dispatch('clear');
        }
    }
}