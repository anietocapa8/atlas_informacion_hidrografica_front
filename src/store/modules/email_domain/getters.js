const getEmailDomain = (state) => {
  return state.EmailDomain;
}

const getEmailDomainPages = (state) => {
    return state.EmailDomainPages;
}
 
const getEmailDomainQuery = (state) => {
  return state.EmailDomainQuery;
}

const getEmailDomainMeta = (state) => {
  return  state.EmailDomainTotalRegisters;
}

const getEmailDomainAdded = (state) => {
  return state.EmailDomainAdded;
}
  
export default {
  getEmailDomain,
  getEmailDomainPages,
  getEmailDomainQuery,
  getEmailDomainMeta,
    getEmailDomainAdded
}