'use strict'

const Quotes = require('./model')

module.exports = {
  initQuotes,
  getRandomQuote
}

function initQuotes (router) {
  router.get('quotes', '/quotes', getFormAddQuotes)
  router.post('quotes', '/quotes', addNewQuotes)
}

async function getFormAddQuotes (ctx) {
  return ctx.render('quotes/quotes', {
    pageTitle: 'Add new quotes'
  })
}

async function addNewQuotes (ctx) {
  const quote = ctx.request.body.quote
  const data = await Quotes.create({ quote: quote })

  ctx.body = {
    success: true,
    message: 'Add quote success!!!',
    data
  }
}

async function getRandomQuote () {
  const data = await Quotes.aggregate([{ $sample: { size: 1 } }])
  return data[0].quote
}
