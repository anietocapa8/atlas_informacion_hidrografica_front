const setSearchQuery = async ({ commit }, payload) => {
    
    commit('setSearchQuery', { data:  payload});

}

export default {
    setSearchQuery
}