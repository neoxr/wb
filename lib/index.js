"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Component = exports.Spam = exports.Caching = exports.Chiper = exports.Converter = exports.Logs = exports.JID = exports.Cooldown = exports.Scraper = exports.Function = exports.Connector = exports.Client = exports.Baileys = void 0;
require("dotenv/config");
const fs_1 = __importDefault(require("fs"));
var connection_1 = require("./Socket/connection");
Object.defineProperty(exports, "Baileys", { enumerable: true, get: function () { return __importDefault(connection_1).default; } });
var _connection_1 = require("./Socket/_connection");
Object.defineProperty(exports, "Client", { enumerable: true, get: function () { return __importDefault(_connection_1).default; } });
var connector_1 = require("./Socket/connector");
Object.defineProperty(exports, "Connector", { enumerable: true, get: function () { return __importDefault(connector_1).default; } });
var functions_1 = require("./Utils/functions");
Object.defineProperty(exports, "Function", { enumerable: true, get: function () { return __importDefault(functions_1).default; } });
var scraper_1 = require("./Utils/scraper");
Object.defineProperty(exports, "Scraper", { enumerable: true, get: function () { return __importDefault(scraper_1).default; } });
var cooldown_1 = require("./Utils/cooldown");
Object.defineProperty(exports, "Cooldown", { enumerable: true, get: function () { return __importDefault(cooldown_1).default; } });
var jid_helper_1 = require("./Utils/jid-helper");
Object.defineProperty(exports, "JID", { enumerable: true, get: function () { return __importDefault(jid_helper_1).default; } });
var logs_1 = require("./Utils/logs");
Object.defineProperty(exports, "Logs", { enumerable: true, get: function () { return __importDefault(logs_1).default; } });
var converter_1 = require("./Utils/converter");
Object.defineProperty(exports, "Converter", { enumerable: true, get: function () { return __importDefault(converter_1).default; } });
var chiper_1 = require("./Utils/chiper");
Object.defineProperty(exports, "Chiper", { enumerable: true, get: function () { return __importDefault(chiper_1).default; } });
var caching_1 = require("./Utils/caching");
Object.defineProperty(exports, "Caching", { enumerable: true, get: function () { return __importDefault(caching_1).default; } });
var spam_1 = require("./Utils/spam");
Object.defineProperty(exports, "Spam", { enumerable: true, get: function () { return __importDefault(spam_1).default; } });
const connection_2 = __importDefault(require("./Socket/connection"));
const _connection_2 = __importDefault(require("./Socket/_connection"));
const connector_2 = __importDefault(require("./Socket/connector"));
const functions_2 = __importDefault(require("./Utils/functions"));
const scraper_2 = __importDefault(require("./Utils/scraper"));
const cooldown_2 = __importDefault(require("./Utils/cooldown"));
const jid_helper_2 = __importDefault(require("./Utils/jid-helper"));
const logs_2 = __importDefault(require("./Utils/logs"));
const converter_2 = __importDefault(require("./Utils/converter"));
const chiper_2 = __importDefault(require("./Utils/chiper"));
const caching_2 = __importDefault(require("./Utils/caching"));
const spam_2 = __importDefault(require("./Utils/spam"));
const Config = JSON.parse(fs_1.default.readFileSync('./config.json', 'utf-8'));
const NeoxrApi = require('@neoxr/api');
const Version = require('../package.json')?.version;
class Component {
    constructor() {
        this.Config = Config;
        this.Baileys = connection_2.default;
        this.Client = _connection_2.default;
        this.Connector = connector_2.default;
        this.Function = functions_2.default;
        this.Scraper = scraper_2.default;
        this.Cooldown = cooldown_2.default;
        this.JID = jid_helper_2.default;
        this.Logs = logs_2.default;
        this.Converter = converter_2.default;
        this.Chiper = chiper_2.default;
        this.Caching = caching_2.default;
        this.Spam = spam_2.default;
        this.NeoxrApi = NeoxrApi;
        this.Version = Version;
    }
}
exports.Component = Component;
//# sourceMappingURL=index.js.map