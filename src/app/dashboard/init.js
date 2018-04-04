'use strict'
const quotes = require('../quotes')
const examsModule = require('../exams')
const usersModule = require('../user')

module.exports = initDashBoard

function initDashBoard (router) {
  router.get('dashboard:math', '/home/:slug', renderMathDashBoard)

  async function renderMathDashBoard (ctx) {
    const slug = ctx.params.slug

    const quote = await quotes.getRandomQuote()
    const exams = await examsModule.getAllExamsBySubject(slug)
    const topTenUser = await usersModule.getTopTenUser()
    console.log(topTenUser)

    return ctx.render('dashboard/dashboard', {
      pageTitle: 'Dashboard',
      quote,
      exams,
      topTenUser
    })
  }
}
