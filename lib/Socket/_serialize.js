"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const message_1 = __importDefault(require("./message"));
const fs_1 = __importDefault(require("fs"));
const baileys = fs_1.default.existsSync('./node_modules/@adiwajshing/baileys')
    ? require('@adiwajshing/baileys')
    : fs_1.default.existsSync('./node_modules/@neoxr/baileys')
        ? require('@neoxr/baileys')
        : fs_1.default.existsSync('./node_modules/@whiskeysockets/baileys')
            ? require('@whiskeysockets/baileys')
            : require('baileys');
const { proto } = baileys;
class Serialize extends message_1.default {
    constructor() {
        super(...arguments);
        this.mention = (text) => {
            return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net');
        };
    }
    bind(parent, m, bypassDisappearing = false) {
        try {
            if (!m)
                return m;
            let M = proto.WebMessageInfo;
            const getTypeMsgV2 = () => {
                try {
                    return Object.keys(m.message)[0] === 'senderKeyDistributionMessage'
                        ? (Object.keys(m.message)[2] === 'messageContextInfo'
                            ? Object.keys(m.message)[1]
                            : Object.keys(m.message)[2])
                        : (Object.keys(m.message)[0] !== 'messageContextInfo'
                            ? Object.keys(m.message)[0]
                            : Object.keys(m.message)[1]);
                }
                catch {
                    return null;
                }
            };
            if (m.key) {
                m.id = m.key.id;
                m.isBot = /pollCreationMessage/.test(getTypeMsgV2()) ? false : (m.id.length === 16 || m.id.startsWith('3EB0') || /neoxr/i.test(m.id));
                m.chat = m.key.remoteJid;
                m.fromMe = /pollCreationMessage/.test(getTypeMsgV2()) ? false : m.key.fromMe;
                m.isGroup = m.chat.endsWith('@g.us');
                m.sender = m.fromMe ? (parent.user.id.split(":")[0] + '@s.whatsapp.net' || parent.user.id) : (m.key.participant || m.key.remoteJid);
            }
            if (m.message) {
                if (m.message.viewOnceMessage) {
                    m.mtype = Object.keys(m.message.viewOnceMessage.message)[0];
                    m.msg = m.message.viewOnceMessage.message[m.mtype];
                }
                else if (m.message.viewOnceMessageV2) {
                    m.mtype = Object.keys(m.message.viewOnceMessageV2.message)[0];
                    m.msg = m.message.viewOnceMessageV2.message[m.mtype];
                }
                else {
                    m.mtype = getTypeMsgV2();
                    m.msg = m.message[m.mtype];
                }
                if (m.mtype === 'ephemeralMessage' || m.mtype === 'documentWithCaptionMessage') {
                    this.bind(parent, m.msg);
                    m.mtype = m.msg.mtype;
                    m.msg = m.msg.msg;
                }
                let quoted = m.quoted = typeof m.msg !== 'undefined' ? m.msg.contextInfo ? m.msg.contextInfo.quotedMessage : null : null;
                m.mentionedJid = typeof m.msg !== 'undefined' ? m.msg.contextInfo ? m.msg.contextInfo.mentionedJid : [] : [];
                m.expiration = m.msg?.contextInfo?.expiration || 0;
                if (m?.quoted) {
                    let type = Object.keys(m.quoted)[0];
                    m.quoted = m.quoted[type];
                    if (['productMessage'].includes(type)) {
                        type = Object.keys(m.quoted)[0];
                        m.quoted = m.quoted[type];
                    }
                    if (['documentWithCaptionMessage'].includes(type)) {
                        type = Object.keys(m.quoted.message)[0];
                        m.quoted = m.quoted.message[type];
                        m.quoted.text = m.quoted.caption;
                    }
                    if (typeof m.quoted === 'string') {
                        m.quoted = {
                            text: m.quoted
                        };
                    }
                    if (m?.quoted) {
                        m.quoted.id = m.msg.contextInfo.stanzaId;
                        m.quoted.chat = m.msg.contextInfo.remoteJid || m.chat;
                        m.quoted.isBot = m.quoted.id ? (m.quoted.id.length === 16 || m.quoted.id.startsWith('3EB0') || /neoxr/i.test(m.quoted.id)) : false;
                        m.quoted.sender = m.msg.contextInfo.participant.split(":")[0] || m.msg.contextInfo.participant;
                        m.quoted.fromMe = m.quoted.sender === parent.decodeJid(parent?.user?.id);
                        m.quoted.mentionedJid = m.msg.contextInfo ? m.msg.contextInfo.mentionedJid : [];
                        let vM = m.quoted.fakeObj = M.fromObject({
                            key: {
                                remoteJid: m.quoted.chat,
                                fromMe: m.quoted.fromMe,
                                id: m.quoted.id
                            },
                            message: quoted,
                            ...(m.isGroup ? {
                                participant: m.quoted.sender
                            } : {})
                        });
                        m.quoted.mtype = m.quoted != null ? Object.keys(m.quoted.fakeObj.message)[0] : null;
                        m.quoted.text = m.quoted.text || m.quoted.caption || (m.quoted.mtype === 'interactiveMessage' ? m.quoted.body.text : '') || (/viewOnceMessage/.test(m.quoted.mtype) ? m.quoted.message[Object.keys(m.quoted.message)[0]].caption : '') || (m.quoted.mtype == 'buttonsMessage' ? m.quoted.contentText : '') || (m.quoted.mtype == 'templateMessage' ? m.quoted.hydratedFourRowTemplate.hydratedContentText : '') || '';
                        m.quoted.download = () => parent.downloadMediaMessage(m.quoted);
                    }
                }
            }
            m.reply = (text, options) => parent.sendMessage(m.chat, {
                text,
                mentions: this.mention(text),
                ...options
            }, {
                quoted: m,
                ...(bypassDisappearing ? { ephemeralExpiration: m?.expiration || 0 } : {})
            });
            m.react = async (emoticon, key) => {
                let reactionMessage = {
                    react: {
                        text: emoticon,
                        key: key || m.key
                    }
                };
                return parent.sendMessage(m.chat, reactionMessage);
            };
            if (typeof m.msg !== 'undefined') {
                if (m.msg.url)
                    m.download = () => parent.downloadMediaMessage(m.msg);
            }
            const isClientJid = parent.decodeJid(parent.user.id);
            const isExists = global.db && global.db.bots.length > 0 ? global.db.bots.find((v) => v.jid === isClientJid) : false;
            const text = (m.mtype == 'interactiveResponseMessage' ? JSON.parse(m.msg.nativeFlowResponseMessage.paramsJson).id : '')
                || (m.mtype == 'pollCreationMessage' ? m.body : '')
                || (m.mtype == 'stickerMessage' && global.db && (isExists ? isExists.data : global.db).sticker ? (typeof (isExists ? isExists.data : global.db).sticker[m.msg.fileSha256.toString().replace(/,/g, '')] != 'undefined') ? (isExists ? isExists.data : global.db).sticker[m.msg.fileSha256.toString().replace(/,/g, '')].text : '' : '')
                || (m.mtype == 'editedMessage' ? m.msg.message.protocolMessage.editedMessage.conversation : '')
                || (m.mtype == 'listResponseMessage' ? m.message.listResponseMessage.singleSelectReply.selectedRowId : '')
                || (m.mtype == 'buttonsResponseMessage' ? m.message.buttonsResponseMessage.selectedButtonId : '')
                || (m.mtype == 'templateButtonReplyMessage' ? m.message.templateButtonReplyMessage.selectedId : '')
                || (typeof m.msg !== 'undefined' ? m.msg.text : '')
                || (typeof m.msg !== 'undefined' ? m.msg.caption : '')
                || m.msg
                || '';
            m.text = typeof text !== 'string' ? '' : text;
            return M.fromObject(m);
        }
        catch (e) {
            console.log(e);
            return null;
        }
    }
}
exports.default = Serialize;
