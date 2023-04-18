export const getters = {

  getUserSex (state) {
    return state.userSex;
  },

  getUserType (state){
    return state.userType;
  },

  getUserGender (state) {
    return state.userGender;
  },

  getUserEthnic (state) {
    return state.userEthnic;
  },

  getUserDisability (state) {
    return state.userDisability;
  },

  getUserPhoneType (state) {
    return state.userPhoneType;
  },

  getAcademicLevel (state) {
    return state.academicLevel;
  },

  getUserMoves (state) {
    return state.userMoves;
  },
  getDomain (state) {
    return (domain) => {
      if (state[domain]) {
        return state[domain];
      } else {
        return false;
      }
    }
  },
}

// export default {
//   getUserSex,
//   getUserType,
//   getUserGender,
//   getUserEthnic,
//   getUserDisability,
//   getUserPhoneType,
//   getAcademicLevel,
//   getUserMoves,
// }
