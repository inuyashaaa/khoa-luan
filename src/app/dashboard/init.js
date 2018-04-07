'use strict'
const quotes = require('../quotes')
const examsModule = require('../exams')
const usersModule = require('../user')

module.exports = initDashBoard

function initDashBoard (router) {
  router.get('dashboard', '/home', renderDashBoard)
  router.get('dashboard:subject', '/home/:slug', renderMathDashBoard)

  async function renderDashBoard (ctx) {
    return ctx.render('dashboard/dashboard', {
      pageTitle: 'Ôn thi đại học trực tuyến miễn phí - Ôn thi đại học trược tuyến'
    })
  }

  async function renderMathDashBoard (ctx) {
    const slug = ctx.params.slug

    const quote = await quotes.getRandomQuote()
    const exams = await examsModule.getAllExamsBySubject(slug)
    const topTenUser = await usersModule.getTopTenUser()

    return ctx.render('dashboard/dashboard-subjects', {
      pageTitle: 'Ôn thi đại học trực tuyến - Cộng đồng giúp đỡ nhau ôn thi đại học',
      quote,
      exams,
      topTenUser
    })
  }
}
