const getSocialNetworks = (state) => {
  return state.socialNetworks;
}

const getActiveSocialNetworks = (state) => {
  return state.activeSocialNetworks
}

export default {
  getSocialNetworks,
  getActiveSocialNetworks
}