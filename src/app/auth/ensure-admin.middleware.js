'use strict'

module.exports = function ensureAdminMiddleware (ctx, next) {
  if (ctx.state.user.isAdmin) return next()
  return ctx.redirect('/')
}
