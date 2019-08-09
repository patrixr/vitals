const cms             = require('./cms');
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
}, async function(access_token, refresh_token, profile, done) {

  const strings   = cms.resource('strings');
  const profiles  = cms.resource('profiles');

  const savePair = ([key, value]) => strings.upsertOne({ key }, { key, value });

  const toSave = [
    ['access_token', access_token],
    ['refresh_token', refresh_token],
    ['user_id', profile.id],
    ['display_name', profile.displayName]
  ];

  const encodedId = profile.id;

  const promises = [
    ...toSave.map(savePair),
    profiles.upsertOne({ encodedId }, profile._json.user)
  ];

  await Promise.all(promises);

  done(null, {
    accessToken:  access_token,
    refreshToken: refresh_token,
    profile:      profile
  });
});