require('dotenv').config()
const fs = require('fs')

// No Locked can be manipulated >_<
const Function = new (require('./Utils/Function'))
const Scraper = new (require('./Utils/Scraper'))

class Component {
   constructor() {
      this.Config = JSON.parse(fs.readFileSync('./config.json'))
      this.Client = require('./Utils/_Connection')
      this.Baileys = require('./Utils/Connection')
      this.Converter = new (require('./Utils/Converter'))
      this.Function = Function
      this.Scraper = Scraper
      this.Scandir = new (require('./Utils/Loader'))
      this.Message = require('./Utils/Message')
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
   }
}

module.exports = Component