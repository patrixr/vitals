const axios   = require('axios').default;
const qs      = require('querystring');
const db      = require('./db');
const config  = require('./config');
const moment  = require('moment-timezone');
const _       = require('lodash');


const DATA_POINTS = {
  ACTIVITY: user => {
    const date = moment().tz(user.timezone).format('YYYY-MM-DD');
    return `activities/date/${date}.json`;
  },

  WEIGHT: user => {
    const date_to = moment().tz(user.timezone).format('YYYY-MM-DD');
    const date_from = moment().tz(user.timezone).subtract(1, 'month').format('YYYY-MM-DD');
    return `body/log/weight/date/${date_from}/${date_to}.json`;
  },

  FAT_PCT: user => {
    const date_to = moment().tz(user.timezone).format('YYYY-MM-DD');
    const date_from = moment().tz(user.timezone).subtract(1, 'month').format('YYYY-MM-DD');
    return `body/log/fat/date/${date_from}/${date_to}.json`;
  },

  HEART: user => {
    const now = moment().tz(user.timezone);
    return `activities/heart/date/today/1d/1min.json`;
  }
}

class API {

  async fetch_activities() {
    let res = {};
    const data_sets = await Promise.all(
      _.map(DATA_POINTS, (url_builder, name) => {
        const url = `https://api.fitbit.com/1/user/${this.user_id}/${url_builder(this.user)}`;
        const method = 'GET';
        const headers = { 'authorization': `Bearer ${this.bearer_token}` };
        return this.request({ url, method, headers });
      })
    );

    _.each(data_sets, ({ data }) => _.extend(res, data));

    res.update_at = Date.now();
    db.set('stats', res);
    db.sync();

    return res;
  }

  get basic_auth_token() {
    return Buffer
      .from(`${config.CLIENT_ID}:${config.CLIENT_SECRET}`)
      .toString('base64');
  }

  get bearer_token() {
    return db.get('access_token');
  }

  get user() {
    return db.get('user');
  }

  get user_id() {
    return this.user.encodedId;
  }

  async request(options, retry = true) {
    try {
      return await axios(options);
    } catch (e) {
      if (e.response.status === 401 && retry) {
        await this.refresh_token();
        return this.request(options, false);
      }
      console.error(e);
      throw e;
    }
  }

  async refresh_token() {
    const url = 'https://api.fitbit.com/oauth2/token';
    const { data } = await axios({
      method: 'POST',
      headers: {
        'authorization': `Basic ${this.basic_auth_token}`,
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: qs.stringify({
        grant_type: 'refresh_token',
        refresh_token: db.get('refresh_token'),
        expires_in: 31536000
      }),
      url
    });

    const { access_token, refresh_token } = data;
    db.set('access_token', access_token);
    db.set('refresh_token', refresh_token);
    db.sync();
  }
};

module.exports =  new API();