const axios     = require('axios').default;
const qs        = require('querystring');
const cms       = require('./cms');
const config    = require('./config');
const moment    = require('moment-timezone');
const _         = require('lodash');
const { cache } = require('./cache');

// Helpers

function savePair(key, value) {
  return {
    to(resource) {
      return cms.resource(resource).upsertOne({ key }, { key, value });
    }
  }
}

async function readString(key) {
  const record = await cms.resource('strings').findOne({ key });
  return _.get(record, 'value') || "";
}

function saveDistance(distance) {
  const res = cms.resource('distances');
  return res.upsertOne({ activity: distance.activity }, distance);
}

/**
 * Fitbit API access class
 *
 * @class API
 */
class API {

  async buildUrl(enpoint) {
    const userId = await this.getProfileId();

    return `https://api.fitbit.com/1/user/${userId}/${enpoint}`;
  }

  /**
   * Fetches the day's summary
   *
   * @returns Promise
   * @memberof API
   */
  async fetchSummary() {
    const initialized = await this.initialized();
    if (!initialized) {
      return null;
    }

    const now       = await this.now();
    const date      = now.format('YYYY-MM-DD');
    const url       = await this.buildUrl(`activities/date/${date}.json`);

    const { data }    = await this.userRequest(url);
    const { summary } = data;

    const tasks = _.compact([
      ..._.map(summary.distances, (d) => saveDistance(d)),
      ..._.map(summary, (val, key) => _.isNumber(val) ? savePair(key, val).to('stats') : null)
    ]);

    return Promise.all(tasks);
  }

  /**
   * Fetches the historical weight records
   *
   * @memberof API
   */
  async fetchWeight() {
    const initialized = await this.initialized();
    if (!initialized) {
      return null;
    }

    const now       = await this.now();
    const resource  = cms.resource('weight')
    const dateTo    = now.format('YYYY-MM-DD');
    const dateFrom  = now.subtract(2, 'months').format('YYYY-MM-DD');
    const url       = await this.buildUrl(`body/log/weight/date/${dateFrom}/${dateTo}.json`);

    const { data: { weight } } = await this.userRequest(url);

    for (let record of weight) {
      const exists = await resource.findOne({ logId: record.logId});
      if (!exists) {
        await resource.create(record);
      }
    }
  }

  /**
   * Fetches the day's heartrate timeline
   *
   * @returns
   * @memberof API
   */
  async fetchHeart() {
    const initialized = await this.initialized();
    if (!initialized) {
      return null;
    }

    const heart = cms.resource('heartbeat');
    const url = await this.buildUrl(`activities/heart/date/today/1d/1min.json`);

    const { data } = await this.userRequest(url);

    await heart.remove({}, { multi: true });

    const tasks = _.chain(data)
      .get('activities-heart-intraday.dataset')
      .map(obj => heart.create(obj))
      .value();

    return Promise.all(tasks);
  }

  /**
   * Fetches all the different data types
   *
   * @returns
   * @memberof API
   */
  fetchAllActivities() {
    return Promise.all([
      this.fetchHeart(),
      this.fetchSummary(),
      this.fetchWeight()
    ]);
  }

  /**
   * Builds the Basic auth token for oauth refresh
   *
   * @readonly
   * @memberof API
   */
  get basicAuthToken() {
    return Buffer
      .from(`${config.CLIENT_ID}:${config.CLIENT_SECRET}`)
      .toString('base64');
  }

  /**
   * Fetches the api access token from the db
   *
   * @returns {String}
   * @memberof API
   */
  async getAccessToken() {
    const strings = cms.resource('strings');
    const record  = await strings.findOne({ key: 'access_token' });

    return _.get(record, 'value');
  }

  /**
   * Returns the user proffile
   *
   * @returns {Profile}
   * @memberof API
   */
  async getProfile() {
    const profiles = await cms.resource('profiles').findAll({ limit: 1 });
    return profiles[0];
  }

  /**
   * Get the user time zone
   *
   * @returns {String}
   * @memberof API
   */
  async getTimezone() {
    return cache('timezone', async () => {
      return (await this.getProfile()).timezone;
    });
  }

  /**
   * Get the fitbit user's ID
   *
   * @returns {String}
   * @memberof API
   */
  async getProfileId() {
    return cache('encodedId', async () => {
      return (await this.getProfile()).encodedId;
    });
  }

  /**
   * Returns a moment with the proffile's correct timezone
   *
   * @returns
   * @memberof API
   */
  async now() {
    const tz = await this.getTimezone();

    return moment().tz(tz);
  }

  /**
   * Returns true if the connection to fitbit api has been established
   *
   * @returns {Boolean}
   * @memberof API
   */
  async initialized() {
    return !!(await this.getAccessToken());
  }

  /**
   * Make an authenticated ajax GET
   *
   * @param {*} url
   * @returns
   * @memberof API
   */
  async userRequest(url) {
    const headers = { 'authorization': `Bearer ${await this.getAccessToken()}` };
    const method  = "GET";

    return this.request({ url, method, headers });
  }

  /**
   * Ajax request wrapper, will refresh token and retry if expired
   *
   * @param {*} options
   * @param {boolean} [retry=true]
   * @returns
   * @memberof API
   */
  async request(options, retry = true) {
    try {
      return await axios(
        _.extend({}, options)
      );
    } catch (e) {
      if (e.response.status === 401 && retry) {
        await this.refresh_token();
        return this.request(options, false);
      }
      console.error(e);
      throw e;
    }
  }

  /**
   * Refresh the access token
   *
   * @memberof API
   */
  async refresh_token() {
    const url = 'https://api.fitbit.com/oauth2/token';

    if (this._refresh) {
      return this._refresh;
    }

    this._refresh = axios({
      method: 'POST',
      headers: {
        'authorization': `Basic ${this.basicAuthToken}`,
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: qs.stringify({
        grant_type:     'refresh_token',
        refresh_token:  await readString('refresh_token'),
        expires_in:     31536000
      }),
      url
    }).then(async (data) => {
      const { access_token, refresh_token } = data;

      await savePair('access_token', access_token).to('strings');
      await savePair('refresh_token', refresh_token).to('strings');
      this.refreshPromise = null;
    })
    .catch((e) => {
      this.refreshPromise = null
      throw e;
    });
  }

  /**
   * Poll data from fitbit at a preset interval
   *
   * @returns
   * @memberof API
   */
  startPolling() {
    const min   = 60 * 1000;
    const hour  = 60 * min;

    if (this._polls) {
      return;
    }

    this.fetchAllActivities();
    this.polls = [
      setInterval(() => this.fetchHeart(), 5 * min),
      setInterval(() => this.fetchSummary(), 5 * min),
      setInterval(() => this.fetchWeight(), 24 * hour),
    ];
  }

  /**
   * Stop polling data
   *
   * @memberof API
   */
  stopPolling() {
    _.each(this.polls, clearInterval);
    this.polls = null;
  }
};

module.exports =  new API();