import Vue            from "vue";
import Vuex           from "vuex";
import axios          from "axios";
import _              from "lodash";

Vue.use(Vuex);

// ---- Helpers

function apiAction(url, mutator) {
  return async ({ commit }) => {
    const { data } = await axios.get(url);
    commit(mutator, data);
    return data
  };
}

function getter(key, defaultValue) {
  return (state) => {
    return _.get(state, key) || defaultValue;
  };
}

function setter(key) {
  return (state, data) => {
    state[key] = data;
  }
}

// ---- Store

export default new Vuex.Store({
  state: {
    stats: {},
    user: {}
  },
  getters: {
    summary:          getter('stats.summary'),
    weight:           getter('stats.weight'),
    fat:              getter('stats.fat'),
    heartbeatHistory: getter('stats.activities-heart-intraday'),
    user:             getter('user'),

    updatedAt(state) {
      return new Date(state.stats.update_at);
    }
  },
  actions: {
    fetchUser:  apiAction('/user', 'setUser'),
    pollData:   apiAction('/stats', 'setStats')
  },
  mutations: {
    setStats: setter('stats'),
    setUser:  setter('user')
  }
});