'use strict'
const path = require('path')

const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const createStaticServeMiddleware = require('koa-static')

const app = new Koa()
const router = new Router()
const views = initViews({ router })
const staticServeMiddleware = createStaticServeMiddleware(
  path.resolve(__dirname, '../public')
)

const homeModule = require(path.resolve(__dirname, './home'))

// Init Router
homeModule.init(router)

app
  .use(staticServeMiddleware)
  .use(views)
  .use(router.routes())
  .use(router.allowedMethods())

module.exports = app

function initViews ({ router }) {
  const nunjucks = require('nunjucks')
  const createViews = require('koa-views')
  const dateFilter = require('nunjucks-date-filter-local')
  const viewDirPath = __dirname
  const env = new nunjucks.Environment(
    new nunjucks.FileSystemLoader(viewDirPath)
  )
  dateFilter.setDefaultFormat('YYYY/MM/DD')
  env.addGlobal('router', router)
  env.addFilter('date', dateFilter)

  return createViews(viewDirPath, {
    map: { html: 'nunjucks' },
    options: {
      nunjucksEnv: env
    }
  })
}
