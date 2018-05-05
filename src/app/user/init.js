'use strict'

const User = require('./model')

module.exports = {
  initUser,
  getTopTenUser
}

function initUser (router) {
  router.get('user:profile', '/profile.html', renderUserProfile)

  async function renderUserProfile (ctx) {
    return ctx.render('user/profile')
  }
}

async function getTopTenUser () {
  try {
    const topTenUser = await User.find({}).sort({ point: -1 }).limit(10)
    return topTenUser
  } catch (error) {
    console.log(error)
  }
}
