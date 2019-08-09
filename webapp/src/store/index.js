import Vue            from "vue";
import Vuex           from "vuex";
import _              from "lodash";
import axios          from "axios";
import moment         from "moment-timezone";
import h              from "./helpers";

Vue.use(Vuex);

// ---- Store

export default new Vuex.Store({
  state: {
    authToken: localStorage.getItem('authToken'),
    profiles:   [],
    weight:     [],
    heartbeat:  [],
    stats:      [],
    distances:  []
  },
  getters: {
    authToken:        h.getter('authToken'),
    distances:        h.getter('distances'),
    heartbeat:        h.getter('heartbeat', []),
    stats:            h.toMap('stats'),
    bodyHistory:      h.getter('weight', []),
    body:             h.last('weight'),
    oldestBodyRecord: h.first('weight'),
    user:             h.first('profiles'),
    firstHeartRate:   h.first('heartbeat'),
    lastHeartRate:    h.last('heartbeat'),

    now(state, getters) {
      const tz = _.get(getters, 'user.timezone');
      if (!tz) {
        return moment();
      }
      return moment().tz(tz);
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
      return Math.ceil(getters.heartbeat.length / 60)
    }
  },
  actions: {
    fetchProfiles:  h.load('profiles').andCommit('setProfiles'),
    fetchStats:     h.load('stats').andCommit('setStats'),
    fetchWeight:    h.load('weight').andCommit('setWeight'),
    fetchDistances: h.load('distances').andCommit('setDistances'),
    fetchHeartbeat: h.load('heartbeat').andCommit('setHeartbeat'),

    fetchAll({ dispatch }) {
      return Promise.all([
        dispatch('fetchProfiles'),
        dispatch('fetchStats'),
        dispatch('fetchWeight'),
        dispatch('fetchDistances'),
        dispatch('fetchHeartbeat')
      ])
    },

    async login(ctx, credentials) {
      const { data: { token } } = await axios({
        url: '/users/login',
        method: 'POST',
        data: credentials
      })
      ctx.commit('setAuthToken', token);
    }
  },
  mutations: {
    setProfiles:   h.setter('profiles'),
    setStats:      h.setter('stats'),
    setWeight:     h.setter('weight'),
    setDistances:  h.setter('distances'),
    setHeartbeat:  h.setter('heartbeat'),
    setAuthToken:  h.setter('authToken', { persist: true })
  }
});