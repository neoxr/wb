"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const env = JSON.parse(fs_1.default.readFileSync('./config.json', 'utf-8'));
let bot = [];
exports.default = (client) => {
    let hostJid;
    let clientJid;
    let findJid;
    if (env && client) {
        hostJid = String(client.decodeJid(client.user.id).replace(/@.+/, '')) === String(env.pairing.number);
        clientJid = client.decodeJid(client.user.id);
        findJid = Object.freeze({
            bot: (jid) => global?.db?.bots?.find((v) => v.jid === jid),
            group: (jid) => global?.db?.groups.find((v) => v.jid === jid),
            chat: (jid) => global?.db?.chats.find((v) => v.jid === jid),
            user: (jid) => global?.db?.users.find((v) => v.jid === jid)
        });
    }
    const getbot = (jid) => bot.find(v => v.jid === jid)?.socket;
    const setbot = (jid, socket) => bot.push({
        jid: jid,
        socket: socket
    });
    return { hostJid, clientJid, findJid, bot, getbot, setbot };
};
