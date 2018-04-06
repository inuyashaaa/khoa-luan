'use strict'

const Chat = require('./app/chat/model')

const app = require('./app')
const port = process.env.PORT || 3000

const server = app.listen(port, _ => {
  console.log(`App is start on port: ${port}`)
})

const io = require('socket.io').listen(server)

io.on('connection', async function (socket) {
  // console.log(`User ${socket.conn.id} is connected! IP: ${socket.request.connection.remoteAddress}`)
  try {
    const chats = await Chat.find({}).sort({ _id: 1 })
    console.log(chats)
    io.emit('output', chats)
  } catch (error) {
    console.log(error)
  }

  socket.on('chat:message', async function (data) {
    try {
      const chat = await Chat.create(data)
      io.emit('output', [chat])
    } catch (error) {
      console.log(error)
    }
  })
})
