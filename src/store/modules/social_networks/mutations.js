const setSocialNetworks = (state, payload) => {
  state.socialNetworks = payload.data;
}

const setActiveSocialNetworks = (state, payload) => {
  state.activeSocialNetworks = payload.data
}


export default {
  setSocialNetworks,
  setActiveSocialNetworks
}