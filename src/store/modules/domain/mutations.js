export default {
    setGeoLocal(state, payload){
        state.geoLocal = payload;
        if (payload) {
          localStorage.setItem('geoLocal', JSON.stringify(payload));
        }
        else {
          localStorage.removeItem('geoLocal');
        }
    },
    setInstitutionsF(state , payload){
        state.institutions = payload;
        if (payload) {
          localStorage.setItem('institutions', JSON.stringify(payload));
        } else {
          localStorage.removeItem('institutions');
        }
    },
    setGeoCountry(state, payload) {
      state.geoCountry = payload;
    }
}