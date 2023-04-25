const getReports = (state, payload) => {
    state.Reports = payload.data['data'];
}

const getReportsPages = (state, payload) => {
    state.ReportsPages[payload.page] = payload['data'];
    state.ReportsPages = Object.assign({}, state.ReportsPages);
}

const resetReportsPages = (state, payload) => {
    state.ReportsPages = {};
    state.ReportsPages = Object.assign({}, state.ReportsPages);
}

const getReportsQuery = (state, payload) => {
    state.ReportsQuery = payload;
    state.ReportsQuery = Object.assign({}, state.ReportsQuery);
}

const getReportsMeta = (state, payload) => {
    state.ReportsTotalRegisters = payload.data['meta']['totalElements'];
}

export default {
    getReports,
    getReportsPages,
    getReportsQuery,
    resetReportsPages,
    getReportsMeta
}