'use strict'
const path = require('path')

const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const mongoose = require('mongoose')
const logger = require('koa-logger')
const createStaticServeMiddleware = require('koa-static')
const createSessionMiddleware = require('koa-session')

const config = require(path.resolve(__dirname, '../config'))
const homeModule = require(path.resolve(__dirname, './home'))
const authModule = require(path.resolve(__dirname, './auth'))
const dashboardModule = require(path.resolve(__dirname, './dashboard'))
const quoteModule = require(path.resolve(__dirname, './quotes'))
const examsModule = require(path.resolve(__dirname, './exams'))
const uploadModule = require(path.resolve(__dirname, './upload'))
const newsModule = require(path.resolve(__dirname, './news'))
const chatModule = require(path.resolve(__dirname, './chat'))
const { isCurrentRouteMiddleware } = require(
  path.resolve(__dirname, './_layout')
)
const { cookie: { signKeys } } = config
const app = new Koa()
const router = new Router()
const publicRouter = new Router()
const views = initViews({ router })
const staticServeMiddleware = createStaticServeMiddleware(
  path.resolve(__dirname, '../public')
)
const sessionMiddleware = createSessionMiddleware({ maxAge: 2592000000, renew: true }, app)
mongoose.connect(config.db.host, (err) => {
  if (err) {
    console.log(err)
  } else {
    console.log('Connect DB success !')
  }
})

router
  .use(authModule.ensureLoginMiddleware)
  .use(isCurrentRouteMiddleware)
const passport = authModule.initAuthStrategies()
// Init Router
homeModule.init(publicRouter)
authModule.init(publicRouter, passport)
dashboardModule.init(router)
quoteModule.init(router)
examsModule.init(router)
uploadModule.init(router)
newsModule.init(router)
chatModule.init(router)

app.proxy = true
app.keys = signKeys.split(',')
app
  .use(logger())
  .use(flashMiddleware)
  .use(staticServeMiddleware)
  .use(sessionMiddleware)
  .use(bodyParser())
  .use(views)
  .use(passport.initialize())
  .use(passport.session())
  .use(router.routes())
  .use(router.allowedMethods())
  .use(publicRouter.routes())
  .use(publicRouter.allowedMethods())

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
  env.addGlobal('publicRouter', publicRouter)
  env.addFilter('date', dateFilter)

  return createViews(viewDirPath, {
    map: { html: 'nunjucks' },
    options: {
      nunjucksEnv: env
    }
  })
}

function flashMiddleware (ctx, next) {
  ctx.flash = function (type, msg) {
    ctx.session.flash = { type: type, message: msg }
  }
  return next()
}
