"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Version = exports.NeoxrApi = exports.Utils = exports.Spam = exports.Scraper = exports.JID = exports.Instance = exports.Converter = exports.Cooldown = exports.Config = exports.Database = exports.Client = exports.Chiper = exports.CryptoKey = void 0;
require("dotenv/config");
const node_fs_1 = __importDefault(require("node:fs"));
const path_1 = __importDefault(require("path"));
const CACHE_DIR = path_1.default.join(process.cwd(), '.cache');
if (!node_fs_1.default.existsSync(CACHE_DIR)) {
    node_fs_1.default.mkdirSync(CACHE_DIR);
}
const cryptokey_js_1 = __importDefault(require("./Utils/cryptokey.js"));
exports.CryptoKey = cryptokey_js_1.default;
const chiper_js_1 = __importDefault(require("./Utils/chiper.js"));
exports.Chiper = chiper_js_1.default;
const connection_js_1 = __importDefault(require("./Core/connection.js"));
exports.Client = connection_js_1.default;
const cooldown_js_1 = __importDefault(require("./Utils/cooldown.js"));
exports.Cooldown = cooldown_js_1.default;
const converter_js_1 = __importDefault(require("./Utils/converter.js"));
exports.Converter = converter_js_1.default;
const Database = __importStar(require("./Database/index.js"));
exports.Database = Database;
const instance_js_1 = __importDefault(require("./Core/instance.js"));
exports.Instance = instance_js_1.default;
const jid_helper_js_1 = __importDefault(require("./Utils/jid-helper.js"));
exports.JID = jid_helper_js_1.default;
const scraper_js_1 = __importDefault(require("./Utils/scraper.js"));
const spam_js_1 = __importDefault(require("./Utils/spam.js"));
exports.Spam = spam_js_1.default;
const Functions = __importStar(require("./Utils/functions.js"));
const index_js_1 = require("./Types/index.js");
const Config = node_fs_1.default.existsSync('./config.json') ? JSON.parse(node_fs_1.default.readFileSync('./config.json', 'utf-8')) : {};
exports.Config = Config;
const api_1 = __importDefault(require("@neoxr/api"));
exports.NeoxrApi = api_1.default;
const Version = index_js_1.pkg.version;
exports.Version = Version;
const Utils = { ...Functions };
exports.Utils = Utils;
const Scraper = { ...scraper_js_1.default };
exports.Scraper = Scraper;
//# sourceMappingURL=index.js.map