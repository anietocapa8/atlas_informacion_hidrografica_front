const getUser = (state) => {
  return state.User;
}

const getUserPages = (state) => {
  return state.User;
}
 
const getUserQuery = (state) => {
  return state.UserQuery;
}

const getUserMeta = (state) => {
  return  state.UserTotalRegisters;
}
  
export default {
  getUser,
  getUserPages,
  getUserQuery,
  getUserMeta
}