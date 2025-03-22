"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("rootpath");
const functions_1 = __importDefault(require("./functions"));
const fs_1 = __importDefault(require("fs"));
class Session {
    constructor() {
        this.init = () => {
            if (!fs_1.default.existsSync('./session_backup')) {
                fs_1.default.mkdirSync('./session_backup');
            }
        };
        this.backup = async (client, dir) => {
            try {
                const JID = client.user.id;
                const PATH_BASE = './session_backup/' + client.decodeJid(JID).replace(/@.+/, '');
                await functions_1.default.delay(1500);
                if (fs_1.default.existsSync(PATH_BASE) && fs_1.default.existsSync(dir + '/creds.json')) {
                    const creds = require(dir + '/creds.json');
                    fs_1.default.writeFileSync(PATH_BASE + '/creds.json', JSON.stringify(creds));
                }
                else {
                    if (!fs_1.default.existsSync(PATH_BASE))
                        fs_1.default.mkdirSync(PATH_BASE);
                    if (fs_1.default.existsSync(dir + '/creds.json')) {
                        const creds = require(dir + '/creds.json');
                        fs_1.default.writeFileSync(PATH_BASE + '/creds.json', JSON.stringify(creds));
                    }
                }
            }
            catch (e) {
                console.log(e);
            }
        };
        this.restore = async (client, dir) => {
            try {
                const JID = client.user.id;
                const PATH_BASE = './session_backup/' + client.decodeJid(JID).replace(/@.+/, '') + '/creds.json';
                await functions_1.default.delay(1500);
                if (fs_1.default.existsSync(PATH_BASE)) {
                    const creds = require(PATH_BASE.replace('./', ''));
                    fs_1.default.writeFileSync('./' + dir + '/creds.json', JSON.stringify(creds));
                }
            }
            catch (e) {
                console.log(e);
            }
        };
        this.isBackupExist = async (client) => {
            try {
                const JID = client.user.id;
                const PATH_BASE = './session_backup/' + client.decodeJid(JID).replace(/@.+/, '') + '/creds.json';
                return fs_1.default.existsSync(PATH_BASE) ? true : false;
            }
            catch (e) {
                return false;
            }
        };
        this.init();
    }
}
exports.default = new Session;
