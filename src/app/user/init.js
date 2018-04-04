'use strict'

const User = require('./model')

module.exports = {
  getTopTenUser
}

async function getTopTenUser () {
  try {
    const topTenUser = await User.find({}).sort({ point: -1 }).limit(10)
    return topTenUser
  } catch (error) {
    console.log(error)
  }
}
