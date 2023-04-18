const getInstitutions = (state) => {
  return state.Institutions;
}

const getInstitutionsPages = (state) => {
  return state.Institutions;
}

const getInstitutionsQuery = (state) => {
  return state.InstitutionsQuery;
}

const getInstitutionsMeta = (state) => {
  return  state.InstitutionsTotalRegisters;
}

const getInstitution = (state) => {
  return state.institution;
}

export default {
  getInstitution,
  getInstitutions,
  getInstitutionsPages,
  getInstitutionsQuery,
  getInstitutionsMeta
}