require('dotenv').config()
const fs = require('fs')
module.exports = class Component {
   Config = JSON.parse(fs.readFileSync('./config.json'))
   Client = require('./Utils/_Connection')
   Baileys = require('./Utils/Connection')
   Converter = new (require('./Utils/Converter'))
   Function = new (require('./Utils/Function'))
   Scraper = new (require('./Utils/Scraper'))
   Local = new(require('./Utils/Local'))
   MongoDB = /mongo/.test(process.env.DATABASE_URL) && process.env.DATABASE_URL ? new (require('./Utils/Mongo')) : false
   PostgreSQL = /postgres/.test(process.env.DATABASE_URL) && process.env.DATABASE_URL ? new (require('./Utils/Postgre')) : false
   Dataset = process.env.DATABASE_URL ? new (require('./Utils/Multi')) : false
   Scandir = new (require('./Utils/Loader'))
   Message = require('./Utils/Message')
   Cloud = require('./Utils/_Store')
   InvCloud = require('./Utils/Store')
   Logs = require('./Utils/Logs')
   NeoxrCommands = new(require('./Utils/Cmd'))
   NeoxrApi = require('@neoxr/api')
   Cooldown = require('./Utils/Cooldown')
   Queue = require('./Utils/Queue')
   Spam = require('./Utils/Spam')
   Session = require('./Utils/Session')
   Connector = require('./Utils/Connector')
}