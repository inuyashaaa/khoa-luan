'use strict'

module.exports = {
  initChat
}

function initChat (router) {
  router.get('get:chat-room', '/chat', renderRoomChat)

  async function renderRoomChat (ctx) {
    return ctx.render('chat/chat-room', {
      pageTitle: 'Phòng chat - Nơi mọi người trao đổi, tâm sự về học tập và cuộc sống'
    })
  }
}
