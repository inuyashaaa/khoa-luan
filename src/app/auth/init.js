'use strict'

module.exports = initAuth

function initAuth (router, passport) {
  const redirectToGooglePageLogin = passport.authenticate('google', {
    scope: ['email'],
    accessType: 'offline',
    prompt: 'consent'
  })
  const postGoogleLoginHandler = passport.authenticate('google', {
    successRedirect: '/home',
    failureRedirect: '/',
    failureFlash: 'Đăng nhập không thành công',
    successFlash: 'Bạn đã đăng nhập thành công'
  })
  const passportLoginLocal = passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/',
    failureFlash: 'Đăng nhập không thành công',
    successFlash: 'Bạn đã đăng nhập thành công'
  })

  router.post('login', '/login', redirectToDaskboadIfAuthenticated, passportLoginLocal)
  router.get('logout', '/logout', doLogout)
  router.get('auth:google', '/auth/google',
    redirectToDaskboadIfAuthenticated,
    redirectToGooglePageLogin
  )
  router.get('auth:google:callback', '/auth/google/callback',
    redirectToDaskboadIfAuthenticated,
    postGoogleLoginHandler
  )

  // function displayLoginForm (ctx) {
  //   if (ctx.isAuthenticated()) {
  //     return ctx.redirect('/')
  //   }
  //   const {message = undefined} = Object.assign({}, ctx.session.flash)
  //   if (ctx.session.flash && ctx.session.flash.message) {
  //     delete ctx.session.flash.message
  //   }
  //   return ctx.render('home/home', {
  //     errorMessage: message
  //   })
  // }

  function doLogout (ctx) {
    ctx.logout()
    ctx.redirect('/')
  }

  async function redirectToDaskboadIfAuthenticated (ctx, next) {
    if (ctx.isAuthenticated()) return ctx.redirect('/home/math')
    return next()
  }
}
