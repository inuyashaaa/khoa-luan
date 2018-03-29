'use strict'

const mongoose = require('mongoose')

const Schema = mongoose.Schema

const quotesSchema = new Schema({
  quote: { type: String, required: true }
})
module.exports = mongoose.model('quotes', quotesSchema)
