'use strict'
const News = require('./model')
const isAdminMiddleWare = require('../auth/ensure-admin.middleware')

module.exports = {
  initNews
}

function initNews (router) {
  router.get('get:add:news', '/add-news.html', isAdminMiddleWare, renderNewsForm)
  router.get('get:all:news', '/news', getAllNews)
  router.get('get:all:keyed', '/keyed', getAllKeyed)
  router.get('get:detail:news', '/news/:slug', getDetailNews)
  router.get('get:edit:news', '/news/edit/:slug', isAdminMiddleWare, getEditNews)
  router.post('post:add:news', '/add-news.html', createNews)
  router.post('post:edit:news', '/news/edit', updateNews)
  router.get('get:delete:news', '/news/delete/:id', deleteNews)

  async function renderNewsForm (ctx) {
    return ctx.render('news/news-add', {
      pageTitle: 'Thêm tin tức mới - Thidaihoc.online'
    })
  }

  async function createNews (ctx) {
    const title = ctx.request.body.title
    const slug = ctx.request.body.slug
    const description = ctx.request.body.description
    const imageLink = ctx.request.body.imageLink
    const content = ctx.request.body.content
    let isNews = ctx.request.body.isNews
    if (!isNews) {
      isNews = 1
    }
    try {
      const news = await News.create({ title, slug, description, imageLink, content, isNews, state: 1 })
      ctx.body = {
        success: true,
        message: 'Create news success!!!',
        data: news
      }
      return ctx.redirect(`/news/${slug}`)
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
    const news = await News.find({ isNews: 1 }).sort({ updatedAt: -1 })

    return ctx.render('news/news-list', {
      pageTitle: 'Tin tức - Kênh ôn thi đại học',
      news
    })
  }

  async function getAllKeyed (ctx) {
    const news = await News.find({ isNews: 0 }).sort({ updatedAt: -1 })

    return ctx.render('news/news-list', {
      pageTitle: 'Bí kíp mùa thi - Kênh ôn thi đại học',
      news
    })
  }

  async function getDetailNews (ctx) {
    const slug = ctx.params.slug
    const news = await News.findOne({ slug: slug })

    return ctx.render('news/news-detail', {
      pageTitle: news.title,
      news
    })
  }
  async function getEditNews (ctx) {
    const slug = ctx.params.slug
    const news = await News.findOne({ slug: slug })

    return ctx.render('news/news-edit', {
      pageTitle: news.title,
      news
    })
  }
  async function updateNews (ctx) {
    const idNews = ctx.request.body.idNews
    const title = ctx.request.body.title
    const slug = ctx.request.body.slug
    const description = ctx.request.body.description
    const imageLink = ctx.request.body.imageLink
    const content = ctx.request.body.content
    let isNews = ctx.request.body.isNews
    if (!isNews) {
      isNews = 1
    }
    try {
      const news = await News.update({ _id: idNews }, { title, slug, description, imageLink, content, isNews })
      ctx.body = {
        success: true,
        message: 'Update news success!!!',
        data: news
      }
      return ctx.redirect(`/news/${slug}`)
    } catch (error) {
      ctx.body = {
        success: false,
        message: 'Opp!!! Something went wrong!!!',
        data: error
      }
      return ctx.body
    }
  }
  async function deleteNews (ctx) {
    const idNews = ctx.params.id
    try {
      const news = await News.deleteOne({ _id: idNews })
      ctx.body = {
        success: true,
        message: 'Update news success!!!',
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
}
