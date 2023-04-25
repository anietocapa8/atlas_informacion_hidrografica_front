const getActiveLinks = (state) => {
  return state.activeLinks;
}

const getLinks = (state) => {
  return state.links;
}

const getLinksPages = (state) => {
  return state.links;
}
 
const getLinksQuery = (state) => {
  return state.linksQuery;
}

const getLinksMeta = (state) => {
  return  state.linksTotalRegisters;
}

export default {
  getActiveLinks,
  getLinks,
  getLinksPages,
  getLinksQuery,
  getLinksMeta
}