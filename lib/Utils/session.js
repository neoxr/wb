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
require("rootpath");
const functions_1 = __importDefault(require("./functions"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
const BeautifyConsole = __importStar(require("beautify-console-log"));
const log = BeautifyConsole.default.getInstance();
log.config({
    title: 'Location ~',
    type: ['error', 'warn']
});
class Session {
    constructor(session) {
        this.init = () => {
            try {
                if (typeof this.session === 'string' && !fs_1.default.existsSync(path_1.default.join(process.cwd(), this.BACKUP_DIR))) {
                    fs_1.default.mkdirSync(path_1.default.join(process.cwd(), this.BACKUP_DIR));
                }
            }
            catch (e) {
                console.log(chalk_1.default.black(chalk_1.default.red(`Error creating backup directory`)));
                log.error(e);
            }
        };
        this.backup = async (client, dir) => {
            try {
                if (typeof this.session === 'string') {
                    const JID = client.user.id;
                    const BASE_PATH = path_1.default.join(process.cwd(), `${this.BACKUP_DIR}/${client.decodeJid(JID).replace(/@.+/, '')}`);
                    const SESSION_PATH = path_1.default.join(process.cwd(), `${dir}/creds.json`);
                    await functions_1.default.delay(1500);
                    if (fs_1.default.existsSync(BASE_PATH) && fs_1.default.existsSync(SESSION_PATH)) {
                        const creds = JSON.parse(fs_1.default.readFileSync(SESSION_PATH, 'utf-8'));
                        fs_1.default.writeFileSync(`${BASE_PATH}/creds.json`, JSON.stringify(creds));
                    }
                    else {
                        if (!fs_1.default.existsSync(BASE_PATH)) {
                            fs_1.default.mkdirSync(BASE_PATH);
                        }
                        if (fs_1.default.existsSync(SESSION_PATH)) {
                            const creds = JSON.parse(fs_1.default.readFileSync(SESSION_PATH, 'utf-8'));
                            fs_1.default.writeFileSync(`${BASE_PATH}/creds.json`, JSON.stringify(creds));
                        }
                    }
                }
            }
            catch (e) {
                console.log(chalk_1.default.black(chalk_1.default.red(`Error creating backup session`)));
                log.error(e);
            }
        };
        this.restore = async (client, dir) => {
            try {
                if (typeof this.session === 'string') {
                    const JID = client.user.id;
                    const BASE_PATH = path_1.default.join(process.cwd(), `${this.BACKUP_DIR}/${client.decodeJid(JID).replace(/@.+/, '')}/creds.json`);
                    const SESSION_PATH = path_1.default.join(process.cwd(), `${dir}/creds.json`);
                    await functions_1.default.delay(1500);
                    if (fs_1.default.existsSync(BASE_PATH)) {
                        const creds = JSON.parse(fs_1.default.readFileSync(BASE_PATH, 'utf-8'));
                        if (!fs_1.default.existsSync(path_1.default.join(process.cwd(), dir))) {
                            fs_1.default.mkdirSync(path_1.default.join(process.cwd(), dir));
                            fs_1.default.writeFileSync(SESSION_PATH, JSON.stringify(creds));
                        }
                        else {
                            fs_1.default.writeFileSync(SESSION_PATH, JSON.stringify(creds));
                        }
                    }
                }
            }
            catch (e) {
                console.log(chalk_1.default.black(chalk_1.default.red(`Error restoring session`)));
                log.error(e);
            }
        };
        this.isBackupExist = async (client) => {
            try {
                if (typeof this.session === 'string') {
                    const JID = client.user.id;
                    const BASE_PATH = path_1.default.join(process.cwd(), `${this.BACKUP_DIR}/${client.decodeJid(JID).replace(/@.+/, '')}/creds.json`);
                    return fs_1.default.existsSync(BASE_PATH) ? true : false;
                }
                else {
                    return false;
                }
            }
            catch (e) {
                return false;
            }
        };
        this.session = session;
        this.BACKUP_DIR = 'session_backup';
        this.init();
    }
}
exports.default = Session;
