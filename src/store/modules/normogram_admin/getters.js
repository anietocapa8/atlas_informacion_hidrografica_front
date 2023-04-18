const getNorms = (state) => {
  return state.norms;
}

const getNormsPages = (state) => {
  return state.norms;
}
 
const getNormsQuery = (state) => {
  return state.normsQuery;
}

const getNormsMeta = (state) => {
  return  state.normsTotalRegisters;
}

const getUsers = (state) => {
  return  state.norm_users;
}

export default {
  getNorms,
  getNormsPages,
  getNormsQuery,
  getNormsMeta,
  getUsers
}