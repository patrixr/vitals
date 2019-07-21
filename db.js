const low       = require('lowdb');
const FileSync  = require('lowdb/adapters/FileSync');

const file = process.env.NODE_ENV === "production"
  ? '/opt/vitals/db.json'
  : 'db.json';

const adapter = new FileSync(file);
const db = low(adapter);

db.defaults({
  access_token: '',
  refresh_token: '',
  user: {},
  stats: {}
}).write();

module.exports = db;