'use strict'

module.exports = initHomePage

function initHomePage (router) {
  router.get('/', renderHomePage)

  async function renderHomePage (ctx) {
    return ctx.render('get:home', 'home/home', {
      pageTitle: 'Ôn thi đại học trực tuyến miễn phí'
    })
  }
}
