'use strict'

const Exams = require('../exams/model')

module.exports = initAdmin

function initAdmin (router) {
  router.get('/admin/home', renderLoginPage)

  async function renderLoginPage (ctx) {
    const deleleExams = await Exams.find({ state: 0 })
    const publishExams = await Exams.find({ state: true })
    return ctx.render('admin/home', {
      totalDeleleExams: deleleExams.length,
      totalPublishExams: publishExams.length
    })
  }
}
