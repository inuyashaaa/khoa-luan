const mongoose = require('mongoose')
const Schema = mongoose.Schema

var chatsModule = new Schema({
  username: { type: String, required: true },
  content: { type: String, required: true }
}, { timestamps: true })

module.exports = mongoose.model('Chats', chatsModule)
