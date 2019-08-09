const Pocket      = require('pocket-cms');
const { Schema }  = Pocket;

// e.g
// bmi: 23.31
// date: "2019-07-05"
// fat: 21.882999420166016
// logId: 1562312805000
// source: "Aria"
// time: "07:46:45"
// weight: 71.4

module.exports = new Schema({
	additionalProperties: false,
	fields: {
		date: 'date',
    fat: 'number',
    bmi: 'number',
    weight: 'number',
    source: 'string',
    time: 'string',
    logId: {
      type: 'number',
      index: { unique: true }
    }
	}
});
