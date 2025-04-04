"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mime_types_1 = require("mime-types");
const fs_1 = __importDefault(require("fs"));
const bytes_1 = __importDefault(require("bytes"));
const file_type_1 = __importDefault(require("file-type"));
const awesome_phonenumber_1 = __importDefault(require("awesome-phonenumber"));
const baileys = fs_1.default.existsSync('./node_modules/@adiwajshing/baileys')
    ? require('@adiwajshing/baileys')
    : fs_1.default.existsSync('./node_modules/@neoxr/baileys')
        ? require('@neoxr/baileys')
        : fs_1.default.existsSync('./node_modules/@whiskeysockets/baileys')
            ? require('@whiskeysockets/baileys')
            : require('baileys');
const { downloadContentFromMessage, getContentType, generateWAMessage, generateWAMessageContent, generateWAMessageFromContent, generateForwardMessageContent, prepareWAMessageMedia, proto, jidDecode } = baileys;
const exif_1 = __importDefault(require("../Utils/exif"));
const functions_1 = __importDefault(require("../Utils/functions"));
const helper_1 = require("@neoxr/helper");
class Message {
    constructor() {
        this.tags = {
            album: 'Neoxr Music',
            APIC: Buffer.from('/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAHgAeADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD+/iiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKK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APC4+GX/AM6ej/iDd/4JRf8ARbf2t/8AwuPhl/8AOnr+sX/hCLv/AJ+F/wC+f/r0f8IRd/8APwv/AHz/APXoA/k6/wCIN3/glF/0W39rf/wuPhl/86ej/iDd/wCCUX/Rbf2t/wDwuPhl/wDOnr+sX/hCLv8A5+F/75/+vR/whF3/AM/C/wDfP/16AP5Ov+IN3/glF/0W39rf/wALj4Zf/OnrS0b/AIM6v+CS+maxpWo3/wAV/wBqzXrGw1CyvL3Q9Q8feAYLHWLW2ukmn0u8uNM+GdjqMFrqESNa3Ethd299HDIz2t1DcCOWv6s/+EIu/wDn4X/vn/69H/CEXf8Az8L/AN8//XoA4uWPRrC50/RtDhjttM0u00/TdNtIt3k2lhYRi2tLaMu7v5cFvFFHHuZmKqNzlgzV7xp3/Hjb/wDXMf8AoUlef2PgX7Pc+fKyuQRjgDoT2wfTuR1HJBr0iGMQxJEOiqF/It7D1z7cjnJNAElFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABgf0/Dn/P4nvkkwMYwMemOPyz/n680UUAJgeg/IVTurKO7VVcL8pyMrnue2fT37nvnN2igCpaWiWkZjXBBOeBgdT7/wCcnnrm1geg/IUtFADSiHkop9yo7Zx1H+cnk85Ty4/+eaf98L/hT6KAAAAYHA9B0/L/AD9c80UUUAJgeg/IUYHoPyFLRQAmB6D8h7+/+cnknJJgeg/IUtFABgYxgY9Mcfln/P15pAAOgA+g/wDr/wCfXPNLRQAViX2k/bd2X2544A6ZPv0wq8fTkEMDt0UAYenaLDYNuU5IxzgDPJz0/wA4xyCvO2AB0AH0H/1/8+ueaWigBMD0H5UvTp/nr7/5ye+SSigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/9k=', 'base64')
        };
        this.mention = (text) => [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net');
        this.createMessageFunction = (sock, bypassDisappearing = false, groupCache) => {
            sock.decodeJid = (jid) => {
                if (!jid)
                    return jid;
                if (/:\d+@/gi.test(jid)) {
                    let decode = jidDecode(jid) || {};
                    return decode.user && decode.server && decode.user + '@' + decode.server || jid;
                }
                else
                    return jid;
            };
            sock.getGroupMetadata = (jid) => {
                const cached = groupCache.getCache(jid);
                if (cached !== null) {
                    return cached;
                }
                const getData = async () => {
                    try {
                        const metadata = await sock.groupMetadata(jid);
                        return metadata || null;
                    }
                    catch (error) {
                        return null;
                    }
                };
                const resultPromise = groupCache.cacheFunction(jid, getData);
                return resultPromise;
            };
            sock.generateMessage = async (jid, message, quoted = {}, options = {}) => {
                let generate = await generateWAMessage(jid, message, quoted);
                const type = getContentType(generate.message);
                if ('contextInfo' in message)
                    generate.message[type].contextInfo = {
                        ...generate.message[type].contextInfo,
                        ...message.contextInfo
                    };
                if ('contextInfo' in options)
                    generate.message[type].contextInfo = {
                        ...generate.message[type].contextInfo,
                        ...options.contextInfo
                    };
                return await sock.relayMessage(jid, generate.message, {
                    messageId: generate.key.id
                }).then(() => generate);
            };
            sock.sendFromAI = async (jid, text, quoted, options = {}) => {
                await sock.sendPresenceUpdate('composing', jid);
                const stanza = [];
                stanza.push({
                    attrs: {
                        biz_bot: '1'
                    },
                    tag: "bot"
                });
                stanza.push({
                    attrs: {},
                    tag: "biz"
                });
                const message = generateWAMessageFromContent(jid, {
                    extendedTextMessage: {
                        text: text,
                        contextInfo: {
                            mentionedJid: this.mention(text),
                            ...options
                        },
                        message: {
                            messageContextInfo: {
                                messageSecret: functions_1.default.makeId(32),
                                supportPayload: JSON.stringify({
                                    version: 1,
                                    is_ai_message: true,
                                    should_show_system_message: true,
                                    ticket_id: 1669945700536053
                                })
                            }
                        }
                    }
                }, {
                    userJid: sock.user.jid,
                    quoted,
                    ...(bypassDisappearing ? { ephemeralExpiration: quoted?.expiration || 0 } : {})
                });
                sock.relayMessage(jid, message['message'], {
                    messageId: message.key.id,
                    additionalNodes: stanza
                });
                return message;
            };
            sock.sendMessageModify = async (jid, text, quoted, properties, options = {}) => {
                await sock.sendPresenceUpdate('composing', jid);
                let imgUrl;
                if (properties.thumbnail && !functions_1.default.isUrl(properties.thumbnail)) {
                    const { file } = await functions_1.default.getFile(properties.thumbnail);
                    imgUrl = await (await (0, helper_1.upload)(fs_1.default.readFileSync(file))).data.url;
                }
                else if (properties.thumbnail && Buffer.isBuffer(properties.thumbnail)) {
                    imgUrl = await (await (0, helper_1.upload)(properties.thumbnail)).data.url;
                }
                else if (properties.thumbnail && functions_1.default.isUrl(properties.thumbnail)) {
                    imgUrl = properties.thumbnail;
                }
                else {
                    imgUrl = 'https://telegra.ph/file/d5a48b03b80791b50717f.jpg';
                }
                return sock.generateMessage(jid, {
                    text: text,
                    ...options,
                    contextInfo: {
                        mentionedJid: this.mention(text),
                        externalAdReply: {
                            title: properties.title || global.header || '© neoxr-bot v4',
                            body: properties.body || null,
                            mediaType: 1,
                            thumbnailUrl: imgUrl,
                            thumbnail: '',
                            mediaUrl: 'https://telegra.ph/?id=' + functions_1.default.makeId(8),
                            sourceUrl: properties.url || '',
                            showAdAttribution: properties.ads && properties.ads ? true : false,
                            renderLargerThumbnail: properties.largeThumb && properties.largeThumb ? true : false,
                            containsAutoReply: false
                        }
                    }
                }, {
                    quoted,
                    ...(bypassDisappearing ? { ephemeralExpiration: quoted?.expiration || 0 } : {})
                });
            };
            sock.sendMessageModifyV2 = async (jid, text, caption, properties, options = {}) => {
                const quoted = {
                    key: {
                        fromMe: false,
                        participant: `0@s.whatsapp.net`,
                        ...(jid ? {
                            remoteJid: 'status@broadcast'
                        } : {})
                    },
                    message: {
                        "locationMessage": {
                            "name": caption || '© neoxr-bot',
                            "jpegThumbnail": await functions_1.default.createThumb(fs_1.default.readFileSync(`./media/image/thumb.jpg`))
                        }
                    }
                };
                await sock.sendPresenceUpdate('composing', jid);
                let imgUrl;
                if (properties.thumbnail && !functions_1.default.isUrl(properties.thumbnail)) {
                    const { file } = await functions_1.default.getFile(properties.thumbnail);
                    imgUrl = await (await (0, helper_1.upload)(fs_1.default.readFileSync(file))).data.url;
                }
                else if (properties.thumbnail && Buffer.isBuffer(properties.thumbnail)) {
                    imgUrl = await (await (0, helper_1.upload)(properties.thumbnail)).data.url;
                }
                else if (properties.thumbnail && functions_1.default.isUrl(properties.thumbnail)) {
                    imgUrl = properties.thumbnail;
                }
                else {
                    imgUrl = 'https://telegra.ph/file/d5a48b03b80791b50717f.jpg';
                }
                return sock.generateMessage(jid, {
                    text: text,
                    ...options,
                    contextInfo: {
                        mentionedJid: this.mention(text),
                        title: properties.title || global.header || '© neoxr-bot v4',
                        body: properties.body || null,
                        mediaType: 1,
                        thumbnailUrl: properties.thumbnail ? imgUrl : 'https://telegra.ph/file/d5a48b03b80791b50717f.jpg',
                        thumbnail: '',
                        mediaUrl: 'https://telegra.ph/?id=' + functions_1.default.makeId(8),
                        sourceUrl: properties.url || '',
                        showAdAttribution: properties.ads && properties.ads ? true : false,
                        renderLargerThumbnail: properties.largeThumb && properties.largeThumb ? true : false,
                        containsAutoReply: false
                    }
                }, {
                    quoted,
                    ...(bypassDisappearing ? { ephemeralExpiration: quoted?.expiration || 0 } : {})
                });
            };
            sock.groupAdmin = async (jid) => {
                try {
                    const participant = await (await sock.getGroupMetadata(jid)).participants;
                    const admins = participant
                        .filter((i) => i.admin === "admin" || i.admin === "superadmin")
                        .map((i) => i.id);
                    if (!admins || admins.length === 0) {
                        return [];
                    }
                    return admins;
                }
                catch {
                    return [];
                }
            };
            sock.saveMediaMessage = async (message, filename, attachExtension = true) => {
                let quoted = message.msg ? message.msg : message;
                let mime = (message.msg || message).mimetype || '';
                let messageType = mime.split('/')[0].replace('application', 'document') ? mime.split('/')[0].replace('application', 'document') : mime.split('/')[0];
                const stream = await downloadContentFromMessage(quoted, messageType);
                let buffer = Buffer.from([]);
                for await (const chunk of stream) {
                    buffer = Buffer.concat([buffer, chunk]);
                }
                let type = await file_type_1.default.fromBuffer(buffer);
                let trueFileName = attachExtension ? (filename + '.' + type.ext) : filename;
                await fs_1.default.writeFileSync(trueFileName, buffer);
                return trueFileName;
            };
            sock.downloadMediaMessage = async (message) => {
                let mime = (message.msg || message).mimetype || '';
                let messageType = message.mtype ? message.mtype.replace(/Message|WithCaption/gi, '') : mime.split('/')[0];
                const stream = await downloadContentFromMessage(message, messageType);
                let buffer = Buffer.from([]);
                for await (const chunk of stream) {
                    buffer = Buffer.concat([buffer, chunk]);
                }
                return buffer;
            };
            sock.copyNForward = async (jid, message = {}, forceForward = false, options = {}) => {
                let vtype;
                if (options.readViewOnce) {
                    message.message = message.message && message.message.ephemeralMessage && message.message.ephemeralMessage.message ? message.message.ephemeralMessage.message : (message.message || undefined);
                    vtype = Object.keys(message.message.viewOnceMessage.message)[0];
                    // delete (message.message && message.message.ignore ? message.message.ignore : (message.message || undefined))
                    if (message.message?.ignore) {
                        delete message.message.ignore;
                    }
                    else if (message.message) {
                        delete message.message;
                    }
                    delete message.message.viewOnceMessage.message[vtype].viewOnce;
                    message.message = {
                        ...message.message.viewOnceMessage.message
                    };
                }
                let mtype = Object.keys(message.message)[0];
                let content = await generateForwardMessageContent(message, forceForward);
                let ctype = Object.keys(content)[0];
                let context = {};
                if (mtype != "conversation")
                    context = message.message[mtype].contextInfo;
                content[ctype].contextInfo = {
                    ...context,
                    ...content[ctype].contextInfo
                };
                const waMessage = await generateWAMessageFromContent(jid, content, options ? {
                    ...content[ctype],
                    ...options,
                    ...(options.contextInfo ? {
                        contextInfo: {
                            ...content[ctype].contextInfo,
                            ...options.contextInfo
                        }
                    } : {})
                } : {});
                await sock.relayMessage(jid, waMessage.message, {
                    messageId: waMessage.key.id,
                    additionalAttributes: {
                        ...options
                    }
                });
                return waMessage;
            };
            sock.reply = async (jid, text, quoted, options = {}) => {
                await sock.sendPresenceUpdate('composing', jid);
                return sock.sendMessage(jid, {
                    text: text,
                    mentions: this.mention(text),
                    ...options
                }, {
                    quoted,
                    ...(bypassDisappearing ? { ephemeralExpiration: quoted?.expiration || 0 } : {})
                });
            };
            sock.sendMessageVerify = async (jid, text, caption, options = {}) => {
                const quoted = {
                    key: {
                        fromMe: false,
                        participant: `0@s.whatsapp.net`,
                        ...(jid ? {
                            remoteJid: 'status@broadcast'
                        } : {})
                    },
                    message: {
                        "locationMessage": {
                            "name": caption || '© neoxr-bot',
                            "jpegThumbnail": await functions_1.default.createThumb(fs_1.default.readFileSync(`./media/image/thumb.jpg`)),
                        }
                    },
                    expiration: 0
                };
                await sock.sendPresenceUpdate('composing', jid);
                return sock.sendMessage(jid, {
                    text: text,
                    mentions: this.mention(text),
                    ...options
                }, {
                    quoted,
                    ...(bypassDisappearing ? { ephemeralExpiration: quoted?.expiration || 0 } : {})
                });
            };
            sock.sendPoll = async (jid, text, poll, quoted, options = {}) => {
                if (poll.options.length < 2)
                    return false;
                const pollMessage = {
                    name: text,
                    values: poll.options,
                    selectableCount: 1,
                    mentions: this.mention(text),
                    ...options
                };
                return sock.sendMessage(jid, {
                    poll: pollMessage
                }, {
                    quoted
                });
            };
            sock.sendPollV2 = async (jid, text, optiPoll, options) => {
                if (!options)
                    options = {};
                const pollMessage = {
                    name: text,
                    values: optiPoll,
                    selectableCount: 1,
                    mentions: this.mention(text),
                    ...options
                };
                return sock.relayMessage(jid, {
                    pollCreationMessage: pollMessage
                }, {
                    ...options
                });
            };
            sock.sendSticker = async (jid, path, quoted, options = {}) => {
                const buffer = /^https?:\/\//.test(path) ? await functions_1.default.fetchBuffer(path) : Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split('.')[1], 'base64') : Buffer.alloc(0);
                const { mime } = await file_type_1.default.fromBuffer(buffer) ?? { mime: 'bin' };
                const convert = (/image\/(jpe?g|png|gif)|octet/.test(mime)) ? (options && (options.packname || options.author)) ? await exif_1.default.writeExifImg(buffer, options) : await exif_1.default.imageToWebp(buffer) : (/video/.test(mime)) ? (options && (options.packname || options.author)) ? await exif_1.default.writeExifVid(buffer, options) : await exif_1.default.videoToWebp(buffer) : (/webp/.test(mime)) ? await exif_1.default.writeExifWebp(buffer, options) : Buffer.alloc(0);
                await sock.sendPresenceUpdate('composing', jid);
                return sock.sendMessage(jid, {
                    sticker: {
                        url: convert
                    },
                    ...options
                }, {
                    quoted,
                    ...(bypassDisappearing ? { ephemeralExpiration: quoted?.expiration || 0 } : {})
                });
            };
            sock.sendReact = async (jid, emoticon, keys = {}) => {
                let reactionMessage = {
                    react: {
                        text: emoticon,
                        key: keys
                    }
                };
                return sock.sendMessage(jid, reactionMessage);
            };
            sock.sendContact = async (jid, contact, quoted, info = {}, opts = {}) => {
                let list = [];
                contact.map((v) => list.push({
                    displayName: v.name,
                    vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:${v.name}\nORG:${info && info.org ? info.org : 'Neoxr Nework'}\nTEL;type=CELL;type=VOICE;waid=${v.number}:${new awesome_phonenumber_1.default('+' + v.number).getNumber('international')}\nEMAIL;type=Email:${info && info.email ? info.email : 'admin@neoxr.my.id'}\nURL;type=Website:${info && info.website ? info.website : 'https://neoxr.my.id'}\nADR;type=Location:;;Unknown;;\nOther:${info && info.about ? info.about : v.about}\nEND:VCARD`
                }));
                return sock.sendMessage(jid, {
                    contacts: {
                        displayName: `${list.length} Contact`,
                        contacts: list
                    },
                    ...opts
                }, {
                    quoted,
                    ...(bypassDisappearing ? { ephemeralExpiration: quoted?.expiration || 0 } : {})
                });
            };
            sock.sendPtv = async (jid, url, opts) => {
                const { status, file, filename, mime, size, extension } = await functions_1.default.getFile(url, opts && opts.referer ? opts.referer : false);
                const msg = await generateWAMessageContent({
                    video: fs_1.default.readFileSync('./' + file)
                }, {
                    upload: sock.waUploadToServer
                });
                await sock.sendPresenceUpdate('composing', jid);
                return await sock.relayMessage(jid, {
                    ptvMessage: msg.videoMessage
                }, {});
            };
            sock.sendProgress = async (jid, text, quoted) => {
                const bars = [
                    '⬢⬡⬡⬡⬡⬡⬡⬡⬡⬡ 10%',
                    '⬢⬢⬢⬡⬡⬡⬡⬡⬡⬡ 30%',
                    '⬢⬢⬢⬢⬢⬡⬡⬡⬡⬡ 50%',
                    '⬢⬢⬢⬢⬢⬢⬢⬢⬢⬢ 100%',
                    text
                ];
                sock.reply(jid, '⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡ 0%', quoted).then(async (v) => {
                    for (let bar of bars) {
                        await functions_1.default.delay(1000);
                        sock.relayMessage(jid, {
                            protocolMessage: {
                                key: v.key,
                                type: 14,
                                editedMessage: {
                                    conversation: bar
                                }
                            }
                        }, {});
                    }
                });
            };
            sock.sendIAMessage = async (jid, buttons = [], quoted, opts = {}, options = {}) => {
                let prepare;
                let file;
                if (opts.media) {
                    file = await functions_1.default.getFile(opts.media);
                    if (/image/.test(file.mime)) {
                        const parse = await prepareWAMessageMedia({
                            image: {
                                url: file.file
                            },
                        }, {
                            upload: sock.waUploadToServer
                        });
                        prepare = {
                            imageMessage: parse.imageMessage
                        };
                    }
                    else if (/video/.test(file.mime)) {
                        const parse = await prepareWAMessageMedia({
                            video: {
                                url: file.file
                            },
                        }, {
                            upload: sock.waUploadToServer
                        });
                        prepare = {
                            videoMessage: parse.videoMessage
                        };
                    }
                    else {
                        prepare = {};
                    }
                }
                const message = generateWAMessageFromContent(jid, {
                    viewOnceMessage: {
                        message: {
                            messageContextInfo: {
                                deviceListMetadata: {},
                                deviceListMetadataVersion: 2
                            },
                            interactiveMessage: {
                                header: proto.Message.InteractiveMessage.create({
                                    title: opts.header ? opts.header : '',
                                    subtitle: opts.subtitle ? opts.subtitle : '',
                                    hasMediaAttachment: opts.media && /image|video/.test(file.mime) ? true : false,
                                    ...(prepare || {})
                                }),
                                body: proto.Message.InteractiveMessage.create({
                                    text: opts.content ? opts.content : ''
                                }),
                                footer: proto.Message.InteractiveMessage.create({
                                    text: opts.footer ? opts.footer : ''
                                }),
                                nativeFlowMessage: proto.Message.InteractiveMessage.create({
                                    buttons,
                                    messageParamsJson: ''
                                }),
                                contextInfo: {
                                    mentionedJid: this.mention(opts.content ? opts.content : ''),
                                    ...options
                                }
                            }
                        }
                    }
                }, {
                    userJid: sock.user.jid,
                    quoted,
                    ...(bypassDisappearing ? { ephemeralExpiration: quoted?.expiration || 0 } : {})
                });
                await sock.sendPresenceUpdate('composing', jid);
                sock.relayMessage(jid, message['message'], {
                    messageId: message.key.id
                });
                return message;
            };
            sock.sendCarousel = async (jid, contents = [], quoted = {}, opts = {}) => {
                let cards = [];
                for (const v of contents) {
                    const file = await functions_1.default.getFile(v.header.imageMessage);
                    const parse = await prepareWAMessageMedia({
                        image: {
                            url: file.file
                        },
                    }, {
                        upload: sock.waUploadToServer
                    });
                    cards.push({
                        header: {
                            imageMessage: parse.imageMessage,
                            hasMediaAttachment: true,
                        },
                        body: v.body,
                        nativeFlowMessage: v.nativeFlowMessage
                    });
                }
                const message = generateWAMessageFromContent(jid, {
                    viewOnceMessage: {
                        message: {
                            interactiveMessage: {
                                body: {
                                    text: opts.content ? opts.content : ''
                                },
                                carouselMessage: {
                                    cards,
                                    messageVersion: 1
                                },
                                footer: {
                                    text: opts.footer ? opts.footer : ''
                                }
                            }
                        }
                    }
                }, {
                    userJid: sock.user.jid,
                    quoted,
                    ...(bypassDisappearing ? { ephemeralExpiration: quoted?.expiration || 0 } : {})
                });
                sock.relayMessage(jid, message['message'], {
                    messageId: message.key.id
                });
                return message;
            };
            sock.replyButton = async (jid, buttons = [], quoted, opts = {}, options = {}) => {
                let button = [];
                for (const btn of buttons) {
                    if (btn?.name) {
                        button.push({
                            nativeFlowInfo: {
                                name: btn.name,
                                paramsJson: JSON.stringify(btn.param)
                            },
                            type: 'NATIVE_FLOW'
                        });
                    }
                    else {
                        button.push({
                            buttonId: btn.command,
                            buttonText: {
                                displayText: btn.text
                            },
                            type: 'RESPONSE'
                        });
                    }
                }
                let imgUrl;
                if (opts?.thumbnail && !functions_1.default.isUrl(opts?.thumbnail)) {
                    const { file } = await functions_1.default.getFile(opts?.thumbnail);
                    imgUrl = await (await (0, helper_1.upload)(fs_1.default.readFileSync(file))).data.url;
                }
                else if (opts?.thumbnail && Buffer.isBuffer(opts?.thumbnail)) {
                    imgUrl = await (await (0, helper_1.upload)(opts?.thumbnail)).data.url;
                }
                else if (opts?.thumbnail && functions_1.default.isUrl(opts?.thumbnail)) {
                    imgUrl = opts?.thumbnail;
                }
                else {
                    imgUrl = 'https://telegra.ph/file/d5a48b03b80791b50717f.jpg';
                }
                let prepare;
                if (opts?.media) {
                    const file = await functions_1.default.getFile(opts.media);
                    if (opts?.media && opts?.document) {
                        const parse = await prepareWAMessageMedia({
                            document: {
                                url: file.file
                            },
                            fileName: opts?.document?.filename || file.filename,
                            mimetype: file.mime,
                        }, {
                            upload: sock.waUploadToServer
                        });
                        prepare = {
                            documentMessage: parse.documentMessage
                        };
                    }
                    else if (/image/.test(file.mime) && opts?.location) {
                        prepare = {
                            locationMessage: {
                                thumbnail: await functions_1.default.createThumb(opts.media)
                            }
                        };
                    }
                    else if (/image/.test(file.mime) && opts?.product) {
                        const parse = await prepareWAMessageMedia({
                            image: {
                                url: file.file
                            },
                        }, {
                            upload: sock.waUploadToServer
                        });
                        prepare = {
                            imageMessage: parse.imageMessage
                        };
                    }
                    else if (/image/.test(file.mime)) {
                        const parse = await prepareWAMessageMedia({
                            image: {
                                url: file.file
                            },
                        }, {
                            upload: sock.waUploadToServer
                        });
                        prepare = {
                            imageMessage: parse.imageMessage
                        };
                    }
                    else if (/video/.test(file.mime)) {
                        const parse = await prepareWAMessageMedia({
                            video: {
                                url: file.file
                            },
                        }, {
                            upload: sock.waUploadToServer
                        });
                        prepare = {
                            videoMessage: parse.videoMessage
                        };
                    }
                    else {
                        prepare = {};
                    }
                }
                else if (opts?.thumbnail) {
                    prepare = {
                        documentMessage: {
                            "url": "https://mmg.whatsapp.net/v/t62.7119-24/30687577_927329652895312_4158665759265521360_n.enc?ccb=11-4&oh=01_Q5AaIKZCtGTzw3Ly_-LkG3hZK7u2N7Ah2MMsPWhPlyTGAiHe&oe=67D4BC26&_nc_sid=5e03e0&mms3=true",
                            "mimetype": opts?.docs?.extension ? (0, mime_types_1.lookup)(opts?.docs?.extension) : (0, mime_types_1.lookup)('ppt'),
                            "fileSha256": "JrkTQxgGCnqSR9Q1o65p4aPWBmdAKMkSqHxDfjCBRrs=",
                            "fileLength": String((0, bytes_1.default)(opts?.docs?.size || '0KB')),
                            "pageCount": opts?.docs?.pages || 0,
                            "mediaKey": "qSc7o8rRi33yoXC28xwWWyEjlUrfZOzSOVcJCJbHKzQ=",
                            "fileName": opts?.docs?.name || 'Hi ^_^',
                            "fileEncSha256": "Jh0vWppJisJ6RifPchKq02b46o7Tbm9Dq8PyjAa1XS4=",
                            "directPath": "/v/t62.7119-24/30687577_927329652895312_4158665759265521360_n.enc?ccb=11-4&oh=01_Q5AaIKZCtGTzw3Ly_-LkG3hZK7u2N7Ah2MMsPWhPlyTGAiHe&oe=67D4BC26&_nc_sid=5e03e0",
                            "mediaKeyTimestamp": "1739406025"
                        }
                    };
                }
                else {
                    prepare = {};
                }
                const message = generateWAMessageFromContent(jid, {
                    viewOnceMessage: {
                        message: {
                            messageContextInfo: {
                                deviceListMetadata: {},
                                deviceListMetadataVersion: 2
                            },
                            buttonsMessage: {
                                ...(prepare || {}),
                                contentText: opts?.text || '',
                                footerText: opts?.footer || '',
                                contextInfo: {
                                    mentionedJid: this.mention(opts?.text || ''),
                                    ...(opts?.thumbnail ? {
                                        externalAdReply: {
                                            title: opts?.title || global.header || '© neoxr-bot v4',
                                            body: opts?.body || null,
                                            mediaType: 1,
                                            thumbnailUrl: imgUrl,
                                            thumbnail: '',
                                            mediaUrl: 'https://telegra.ph/?id=' + functions_1.default.makeId(8),
                                            sourceUrl: opts?.url || '',
                                            showAdAttribution: opts?.ads || false,
                                            renderLargerThumbnail: true,
                                            containsAutoReply: false
                                        }
                                    } : {}),
                                    ...options,
                                },
                                buttons: button,
                                headerType: prepare?.imageMessage && opts?.product ? 'PRODUCT' : prepare?.documentMessage ? 'DOCUMENT' : prepare?.locationMessage ? 'LOCATION' : prepare?.imageMessage ? 'IMAGE' : prepare?.videoMessage ? 'VIDEO' : 'EMPTY'
                            }
                        }
                    }
                }, {
                    userJid: sock.user.jid,
                    quoted,
                    ...(bypassDisappearing ? { ephemeralExpiration: quoted?.expiration || 0 } : {})
                });
                await sock.sendPresenceUpdate('composing', jid);
                sock.relayMessage(jid, message['message'], {
                    messageId: message.key.id
                });
                return message;
            };
            sock.sendFile = async (jid, url, name, caption = '', quoted, opts, options) => {
                const { status, file, filename, mime, size, extension } = await functions_1.default.getFile(url, name, opts && opts.referer ? opts.referer : false);
                if (!status)
                    return sock.reply(jid, functions_1.default.texted('italic', `Failed to proccess file`), quoted);
                sock.refreshMediaConn(false);
                if (opts && opts.document) {
                    await sock.sendPresenceUpdate('composing', jid);
                    const proc = await functions_1.default.metaAudio(file, {
                        title: filename.replace(new RegExp('.mp3', 'i'), ''),
                        album: opts && opts.album ? opts.album : this.tags.album,
                        APIC: opts && opts.APIC ? opts.APIC : this.tags.APIC
                    });
                    return sock.sendMessage(jid, {
                        document: {
                            url: extension == 'm4a' ? file : proc.file
                        },
                        fileName: filename,
                        mimetype: mime,
                        caption,
                        ...options
                    }, {
                        quoted,
                        ...(bypassDisappearing ? { ephemeralExpiration: quoted?.expiration || 0 } : {})
                    });
                }
                else {
                    if (/image\/(jpe?g|png)/.test(mime)) {
                        await sock.sendPresenceUpdate('composing', jid);
                        return sock.sendMessage(jid, {
                            image: {
                                url: file
                            },
                            caption,
                            mentions: this.mention(caption),
                            ...options
                        }, {
                            quoted,
                            ...(bypassDisappearing ? { ephemeralExpiration: quoted?.expiration || 0 } : {})
                        });
                    }
                    else if (/video/.test(mime)) {
                        await sock.sendPresenceUpdate('composing', jid);
                        return sock.sendMessage(jid, {
                            video: {
                                url: file
                            },
                            caption,
                            gifPlayback: opts && opts.gif ? true : false,
                            mentions: this.mention(caption),
                            ...options
                        }, {
                            quoted,
                            ...(bypassDisappearing ? { ephemeralExpiration: quoted?.expiration || 0 } : {})
                        });
                    }
                    else if (/audio/.test(mime)) {
                        await sock.sendPresenceUpdate(opts && opts.ptt ? 'recording' : 'composing', jid);
                        const proc = await functions_1.default.metaAudio(file, {
                            title: filename.replace(new RegExp('.mp3', 'i'), ''),
                            album: opts && opts.album ? opts.album : this.tags.album,
                            APIC: opts && opts.APIC ? opts.APIC : this.tags.APIC
                        });
                        const voiceNote = opts && opts.ptt ? true : false;
                        return sock.sendMessage(jid, {
                            audio: {
                                url: extension == 'm4a' ? file : proc.file
                            },
                            ptt: voiceNote,
                            mimetype: mime,
                            fileName: extension == 'm4a' ? file.filename : proc.filename,
                            waveform: voiceNote ? [0, 3, 58, 44, 35, 32, 2, 4, 31, 35, 44, 34, 48, 13, 0, 54, 49, 40, 1, 44, 50, 51, 16, 0, 3, 40, 39, 46, 3, 42, 38, 44, 46, 0, 0, 47, 0, 0, 46, 19, 20, 48, 43, 49, 0, 0, 39, 40, 31, 18, 29, 17, 25, 37, 51, 22, 37, 34, 19, 11, 17, 12, 16, 19] : [],
                            mentions: this.mention(caption),
                            ...options
                        }, {
                            quoted,
                            ...(bypassDisappearing ? { ephemeralExpiration: quoted?.expiration || 0 } : {})
                        });
                    }
                    else {
                        await sock.sendPresenceUpdate('composing', jid);
                        return sock.sendMessage(jid, {
                            document: {
                                url: file
                            },
                            fileName: filename,
                            mimetype: mime,
                            caption,
                            ...options
                        }, {
                            quoted,
                            ...(bypassDisappearing ? { ephemeralExpiration: quoted?.expiration || 0 } : {})
                        });
                    }
                }
            };
        };
    }
}
exports.default = Message;
