const getTimeLines = (state, payload) => {
    state.timeLines = payload.data['data'];
}

const getTimeLinesPages = (state, payload) => {
    state.timeLinesPages[payload.page] = payload['data'];
    state.timeLinesPages = Object.assign({}, state.timeLinesPages);
}

const resetTimeLinesPages = (state, payload) => {
    state.timeLinesPages = {};
    state.timeLinesPages = Object.assign({}, state.timeLinesPages);
}

const getTimeLinesQuery = (state, payload) => {
    state.timeLinesQuery = payload;
    state.timeLinesQuery = Object.assign({}, state.timeLinesQuery);
}

const getTimeLinesMeta = (state, payload) => {
    state.timeLinesTotalRegisters = payload.data['meta']['totalElements'];
}

const setContestId = (state, payload) => {
    state.contestId = payload;
}

export default {
    getTimeLines,
    getTimeLinesPages,
    getTimeLinesQuery,
    resetTimeLinesPages,
    getTimeLinesMeta,
    setContestId,
}