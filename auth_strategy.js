const db              = require('./db');
const config          = require('./config');
const FitbitStrategy  = require( 'passport-fitbit-oauth2' ).FitbitOAuth2Strategy;

module.exports = new FitbitStrategy({
  clientID: config.CLIENT_ID,
  clientSecret: config.CLIENT_SECRET,
  scope: [
    'sleep',
    'weight',
    'activity',
    'heartrate',
    'location',
    'profile',
    'nutrition',
    'social'
  ],
  callbackURL: (
    /prod/.test(process.env.NODE_ENV) ?
      "https://vitals.tronica.io/callback" :
      "http://localhost:8000/callback"
  )
}, function(access_token, refresh_token, profile, done) {

  db.set('access_token', access_token).value();
  db.set('refresh_token', refresh_token).value();
  db.set('user', profile._json.user).value();
  db.set('user_id', profile.id).value();
  db.set('display_name', profile.displayName).value();
  db.write();
  done(null, {
    accessToken: access_token,
    refreshToken: refresh_token,
    profile: profile
  });
});