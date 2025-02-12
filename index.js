require('dotenv').config()
const fs = require('fs')

// No Locked, it can be manipulated >_<
const Function = new (require('./Utils/Function'))
const Scraper = new (require('./Utils/Scraper'))
const JID = require('./Utils/JidHelper')

class Component {
   constructor() {
      this.Config = fs.existsSync('./config.json') ? JSON.parse(fs.readFileSync('./config.json')) : {}
      this.Client = require('./Utils/_Connection')
      this.Baileys = require('./Utils/Connection')
      this.Converter = new (require('./Utils/Converter'))
      this.Function = Function
      this.Scraper = Scraper
      this.JID = JID
      this.Chiper = require('./Utils/Chiper')
      this.Scandir = new (require('./Utils/Loader'))
      this.Message = require('./Utils/Message')
      this.MongoDB = /mongo/.test(process.env.DATABASE_URL) && process.env.DATABASE_URL ? new (require('./Utils/Mongo')) : false
      this.PostgreSQL = /postgres/.test(process.env.DATABASE_URL) && process.env.DATABASE_URL ? new (require('./Utils/Postgres')) : false
      this.Cloud = require('./Utils/_Store')
      this.InvCloud = require('./Utils/Store')
      this.Logs = require('./Utils/Logs')
      this.NeoxrCommands = new (require('./Utils/Cmd'))
      this.NeoxrApi = require('@neoxr/api')
      this.Cooldown = require('./Utils/Cooldown')
      this.Queue = require('./Utils/Queue')
      this.Spam = require('./Utils/Spam')
      this.Session = require('./Utils/Session')
      this.Connector = require('./Utils/Connector')
      this.Caching = require('./Utils/Caching')
   }
}

module.exports = Component