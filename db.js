const JSONdb       = require('simple-json-db');

const file = process.env.NODE_ENV === "production"
  ? '/opt/vitals/db.json'
  : 'db.json';

const db = new JSONdb(file, {
  syncOnWrite: false,
  asyncWrite: false
});

module.exports = db;