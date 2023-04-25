const getTimeLine = (state, payload) => {
    state.timeLine = payload.data['data'];
}

const getTimeLinePages = (state, payload) => {
    state.timeLinePages[payload.page] = payload['data'];
    state.timeLinePages = Object.assign({}, state.timeLinePages);
}

const resetTimeLinePages = (state, payload) => {
    state.timeLinePages = {};
    state.timeLinePages = Object.assign({}, state.timeLinePages);
}

const getTimeLineQuery = (state, payload) => {
    state.timeLineQuery = payload;
    state.timeLineQuery = Object.assign({}, state.timeLineQuery);
}

const getTimeLineMeta = (state, payload) => {
    state.timeLineTotalRegisters = payload.data['meta']['totalElements'];
}

export default {
    getTimeLine,
    getTimeLinePages,
    getTimeLineQuery,
    resetTimeLinePages,
    getTimeLineMeta
}