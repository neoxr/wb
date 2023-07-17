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

client.on('message', data => console.log(data))