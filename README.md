# Simplicity WhatsApp Bot

A lightweight, developer-friendly WhatsApp bot library built on top of [Baileys](https://github.com/WhiskeySockets/Baileys). It simplifies creating, customizing, and managing a WhatsApp bot, with effortless integration and a quick setup.

> [!WARNING]
> Starting from **version 6**, this module was refactored. Some functions may be missing or changed, and **only ESM plugins (ECMAScript Modules) are supported**.

<p align="center"><img width="100%" src="https://raw.githubusercontent.com/neoxr/neoxr/refs/heads/main/wb.png" alt="Preview" /></p>

## Table of Contents

- [Requirements](#requirements)
- [Quick Start](#quick-start)
- [Connection](#connection)
- [Options](#options)
- [Events](#events)
- [Message Metadata](#message-metadata)
- [Messaging Functions](#messaging-functions)
- [Example Project](#example-project)

## Requirements

- Node.js **>= 20**
- FFmpeg (needed for stickers, audio, and video conversion)
- Git

## Quick Start

The fastest way to get a working bot is to start from the reference project, [neoxr-bot](https://github.com/neoxr/neoxr-bot), which already uses this library.

### 1. Clone and install

```bash
git clone https://github.com/neoxr/neoxr-bot
cd neoxr-bot
yarn          # or: npm install
```

> [!TIP]
> On a fresh Debian/Ubuntu server you can run `bash install.sh` instead. It installs FFmpeg, Node.js 20 (via nvm), PM2, and the dependencies, then starts the bot.

### 2. Configure `config.json`

Set your own number as the owner, and the number the bot will run on.

```json
{
   "owner": "6285xxxxxxxx",
   "owner_name": "Your Name",
   "database": "data",
   "limit": 15,
   "ram_limit": "900mb",
   "pairing": {
      "state": true,
      "number": 6285xxxxxxxx,
      "code": "NEOXRBOT"
   }
}
```

| Key | Description |
| --- | --- |
| `owner` | Owner number (country code, no `+`) |
| `pairing.state` | `true` to log in with a pairing code, `false` to scan a QR code |
| `pairing.number` | The WhatsApp number the bot will run on |
| `pairing.code` | Optional custom pairing code (8 alphanumeric characters) |
| `database` | Local database file name |
| `ram_limit` | The bot restarts itself when memory usage exceeds this value |

### 3. Configure `.env`

```env
API_KEY = ''
TZ = 'Asia/Jakarta'
DATABASE_URL = ''   # leave empty to use a local JSON database
```

`DATABASE_URL` can point to MongoDB, PostgreSQL, MySQL, or Redis. Leave it empty for local storage.

### 4. Run

```bash
npm start
```

Or keep it alive in the background with PM2:

```bash
pm2 start pm2.config.cjs && pm2 logs neoxr
```

### 5. Link your WhatsApp

1. Start the bot and wait for the pairing code to appear in the console.
2. On the phone, open **WhatsApp → Linked devices → Link a device → Link with phone number instead**.
3. Enter the code shown in the console.

When the console shows the bot is ready, send `.menu` to the bot to confirm it works.

### 6. Write your first plugin

Plugins are ESM files inside the `plugins/` directory (subfolders are fine). Create `plugins/example/hello.js`:

```javascript
export const run = {
   usage: ['hello'],
   category: 'example',
   async: async (m, { client }) => {
      try {
         client.reply(m.chat, `Hello, ${m.pushName}!`, m)
      } catch (e) {
         console.error(e)
         client.reply(m.chat, global.status.error, m)
      }
   },
   error: false
}
```

Send `.hello` to the bot and it will reply. More examples are in [`plugins/example`](https://github.com/neoxr/neoxr-bot/tree/5.0-ESM/plugins/example) (buttons, polls, rich messages, and more).

A single file can also hold several plugins by exporting an array. Entries without `usage` run as non-command plugins on every message:

```javascript
export const run = [{
   usage: ['ping'],
   category: 'example',
   async: async (m, { client }) => client.reply(m.chat, 'Pong!', m),
   group: true // group chats only (use `private: true` for private chats only)
}, {
   async: async (m, { client, body }) => {
      if (/^thanks?$/i.test(body)) client.reply(m.chat, 'You are welcome!', m)
   }
}]
```

### Using the library directly

If you want to build your own project instead of using neoxr-bot as a base:

```bash
npm install @neoxr/wb baileys
```

Then follow the [Connection](#connection) section below.

## Connection

The simplest way to create a connection:

```javascript
import * as baileys from 'baileys'
import { Client, Utils, Config } from '@neoxr/wb'

const waSocket = new Client({
   plugsdir: 'plugins',
   presence: true,
   online: true,
   bypass_disappearing: true,
   pairing: {
      state: true, // Set to false to use a QR code instead
      number: '6285xxxxxxx', // Your bot number
      code: 'NEOXRBOT' // Optional custom pairing code (8 alphanumeric characters)
   },
   create_session: {
      type: 'local',
      session: 'session',
      config: process.env?.DATABASE_URL || ''
   },
   // stealth: 'ios', // Avoid bot detection. Devices: ios, android, web, desktop
   custom_id: 'neoxr',
   bot: (id) => {
      return (id.startsWith('3EB0') && id.length === 40) || id.startsWith('BAE') || /[-]/.test(id)
   },
   engines: [baileys], // Baileys is the main engine
   debug: false // Set to true to see how this module works
}, {
   // Baileys connection options
   version: [2, 3000, 1027023507],
   browser: ['Ubuntu', 'Firefox', '20.0.00'],
   shouldIgnoreJid: jid => {
      return /(newsletter|bot)/.test(jid)
   }
})
```

## Options

Default configuration used when initializing a new connection. It covers session management, plugin loading, and bot-specific behavior.

```typescript
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

## Events

### Built-in events

```javascript
waSocket.on('connect', () => console.log('connected'))
waSocket.on('error', error => console.log(error))
waSocket.on('ready', () => console.log('ready'))
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

### Baileys events (event piping)

The default Baileys events are also available through `waSocket.ev`:

```javascript
waSocket.ev.on('messaging-history.set', update => console.log(update))
waSocket.ev.on('messaging-history.status', update => console.log(update))
waSocket.ev.on('chats.upsert', update => console.log(update))
waSocket.ev.on('chats.update', update => console.log(update))
waSocket.ev.on('chats.delete', update => console.log(update))
waSocket.ev.on('chats.lock', update => console.log(update))
waSocket.ev.on('lid-mapping.update', update => console.log(update))
waSocket.ev.on('presence.update', update => console.log(update))
waSocket.ev.on('contacts.upsert', update => console.log(update))
waSocket.ev.on('contacts.update', update => console.log(update))
waSocket.ev.on('messages.delete', update => console.log(update))
waSocket.ev.on('messages.update', update => console.log(update))
waSocket.ev.on('messages.media-update', update => console.log(update))
waSocket.ev.on('messages.upsert', update => console.log(update))
waSocket.ev.on('messages.reaction', update => console.log(update))
waSocket.ev.on('message-receipt.update', update => console.log(update))
waSocket.ev.on('groups.upsert', update => console.log(update))
waSocket.ev.on('groups.update', update => console.log(update))
waSocket.ev.on('group-participants.update', update => console.log(update))
waSocket.ev.on('group.join-request', update => console.log(update))
waSocket.ev.on('group.member-tag.update', update => console.log(update))
waSocket.ev.on('blocklist.set', update => console.log(update))
waSocket.ev.on('blocklist.update', update => console.log(update))
waSocket.ev.on('call', update => console.log(update))
waSocket.ev.on('labels.edit', update => console.log(update))
waSocket.ev.on('labels.association', update => console.log(update))
waSocket.ev.on('newsletter.reaction', update => console.log(update))
waSocket.ev.on('newsletter.view', update => console.log(update))
waSocket.ev.on('newsletter-participants.update', update => console.log(update))
waSocket.ev.on('newsletter-settings.update', update => console.log(update))
waSocket.ev.on('settings.update', update => console.log(update))
```

## Message Metadata

Example of the context object passed to a message handler:

```javascript
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
      reply: [Function (anonymous)],
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

## Messaging Functions

Get the socket first:

```javascript
const client = waSocket.sock
```

Inside a plugin, `client` is already provided (see [Quick Start](#6-write-your-first-plugin)).

### Text

```javascript
// Text message (auto tagged)
client.reply(m.chat, 'Test!', m)

// Reaction
client.sendReact(m.chat, '💀', m.key)

// Text message with a progress bar
client.sendProgress(m.chat, 'Test!', m)

// Text message with a custom thumbnail
client.sendMessageModify(m.chat, 'Test!', m, {
   title: '© neoxr-bot',
   largeThumb: true,
   ads: false,
   thumbnail: 'https://iili.io/HP3ODj2.jpg', // Buffer or URL
   url: 'https://chat.whatsapp.com/HYknAquOTrECm9KPJJQO1V'
})

// Text message with a custom thumbnail (link preview)
client.sendMessageModify(m.chat, 'Test!', m, {
   title: '© neoxr-bot',
   largeThumb: true,
   type: 'preview-link',
   ratio: 'landscape', // landscape (default), portrait, square
   thumbnail: 'https://iili.io/HP3ODj2.jpg', // Buffer or URL
   url: 'https://chat.whatsapp.com/HYknAquOTrECm9KPJJQO1V',
   icon: 'https://i.pinimg.com/1200x/5c/d9/d1/5cd9d1f17eba515351444b83b9991ee4.jpg'
})

// Text message with a custom thumbnail and fake quoted message
client.sendMessageModifyV2(m.chat, 'Test!', '© neoxr-bot', {
   title: '© neoxr-bot',
   largeThumb: true,
   ads: false,
   thumbnail: 'https://iili.io/HP3ODj2.jpg', // Buffer or URL
   url: 'https://chat.whatsapp.com/HYknAquOTrECm9KPJJQO1V'
})

// Text message with a custom thumbnail and fake quoted message (link preview)
client.sendMessageModifyV2(m.chat, 'Test!', m, {
   title: '© neoxr-bot',
   largeThumb: true,
   type: 'preview-link',
   ratio: 'landscape', // landscape (default), portrait, square
   thumbnail: 'https://iili.io/HP3ODj2.jpg', // Buffer or URL
   url: 'https://chat.whatsapp.com/HYknAquOTrECm9KPJJQO1V',
   icon: 'https://i.pinimg.com/1200x/5c/d9/d1/5cd9d1f17eba515351444b83b9991ee4.jpg'
})

// Text message with a fake quoted message
client.sendMessageVerify(m.chat, 'Test!', '© neoxr-bot')

// Text message with the "AI" label (only works with WhatsApp Business)
client.sendFromAI(m.chat, 'Hi!', m)
```

### Files and media

All file functions accept a path, URL, or Buffer.

```javascript
// File (extension detected automatically)
client.sendFile(m.chat, 'https://iili.io/HP3ODj2.jpg', 'image.jpg', 'Test!', m)

// Document
client.sendFile(m.chat, 'https://iili.io/HP3ODj2.jpg', 'image.jpg', 'Test!', m, {
   document: true
})

// Live photo (from a video)
client.sendFile(m.chat, 'https://cdn.videy.co/7QUk0zRO1.mp4', 'video.mp4', 'Test!', m, {
   photo_live: true
   // thumbnail: Buffer | URL | Path
})

// Voice note
client.sendFile(m.chat, './media/audio/ah.mp3', '', '', m, {
   ptt: true
})

// Audio with a thumbnail in the audio tag
client.sendFile(m.chat, './media/audio/ah.mp3', '', '', m, {
   APIC: buffer // Buffer
})

// PTV (video note, max duration 10s)
client.sendPtv(m.chat, './media/video/yemete.mp4')

// Album
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
   caption: 'Content 3rd', // optional
   type: 'image' // optional
}], m)
```

### Stickers

```javascript
// Sticker
client.sendSticker(m.chat, 'https://iili.io/HP3ODj2.jpg', m, {
   packname: 'Sticker by',
   author: '© neoxr.js'
})

// AI sticker
client.sendSticker(m.chat, 'https://iili.io/HP3ODj2.jpg', m, {
   packname: 'Sticker by',
   author: '© neoxr.js',
   meta: true
})

// Lock sticker
client.sendSticker(m.chat, 'https://iili.io/HP3ODj2.jpg', m, {
   packname: 'Sticker by',
   author: '© neoxr.js',
   lock: true
})

// Premium sticker
client.sendSticker(m.chat, 'https://iili.io/HP3ODj2.jpg', m, {
   packname: 'Sticker by',
   author: '© neoxr.js',
   premium: true
})
```

### Polls, contacts, and forwarding

```javascript
// Poll
client.sendPoll(m.chat, 'Do you like this library?', {
   options: ['Yes', 'No'],
   multiselect: false
})

// Poll with images
client.sendPoll(m.chat, 'Choose one:', {
   options: [
      { name: 'menu', image: 'https://i.pinimg.com/736x/89/8c/5c/898c5cd36ce73762b57e0c3f39d61157.jpg' },
      { name: 'runtime', image: 'https://i.pinimg.com/736x/4d/67/5a/4d675afa9a7a4ec4ee934484c615e0bf.jpg' }
   ]
}, m)

// Poll result
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

// Contact
client.sendContact(m.chat, [{
   name: 'Wildan Izzudin',
   number: '6285887776722',
   about: 'Owner & Creator'
}], m, {
   org: 'Neoxr Network',
   website: 'https://api.neoxr.my.id',
   email: 'contact@neoxr.my.id'
})

// Forward a message
client.copyNForward(m.chat, m)
```

### Interactive buttons

> [!CAUTION]
> Interactive buttons rely on WhatsApp internals that can change without notice. Use them at your own risk.

```javascript
const buttons = [{
   name: 'quick_reply',
   buttonParamsJson: JSON.stringify({
      display_text: 'OWNER',
      id: '.owner'
   })
}, {
   name: 'cta_url',
   buttonParamsJson: JSON.stringify({
      display_text: 'Rest API',
      url: 'https://api.neoxr.my.id',
      merchant_url: 'https://api.neoxr.my.id'
   })
}, {
   name: 'cta_copy',
   buttonParamsJson: JSON.stringify({
      display_text: 'Copy',
      copy_code: '123456'
   })
}, {
   name: 'cta_call',
   buttonParamsJson: JSON.stringify({
      display_text: 'Call',
      phone_number: '6285887776722'
   })
}, {
   name: 'single_select',
   buttonParamsJson: JSON.stringify({
      title: 'Tap!',
      sections: [{
         rows: [{
            title: 'Owner',
            description: 'X',
            id: '.owner'
         }, {
            title: 'Runtime',
            description: 'Y',
            id: '.run'
         }]
      }]
   })
}]

// Buttons and list
client.sendIAMessage(m.chat, buttons, m, {
   header: '',
   content: 'Hi!',
   // v2: true, // product style with an image
   footer: '',
   media: global.db.setting.cover // video or image link
})

// Buttons and list (multiple)
client.sendIAMessage(m.chat, buttons, m, {
   header: '',
   content: 'Hi!',
   // v2: true, // product style with an image
   footer: '',
   media: global.db.setting.cover, // video or image link
   multiple: {
      name: 'オートメーション',
      code: 'neoxr-bot',
      list_title: 'Select Menu',
      button_title: 'Tap Here!'
   }
})
```

### Carousel

```javascript
const cards = [{
   header: {
      imageMessage: global.db.setting.cover,
      hasMediaAttachment: true
   },
   body: {
      text: 'P'
   },
   nativeFlowMessage: {
      buttons: [{
         name: 'cta_url',
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
      hasMediaAttachment: true
   },
   body: {
      text: 'P'
   },
   nativeFlowMessage: {
      buttons: [{
         name: 'cta_url',
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
```

### Legacy buttons

```javascript
const buttons = [{
   text: 'Runtime',
   command: '.runtime'
}, {
   text: 'Statistic',
   command: '.stat'
}]

// Text
client.replyButton(m.chat, buttons, m, {
   text: 'Hi @0', // required
   footer: global.footer // required
})

// Image or video
client.replyButton(m.chat, buttons, m, {
   text: 'Hi @0', // required
   footer: global.footer, // required
   media: global.db.setting.cover // video or image link
})

// Document
client.replyButton(m.chat, buttons, m, {
   text: 'Hi @0', // required
   footer: global.footer, // required
   media: global.db.setting.cover, // link to a file of any extension
   document: {
      filename: 'neoxr.jpg'
   }
})

// Location
client.replyButton(m.chat, buttons, m, {
   text: 'Hi @0', // required
   footer: global.footer, // required
   media: global.db.setting.cover, // link to a file of any extension
   location: {
      name: global.header,
      description: 'オートメーション'
   }
})

// Legacy buttons + native flow
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
   text: 'Hi @0', // required
   footer: global.footer, // required
   media: global.db.setting.cover // video or image link
})
```

### Group status

```javascript
// Video or image
client.groupStatus(m.chat, {
   media: 'https://i.pinimg.com/736x/0b/97/6f/0b976f0a7aa1aa43870e1812eee5a55d.jpg', // URL or Buffer
   caption: 'Hi!'
})

// Audio
client.groupStatus(m.chat, {
   media: 'https://example.com/audio.mp3', // URL or Buffer
   background: '#FF0000'
})

// Text
client.groupStatus(m.chat, {
   text: 'Hi!',
   background: '#FF0000',
   color: '#222222'
})

// Close friends (same as above, plus the `private` option)
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

// Instant (forward a quoted message)
client.groupStatus(m.chat, m.quoted.fakeObj, {
   private: {
      name: 'Neoxr Creative',
      emoji: '🔥'
   }
})
```

### Meta messages (rich messages)

#### v1: text, mentions, tables, and code

```javascript
client.sendMetaMsg(m.chat, [{
   text: `Hi @${m.sender.replace(/@.+/, '')} ✨, this is an example of a simple meta message that supports *mentions*, *tables*, and *code format*.\n\nBelow is an example of the code format.`
}, {
   code: {
      language: 'javascript',
      code: fs.readFileSync('./error.js', 'utf-8')
   }
}, {
   text: 'And this is an example of a table.'
}, {
   table: {
      title: 'Data',
      headers: ['Code', 'User'],
      rows: [
         ['A-001', 'Alice'],
         ['B-002', `@${m.sender.replace(/@.+/, '')}`]
      ]
   }
}, {
   text: 'You can add text, tables, and code blocks as you like. 😎'
}], m, {
   title: global.header,
   mentions: [m.sender]
})
```

#### v2: citations, links, suggestions, and sources

Mentions and tables are **not** supported in v2.

```javascript
client.sendMetaMsg(m.chat, [{
   text: 'This meta message does not support *~mentions~* or *~tables~*, but offers more variations, such as citations [](https://api.neoxr.eu) and links [Neoxr API](https://api.neoxr.eu).\n\nCode formatting still works:'
}, {
   code: {
      language: 'javascript',
      code: fs.readFileSync('./error.js', 'utf-8')
   }
}, {
   muted: 'There is also muted text like this.'
}, {
   suggestions: ['N', 'E', 'O', 'X', 'R', 'B', 'O', 'T']
}, {
   sources: [{
      icon: 'https://i.pinimg.com/736x/b4/e0/12/b4e012b9e55bc101eb2c89655888e2f1.jpg',
      title: 'Github',
      url: 'https://github.com/neoxr/neoxr-bot'
   }]
}], m, {
   title: global.header
})
```

#### v3: reels, posts, and products

Photo and video media are supported, but mentions and tables are **not**.

```javascript
client.sendMetaMsg(m.chat, [{
   text: 'Photo and video media are supported, but not *~mentions~* or *~tables~*.\n\n---\n\nExample of a reel:'
}, {
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
}, {
   text: '\n\n---\n\nExample of a social media post:'
}, {
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
}, {
   text: '\n\n---\n\nExample of a single product (no slide):\n\n'
}, {
   products: {
      title: 'Script Selfbot (WhatsApp Bot) [Free Update]',
      image: 'https://imgkub.com/images/2026/01/14/image586735a7ca2a894a.jpg',
      sale_price: 'Rp. 65.000',
      brand: 'Neoxr Creative',
      url: `https://wa.me/${Config.owner}`
   }
}, {
   text: '\n'
}, {
   products: {
      title: 'Payment Gateway',
      image: 'https://imgkub.com/images/2026/01/22/image7af565014aadeae6.jpg',
      sale_price: 'Rp. 80.000',
      brand: 'Neoxr Creative',
      url: `https://wa.me/${Config.owner}`
   }
}, {
   text: '\n\n---\n\nExample of a product slide:'
}, {
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
```

## Example Project

A complete, ready-to-run bot built with this library lives at [neoxr-bot](https://github.com/neoxr/neoxr-bot). It includes a plugin loader, a database layer, and many ready-made plugins.