import axios  from 'axios';
import _      from 'lodash';

export default {
  load(name) {
    return {
      andCommit(mutator) {
        return async ({ commit, getters }) => {
          const { data } = await axios.get(`/rest/${name}`, {
            headers: { 'authorization': `Bearer ${getters.authToken}` }
          });
          commit(mutator, data);
          return data
        };
      }
    };
  },

  getter(key, defaultValue) {
    return (state) => {
      return _.get(state, key) || defaultValue;
    };
  },

  setter(key, opts = { persist: false }) {
    return (state, data) => {
      state[key] = data;
      if (opts && opts.persist) {
        localStorage.setItem(key, data);
      }
    }
  },

  last(key) {
    return (state) => _.last(state[key]);
  },

  first(key) {
    return (state) => _.first(state[key]);
  },

  toMap(key) {
    return (state) => {
      return _.reduce(state[key], (map, obj) => {
        map[obj.key] = obj.value;
        return map;
      }, {})
    };
  }
}