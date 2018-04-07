'use strict'

module.exports = {
  isCurrentRouteMiddleware
}

async function isCurrentRouteMiddleware (ctx, next) {
  ctx.state.isCurrentRoute = routerName => ctx.routerName === routerName
  return next()
}
