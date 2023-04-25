const getEmailAdministration = (state) => {
  return state.EmailAdministration;
}

const getEmailAdministrationPages = (state) => {
  return state.EmailAdministration;
}
 
const getEmailAdministrationQuery = (state) => {
  return state.EmailAdministrationQuery;
}

const getEmailAdministrationMeta = (state) => {
  return  state.EmailAdministrationTotalRegisters;
}

const getEmailValidationStatus = (state) => {
  return state.EmailValidationStatus;
}

const getEmailAdministrationRegistersPerPage = (state) => {
    return state.EmailAdministrationRegistersPerPage;
}
  
export default {
  getEmailAdministration,
  getEmailAdministrationPages,
  getEmailAdministrationQuery,
  getEmailAdministrationMeta,
    getEmailValidationStatus,
    getEmailAdministrationRegistersPerPage
}