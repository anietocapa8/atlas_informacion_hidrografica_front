const getRequests = (state) => {
  return state.requests;
}

const getRequestsPages = (state) => {
  return state.requests;
}
 
const getRequestsQuery = (state) => {
  return state.requestsQuery;
}

const getRequestsMeta = (state) => {
  return  state.requestsTotalRegisters;
}
  
export default {
  getRequests,
  getRequestsPages,
  getRequestsQuery,
  getRequestsMeta
}