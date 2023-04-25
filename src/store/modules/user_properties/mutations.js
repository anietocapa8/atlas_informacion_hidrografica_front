
export const mutations = {
  setDomain (state, payload) {
    if (payload.domain in state) {
      state[payload.domain] = payload.data;
    }  
  },
  
}
