function setHelp(state, payload) {
  state.help = payload;
};

function removeHelp(state) {
  state.help = undefined;
};

export default {
  setHelp,
  removeHelp,
}
