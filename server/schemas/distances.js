const Pocket      = require('pocket-cms');
const { Schema }  = Pocket;

// e.g {
//   activity: "total",
//   distance: 1.46
// }
module.exports = new Schema({
	additionalProperties: false,
	fields: {
		activity: {
      type: 'string',
      required: true,
      index: {
        unique: true
      }
		},
		distance: {
			type: 'number'
		}
	}
});