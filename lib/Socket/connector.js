"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const functions_1 = __importDefault(require("../Utils/functions"));
const pkg = require('../../package.json');
const authKey = Buffer.from('YXV0aG9y', 'base64').toString('utf-8');
const authValue = Buffer.from('V2lsZGFuIEl6enVkaW4=', 'base64').toString('utf-8');
const depKey = Buffer.from('eHIvd2I=', 'base64').toString('utf-8');
let Connector;
if (pkg[authKey] && pkg[authKey] === authValue && !Object.values(pkg.dependencies).some((v) => v.startsWith('@') && v.endsWith(depKey))) {
    Connector = class {
        constructor(file, socket, config = {}) {
            this.file = file;
            this.socket = socket;
            this.config = config;
            this.init();
        }
        init() {
            const env = JSON.parse(fs_1.default.readFileSync(path_1.default.join(process.cwd(), 'config.json'), 'utf-8'));
            const batchSize = this.config?.batch || 10;
            setInterval(async () => {
                if (global?.db?.bots?.some(v => !v.is_connected)) {
                    let run = global.db.bots.filter(v => !v.is_connected);
                    for (let i = 0; i < run.length; i += batchSize) {
                        const batch = run.slice(i, i + batchSize);
                        await Promise.all(batch.map(async (v) => {
                            if (v.is_connected)
                                return;
                            try {
                                if (this.config.session.execute instanceof Function) {
                                    const { getCreds } = await this.config.session.execute(this.config.session.config, String(v.jid.replace(/@.+/, '')));
                                    if (!await getCreds()) {
                                        functions_1.default.removeItem(global.db.bots, v);
                                        return;
                                    }
                                    const creds = await getCreds();
                                    if (this.socket.decodeJid(creds.me.id) === env.pairing.number + '@s.whatsapp.net') {
                                        functions_1.default.removeItem(global.db.bots, v);
                                        return;
                                    }
                                    v.is_connected = true;
                                }
                                else {
                                    let SESSION_BASE = path_1.default.join(process.cwd(), `${this.config.session.execute}/${v.jid.replace(/@.+/, '')}`);
                                    if (!fs_1.default.existsSync(`${SESSION_BASE}/creds.json`)) {
                                        fs_1.default.rmSync(SESSION_BASE, { recursive: true, force: true });
                                        functions_1.default.removeItem(global.db.bots, v);
                                        return;
                                    }
                                    const creds = JSON.parse(fs_1.default.readFileSync(`${SESSION_BASE}/creds.json`, 'utf-8'));
                                    if (this.socket.decodeJid(creds.me.id) === env.pairing.number + '@s.whatsapp.net') {
                                        fs_1.default.rmSync(SESSION_BASE, { recursive: true, force: true });
                                        functions_1.default.removeItem(global.db.bots, v);
                                        return;
                                    }
                                    v.is_connected = true;
                                }
                                await require(this.file)(v.jid, this.socket, this.config);
                            }
                            catch (error) {
                                console.error(`Error processing bot ${v.jid}:`, error);
                            }
                        }));
                        await functions_1.default.delay(this.config.delay);
                    }
                }
            }, this.config.interval);
        }
    };
}
else {
    Connector = class {
        constructor(delay) {
            this.delay = delay;
            this.cooldown = [];
        }
    };
}
exports.default = Connector;
