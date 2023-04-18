const getEmailAdministration = (state, payload) => {
    state.EmailAdministration = payload.data['data'];
}

const getEmailAdministrationPages = (state, payload) => {
    state.EmailAdministrationPages[payload.page] = payload['data'];
    state.EmailAdministrationPages = Object.assign({}, state.EmailAdministrationPages);
}

const resetEmailAdministrationPages = (state, payload) => {
    state.EmailAdministrationPages = {};
    state.EmailAdministrationPages = Object.assign({}, state.EmailAdministrationPages);
}

const getEmailAdministrationQuery = (state, payload) => {
    state.EmailAdministrationQuery = payload;
    state.EmailAdministrationQuery = Object.assign({}, state.EmailAdministrationQuery);
}

const getEmailAdministrationMeta = (state, payload) => {
    state.EmailAdministrationTotalRegisters = payload.data['meta']['totalElements'];
}

const setEmailAdministration = (state, playload) =>{
    state.EmailAdministration = playload.data;
}

const  getEmailValidationStatus = (state, playload) =>{
    state.EmailValidationStatus = playload.data;
}

const resetEmailValidationStatus = (state) =>{
    state.EmailValidationStatus = 0;
}

const setEmailAdministrationRegistersPerPage = (state, playload) => {
    state.EmailAdministrationRegistersPerPage = playload.data;
}
export default {
    getEmailAdministration,
    getEmailAdministrationPages,
    getEmailAdministrationQuery,
    resetEmailAdministrationPages,
    getEmailAdministrationMeta,
    setEmailAdministration,
    getEmailValidationStatus,
    resetEmailValidationStatus,
    setEmailAdministrationRegistersPerPage
}