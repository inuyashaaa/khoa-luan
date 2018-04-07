const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema

const usersSchema = new Schema({
  id: { type: Number, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, minlength: 6 },
  email:
    {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator:
          (value) => {
            const regex = /@/
            return regex.test(value)
          },
        message: '{VALUE} is not valid email'
      }
    },
  avatar: { type: String, default: '/images/default-avatar.png' },
  createdDate: { type: Date, default: new Date().toISOString() },
  updatedDate: { type: Date, default: new Date().toISOString() },
  // profile : { type : ObjectId, ref : 'profiles', default : null},
  rank: { type: Number, required: true, default: 0 },
  point: { type: Number, default: 0 },
  isAdmin: {type: Boolean, required: true, default: 0}
})

usersSchema.pre('save', function (next) {
  var user = this
  if (!user.isModified('password')) {
    return next()
  }

  bcrypt.genSalt(10, (err, salt) => {
    if (err) return
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        return
      }
      user.password = hash
      next()
    })
  })
})

module.exports = mongoose.model('User', usersSchema)
