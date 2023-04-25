function setProcedure(state, payload) {
  state.procedure = payload;
};

function removeProcedure(state) {
    state.procedure = undefined;
};

export default {
  setProcedure,
  removeProcedure,
}
