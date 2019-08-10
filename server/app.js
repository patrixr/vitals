const path            = require('path');
const express         = require('express');
const passport        = require('passport');
const auth_strategy   = require('./auth_strategy');
const api             = require('./api');
const cms             = require('./cms');
const Sentry          = require('./sentry');

require("./sentry");

const app = express();

// --> Middlewares

app.use(passport.initialize());

passport.use(auth_strategy);

const authenticate = passport.authenticate('fitbit', {
  session: false,
  successRedirect: '/',
  failureRedirect: '/error'
});

const Bundler     = require('parcel-bundler');
const entryFile   = path.join(__dirname, '../webapp/index.html');
const outDir      = path.join(__dirname, '../dist');
const bundler     = new Bundler(entryFile, { outDir });

async function once(req, res, next) {
  if (await api.initialized()) {
    const error = 'Already set up';
    return res.status(400).json({ error });
  }
  next();
}

// --> API

app.use(cms.middleware());

app.get('/login', once, authenticate);
app.get('/callback', once, authenticate);
app.use('/', bundler.middleware());

app.use(function (err, req, res, next) {
  console.error(err)
  Sentry.captureException(err);
  res.status(500).json({ error: 'Internal error' });
})

// --> Poll data
api.startPolling();

app.listen(8000, () => {
  console.log('--> Server is running on port 8000');
});