const Pocket      = require('pocket-cms');
const _           = require('lodash');
const { Schema }  = Pocket;

const fields = {
  age: 'number',
  avatar: 'string',
  avatar150: 'string',
  avatar640: 'string',
  averageDailySteps: 'number',
  dateOfBirth: 'date',
  displayName: 'string',
  height: 'number',
  heightUnit: 'string',
  locale: 'string',
  timezone: 'string',
  topBadges: 'array',
  encodedId: {
    type: 'string',
    index: { unique: true }
  }
};

const profile = new Schema({
	additionalProperties: false,
	fields: fields
});

const allowedKeys = _.keys(fields);

profile.before("validate", async ({ record }, ctx) => {
  _.each(record, (val, key) => {
    if (!/^_/.test(key) && !_.includes(allowedKeys, key)) {
      delete record[key];
    }
  });
});

module.exports = profile;