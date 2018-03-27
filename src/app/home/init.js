'use strict'

module.exports = initHomePage

function initHomePage (router) {
  router.get('/', renderHomePage)

  async function renderHomePage (ctx) {
    return ctx.render('home/home', {
      pageTitle: 'Luyen Thi Dai Hoc'
    })
  }
}
