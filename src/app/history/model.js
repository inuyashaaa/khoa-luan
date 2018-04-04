const mongoose = require('mongoose')
const Schema = mongoose.Schema

const historySchema = new Schema({
  idExam: { type: Number, required: true },
  numberOfTrueAnswer: { type: Number, required: true },
  userIdCreated: { type: Number, ref: 'users', default: null },
  rankUpdated: { type: Number, default: 0 },
  bonusPoint: { type: Number, dafault: 0 },
  subject: { type: String, required: true },
  level: { type: String, required: true },
  score: { type: Number, required: true },
  name: { type: String },
  school: { type: String }
})
module.exports = mongoose.model('History', historySchema)
