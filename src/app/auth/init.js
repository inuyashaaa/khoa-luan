'use strict'

module.exports = initAuth

function initAuth (router, passport) {
  const redirectToGooglePageLogin = passport.authenticate('google', {
    scope: ['email'],
    accessType: 'offline',
    prompt: 'consent'
  })
  const postGoogleLoginHandler = passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/login.html',
    failureFlash: true
  })

  router.get('login', '/login.html', redirectToDaskboadIfAuthenticated, displayLoginForm)
  router.get('/logout', doLogout)
  router.get('/auth/google',
    redirectToDaskboadIfAuthenticated,
    redirectToGooglePageLogin
  )
  router.get('/auth/google/callback',
    redirectToDaskboadIfAuthenticated,
    postGoogleLoginHandler
  )

  function displayLoginForm (ctx) {
    if (ctx.isAuthenticated()) {
      return ctx.redirect('/')
    }
    const {message = undefined} = Object.assign({}, ctx.session.flash)
    if (ctx.session.flash && ctx.session.flash.message) {
      delete ctx.session.flash.message
    }
    return ctx.render('auth/login', {
      errorMessage: message
    })
  }

  function doLogout (ctx) {
    ctx.logout()
    ctx.redirect('/login.html')
  }

  async function redirectToDaskboadIfAuthenticated (ctx, next) {
    if (ctx.isAuthenticated()) return ctx.redirect('/')
    return next()
  }
}
