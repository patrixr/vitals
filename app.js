const path            = require('path');
const express         = require('express');
const db              = require('./db');
const passport        = require('passport');
const auth_strategy   = require('./auth_strategy');
const api             = require('./api');
const config          = require('./config');

const app = express();

app.use(passport.initialize());

passport.use(auth_strategy);

// --> Middlewares

function is_initialized() {
  return !!db.get('access_token');
}

function load_data(req, res) {
  if (is_initialized()) {
    return api.fetch_activities()
      .then(() => {
        res && res.json({ ok: true });
      })
      .catch(e => {
        console.error(e);
        res && res.json({
          ok: false,
          error: e
        });
      });
  }

  if (res) {
    res.json({
      ok: false,
      error: 'Uninitialized'
    })
  }
}

const one_time_only = (req, res, next) => {
  if (is_initialized()) {
    const error = 'Already set up';
    return res.status(400).json({ error });
  }
  next();
};

const password_protected = (req, res, next) => {
  const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
  const [login, password] = new Buffer(b64auth, 'base64').toString().split(':');

  if (login === config.LOGIN && password === config.PASSWORD) {
    return next()
  }

  res.set('WWW-Authenticate', 'Basic realm="401"');
  res.status(401).send('Authentication required.');
}

const db_fetch = (key) => {
  return (req, res) => { res.json(db.get(key)) };
}

const fitbit_authenticate = passport.authenticate('fitbit', {
  session: false,
  successRedirect: '/',
  failureRedirect: '/error'
});

// --> API

// -------> Authentication
app.get('/login',     one_time_only,  fitbit_authenticate);
app.get('/callback',  one_time_only,  fitbit_authenticate);

// -------> Data
app.get('/stats', password_protected, db_fetch('stats'));
app.get('/user', password_protected, db_fetch('user'));
app.get('/refresh', password_protected, load_data);

// --> Default error handler
app.use(function (err, req, res, next) {
  console.error(err)
  res.status(500).json({ error: 'Internal error' });
})

// --> Web app
const Bundler     = require('parcel-bundler');
const entryFile   = path.join(__dirname, 'webapp/index.html');
const outDir      = path.join(__dirname, 'dist');
const bundler     = new Bundler(entryFile, { outDir });

app.use('/', password_protected, bundler.middleware());

// --> Start
app.listen(8000, () => {
  console.log('--> Server is running on port 8000');

  //
  // Poll data
  //
  load_data();
  setInterval(load_data, 5 * 60 * 1000)
});