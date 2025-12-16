## SIMPLICITY WHATSAPP BOT

> A lightweight and developer-friendly WhatsApp bot library built on top of [Baileys](https://github.com/WhiskeySockets/Baileys). It simplifies the process of creating, customizing, and managing WhatsApp bot. Designed for effortless integration and quick setup.

> ⚠️  **Starting from version 6 onward, this module was refactored, and some functions may be missing or modified and only supports ESM plugins (ECMAScript Modules)**.

### Example

To see an example in action, visit the [neoxr-bot](https://github.com/neoxr/neoxr-bot) repository.

<p align="center"><img align="center" width="100%" src="https://raw.githubusercontent.com/neoxr/neoxr/refs/heads/main/wb.png" /></p>

### Options

The following is the default configuration used when initializing a new Baileys connection. This setup is tailored for projects using this lib, and includes options for session management, plugin loading, and handling bot-specific behavior.

```Javascript
type SessionType = 'mongo' | 'postgres' | 'local' | 'mysql' | 'sqlite'

export interface ConnectionOpts {
   online?: boolean,
   presence?: boolean,
   bypass_disappearing?: boolean,
   server?: boolean,
   bot?: any,
   custom_id: string,
   pairing?: {
      state: boolean,
      number: string,
      code?: string
   },
   multiple?: boolean,
   create_session?: {
      type: SessionType,
      session: string,
      config?: any,
      number?: string | number,
      owner?: string | number
   },
   setting?: any,
   engines: any[],
   debug: boolean,
}
```

### Connection

Simple way to make connection

```Javascript
import * as baileys from 'baileys'
import { Client, Utils, Config } from '@neoxr/wb'

const waSocket = new Client({
   plugsdir: 'plugins',
   presence: true,
   online: true,
   bypass_disappearing: true,
   pairing: {
      state: true, // Set to 'false' if you want to use QR scan
      number: '6285xxxxxxx', // Your bot number
      code: 'NEOXRBOT' // If you want a custom pairing code, enter 8 alphanumeric characters
   },
   create_session: {
      type: 'local',
      session: 'session',
      config: process.env?.DATABASE_URL || ''
   },
   custom_id: 'neoxr',
   bot: (id) => {
      return (id.startsWith('3EB0') && id.length === 40) || id.startsWith('BAE') || /[-]/.test(id)
   },
   engines: [baileys], // Init baileys as main engine
   debug: false // Set to 'true' if you want to see how this module works :v
}, {
   // This is the Baileys connection options section
   version: [2, 3000, 1027023507],
   browser: ['Ubuntu', 'Firefox', '20.0.00'],
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
waSocket.on('stories', ctx => console.log(ctx))
waSocket.on('message', ctx => console.log(ctx))
waSocket.on('message.delete', ctx => console.log(ctx))
waSocket.on('message.receipt', ctx => console.log(ctx))
waSocket.on('group.add', ctx => console.log(ctx))
waSocket.on('group.remove', ctx => console.log(ctx))
waSocket.on('group.promote', ctx => console.log(ctx))
waSocket.on('group.demote', ctx => console.log(ctx))
waSocket.on('group.request', ctx => console.log(ctx))
waSocket.on('caller', ctx => console.log(ctx))
waSocket.on('poll', ctx => console.log(ctx))
waSocket.on('presence.update', ctx => console.log(ctx))
```

### Message Metadata

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
   url: 'https://chat.whatsapp.com/HYknAquOTrECm9KPJJQO1V'
})

// send a text message with custom thumbnail & fake quoted
client.sendMessageModifyV2(m.chat, `Test!`, '© neoxr-bot', {
   title: '© neoxr-bot',
   largeThumb: true,
   ads: false,
   /* can buffer or url */
   thumbnail: 'https://iili.io/HP3ODj2.jpg',
   url: 'https://chat.whatsapp.com/HYknAquOTrECm9KPJJQO1V'
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
   // v2: true, (for product style with image)
   footer: '',
   media: global.db.setting.cover // video or image link
})

// button & list (multiple)
client.sendIAMessage(m.chat, buttons, m, {
   header: '',
   content: 'Hi!',
   // v2: true, (for product style with image)
   footer: '',
   media: global.db.setting.cover, // video or image link
   multiple: {
      name: 'オートメーション',
      code: 'neoxr-bot',
      list_title: 'Select Menu',
      button_title: 'Tap Here!'
   }
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

// send group status (video & image)
client.groupStatus(m.chat, {
   media: 'https://i.pinimg.com/736x/0b/97/6f/0b976f0a7aa1aa43870e1812eee5a55d.jpg', // Support URL and Buffer
   caption: 'Hi!'
})

// send group status (audio)
client.groupStatus(m.chat, {
   media: 'https://example.com/audio.mp3', // Support URL and Buffer
   background: '#FF0000'
})

// send group status (text)
client.groupStatus(m.chat, {
   text: 'Hi!',
   background: '#FF0000'
})
```