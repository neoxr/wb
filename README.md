## SIMPLICITY WHATSAPP BOT

> A lightweight and developer-friendly WhatsApp bot library built on top of [Baileys](https://github.com/WhiskeySockets/Baileys). It simplifies the process of creating, customizing, and managing WhatsApp bot. Designed for effortless integration and quick setup.

> ⚠️  **Starting from version 6 onward, this module was refactored, and some functions may be missing or modified and only supports ESM plugins (ECMAScript Modules)**.

### Example

To see an example in action, visit the [neoxr-bot](https://github.com/neoxr/neoxr-bot) repository.

<p align="center"><img align="center" width="100%" src="https://raw.githubusercontent.com/neoxr/neoxr/refs/heads/main/wb.png" /></p>

### Options

The following is the default configuration used when initializing a new Baileys connection. This setup is tailored for projects using this lib, and includes options for session management, plugin loading, and handling bot-specific behavior.

```Javascript
type SessionType = 'mongo' | 'postgres' | 'local' | 'mysql' | 'sqlite' | 'redis'

export interface ConnectionOpts {
   online?: boolean,
   presence?: boolean,
   bypass_disappearing?: boolean,
   server?: boolean,
   bot?: any,
   stealth?: string,
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
   // stealth: 'ios', // Stealth mode to avoid bot detection, device list : ios, android, web, dekstop
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

### Handling Events (Built-in)

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
waSocket.on('lid-mapping', ctx => console.log(ctx))
```

### Event Piping (Pipelining)

You can also use the default events from Baileys.

```Javascript
waSocket.ev.on('messaging-history.set', (update) => console.log(update))
waSocket.ev.on('messaging-history.status', (update) => console.log(update))
waSocket.ev.on('chats.upsert', (update) => console.log(update))
waSocket.ev.on('chats.update', (update) => console.log(update))
waSocket.ev.on('chats.delete', (update) => console.log(update))
waSocket.ev.on('chats.lock', (update) => console.log(update))
waSocket.ev.on('lid-mapping.update', (update) => console.log(update))
waSocket.ev.on('presence.update', (update) => console.log(update))
waSocket.ev.on('contacts.upsert', (update) => console.log(update))
waSocket.ev.on('contacts.update', (update) => console.log(update))
waSocket.ev.on('messages.delete', (update) => console.log(update))
waSocket.ev.on('messages.update', (update) => console.log(update))
waSocket.ev.on('messages.media-update', (update) => console.log(update))
waSocket.ev.on('messages.upsert', (update) => console.log(update))
waSocket.ev.on('messages.reaction', (update) => console.log(update))
waSocket.ev.on('message-receipt.update', (update) => console.log(update))
waSocket.ev.on('groups.upsert', (update) => console.log(update))
waSocket.ev.on('groups.update', (update) => console.log(update))
waSocket.ev.on('group-participants.update', (update) => console.log(update))
waSocket.ev.on('group.join-request', (update) => console.log(update))
waSocket.ev.on('group.member-tag.update', (update) => console.log(update))
waSocket.ev.on('blocklist.set', (update) => console.log(update))
waSocket.ev.on('blocklist.update', (update) => console.log(update))
waSocket.ev.on('call', (update) => console.log(update))
waSocket.ev.on('labels.edit', (update) => console.log(update))
waSocket.ev.on('labels.association', (update) => console.log(update))
waSocket.ev.on('newsletter.reaction', (update) => console.log(update))
waSocket.ev.on('newsletter.view', (update) => console.log(update))
waSocket.ev.on('newsletter-participants.update', (update) => console.log(update))
waSocket.ev.on('newsletter-settings.update', (update) => console.log(update))
waSocket.ev.on('settings.update', (update) => console.log(update))
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

// send a text message with custom thumbnail (preview link)
client.sendMessageModify(m.chat, `Test!`, m, {
   title: '© neoxr-bot',
   largeThumb: true,
   type: 'preview-link',
   /* choose: landscape (default), portrait, square */
   ratio: 'landscape',
   /* can buffer or url */
   thumbnail: 'https://iili.io/HP3ODj2.jpg',
   url: 'https://chat.whatsapp.com/HYknAquOTrECm9KPJJQO1V',
   icon: 'https://i.pinimg.com/1200x/5c/d9/d1/5cd9d1f17eba515351444b83b9991ee4.jpg'
})

// send a text message with custom thumbnail & fake quoted
client.sendMessageModifyV2(m.chat, `Test!`, '© neoxr-bot', {
   title: '© neoxr-bot',
   largeThumb: true,
   ads: false,
   /* can buffer or url */
   thumbnail: 'https://iili.io/HP3ODj2.jpg',
   url: 'https://chat.whatsapp.com/HYknAquOTrECm9KPJJQO1V',
})

// send a text message with custom thumbnail & fake quoted (preview link)
client.sendMessageModifyV2(m.chat, `Test!`, m, {
   title: '© neoxr-bot',
   largeThumb: true,
   type: 'preview-link',
   /* choose: landscape (default), portrait, square */
   ratio: 'landscape',
   /* can buffer or url */
   thumbnail: 'https://iili.io/HP3ODj2.jpg',
   url: 'https://chat.whatsapp.com/HYknAquOTrECm9KPJJQO1V',
   icon: 'https://i.pinimg.com/1200x/5c/d9/d1/5cd9d1f17eba515351444b83b9991ee4.jpg'
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

// send an AI sticker message from url or buffer
client.sendSticker(m.chat, 'https://iili.io/HP3ODj2.jpg', m, {
   packname: 'Sticker by',
   author: '© neoxr.js',
   meta: true
})

// send a lock sticker from url or buffer
client.sendSticker(m.chat, 'https://iili.io/HP3ODj2.jpg', m, {
   packname: 'Sticker by',
   author: '© neoxr.js',
   lock: true
})

// send a premium sticker message from url or buffer
client.sendSticker(m.chat, 'https://iili.io/HP3ODj2.jpg', m, {
   packname: 'Sticker by',
   author: '© neoxr.js',
   premium: true
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

// button location
client.replyButton(m.chat, buttons, m, {
   text: 'Hi @0', // do not empty
   footer: global.footer, // do not empty
   media: global.db.setting.cover, // file link (all extension)
   location: {
      name: global.header,
      description: 'オートメーション'
   }
})

// old button + native flow
client.replyButton(m.chat, [{
   text: 'Runtime',
   command: '.runtime'
}, {
   name: 'single_select',
   params: {
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
   background: '#FF0000',
   color: '#222222'
})

// send group status (close friends)
// same like group status just add private options
client.groupStatus(m.chat, {
   text: 'Hi!',
   background: '#FF0000',
   color: '#222222'
}, {
   private: {
      name: 'Neoxr Creative',
      emoji: '🔥'
   }
})

// send group status (instant)
client.groupStatus(m.chat, m.quoted.fakeObj, {
   private: {
      name: 'Neoxr Creative',
      emoji: '🔥'
   }
})

// send meta message v1 (rich message)
client.sendMetaMsg(m.chat, [{
      text: `Hi @${m.sender.replace(/@.+/, '')} ✨, This is an example of a simple meta message that supports *mentions*, *tables* and *code format*.\n\nAnd below is an example of the code format.`
   },
   {
      code: {
         language: 'javascript',
         code: fs.readFileSync('./error.js', 'utf-8')
      }
   },
   {
      text: `And this is an example of a table.`
   },
   {
      table: {
         title: 'Data',
         headers: ['Code', 'Artist'],
         rows: [
            ['SSID-738', 'Yua Mikami'],
            ['RTXU-849', `@${m.sender.replace(/@.+/, '')}`]
         ]
      }
   }, {
      text: 'You can add text, tables, and code formats as you like. 😎'
   },], m, {
      title: global.header,
      mentions: [m.sender]
})

// send meta message v2 (rich message)
client.sendMetaMsg(m.chat, [
   {
      text: `This is an example of a meta message that does not support *~mentions~* and *~tables~*, but has many variations. Such as citations [](https://api.neoxr.eu) and links [Neoxr API](https://api.neoxr.eu).\n\nCode formatting can still works :`
   },
   {
      code: {
         language: 'javascript',
         code: fs.readFileSync('./error.js', 'utf-8')
      }
   },
   {
      muted: 'There is also muted text like this.'
   },
   {
      suggestions: ['N', 'E', 'O', 'X', 'R', 'B', 'O', 'T']
   },
   {
      sources: [{
         icon: 'https://i.pinimg.com/736x/b4/e0/12/b4e012b9e55bc101eb2c89655888e2f1.jpg',
         title: 'Github',
         url: 'https://github.com/neoxr/neoxr-bot'
      }]
   }], m, {
   title: global.header
})

