const path = require('path')

const passport = require('koa-passport')
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const knex = require('../knex')

const {passport: {google}} = require(path.resolve(__dirname, '../../config/index'))

const googleStrategy = new GoogleStrategy({
  clientID: google.clientID,
  clientSecret: google.clientSecret,
  callbackURL: google.callbackURL,
  accessType: 'offline',
  prompt: 'consent'
}, verifyUserCredentials)

passport.use(googleStrategy)
passport.serializeUser(persitToStorage)
passport.deserializeUser(loadUserFromStorageToAppContext)

function persitToStorage (email, done) {
  done(null, email)
}

async function loadUserFromStorageToAppContext (email, done) {
  try {
    const user = await knex.select().from('users').where('email', email).first()
    if (!user.email) {
      return done(null, false, {
        message: 'Can not find user'
      })
    }
    return done(null, user)
  } catch (err) {
    if (err.response && err.response.status === 401) {
      return done(null, false, {message: 'No find user'})
    }
    return done(err)
  }
}

async function verifyUserCredentials (token, refreshToken, profile, done) {
  const email = profile.emails[0].value
  const isVnextEmail = /@vnext\..*/gi.test(email)
  if (!isVnextEmail) {
    return done(null, false, {
      message: `Opps!!! ${email} domain is not support.
        Please login with 'email.vnext.vn' or 'email.vnext.com.vn'`
    })
  }
  const username = email.split('@').shift()
  const avatar = profile.photos[0].value
  const user = await findOrCreateUser({username, email, avatar})
  done(null, user.email)
}

module.exports = _ => passport

async function findOrCreateUser ({username, email, avatar}) {
  let user
  user = await knex.select().from('users').where('email', email).first()
  if (!user) {
    user = await knex('users').insert({username, email, avatar})
    if (!user.length) {
      return false
    }
    user = await knex.select().from('users').where('email', email).first()
    return user
  }
  return user
}
