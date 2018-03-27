'use strict'
const path = require('path')

module.exports = {
  initAuthStrategies: require(path.resolve(__dirname, './strategies-init')),
  init: require(path.resolve(__dirname, './init')),
  ensureLoginMiddleware: require(path.resolve(__dirname, './ensure-login.middleware'))
}
