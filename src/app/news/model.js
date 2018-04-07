'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const newsSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true },
    description: { type: String },
    imageLink: { type: String },
    content: { type: String }
  },
  { timestamps: true }
)
module.exports = mongoose.model('News', newsSchema)
