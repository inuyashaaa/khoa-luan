'use strict'

const Exams = require('../exams/model')
const News = require('../news/model')

module.exports = initAdmin

function initAdmin (router) {
  router.get('get:admin', '/admin/home', renderAdminHomePage)
  router.get('/admin/exams-list.html', renderListExams)
  router.get('/admin/news-list.html', renderListNews)
  async function renderAdminHomePage (ctx) {
    const deleleExams = await Exams.find({ state: 0 })
    const publishExams = await Exams.find({ state: true })
    const deleteNews = await News.find({ state: false })
    const publishNews = await News.find({ state: true })
    return ctx.render('admin/home', {
      totalDeleleExams: deleleExams.length,
      totalPublishExams: publishExams.length,
      totalDeleleNews: deleteNews.length,
      totalPublishNews: publishNews.length
    })
  }

  async function renderListExams (ctx) {
    const exams = await Exams.find({})

    return ctx.render('admin/exams-list', {
      exams
    })
  }
  async function renderListNews (ctx) {
    const newsList = await News.find({})

    return ctx.render('admin/news-list', {
      newsList
    })
  }
}
