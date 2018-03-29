'use strict'
const quotes = require('../quotes')

module.exports = initDashBoard

function initDashBoard (router) {
  router.get('dashboard', '/home', renderDashBoard)
  async function renderDashBoard (ctx) {
    const quote = await quotes.getRandomQuote()
    console.log(quote)

    return ctx.render('dashboard/dashboard', {
      pageTitle: 'Dashboard',
      quote
    })
  }
}
