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
const events_1 = require("events");
const chalk_1 = __importDefault(require("chalk"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const pino_1 = __importDefault(require("pino"));
const { makeWASocket, Browsers, DisconnectReason, fetchLatestBaileysVersion, useMultiFileAuthState, makeInMemoryStore, makeCacheableSignalKeyStore, delay, proto, getAggregateVotesInPollMessage } = require('@adiwajshing/baileys');
const functions_1 = __importDefault(require("../Utils/functions"));
const loader_1 = __importDefault(require("../Utils/loader"));
const session_1 = __importDefault(require("../Utils/session"));
const serialize_1 = __importDefault(require("./serialize"));
const message_1 = __importDefault(require("./message"));
const Message = new message_1.default;
const caching_1 = __importDefault(require("../Utils/caching"));
const node_cache_1 = require("@cacheable/node-cache");
const BeautifyConsole = __importStar(require("beautify-console-log"));
const cmd_1 = __importDefault(require("../Utils/cmd"));
const node_cron_1 = __importDefault(require("node-cron"));
const msgRetryCounterCache = new node_cache_1.NodeCache();
const log = BeautifyConsole.default.getInstance();
log.config({
    title: 'Location ~',
    type: ['error', 'warn']
});
const logger = (0, pino_1.default)({ level: 'silent' });
logger.level = 'fatal';
global.neoxr = cmd_1.default;
const pkg = require('../../package.json');
let Baileys;
if (pkg.name === Buffer.from('QG5lb3hyL3di', 'base64').toString('utf-8')) {
    Baileys = class extends events_1.EventEmitter {
        constructor(args = {}, options = {}) {
            super();
            this.plugins = {};
            this.checkVersion = async () => {
                try {
                    const json = await (await fetch('https://api.github.com/repos/neoxr/neoxr-bot/contents/package.json', {
                        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.3' }
                    })).json();
                    if (!json?.content)
                        throw new Error('Invalid repos');
                    const buf = Buffer.from(json.content, json.encoding);
                    const newVersion = JSON.parse(buf.toString('ascii'))?.dependencies?.['@neoxr/wb'];
                    if (!newVersion || ['*', 'latest']?.includes(newVersion))
                        return;
                    const regex = /(?<!\b(?:latest|\*)\b)[~^<>!=xX-]/g;
                    const fixVersion = newVersion.replace(regex, '');
                    const oldVersion = pkg.version.replace(regex, '');
                    if (fixVersion !== oldVersion) {
                        console.log(`\x1b[33mWARNING:\x1B[0m @neoxr/wb is out of date! Update with "npm install @neoxr/wb@${fixVersion}"`);
                    }
                }
                catch (e) { }
            };
            this.init = async () => {
                try {
                    if (typeof this?.session === 'string') {
                        var { state, saveCreds } = await useMultiFileAuthState(this.session);
                    }
                    else if (typeof this?.session === 'object') {
                        var { state, saveCreds, deleteCreds, autoDeleteOldData, restoreCreds } = await this.session;
                    }
                    else {
                        throw new Error('Invalid session format');
                    }
                    this.store = makeInMemoryStore({ logger });
                    this.socket({ state, saveCreds, deleteCreds, autoDeleteOldData, restoreCreds });
                }
                catch (e) {
                    this.emit('error', e);
                }
            };
            this.getMessage = async (key) => {
                if (this.store) {
                    const msg = await this.store.loadMessage(key.remoteJid, key.id);
                    return msg.message || undefined;
                }
                return proto.Message.fromObject({});
            };
            this.socket = async ({ state, saveCreds, deleteCreds, autoDeleteOldData, restoreCreds }) => {
                const { version } = await fetchLatestBaileysVersion();
                this.sock = makeWASocket({
                    version: this.version || version,
                    logger,
                    auth: {
                        creds: state.creds,
                        keys: makeCacheableSignalKeyStore(state.keys, (0, pino_1.default)({ level: 'silent' }))
                    },
                    mobile: false,
                    printQRInTerminal: this.pairingConfig.pairing?.state && this.pairingConfig.pairing.number ? false : true,
                    browser: Browsers.ubuntu('Firefox'),
                    cachedGroupMetadata: async (jid) => caching_1.default.getCache(jid),
                    markOnlineOnConnect: this.online,
                    generateHighQualityLinkPreview: true,
                    syncFullHistory: false,
                    msgRetryCounterCache,
                    getMessage: this.getMessage,
                    ...this.options
                });
                this.store.bind(this.sock.ev);
                if (this.pairingConfig.pairing?.state && !this.sock.authState.creds.registered) {
                    const phoneNumber = this.pairingConfig.pairing.number;
                    await delay(2000);
                    try {
                        let code = await this.sock.requestPairingCode(phoneNumber);
                        code = code.match(/.{1,4}/g).join("-") || code;
                        this.emit('connect', { ...this.pairingConfig, code });
                        console.log(chalk_1.default.black(chalk_1.default.bgGreen(` Your Pairing Code `)), ' : ' + chalk_1.default.black(chalk_1.default.white(code)));
                    }
                    catch { }
                }
                if (autoDeleteOldData) {
                    node_cron_1.default.schedule('00 00 * * *', async () => {
                        await autoDeleteOldData();
                    }, {
                        scheduled: true,
                        timezone: process?.env?.TZ
                    });
                }
                this.sock.ev.on('connection.update', async (update) => {
                    try {
                        const { lastDisconnect, connection, receivedPendingNotifications } = update;
                        if (receivedPendingNotifications && !this.sock.authState.creds?.myAppStateKeyId) {
                            this.sock.ev.flush();
                        }
                        if (connection === 'connecting') {
                            if (this.plugsdir) {
                                if (!this.type) {
                                    console.log(chalk_1.default.black(chalk_1.default.bgRed(` Error `)), ' : ' + chalk_1.default.black(chalk_1.default.white(`You have to add "type" option --neoxr-v1 or --neoxr-v2`)));
                                    process.exit(0);
                                }
                                else if (this.type && !['--neoxr-v1', '--neoxr-v2'].includes(this.type)) {
                                    console.log(chalk_1.default.black(chalk_1.default.bgRed(` Error `)), ' : ' + chalk_1.default.black(chalk_1.default.white(`There is only --neoxr-v1 and --neoxr-v2`)));
                                    process.exit(0);
                                }
                            }
                            this.emit('connect', { message: `Connecting . . .` });
                        }
                        else if (connection === 'open') {
                            const isInfo = `Connected, you login as ${this.sock.user.name || this.sock.user.verifiedName || 'WhatsApp Bot'}`;
                            console.log(chalk_1.default.black(chalk_1.default.bgGreen(` Success `)), ' : ' + chalk_1.default.black(chalk_1.default.white(isInfo)));
                            Message.createMessageFunction(this.sock, this.bypass_disappearing, caching_1.default);
                            this.initEvent();
                            if (this.session) {
                                session_1.default.backup(this.sock, this.session);
                            }
                            this.initPlugin();
                            this.emit('connect', { message: isInfo });
                            this.emit('ready', this.sock);
                        }
                        else if (connection === 'close') {
                            const reason = lastDisconnect?.error?.output?.statusCode || false;
                            if (!reason)
                                return;
                            if (reason === DisconnectReason.badSession) {
                                this.emit('error', { message: `Bad session` });
                                if (typeof this?.session === 'string') {
                                    this.clearSession({ deleteCreds });
                                    const check = await session_1.default.isBackupExist(this.sock);
                                    if (check) {
                                        await session_1.default.restore(this.sock, this.session);
                                        await delay(1500);
                                        this.init();
                                    }
                                }
                                else {
                                    await restoreCreds();
                                    await delay(1500);
                                    this.init();
                                }
                            }
                            else if (reason === DisconnectReason.connectionClosed) {
                                this.emit('error', { message: `Connection closed, reconnecting . . .` });
                                this.init();
                            }
                            else if (reason === DisconnectReason.connectionLost) {
                                this.emit('error', { message: `Connection lost, reconnecting . . .` });
                                this.init();
                            }
                            else if (reason === DisconnectReason.connectionReplaced) {
                                this.emit('error', { message: `Session running on another server` });
                                process.exit(0);
                            }
                            else if (reason === DisconnectReason.loggedOut) {
                                this.emit('error', { message: `Device logged out` });
                                this.clearSession({ deleteCreds });
                            }
                            else if (reason === DisconnectReason.restartRequired) {
                                this.init();
                            }
                            else if (reason === DisconnectReason.multideviceMismatch) {
                                this.emit('error', { message: `Multi device mismatch` });
                                this.clearSessionAndRestart({ deleteCreds });
                            }
                            else if (reason === DisconnectReason.timedOut) {
                                this.emit('error', { message: `Connection timed-out, reconnecting . . .` });
                                this.init();
                            }
                            else if (reason === DisconnectReason.unavailableService) {
                                this.emit('error', { message: `Service unavailable, reconnecting . . .` });
                                this.init();
                            }
                            else if (reason === 405) {
                                this.emit('error', { message: `Method not allowed` });
                                this.clearSessionAndRestart({ deleteCreds });
                            }
                            else if (reason === 503) {
                                this.init();
                            }
                            else {
                                this.emit('error', { message: `Connection error. (Reason: ${reason})` });
                                this.clearSession({ deleteCreds });
                            }
                        }
                    }
                    catch (e) { }
                });
                this.sock.ev.on('creds.update', saveCreds);
                this.sock.ws.on('CB:call', (json) => {
                    if (/offer/.test(json?.content?.[0]?.tag || 'none')) {
                        this.emit('caller', {
                            id: json?.content?.[0]?.attrs?.['call-id'],
                            jid: json?.content?.[0]?.attrs?.['call-creator']
                        });
                    }
                    else {
                        this.emit('caller', false);
                    }
                });
            };
            this.clearSession = async ({ deleteCreds }) => {
                if (deleteCreds) {
                    await deleteCreds();
                }
                else {
                    const PATH_BASE = path_1.default.join(process.cwd(), this.session);
                    fs_1.default.rmSync(PATH_BASE, { recursive: true, force: true });
                }
            };
            this.clearSessionAndRestart = async ({ deleteCreds }) => {
                if (deleteCreds) {
                    await deleteCreds();
                }
                else {
                    const PATH_BASE = path_1.default.join(process.cwd(), this.session);
                    fs_1.default.rmSync(PATH_BASE, { recursive: true, force: true });
                }
                this.init();
            };
            this.busEvents = () => [
                {
                    event: 'messages.upsert',
                    execute: async (chatUpdate) => {
                        let m = chatUpdate.messages[0];
                        if (!m.message)
                            return;
                        this.initSetting();
                        serialize_1.default.bind(this.sock, m, this.bypass_disappearing);
                        if (m.msg && m.msg.type === 0) {
                            let copy = await this.store.loadMessage(m.chat, m.key.id, this.sock);
                            for (let i = 0; i < 5; i++) {
                                if (copy.mtype == 'protocolMessage') {
                                    copy = await this.store.loadMessage(m.chat, m.key.id, this.sock);
                                    await delay(1000);
                                    if (copy.mtype != 'protocolMessage')
                                        break;
                                }
                            }
                            const object = proto.WebMessageInfo.fromObject({
                                key: copy.key,
                                message: { [copy.mtype]: copy.msg }
                            });
                            this.emit('message.delete', { origin: m, delete: object });
                        }
                        else {
                            this.emit('message.delete', false);
                        }
                        const body = typeof m.text == 'string' ? m.text : false;
                        const getPrefix = body ? functions_1.default.isEmojiPrefix(body) ? functions_1.default.getEmoji(body)?.[0] : body.charAt(0) : '';
                        const prefix = (this.setting.multiprefix ? this.setting.prefix.includes(getPrefix) : this.setting.onlyprefix == getPrefix) ? getPrefix : false;
                        const args = body && body.replace(prefix, '').split ` `.filter(v => v);
                        const command = args && /(String|Number)/.test(args.constructor.name) ? args.toLowerCase() : args && args.constructor.name == 'Array' && args.length > 0 ? args.shift().toLowerCase() : false;
                        const clean = body && body.replace(prefix, '').trim().split ` `.slice(1);
                        const text = clean ? clean.join ` ` : false;
                        const prefixes = this.setting.multiprefix ? this.setting.prefix : [this.setting.onlyprefix];
                        const corePrefix = this.setting.prefix.concat([this.setting.onlyprefix]);
                        const core = {
                            prefix: body ? functions_1.default.isEmojiPrefix(body) ? functions_1.default.getEmoji(body)?.[0] : body.charAt(0) : '',
                            command: body ? corePrefix.some(v => body.startsWith(v)) ? body.replace(corePrefix.find(v => body.startsWith(v)), '').split ` `[0] : body.split ` `[0] : '',
                            corePrefix
                        };
                        this.emit('message', { store: this.store, m, body, prefix: prefix || '', plugins: this.plugins, commands: this.commands, args, command, text, prefixes, core });
                        this.sock.chats = this.sock.chats || [];
                        const is_found = this.sock.chats.find((v) => v.jid === this.sock.decodeJid(m.sender));
                        if (is_found)
                            is_found.name = m.pushName;
                        if (m.sender.endsWith('.net') && !is_found)
                            this.sock.chats.push({ jid: this.sock.decodeJid(m.sender), name: m.pushName || 'bot' });
                        this.sock.getNameV2 = (jid) => {
                            const isFound = this.sock.chats.find((v) => v.jid === this.sock.decodeJid(jid));
                            return isFound ? isFound.name : null;
                        };
                        this.emit('chats.set', this.sock.chats);
                    }
                },
                {
                    event: 'messages.update',
                    execute: async (chatUpdate) => {
                        for (const { key, update } of chatUpdate) {
                            if (update.pollUpdates) {
                                const pollCreation = await this.getMessage(key);
                                if (pollCreation) {
                                    const pollMessage = await getAggregateVotesInPollMessage({ message: pollCreation, pollUpdates: update.pollUpdates });
                                    const [msg] = chatUpdate;
                                    const voters = pollMessage.find(poll => poll.voters.length > 0);
                                    const date = new Date();
                                    let m = {
                                        ...msg,
                                        messageTimestamp: date.getTime() / 1000,
                                        body: voters ? voters.name : '',
                                        sender: key.remoteJid,
                                        message: pollCreation
                                    };
                                    this.initSetting();
                                    serialize_1.default.bind(this.sock, m);
                                    const body = typeof m.text == 'string' ? m.text : false;
                                    const getPrefix = body ? functions_1.default.isEmojiPrefix(body) ? functions_1.default.getEmoji(body)?.[0] : body.charAt(0) : '';
                                    const prefix = (this.setting.multiprefix ? this.setting.prefix.includes(getPrefix) : this.setting.onlyprefix == getPrefix) ? getPrefix : false;
                                    const args = body && body.replace(prefix, '').split ` `.filter(v => v);
                                    const command = args && /(String|Number)/.test(args.constructor.name) ? args.toLowerCase() : args && args.constructor.name == 'Array' && args.length > 0 ? args.shift().toLowerCase() : false;
                                    const clean = body && body.replace(prefix, '').trim().split ` `.slice(1);
                                    const text = clean ? clean.join ` ` : false;
                                    const prefixes = this.setting.multiprefix ? this.setting.prefix : [this.setting.onlyprefix];
                                    const corePrefix = this.setting.prefix.concat([this.setting.onlyprefix]);
                                    const core = {
                                        prefix: body ? functions_1.default.isEmojiPrefix(body) ? functions_1.default.getEmoji(body)?.[0] : body.charAt(0) : '',
                                        command: body ? corePrefix.some(v => body.startsWith(v)) ? body.replace(corePrefix.find(v => body.startsWith(v)), '').split ` `[0] : body.split ` `[0] : '',
                                        corePrefix
                                    };
                                    this.emit('message', { store: this.store, m, body, prefix: prefix || '', plugins: this.plugins, commands: this.commands, args, command, text, prefixes, core });
                                    this.emit('poll', m);
                                }
                            }
                        }
                    }
                },
                {
                    event: 'message-receipt.update',
                    execute: (update) => this.emit('message.receipt', update)
                },
                {
                    event: 'contacts.update',
                    execute: (update) => {
                        for (let contact of update) {
                            let id = this.sock.decodeJid(contact.id);
                            if (this.store && this.store.contacts)
                                this.store.contacts[id] = { id, name: contact.notify };
                        }
                    }
                },
                {
                    event: 'presence.update',
                    execute: (update) => this.emit('presence.update', update)
                },
                {
                    event: 'groups.update',
                    execute: async (update) => {
                        try {
                            let jid = update?.[0]?.id;
                            const getData = async () => {
                                try {
                                    const metadata = await this.sock.groupMetadata(jid);
                                    return metadata || null;
                                }
                                catch (e) {
                                    return null;
                                }
                            };
                            await caching_1.default.cacheFunction(jid, getData);
                        }
                        catch (e) {
                            console.log(e);
                        }
                    }
                },
                {
                    event: 'group-participants.update',
                    execute: async (update) => {
                        try {
                            const getData = async () => {
                                try {
                                    const metadata = await this.sock.groupMetadata(update.id);
                                    return metadata || null;
                                }
                                catch (e) {
                                    return null;
                                }
                            };
                            await caching_1.default.cacheFunction(update.id, getData);
                            const meta = await this.sock.groupMetadata(update.id);
                            if (!meta)
                                return;
                            if (update.action === 'add') {
                                this.emit('group.add', { _act: 'add', jid: update.id, subject: meta.subject, member: update.participants[0], groupMetadata: meta });
                            }
                            else if (update.action === 'remove') {
                                this.emit('group.remove', { _act: 'remove', jid: update.id, subject: meta.subject, member: update.participants[0], groupMetadata: meta });
                            }
                            else if (update.action === 'promote') {
                                this.emit('group.promote', { _act: 'promote', jid: update.id, subject: meta.subject, member: update.participants[0], groupMetadata: meta });
                            }
                            else if (update.action === 'demote') {
                                this.emit('group.demote', { _act: 'demote', jid: update.id, subject: meta.subject, member: update.participants[0], groupMetadata: meta });
                            }
                        }
                        catch (e) {
                            console.log(e);
                        }
                    }
                }
            ];
            this.initEvent = () => {
                const listEvents = this.busEvents();
                for (const { event, execute } of listEvents) {
                    this.sock.ev.on(event, execute);
                }
            };
            this.updatePlugin = () => {
                try {
                    const PATH_BASE = path_1.default.join(process.cwd(), this.plugsdir);
                    if (this.plugsdir && fs_1.default.existsSync(PATH_BASE)) {
                        const files = this.loader.files;
                        files.filter(v => v.endsWith('.js')).forEach(file => {
                            const resolvedPath = require.resolve(file);
                            if (require.cache[resolvedPath]) {
                                delete require.cache[resolvedPath];
                            }
                        });
                        if (this.type === '--neoxr-v1') {
                            delete global.neoxr;
                            this.plugins = Object.fromEntries(files.filter(v => v.endsWith('.js')).filter(v => !this.setting.hidden.includes(require(v).category)).filter(v => !this.setting.pluginDisable.includes(path_1.default.basename(v).replace('.js', ''))).map(file => [path_1.default.basename(file).replace('.js', ''), require(file)]));
                            this.commands = functions_1.default.arrayJoin(Object.values(Object.fromEntries(Object.entries(this.plugins).filter(([name, prop]) => prop.run.usage))).map(v => v.run.usage)).concat(functions_1.default.arrayJoin(Object.values(Object.fromEntries(Object.entries(this.plugins).filter(([name, prop]) => prop.run.hidden))).map(v => v.run.hidden)));
                        }
                        else if (this.type === '--neoxr-v2') {
                            files.filter(v => v.endsWith('.js')).map(file => require(file));
                            this.plugins = (global.neoxr || []).plugins.filter(v => !this.setting.hidden.includes(v.category)).filter(v => !this.setting.pluginDisable.includes(v.pluginName));
                            this.commands = (global.neoxr || []).plugins.filter(v => v.usage).map(v => v.usage).concat((global.neoxr || []).plugins.filter(v => v.hidden).map(v => v.hidden)).flat(Infinity);
                        }
                        else {
                            this.plugins = [];
                            this.commands = [];
                        }
                    }
                    else {
                        this.plugins = [];
                        this.commands = [];
                    }
                }
                catch (e) {
                    this.plugins = [];
                    this.commands = [];
                    console.error(e);
                }
            };
            this.initSetting = () => {
                try {
                    const isClientJid = this.sock.decodeJid(this.sock.user.id);
                    const isExists = global.db && global.db.bots.length > 0 ? global.db.bots.find(v => v.jid === isClientJid) : false;
                    this.setting = isExists ? Object.values(isExists.data.setting).length > 0 ? isExists.data.setting : Object.values(global.db.setting).length > 0 ? global.db.setting : (this.options.setup || {
                        multiprefix: true,
                        prefix: ['.', '#', '!', '/'],
                        onlyprefix: '+',
                        hidden: [],
                        pluginDisable: []
                    }) : (this.options.setup || {
                        multiprefix: true,
                        prefix: ['.', '#', '!', '/'],
                        onlyprefix: '+',
                        hidden: [],
                        pluginDisable: []
                    });
                }
                catch {
                    this.setting = global.db && global.db.setting && Object.values(global.db.setting).length > 0 ? global.db.setting : (this.options.setup || {
                        multiprefix: true,
                        prefix: ['.', '#', '!', '/'],
                        onlyprefix: '+',
                        hidden: [],
                        pluginDisable: []
                    });
                }
            };
            this.setMaxListeners(20);
            this.sock = null;
            this.store = null;
            this.plugins = [];
            this.commands = [];
            this.online = args?.online || false;
            this.plugsdir = args?.plugsdir || '';
            this.type = args?.type || '';
            this.session = args?.session || 'session';
            this.version = args?.version || [2, 2318, 11];
            this.bypass_disappearing = args?.bypass_disappearing || false;
            this.options = options;
            this.pairingConfig = this.options?.pairing ? this.options : JSON.parse(fs_1.default.readFileSync('./config.json', 'utf-8'));
            this.setting = global.db?.setting && Object.values(global.db.setting).length > 0 ? global.db.setting : (this.options.setup || {
                multiprefix: true,
                prefix: ['.', '#', '!', '/'],
                onlyprefix: '+',
                hidden: [],
                pluginDisable: []
            });
            this.loader = new loader_1.default();
            this.listenerRegistry = new Map();
            this.init();
            this.checkVersion();
        }
        register(event, handler, maxCalls = 2, resetAfter = true) {
            if (!this.listenerRegistry.has(event)) {
                this.listenerRegistry.set(event, { callCount: 0, resetAfter });
                this.on(event, this._createListener(event, handler, maxCalls, resetAfter));
            }
        }
        _createListener(event, handler, maxCalls, resetAfter) {
            const registry = this.listenerRegistry.get(event);
            return (...args) => {
                if (registry.callCount < maxCalls) {
                    registry.callCount++;
                    handler(...args);
                }
                if (registry.callCount >= maxCalls) {
                    this.removeListener(event, this._createListener);
                    if (resetAfter) {
                        registry.callCount = 0;
                        this.register(event, handler, maxCalls, resetAfter);
                    }
                }
            };
        }
        async initPlugin() {
            try {
                const PATH_BASE = path_1.default.join(process.cwd(), this.plugsdir);
                if (this.plugsdir && fs_1.default.existsSync(PATH_BASE)) {
                    const files = await this.loader.scan(this.plugsdir);
                    if (this.type === '--neoxr-v1') {
                        delete global.neoxr;
                        this.plugins = Object.fromEntries(files.filter(v => v.endsWith('.js')).filter(v => !this.setting.hidden.includes(require(v).category)).filter(v => !this.setting.pluginDisable.includes(path_1.default.basename(v).replace('.js', ''))).map(file => [path_1.default.basename(file).replace('.js', ''), require(file)]));
                        this.commands = functions_1.default.arrayJoin(Object.values(Object.fromEntries(Object.entries(this.plugins).filter(([name, prop]) => prop.run.usage))).map(v => v.run.usage)).concat(functions_1.default.arrayJoin(Object.values(Object.fromEntries(Object.entries(this.plugins).filter(([name, prop]) => prop.run.hidden))).map(v => v.run.hidden)));
                        console.log(chalk_1.default.black(chalk_1.default.cyan(`System successfully loaded ${files.length} plugin files and ${this.commands.length} commands`)));
                    }
                    else if (this.type === '--neoxr-v2') {
                        files.filter(v => v.endsWith('.js')).map(file => require(file));
                        this.plugins = (global.neoxr || []).plugins.filter(v => !this.setting.hidden.includes(v.category)).filter(v => !this.setting.pluginDisable.includes(v.pluginName));
                        this.commands = (global.neoxr || []).plugins.filter(v => v.usage).map(v => v.usage).concat((global.neoxr || []).plugins.filter(v => v.hidden).map(v => v.hidden)).flat(Infinity);
                        console.log(chalk_1.default.black(chalk_1.default.cyan(`System successfully loaded ${files.length} plugin files and ${this.commands.length} commands`)));
                    }
                    else {
                        this.plugins = [];
                        this.commands = [];
                    }
                }
                else {
                    this.plugins = [];
                    this.commands = [];
                }
            }
            catch (e) {
                console.log(chalk_1.default.black(chalk_1.default.red(`Plugin failed to load because there was a plugin error, please check and fix it`)));
                this.plugins = [];
                this.commands = [];
                log.error(e);
            }
            this.loader.watchChanges(this.updatePlugin.bind(this));
        }
    };
}
else {
    Baileys = class extends events_1.EventEmitter {
        constructor(args = {}, options = {}) {
            super();
            this.neoxr = () => {
                console.log(chalk_1.default.redBright(String.fromCharCode(89, 111, 117, 32, 99, 97, 110, 39, 116, 32, 117, 115, 101, 32, 116, 104, 105, 115, 32, 112, 114, 111, 103, 114, 97, 109, 32, 98, 101, 99, 97, 117, 115, 101, 32, 111, 102, 32, 99, 111, 112, 121, 114, 105, 103, 104, 116, 32, 105, 115, 115, 117, 101, 115)) + '\n\n' + chalk_1.default.black(chalk_1.default.bgCyan(Buffer.from('IE9yaWdpbmFsIA==', 'base64').toString('utf-8'))) + ' : ' + Buffer.from('aHR0cHM6Ly93d3cubnBtanMuY29tL3BhY2thZ2UvQG5lb3hyL3di', 'base64').toString('utf-8'));
            };
            this.neoxr();
        }
    };
}
exports.default = Baileys;
