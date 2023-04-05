const getManual = (state) => (id) => {
  if (state.help) {
    return state.help.helpDocuments.find(manual => manual.cryptedId === id);
  }
}

const getHelp = (state) => {
  return state.help;
}

export default {
  getManual,
  getHelp,
}