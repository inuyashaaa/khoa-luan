'use strict'

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
module.exports = Object.freeze({
  db: {
    host: process.env.DB_HOST || 'mongodb://localhost/koa-web'
  },
  app: {
    port: parseInt(process.env.PORT) || 3000
  },
  passport: {
    google: {
      clientID: process.env.GOOGLE_OAUTH2_CLIENT_ID,
      clientSecret: process.env.GOOGLE_OAUTH2_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_OAUTH2_CALLBACKURL
    }
  },
  cookie: {
    signKeys: process.env.COOKIE_SIGN_KEY
  }
})
