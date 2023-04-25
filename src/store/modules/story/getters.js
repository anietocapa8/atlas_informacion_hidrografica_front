const getStoryGeneral = (state) => {
  return state.storyGeneral;
}  

const getStoriesFilter = (state) => {
  return state.storiesFilter;
}  

const getStories = (state) => {
  return state.stories;
}

const getStoriesMeta = (state) => {
  return state.storiesMeta;
}

const getStoriesPage = (state) => {
  return state.storiesPage;
}

export default {
  getStoryGeneral,
  getStoriesFilter,
  getStories,
  getStoriesMeta,
  getStoriesPage,
}