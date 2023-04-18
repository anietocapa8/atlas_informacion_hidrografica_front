import VAPI from '../../../http_common'
import {SERVICE_NAMES} from "../../../sipsder_constants";


const getReportsPages = ({commit, state}, query) => {
    let query_string = '?';
    let cont = 1;
    query['page'] = query['page'] - 1;
    Object.keys(query).forEach(function (key) {
        var value = query[key];
        if (key !== 'drop' && value !== null && value !== '') {
            query_string += key + '=' + value;

            if (Object.keys(query).length - 1 !== cont) {
                query_string += '&'
            }
            cont++;
        }
    });
    // console.log("Query string " + query_string);

    if (state['ReportsPages'][query['page']] === undefined) {
        VAPI.get('/' + SERVICE_NAMES.REPORT + query_string).then((output) => {
            commit('getReportsPages', {data: output.data, page: query['page']});
            commit('getReports', {data: output.data});
            commit('getReportsMeta', {data: output.data})
        }).catch((e) => {
            console.log(e);
        });
    } else {
        commit('getReports', {data: state['ReportsPages'][query['page']]});
    }
}

const getReportsQuery = ({commit}, query) => {

    if (query['drop']) {
        commit('resetReportsPages');
    }
    query['drop'] = false;
    commit('getReportsQuery', {query: query});

}


export default {
    getReportsPages,
    getReportsQuery
}