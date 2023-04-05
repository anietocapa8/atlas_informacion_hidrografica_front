const getNorms = (state, payload) => {
    state.norms = payload.data;
}

const getNormsPages = (state, payload) => {
    state.normsPages[payload.page] = payload.data;
    state.normsPages = Object.assign({}, state.normsPages);
}

const resetNormsPages = (state, payload) => {
    state.normsPages = {};
    state.normsPages = Object.assign({}, state.normsPages);
}

const getNormsQuery = (state, payload) => {
    state.normsQuery = payload;
    state.normsQuery = Object.assign({}, state.normsQuery);
}

const getNormsMeta = (state, payload) => {
    state.normsTotalRegisters = payload.data.meta.totalElements;
}

const getUsers = (state, payload) => {
  state.norm_users = payload.data;
}

export default {
    getNorms,
    getNormsPages,
    getNormsQuery,
    resetNormsPages,
    getNormsMeta,
    getUsers
}