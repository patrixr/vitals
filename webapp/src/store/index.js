import Vue            from "vue";
import Vuex           from "vuex";
import axios          from "axios";
import _              from "lodash";
import moment         from "moment-timezone"

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
    bodyHistory:      getter('stats.weight', []),
    fat:              getter('stats.fat'),
    heartbeatHistory: getter('stats.activities-heart-intraday.dataset', []),
    user:             getter('user'),

    now(state) {
      const tz = _.get(state, 'user.timezone');
      if (!tz) {
        return moment();
      }
      return moment().tz(tz);
    },

    body(state, getters) {
      return _.last(getters.bodyHistory);
    },

    oldestBodyRecord(state, getters) {
      return _.first(getters.bodyHistory);
    },

    lastUpdate(state, getters) {
      let lastHeartRate = getters.lastHeartRate;
      let m = getters.now;

      if (!lastHeartRate) {
        return null;
      }

      const { time } = lastHeartRate;
      const [ hour, minute ] = time.split(':');
      m.set({ hour, minute });
      return m.toDate();
    },

    heartHistoryDuration(state, getters) {
      return Math.ceil(getters.heartbeatHistory.length / 60)
    },

    lastHeartRate(state) {
      return _.last(
        _.get(state, 'stats.activities-heart-intraday.dataset')
      );
    },

    firstHeartRate(state) {
      return _.first(
        _.get(state, 'stats.activities-heart-intraday.dataset')
      );
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