function setStoriesFilter(state, payload) {
  state.storiesFilter = Object.assign({}, state.storiesFilter, payload);
};

function resetStoriesFilter(state) {
  state.storiesFilter = { orderBy: "date,desc", own: false, ruralHousing: false, page: 1, size: 10 };
};

function setStoryGeneral(state, payload) {
  state.storyGeneral = payload;
};

function setStories(state, payload) {
  state.stories = payload.data;
  state.storiesMeta = payload.meta;
  state.storiesPage = payload.page;
};

export default {
  resetStoriesFilter,
  setStoriesFilter,
  setStoryGeneral,
  setStories,
}
