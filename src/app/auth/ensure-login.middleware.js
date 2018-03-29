'use strict'

module.exports = function ensureLoginMiddleware (ctx, next) {
  if (ctx.isAuthenticated()) return next()
  return ctx.redirect('/')
}
