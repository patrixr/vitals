const Pocket      = require('pocket-cms');
const { Schema }  = Pocket;

module.exports = new Schema({
	additionalProperties: false,
	fields: {
		time: {
      type: 'string',
      required: true
		},
		value: {
			type: 'number',
			required: true
		}
	}
});
