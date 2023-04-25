const getInstitutions = (state, payload) => {
  state.Institutions = payload.data['data'];
}

const getInstitutionsPages = (state, payload) => {
  state.InstitutionsPages[payload.page] = payload['data'];
  state.InstitutionsPages = Object.assign({}, state.InstitutionsPages);
}

const resetInstitutionsPages = (state, payload) => {
  state.InstitutionsPages = {};
  state.InstitutionsPages = Object.assign({}, state.InstitutionsPages);
}

const getInstitutionsQuery = (state, payload) => {
  state.InstitutionsQuery = payload;
  state.InstitutionsQuery = Object.assign({}, state.InstitutionsQuery);
}

const getInstitutionsMeta = (state, payload) => {
  state.InstitutionsTotalRegisters = payload.data['meta']['totalElements'];
}

function setInstitution(state, payload) {
  state.institution = payload;
};

function resetInstitution(state) {
    state.institution = {
        id: undefined,
        name: undefined,
        userTypeId: undefined,
        institutionTypeId: undefined,
        sectorId: undefined,
        status: true,
        offices: [],
        contacts: [],
        emailDomains: [],
    };
};

function removeInstitution(state) {
    state.institution = undefined;
}

export default {
  getInstitutions,
  getInstitutionsPages,
  getInstitutionsQuery,
  resetInstitutionsPages,
  getInstitutionsMeta,

  setInstitution,
  resetInstitution,
  removeInstitution,
}
