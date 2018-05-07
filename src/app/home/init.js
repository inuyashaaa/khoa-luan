'use strict'

module.exports = initHomePage

function initHomePage (router) {
  router.get('get:home', '/', renderHomePage)

  async function renderHomePage (ctx) {
    return ctx.render('home/home', {
      pageTitle: 'Ôn thi đại học trực tuyến miễn phí'
    })
  }
}
