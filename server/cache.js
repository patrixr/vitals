const cache = {};

module.exports = {
  /**
   * Wraps the function, allowing only the first call to go through. Any subsequent call will use the cached result
   *
   * @param {*} func
   * @returns
   */
  once(func) {
    let result = null;
    let called = false;
    return function(...args) {
      if (!called) {
        result = func.apply(this, args);
        called = true;
      }
      return result;
    };
  },

  async cache(key, func, ...args) {
    if (cache[key]) {
      return cache[key];
    }

    const result = await func(...args);
    cache[key] = result;
    return result;
  }
};