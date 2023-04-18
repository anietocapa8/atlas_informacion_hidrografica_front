const getRequests = (state, payload) => {
    state.requests = payload.data['data'];
}

const getRequestsPages = (state, payload) => {
    state.requestsPages[payload.page] = payload['data'];
    state.requestsPages = Object.assign({}, state.requestsPages);
}

const resetRequestsPages = (state, payload) => {
    state.requestsPages = {};
    state.requestsPages = Object.assign({}, state.requestsPages);
}

const getRequestsQuery = (state, payload) => {
    state.requestsQuery = payload;
    state.requestsQuery = Object.assign({}, state.requestsQuery);
}

const getRequestsMeta = (state, payload) => {
    state.requestsTotalRegisters = payload.data['meta']['totalElements'];
}

export default {
  getRequests,
  getRequestsPages,
  getRequestsQuery,
  resetRequestsPages,
  getRequestsMeta
}