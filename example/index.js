"use strict";
const fs = require('fs')
const { Baileys } = new(require('@neoxr/wb'))
const client = new Baileys({
   sf: 'session',
   version: [2, 2318, 11]
})
client.on('error', async error => console.log(error.message))
client.on('ready', async () => {
   /* clear temp folder every 3 minutes */
   setInterval(() => {
      const tmpFiles = fs.readdirSync('./temp')
      if (tmpFiles.length > 0) {
         tmpFiles.map(v => fs.unlinkSync('./temp/' + v))
      }
   }, 60 * 1000 * 3)
})

/* print all message */
client.on('message', ctx => console.log(ctx))

/* print deleted message */
client.on('message.delete', ctx => ctx ? client.sock.copyNForward(ctx.chat, ctx.delete) : '')

/* other events */
client.on('group.add', ctx => console.log(ctx))
client.on('group.remove', ctx => console.log(ctx))
client.on('group.promote', ctx => console.log(ctx))
client.on('group.demote', ctx => console.log(ctx))
client.on('caller', ctx => console.log(ctx))