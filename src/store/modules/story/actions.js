import VAPI from '../../../http_common';
import { SERVICE_NAMES, HTTP_STATUS } from '../../../sipsder_constants';

async function getStoryGeneral({ commit, state }) {
  commit('setStoryGeneral', undefined);
  try {
    const response = await VAPI.get(`/${SERVICE_NAMES.STORY}/general`);
    if (response && response.status === HTTP_STATUS.OK) {
      commit('setStoryGeneral', response.data);
    } else {
      throw new Error("Response error");
    }
  } catch (e) {
    console.error("An error occurred loading general story: " + e.toString());
  };
}

async function updateStoryGeneral({ commit, state }, model) {
  try {
    const response = await VAPI.put(`/${SERVICE_NAMES.STORY}/general`, model);
    if (response && response.status === HTTP_STATUS.OK) {
      commit('setStoryGeneral', Object.assign({}, state.storyGeneral, response.data));
    } else {
      throw new Error("Response error");
    }
  } catch (e) {
    console.error("An error occurred updating general story: " + e.toString());
  };
}

function removeStoriesFilter({ commit }) {
  commit('resetStoriesFilter');
}

function setStoriesFilter({ commit }, filter) {
  commit('setStoriesFilter', filter);
}

async function getStories({ commit, state }) {
  const filter = state.storiesFilter;
  let strings = [];
  if (filter) {
    strings = Object.entries(filter).filter(entry => entry[1]).map(entry => {
      if (entry[0] === 'page') entry[1]--;
      return entry[0] + '=' + ((entry[1].id) ? entry[1].id : entry[1])
    });
  }
  let strFilter = (strings.length) ? '?' + strings.join('&') : '';
  try {
    const response = await VAPI.get(`/${SERVICE_NAMES.STORY}${strFilter}`);
    if (response && response.status === HTTP_STATUS.OK) {
      commit('setStories', response.data);
    } else if (response && response.status === HTTP_STATUS.NO_CONTENT) {
      commit('setStories', { data: [] })
    } else {
      throw new Error("Response error");
    }
  } catch (e) {
    console.error("An error occurred loading stories: " + e.toString());
  };
}

export default {
  getStoryGeneral,
  updateStoryGeneral,
  removeStoriesFilter,
  setStoriesFilter,
  getStories,
}
