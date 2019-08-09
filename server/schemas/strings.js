const Pocket      = require('pocket-cms');
const { Schema }  = Pocket;

module.exports = new Schema({
	additionalProperties: false,
	fields: {
		key: {
      type: 'string',
      required: true,
      index: {
        unique: true
      }
		},
		value: {
			type: 'string'
		}
	}
});
