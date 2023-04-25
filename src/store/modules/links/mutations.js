const setActiveLinks = (state, payload) => {
  state.activeLinks = payload.data;
}

const getLinks = (state, payload) => {
  state.links = payload.data['data'];
}

const getLinksPages = (state, payload) => {
  state.linksPages[payload.page] = payload['data'];
  state.linksPages = Object.assign({}, state.linksPages);
}

const resetLinksPages = (state, payload) => {
  state.linksPages = {};
  state.linksPages = Object.assign({}, state.linksPages);
}

const getLinksQuery = (state, payload) => {
  state.linksQuery = payload;
  state.linksQuery = Object.assign({}, state.linksQuery);
}

const getLinksMeta = (state, payload) => {
  state.linksTotalRegisters = payload.data['meta']['totalElements'];
}

export default {
  setActiveLinks,
  getLinks,
  getLinksPages,
  resetLinksPages,
  getLinksQuery,
  getLinksMeta
}