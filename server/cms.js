const config          = require('./config');
const Pocket          = require('pocket-cms');
const requireDir      = require('require-dir');
const _               = require('lodash');

const cms = new Pocket();

(async function () {
  const users = await cms.resource('_users').find({});
  if (users.length === 0) {
    console.log('-----> Creating first admin user');

    await cms.users.create('localAdmin', 'localAdmin', [ 'admins' ]);

    console.log('-----> User localAdmin:localAdmin created');
    console.log('-----> Password should be changed ASAP');
  }
})();

const schemas = requireDir('./schemas');
_.each(schemas, (schema, name) => {
  cms.resource(name, schema);
});

module.exports = cms;