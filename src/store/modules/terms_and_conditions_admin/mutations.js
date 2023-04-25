const getTermsAndConditions = (state, payload) => {
    state.termsAndConditions = payload.data['data'];
}

const getTermsAndConditionsPages = (state, payload) => {
    state.termsAndConditionsPages[payload.page] = payload['data'];
    state.termsAndConditionsPages = Object.assign({}, state.termsAndConditionsPages);
}

const resetTermsAndConditionsPages = (state, payload) => {
    state.termsAndConditionsPages = {};
    state.termsAndConditionsPages = Object.assign({}, state.termsAndConditionsPages);
}

const getTermsAndConditionsQuery = (state, payload) => {
    state.termsAndConditionsQuery = payload;
    state.termsAndConditionsQuery = Object.assign({}, state.termsAndConditionsQuery);
}

const getTermsAndConditionsMeta = (state, payload) => {
    state.termsAndConditionsTotalRegisters = payload.data['meta']['totalElements'];
}

export default {
    getTermsAndConditions,
    getTermsAndConditionsPages,
    getTermsAndConditionsQuery,
    resetTermsAndConditionsPages,
    getTermsAndConditionsMeta
}