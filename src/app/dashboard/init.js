'use strict'

module.exports =

function initDashBoard (router) {
  router.get('dashboard', '/home', renderDashBoard)

  async function renderDashBoard (ctx) {
    return ctx.render('dashboard/dashboard', {
      pageTitle: 'Dashboard'
    })
  }
}
