require('dotenv').config()
const { Baileys, Scandir } = require('./system/baileys')
const Converter = new (require('./system/converter'))
const Function = new (require('./system/functions'))
const Scraper = new (require('./system/scraper'))
const MongoDB = /mongo/.test(process.env.DATABASE_URL) && process.env.DATABASE_URL ? new (require('./system/mongo')) : false
const PostgreSQL = /postgres/.test(process.env.DATABASE_URL) && process.env.DATABASE_URL ? new (require('./system/pg')) : false
const Dataset = process.env.DATABASE_URL ? new (require('./system/multidb')) : false
const Logs = require('./system/logs')
const NeoxrCommands = new (require('./system/neoxr'))
const NeoxrApi = require('./system/neoxrApi')
module.exports = class Component {
   Baileys = Baileys
   Converter = Converter
   Function = Function
   Scraper = Scraper
   MongoDB = MongoDB
   PostgreSQL = PostgreSQL
   Dataset = Dataset
   Scandir = Scandir
   Logs = Logs
   NeoxrCommands = NeoxrCommands
   NeoxrApi = NeoxrApi
}