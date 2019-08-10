const Sentry = require('@sentry/node');
const config = require('./config');

Sentry.init({ dsn: config.SENTRY_DSN });

module.exports = Sentry;