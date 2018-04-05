'use strict'
const News = require('./model')

module.exports = {
  initNews
}

function initNews (router) {
  router.get('get:add:news', '/add-news.html', renderNewsForm)
  router.post('post:add:news', '/add-news', createNews)
  router.get('get:all:news', '/news', getAllNews)

  async function renderNewsForm (ctx) {
    return ctx.render('news/news-add', {
      pageTitle: 'Thêm tin tức mới'
    })
  }

  async function createNews (ctx) {
    const title = ctx.request.body.title
    const description = ctx.request.body.description
    const imageLink = ctx.request.body.imageLink
    const content = ctx.request.body.content
    try {
      const news = await News.create({title, description, imageLink, content})
      ctx.body = {
        success: true,
        message: 'Create news success!!!',
        data: news
      }
      return ctx.body
    } catch (error) {
      ctx.body = {
        success: false,
        message: 'Opp!!! Something went wrong!!!',
        data: error
      }
      return ctx.body
    }
  }

  async function getAllNews (ctx) {
    const news = await News.find({}).sort({ updatedAt: -1 })

    return ctx.render('news/news-list', {
      pageTitle: 'Tin tức - Kênh ôn thi đại học',
      news
    })
  }
}
