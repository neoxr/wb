"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const functions_1 = __importDefault(require("./functions"));
moment_timezone_1.default.tz.setDefault(process.env.TZ).locale('id');
exports.default = async (client, m, options) => {
    const pkg = JSON.parse(fs_1.default.readFileSync(path_1.default.join(process.cwd(), 'package.json'), 'utf-8'));
    if (pkg[Buffer.from('YXV0aG9y', 'base64').toString('utf-8')] && pkg[Buffer.from('YXV0aG9y', 'base64').toString('utf-8')] === Buffer.from('V2lsZGFuIEl6enVkaW4=', 'base64').toString('utf-8') && !Object.values(pkg.dependencies).some((v) => v.startsWith('@') && v.endsWith(Buffer.from('eHIvd2I=', 'base64').toString('utf-8')))) {
        try {
            const who = m.fromMe ? 'Self' : m.pushName || 'No Name';
            const time = m.messageTimestamp;
            const typeMsg = options.isSpam
                ? { type: 'SPM', color: chalk_1.redBright.bold('[ SPM ]') }
                : options.commands.includes(options.command)
                    ? { type: 'CMD', color: chalk_1.yellow.bold('[ CMD ]') }
                    : { type: 'MSG', color: chalk_1.blueBright.bold('[ MSG ]') };
            const protocol = { show: options.show === 'all' ? 'all' : options.show === 'command-only' ? 'cmd' : options.show === 'message-only' ? 'msg' : options.show === 'spam-only' ? 'spm' : options.show === 'none' ? 'none' : 'none' };
            const getSize = /(document|audio|sticker|image|video)/.test(m.mtype)
                ? functions_1.default.formatSize(m.msg.fileLength)
                : '0B';
            const replaceAll = (m) => (m.text && m.text.constructor.name === 'String') ? m.text
                .replace(/\`\`\`/g, '')
                .replace(/\*(.*?)\*/g, '\x1b[1m$1\x1b[0m')
                .replace(/_(.*?)_/g, '\x1b[3m$1\x1b[0m') :
                '—';
            if (m.isGroup) {
                try {
                    const subject = await (await client.getGroupMetadata(m.chat)).subject;
                    const groupName = chalk_1.gray.bgYellow(' ' + subject + ' ');
                    if (m.mtype) {
                        if (protocol.show === 'all')
                            console.log('\n' + typeMsg.color, functions_1.default.color((0, moment_timezone_1.default)(time * 1000).format('DD/MM/YY HH:mm:ss'), 'green'), chalk_1.gray.bgGreen(' ' + m.mtype + ' '), chalk_1.green.bold('from'), '[' + m.sender.split `@`[0] + '] ' + chalk_1.gray.bgYellow(' ' + who + ' '), functions_1.default.color('in'), '[' + m.chat + '] ' + groupName, `\n${replaceAll(m)}`);
                        if (protocol.show === 'cmd' && typeMsg.type === 'CMD')
                            console.log('\n' + typeMsg.color, functions_1.default.color((0, moment_timezone_1.default)(time * 1000).format('DD/MM/YY HH:mm:ss'), 'green'), chalk_1.gray.bgGreen(' ' + m.mtype + ' '), getSize, chalk_1.green.bold('from'), '[' + m.sender.split `@`[0] + '] ' + chalk_1.gray.bgYellow(' ' + who + ' '), functions_1.default.color('in'), '[' + m.chat + '] ' + groupName, `\n${replaceAll(m)}`);
                        if (protocol.show === 'msg' && typeMsg.type === 'MSG')
                            console.log('\n' + typeMsg.color, functions_1.default.color((0, moment_timezone_1.default)(time * 1000).format('DD/MM/YY HH:mm:ss'), 'green'), chalk_1.gray.bgGreen(' ' + m.mtype + ' '), getSize, chalk_1.green.bold('from'), '[' + m.sender.split `@`[0] + '] ' + chalk_1.gray.bgYellow(' ' + who + ' '), functions_1.default.color('in'), '[' + m.chat + '] ' + groupName, `\n${replaceAll(m)}`);
                        if (protocol.show === 'spm' && typeMsg.type === 'SPM')
                            console.log('\n' + typeMsg.color, functions_1.default.color((0, moment_timezone_1.default)(time * 1000).format('DD/MM/YY HH:mm:ss'), 'green'), chalk_1.gray.bgGreen(' ' + m.mtype + ' '), getSize, chalk_1.green.bold('from'), '[' + m.sender.split `@`[0] + '] ' + chalk_1.gray.bgYellow(' ' + who + ' '), functions_1.default.color('in'), '[' + m.chat + '] ' + groupName, `\n${replaceAll(m)}`);
                    }
                }
                catch {
                    const groupName = chalk_1.gray.bgRed(' Timed-Out ');
                    if (m.mtype) {
                        if (protocol.show === 'all')
                            console.log('\n' + typeMsg.color, functions_1.default.color((0, moment_timezone_1.default)(time * 1000).format('DD/MM/YY HH:mm:ss'), 'green'), chalk_1.gray.bgGreen(' ' + m.mtype + ' '), getSize, chalk_1.green.bold('from'), '[' + m.sender.split `@`[0] + '] ' + chalk_1.gray.bgYellow(' ' + who + ' '), functions_1.default.color('in'), '[' + m.chat + '] ' + groupName, `\n${replaceAll(m)}`);
                        if (protocol.show === 'cmd' && typeMsg.type === 'CMD')
                            console.log('\n' + typeMsg.color, functions_1.default.color((0, moment_timezone_1.default)(time * 1000).format('DD/MM/YY HH:mm:ss'), 'green'), chalk_1.gray.bgGreen(' ' + m.mtype + ' '), getSize, chalk_1.green.bold('from'), '[' + m.sender.split `@`[0] + '] ' + chalk_1.gray.bgYellow(' ' + who + ' '), functions_1.default.color('in'), '[' + m.chat + '] ' + groupName, `\n${replaceAll(m)}`);
                        if (protocol.show === 'msg' && typeMsg.type === 'MSG')
                            console.log('\n' + typeMsg.color, functions_1.default.color((0, moment_timezone_1.default)(time * 1000).format('DD/MM/YY HH:mm:ss'), 'green'), chalk_1.gray.bgGreen(' ' + m.mtype + ' '), getSize, chalk_1.green.bold('from'), '[' + m.sender.split `@`[0] + '] ' + chalk_1.gray.bgYellow(' ' + who + ' '), functions_1.default.color('in'), '[' + m.chat + '] ' + groupName, `\n${replaceAll(m)}`);
                        if (protocol.show === 'spm' && typeMsg.type === 'SPM')
                            console.log('\n' + typeMsg.color, functions_1.default.color((0, moment_timezone_1.default)(time * 1000).format('DD/MM/YY HH:mm:ss'), 'green'), chalk_1.gray.bgGreen(' ' + m.mtype + ' '), getSize, chalk_1.green.bold('from'), '[' + m.sender.split `@`[0] + '] ' + chalk_1.gray.bgYellow(' ' + who + ' '), functions_1.default.color('in'), '[' + m.chat + '] ' + groupName, `\n${replaceAll(m)}`);
                    }
                }
            }
            else {
                if (m.mtype) {
                    if (protocol.show === 'all')
                        console.log('\n' + typeMsg.color, functions_1.default.color((0, moment_timezone_1.default)(time * 1000).format('DD/MM/YY HH:mm:ss'), 'green'), chalk_1.gray.bgGreen(' ' + m.mtype + ' '), getSize, chalk_1.green.bold('from'), '[' + m.sender.split `@`[0] + '] ' + chalk_1.gray.bgYellow(' ' + who + ' '), functions_1.default.color('in'), '[' + m.chat + ']', `\n${replaceAll(m)}`);
                    if (protocol.show === 'cmd' && typeMsg.type === 'CMD')
                        console.log('\n' + typeMsg.color, functions_1.default.color((0, moment_timezone_1.default)(time * 1000).format('DD/MM/YY HH:mm:ss'), 'green'), chalk_1.gray.bgGreen(' ' + m.mtype + ' '), getSize, chalk_1.green.bold('from'), '[' + m.sender.split `@`[0] + '] ' + chalk_1.gray.bgYellow(' ' + who + ' '), functions_1.default.color('in'), '[' + m.chat + ']', `\n${replaceAll(m)}`);
                    if (protocol.show === 'msg' && typeMsg.type === 'MSG')
                        console.log('\n' + typeMsg.color, functions_1.default.color((0, moment_timezone_1.default)(time * 1000).format('DD/MM/YY HH:mm:ss'), 'green'), chalk_1.gray.bgGreen(' ' + m.mtype + ' '), getSize, chalk_1.green.bold('from'), '[' + m.sender.split `@`[0] + '] ' + chalk_1.gray.bgYellow(' ' + who + ' '), functions_1.default.color('in'), '[' + m.chat + ']', `\n${replaceAll(m)}`);
                    if (protocol.show === 'spm' && typeMsg.type === 'SPM')
                        console.log('\n' + typeMsg.color, functions_1.default.color((0, moment_timezone_1.default)(time * 1000).format('DD/MM/YY HH:mm:ss'), 'green'), chalk_1.gray.bgGreen(' ' + m.mtype + ' '), getSize, chalk_1.green.bold('from'), '[' + m.sender.split `@`[0] + '] ' + chalk_1.gray.bgYellow(' ' + who + ' '), functions_1.default.color('in'), '[' + m.chat + ']', `\n${replaceAll(m)}`);
                }
            }
        }
        catch (e) {
            console.log(e);
        }
    }
};
