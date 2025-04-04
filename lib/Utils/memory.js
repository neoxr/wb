"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.store = void 0;
const node_cache_1 = __importDefault(require("@cacheable/node-cache"));
const cache = new node_cache_1.default({
    stdTTL: 60 * 60 * 12,
    checkperiod: 60 * 60 * 1
});
const fs_1 = __importDefault(require("fs"));
const baileys = fs_1.default.existsSync('./node_modules/@adiwajshing/baileys')
    ? require('@adiwajshing/baileys')
    : fs_1.default.existsSync('./node_modules/@neoxr/baileys')
        ? require('@neoxr/baileys')
        : fs_1.default.existsSync('./node_modules/@whiskeysockets/baileys')
            ? require('@whiskeysockets/baileys')
            : require('baileys');
const { proto: { IWebMessageInfo, IUserReceipt, IReaction, IMessageKey } } = baileys;
const messages = {};
const chats = {};
const contacts = {};
const state = { connection: 'close' };
const history = {
    messages: messages,
    chats: chats,
    contacts: contacts,
    state: state
};
let store = cache.get('history');
exports.store = store;
if (!store) {
    cache.set('history', history);
    exports.store = store = history;
}
else {
    exports.store = store = cache.get('history');
}
const getKeyAuthor = (key, meId = 'me') => ((key?.fromMe ? meId : key?.participant || key?.remoteJid) || '');
store.contactsUpsert = (newContacts) => {
    const oldContacts = new Set(Object.keys(contacts));
    for (const contact of newContacts) {
        oldContacts.delete(contact.id);
        contacts[contact.id] = Object.assign(contacts[contact.id] || {}, contact);
    }
    return oldContacts;
};
store.updateMessageWithReceipt = (msg, receipt) => {
    msg.userReceipt = msg.userReceipt || [];
    const recp = msg.userReceipt.find(m => m.userJid === receipt.userJid);
    if (recp) {
        Object.assign(recp, receipt);
    }
    else {
        msg.userReceipt.push(receipt);
    }
};
store.updateMessageWithReaction = (msg, reaction) => {
    const authorID = getKeyAuthor(reaction.key);
    const reactions = (msg.reactions || [])
        .filter(r => getKeyAuthor(r.key) !== authorID);
    if (reaction.text) {
        reactions.push(reaction);
    }
    msg.reactions = reactions;
};
store.loadMessage = (jid, id) => {
    try {
        const json = store?.messages?.[jid]?.find(v => v.id === id);
        return json;
    }
    catch (e) {
        return null;
    }
};
store.loadMessages = (jid, count) => {
    try {
        const json = count ? store?.messages?.[jid]?.slice(0, count) : store?.messages?.[jid];
        return json?.reverse();
    }
    catch (e) {
        return null;
    }
};
