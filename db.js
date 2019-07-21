const low       = require('lowdb');
const FileSync  = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db.json');
const db = low(adapter);

db.defaults({
  access_token: '',
  refresh_token: '',
  user: {}
}).write();

module.exports = db;