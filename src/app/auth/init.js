'use strict'

const User = require('../user/model')

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
    failureRedirect: '/'
  })

  router.post('login', '/login',
    redirectToDaskboadIfAuthenticated,
    passportLoginLocal,
    handleSuccessLogin
  )
  router.get('logout', '/logout', doLogout)
  router.get('auth:google', '/auth/google',
    redirectToDaskboadIfAuthenticated,
    redirectToGooglePageLogin
  )
  router.get('auth:google:callback', '/auth/google/callback',
    redirectToDaskboadIfAuthenticated,
    postGoogleLoginHandler
  )
  router.post('signup', '/signup', createNewUser)

  async function createNewUser (ctx) {
    try {
      const newUser = {
        username: ctx.request.body.username,
        email: ctx.request.body.email,
        password: ctx.request.body.password
      }
      const lastUser = await User.findOne({}).select('id').sort({ id: -1 })
      let id = 1
      if (lastUser && lastUser.id) {
        id = lastUser.id + 1
      }
      newUser.id = id
      const user = await User.create(newUser)
      ctx.body = {
        success: true,
        message: 'Create user done!!!',
        data: user
      }
      return ctx.body
    } catch (error) {
      ctx.body = {
        success: false,
        message: 'Opp!!! Something went wrong!!!',
        data: error
      }
      return ctx.body
    }
  }

  function doLogout (ctx) {
    ctx.logout()
    ctx.redirect('/')
  }

  async function handleSuccessLogin (ctx) {
    ctx.body = {
      success: true,
      message: 'Đăng nhập thành công!!!',
      data: 'Đăng nhập thành công!!!'
    }
    return ctx.body
  }

  async function redirectToDaskboadIfAuthenticated (ctx, next) {
    if (ctx.isAuthenticated()) return ctx.redirect('/home')
    return next()
  }
}