// send meta message v3 (rich message)
client.sendMetaMsg(m.chat, [
   {
      text: 'Photo and video media messages are supported, however, they do not support *~mentions~* and *~tables~*.\n\n---\n\nHere is an example of a reel:'
   },
   {
      reels: [
         'https://i.pinimg.com/736x/48/58/17/485817189f76066e8b22637d1310d3b4.jpg',
         'https://i.pinimg.com/736x/0e/32/e3/0e32e35b0324a541ba7fe705330febde.jpg',
         'https://i.pinimg.com/736x/88/78/b1/8878b18952e3587dd5c7502f35155731.jpg'
      ].map(image => ({
         creator: 'Neoxr Creative',
         avatar: 'https://avatars.githubusercontent.com/u/52621597?v=4',
         verified: true,
         thumbnail: image,
         url: 'https://api.neoxr.eu',
         source: 'IG'
      }))
   },
   {
      text: '\n\n---\n\nHere is an example of a social media post:'
   },
   {
      posts: [{
         media: 'https://i.pinimg.com/736x/ba/fd/92/bafd92cf5c8fbd802cf59c51286fc13f.jpg',
         caption: '하늘이 무너져도 솟아날 구멍은 있다는데, 난 그냥 그 구멍으로 들어가서 낮잠 잘래.',
         source: 'FACEBOOK'
      }, {
         media: 'https://i.pinimg.com/1200x/ec/0a/fd/ec0afd363645fa73d9d17df1136fddd4.jpg',
         caption: '냉장고랑 진지하게 대화했다. 걔는 자꾸 불빛을 깜빡이며 나한테 우주적 신호를 보내는 것 같아.',
         source: 'THREADS'
      }, {
         media: 'https://i.pinimg.com/736x/53/dd/f9/53ddf9fcf881b704548f2b6c676b07a6.jpg',
         caption: '어제 먹은 떡볶이가 사실 내 전생일지도 몰라. 쫄깃한 인생.',
         source: 'INSTAGRAM'
      }].map(v => ({
         username: 'Neoxr Creative',
         avatar: 'https://avatars.githubusercontent.com/u/52621597?v=4',
         verified: true,
         caption: v.caption,
         url: 'https://api.neoxr.eu',
         thumbnail: v.media,
         source: v.source,
         post_type: 'PHOTO'
      }))
   },
   {
      text: '\n\n---\n\nHere is an example of a non-slide product:\n\n'
   },
   {
      products: {
         title: 'Script Selfbot (WhatsApp Bot) [Free Update]',
         image: 'https://imgkub.com/images/2026/01/14/image586735a7ca2a894a.jpg',
         sale_price: 'Rp. 65.000',
         brand: 'Neoxr Creative',
         url: `https://wa.me/${Config.owner}`
      }
   },
   {
      text: '\n'
   },
   {
      products: {
         title: 'Payment Gateway',
         image: 'https://imgkub.com/images/2026/01/22/image7af565014aadeae6.jpg',
         sale_price: 'Rp. 80.000',
         brand: 'Neoxr Creative',
         url: `https://wa.me/${Config.owner}`
      }
   },
   {
      text: '\n\n---\n\nHere is an example of a slide product:'
   },
   {
      products: [{
         title: 'Script Premium (WhatsApp Bot) V5.1-Optima',
         image: 'https://imgkub.com/images/2025/12/07/image6e1f9b94ba9ced64.jpg',
         sale_price: 'Rp. 150.000'
      }, {
         title: 'Script E-Commerce (NeoCommerce)',
         image: 'https://imgkub.com/images/2025/12/07/image42981ad8a7441ff7.jpg',
         price: 'Rp. 175.000',
         sale_price: 'Rp. 150.000'
      }, {
         title: 'Script Selfbot (WhatsApp Bot)',
         image: 'https://imgkub.com/images/2026/01/14/image3b73a38fbc0a64c6.jpg',
         sale_price: 'Rp. 55.000'
      }, {
         title: 'Temporary Uploader & URL Shortener',
         image: 'https://imgkub.com/images/2025/12/13/imagef7b7c40836e6b3d2.jpg',
         sale_price: 'Rp. 60.000'
      }].map(v => ({
         ...v,
         brand: 'Neoxr Creative',
         url: `https://wa.me/${Config.owner}`
      }))
   }], m, {
   title: global.header
})

// send poll result
client.pollResult(m.chat, {
   name: 'Demo Poll Result',
   votes: [{
      name: 'Jokowi',
      count: 1500
   }, {
      name: 'Prabowo',
      count: 200
   }]
}, m)
```