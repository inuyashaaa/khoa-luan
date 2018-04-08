'use strict'

const path = require('path')

const passport = require('koa-passport')
const bcrypt = require('bcrypt')

const User = require('../user/model')
const LocalStrategy = require('passport-local').Strategy
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy

const {passport: {google}} = require(path.resolve(__dirname, '../../config/index'))

const googleStrategy = new GoogleStrategy({
  clientID: google.clientID,
  clientSecret: google.clientSecret,
  callbackURL: google.callbackURL,
  accessType: 'offline',
  prompt: 'consent'
}, verifyUserCredentials)

passport.use(new LocalStrategy(
  function (username, password, done) {
    User.findOne({ email: username }, (err, user) => {
      if (err) {
        return
      }
      if (user) {
        bcrypt.compare(password, user.password, (err, same) => {
          if (err) {
            return
          }
          if (same) {
            return done(null, user)
          } else {
            return done(null, false)
          }
        })
      }
    })
  })
)
passport.use(googleStrategy)
passport.serializeUser(persitToStorage)
passport.deserializeUser(loadUserFromStorageToAppContext)

function persitToStorage (user, done) {
  done(null, user.email)
}

async function loadUserFromStorageToAppContext (email, done) {
  try {
    User.findOne({ email: email }, (err, user) => {
      if (err) {
        return done(null, false, {
          message: 'Opp!!! Sonething went wrong!'
        })
      }
      if (!user.email) {
        return done(null, false, {
          message: 'Can not find user'
        })
      }
      return done(null, user)
    })
  } catch (err) {
    if (err.response && err.response.status === 401) {
      return done(null, false, {message: 'No find user'})
    }
    return done(err)
  }
}

async function verifyUserCredentials (token, refreshToken, profile, done) {
  const email = profile.emails[0].value
  User.findOne({ email: email }, (error, user) => {
    if (error) return 0
    if (user) {
      return done(null, user)
    }
    const newUser = {
      username: profile.displayName !== '' ? profile.displayName : profile.id,
      email: profile.emails[0].value,
      avatar: profile.photos ? profile.photos[0].value : '/images/default-avatar.png',
      password: 12345678
    }
    User.findOne({})
      .select('id')
      .sort({ id: -1 })
      .exec((err, doc) => {
        if (err) {
          console.log(err)
        } else {
          let id
          if (doc && doc.id) {
            id = doc.id + 1
          } else {
            id = 1
          }
          newUser.id = id
          User.create(newUser, (err, doc) => {
            if (err) {
              console.log(err)
            } else {
              return done(null, doc)
            }
          })
        }
      })
  })
}

module.exports = _ => passport
