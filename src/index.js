'use strict'
// const https = require('https')
// const easyrtc = require('easyrtc')

const Chat = require('./app/chat/model')

const app = require('./app')
const port = process.env.PORT || 3000

const server = app.listen(port, _ => {
  console.log(`App is start on port: ${port}`)
})

const io = require('socket.io').listen(server, { 'log level': 1 })

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

// // Set process name
// process.title = 'node-easyrtc'

// easyrtc.setOption('logLevel', 'debug')

// // Overriding the default easyrtcAuth listener, only so we can directly access its callback
// easyrtc.events.on('easyrtcAuth', function (socket, easyrtcid, msg, socketCallback, callback) {
//   easyrtc.events.defaultListeners.easyrtcAuth(socket, easyrtcid, msg, socketCallback, function (err, connectionObj) {
//     if (err || !msg.msgData || !msg.msgData.credential || !connectionObj) {
//       callback(err, connectionObj)
//       return
//     }

//     connectionObj.setField('credential', msg.msgData.credential, { 'isShared': false })

//     console.log('[' + easyrtcid + '] Credential saved!', connectionObj.getFieldValueSync('credential'))

//     callback(err, connectionObj)
//   })
// })

// // To test, lets print the credential to the console for every room join!
// easyrtc.events.on('roomJoin', function (connectionObj, roomName, roomParameter, callback) {
//   console.log('[' + connectionObj.getEasyrtcid() + '] Credential retrieved!', connectionObj.getFieldValueSync('credential'))
//   easyrtc.events.defaultListeners.roomJoin(connectionObj, roomName, roomParameter, callback)
// })

// // Node Get ICE STUN and TURN list
// const options = {
//   host: 'global.xirsys.net',
//   path: '/_turn/MyFirstApp',
//   method: 'PUT',
//   headers: {
//     'Authorization': 'Basic ' + new Buffer('manhtmhp123:03b1a200-39d0-11e8-884f-1b859292c95c').toString('base64')
//   }
// }

// easyrtc.on('getIceConfig', function (connectionObj, callback) {
//   const httpreq = https.request(options, function (httpres) {
//     let str = ''
//     httpres.on('data', function (data) { str += data })
//     httpres.on('error', function (e) { console.log('error: ', e) })
//     httpres.on('end', function () {
//       var d = JSON.parse(str)
//       if (d.s == 'ok') {
//         var iceConfig = d.v.iceServers
//         console.log('server list: ', iceConfig)
//         callback(null, iceConfig)
//       }
//     })
//   })
//   httpreq.end()
// })

// // Start EasyRTC server
// easyrtc.listen(app, io, null, function (err, rtcRef) {
//   if (err) {
//   }
//   rtcRef.events.on('roomCreate', function (appObj, creatorConnectionObj, roomName, roomOptions, callback) {
//     console.log('roomCreate fired! Trying to create: ' + roomName)

//     appObj.events.defaultListeners.roomCreate(appObj, creatorConnectionObj, roomName, roomOptions, callback)
//   })
// })
