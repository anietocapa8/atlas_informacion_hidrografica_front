const getUser = (state, payload) => {
    state.User = payload.data['data'];
}

const getUserPages = (state, payload) => {
    state.UserPages[payload.page] = payload['data'];
    state.UserPages = Object.assign({}, state.UserPages);
}

const resetUserPages = (state, payload) => {
    state.UserPages = {};
    state.UserPages = Object.assign({}, state.UserPages);
}

const getUserQuery = (state, payload) => {
    state.UserQuery = payload;
    state.UserQuery = Object.assign({}, state.UserQuery);
}

const getUserMeta = (state, payload) => {
    state.UserTotalRegisters = payload.data['meta']['totalElements'];
}

export default {
    getUser,
    getUserPages,
    getUserQuery,
    resetUserPages,
    getUserMeta
}