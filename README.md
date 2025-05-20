## SIMPLICITY WHATSAPP BOT

> A lightweight and developer-friendly WhatsApp bot library built on top of [Baileys](https://github.com/WhiskeySockets/Baileys). It simplifies the process of creating, customizing, and managing WhatsApp bot. Designed for effortless integration and quick setup.

### Example

To see an example in action, visit the [neoxr-bot](https://github.com/neoxr/neoxr-bot) repository.

<p align="center"><img align="center" width="100%" src="https://raw.githubusercontent.com/neoxr/neoxr/refs/heads/main/wb.png" /></p>

### Connection

Simple way to make connection

```Javascript
const { Component } = require('@neoxr/wb')
const { Baileys, Function: Func, Config: env } = new Component

const waSocket = new Baileys({
   type: '--neoxr-v1',
   plugsdir: 'plugins',
   session: 'session',
   online: true,
   bypass_disappearing: true,
   version: [2, 3000, 1017531287],
   bot: id => {
      // Detect message from bot by message ID, you can add another logic here
      return (id.startsWith('3EB0') && id.length === 40) || id.startsWith('BAE') || /[-]/.test(id)
   },
   version: [2, 3000, 1022545672] // To see the latest version : https://wppconnect.io/whatsapp-versions/
}, {
   shouldIgnoreJid: jid => {
      return /(newsletter|bot)/.test(jid)
   }
})
```

### Handling Events

There are several events that can be used are as follows :

```Javascript
waSocket.on('connect', () => console.log)
waSocket.on('error', error => console.log(error))
waSocket.on('ready', () => console.log)
waSocket.on('message', ctx => console.log(ctx))
waSocket.on('message.delete', ctx => console.log(ctx))
waSocket.on('message.receipt', ctx => console.log(ctx))
waSocket.on('group.add', ctx => console.log(ctx))
waSocket.on('group.remove', ctx => console.log(ctx))
waSocket.on('group.promote', ctx => console.log(ctx))
waSocket.on('group.demote', ctx => console.log(ctx))
waSocket.on('caller', ctx => console.log(ctx))
waSocket.on('poll', ctx => console.log(ctx))
waSocket.on('presence.update', ctx => console.log(ctx))
```

### Event Message (message)

```Javascript
{
   m: {
      key: {
         remoteJid: '6285887776722@s.whatsapp.net',
         fromMe: false,
         id: 'A4A5E1FB9C33178CD11673178C46CA1E',
         participant: undefined
      },
      messageTimestamp: 1689557472,
      pushName: 'Wildan Izzudin',
      broadcast: false,
      message: Message {
         extendedTextMessage: [ExtendedTextMessage],
         messageContextInfo: [MessageContextInfo]
      },
      id: 'A4A5E1FB9C33178CD11673178C46CA1E',
      isBot: false,
      chat: '6285887776722@s.whatsapp.net',
      fromMe: false,
      isGroup: false,
      sender: '6285887776722@s.whatsapp.net',
      mtype: 'extendedTextMessage',
      msg: ExtendedTextMessage {
         text: '.menu',
         previewType: 0,
         contextInfo: [ContextInfo],
         inviteLinkGroupTypeV2: 0
      },
      quoted: null,
      mentionedJid: [],
      reply: [Function(anonymous)],
      text: '.menu'
   },
   body: '.menu',
   prefix: '.',
   plugins: [],
   commands: [],
   args: [],
   command: 'menu',
   text: '',
   prefixes: ['.', '#', '!', '/']
}
```
### Messaging Function

```Javascript
// declaration variable sock
const client = waSocket.sock

// send a text message (auto tagged)
client.reply(m.chat, `Test!`, m)

// send a react message
client.sendReact(m.chat, `💀`, m.key)

// send a text message with progress bar
client.sendProgress(m.chat, `Test!`, m)

// send a ptv message from path, url, or buffer (video duration 10s)
client.sendPtv(m.chat, `./media/video/yemete.mp4`)

// send a text message with custom thumbnail
client.sendMessageModify(m.chat, `Test!`, m, {
   title: '© neoxr-bot',
   largeThumb: true,
   ads: false,
   /* can buffer or url */
   thumbnail: 'https://iili.io/HP3ODj2.jpg',
   link: 'https://chat.whatsapp.com/HYknAquOTrECm9KPJJQO1V'
})

// send a text message with custom thumbnail & fake quoted
client.sendMessageModifyV2(m.chat, `Test!`, '© neoxr-bot', {
   title: '© neoxr-bot',
   largeThumb: true,
   ads: false,
   /* can buffer or url */
   thumbnail: 'https://iili.io/HP3ODj2.jpg',
   link: 'https://chat.whatsapp.com/HYknAquOTrECm9KPJJQO1V'
})

// send a text message with fake quoted
client.sendMessageVerify(m.chat, `Test!`, '© neoxr-bot')

// send a file from path, url, or buffer (auto extension)
client.sendFile(m.chat, 'https://iili.io/HP3ODj2.jpg', 'image.jpg', 'Test!', m)

// send a document from path, url, or buffer (auto extension)
client.sendFile(m.chat, 'https://iili.io/HP3ODj2.jpg', 'image.jpg', 'Test!', m, {
   document: true
})

// send a voicenote from path, url, or buffer
client.sendFile(m.chat, './media/audio/ah.mp3', '', '', m, {
   ptt: true
})

// send a audio from path, url, or buffer with thumbnail in audio tag
client.sendFile(m.chat, './media/audio/ah.mp3', '', '', m, {
   APIC: < Buffer >
})

// send a sticker message from url or buffer
client.sendSticker(m.chat, 'https://iili.io/HP3ODj2.jpg', m, {
   packname: 'Sticker by',
   author: '© neoxr.js'
})

// send polling message
client.sendPoll(m.chat, 'Do you like this library ?', {
   options: ['Yes', 'No'],
   multiselect: false
})

// send contact message
client.sendContact(m.chat, [{
   name: 'Wildan Izzudin',
   number: '6285887776722',
   about: 'Owner & Creator'
}], m, {
   org: 'Neoxr Network',
   website: 'https://api.neoxr.my.id',
   email: 'contact@neoxr.my.id'
})

// forward message
client.copyNForward(m.chat, m)

// send interactive button message (your own risk)
var buttons = [{
   name: "quick_reply",
   buttonParamsJson: JSON.stringify({
      display_text: "OWNER",
      id: '.owner'
   }),
}, {
   name: "cta_url",
   buttonParamsJson: JSON.stringify({
      display_text: "Rest API",
      url: "https://api.neoxr.my.id",
      merchant_url: "https://api.neoxr.my.id"
   })
}, {
   name: "cta_copy",
   buttonParamsJson: JSON.stringify({
      display_text: "Copy",
      copy_code: "123456"
   })
}, {
   name: "cta_call",
   buttonParamsJson: JSON.stringify({
      display_text: "Call",
      phone_number: "6285887776722"
   })
}, {
   name: "single_select",
   buttonParamsJson: JSON.stringify({
      title: "Tap!",
      sections: [{
         rows: [{
            title: "Owner",
            description: `X`,
            id: `.owner`
         }, {
            title: "Runtime",
            description: `Y`,
            id: `.run`
         }]
      }]
   })
}]

// button & list
client.sendIAMessage(m.chat, buttons, m, {
   header: '',
   content: 'Hi!',
   footer: '',
   media: global.db.setting.cover // video or image link
})

// carousel message
const cards = [{
   header: {
      imageMessage: global.db.setting.cover,
      hasMediaAttachment: true,
   },
   body: {
      text: "P"
   },
   nativeFlowMessage: {
      buttons: [{
         name: "cta_url",
         buttonParamsJson: JSON.stringify({
            display_text: 'Contact Owner',
            url: 'https://api.neoxr.eu',
            webview_presentation: null
         })
      }]
   }
}, {
   header: {
      imageMessage: global.db.setting.cover,
      hasMediaAttachment: true,
   },
   body: {
      text: "P"
   },
   nativeFlowMessage: {
      buttons: [{
         name: "cta_url",
         buttonParamsJson: JSON.stringify({
            display_text: 'Contact Owner',
            url: 'https://api.neoxr.eu',
            webview_presentation: null
         })
      }]
   }
}]

client.sendCarousel(m.chat, cards, m, {
   content: 'Hi!'
})

// send message with "AI" label (only work if your bot using WhatsApp Business)
client.sendFromAI(m.chat, 'Hi!', m)

// send old button all type
var buttons = [{
   text: 'Runtime',
   command: '.runtime'
}, {
   text: 'Statistic',
   command: '.stat'
}]

// button text
client.replyButton(m.chat, buttons, m, {
   text: 'Hi @0',
   footer: global.footer // do not empty
})

// button image & video
client.replyButton(m.chat, buttons, m, {
   text: 'Hi @0', // do not empty
   footer: global.footer, // do not empty
   media: global.db.setting.cover // video or image link
})

// button document
client.replyButton(m.chat, buttons, m, {
   text: 'Hi @0', // do not empty
   footer: global.footer, // do not empty
   media: global.db.setting.cover, // file link (all extension)
   document: {
      filename: 'neoxr.jpg'
   }
})

// old button + native flow
client.replyButton(m.chat, [{
   text: 'Runtime',
   command: '.runtime'
}, {
   name: 'single_select',
   param: {
      title: 'Tap!',
      sections: [{
         rows: [{
            title: 'Runtime',
            description: '---',
            id: '.runtime'
         }, {
            title: 'Statistic',
            description: '---',
            id: '.stat'
         }]
      }]
   }
}], m, {
   text: 'Hi @0', // do not empty
   footer: global.footer, // do not empty
   media: global.db.setting.cover // video or image link
})

// send album message
client.sendAlbumMessage(m.chat, [{
   url: 'https://i.pinimg.com/736x/6f/a3/6a/6fa36aa2c367da06b2a4c8ae1cf9ee02.jpg',
   caption: 'Content 1st', // optional
   type: 'image' // optional
}, {
   url: 'https://i.pinimg.com/736x/0b/97/6f/0b976f0a7aa1aa43870e1812eee5a55d.jpg',
   caption: 'Content 2nd', // optional
   type: 'image' // optional
}, {
   url: 'https://i.pinimg.com/736x/8c/6d/db/8c6ddb5fe6600fcc4b183cb2ee228eb7.jpg',
   caption: 'Content 2nd', // optional
   type: 'image' // optional
}], m)

// up story tag
client.uploadStory(['jid1', 'jid2'], {
   image: {
      url: 'https://i.pinimg.com/736x/0b/97/6f/0b976f0a7aa1aa43870e1812eee5a55d.jpg'
   }
})
```