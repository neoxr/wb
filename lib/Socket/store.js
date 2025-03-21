"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (store, config, client) => {
    if (config && client) {
        const isClientJid = client.decodeJid(client.user.id);
        const isExists = global.db && global.db.bots.length > 0 ? global.db.bots.find((v) => v.jid === isClientJid) : false;
        const isObj = isExists ? isExists.data : global.db;
        try {
            store.fromJSON(JSON.parse(isObj.memoryStore));
        }
        catch {
            isObj.memoryStore = isObj.memoryStore ? isObj.memoryStore : JSON.stringify(store.toJSON());
            store.fromJSON(JSON.parse(isObj.memoryStore));
        }
    }
    else {
        try {
            store.fromJSON(JSON.parse(global.db.memoryStore));
        }
        catch {
            global.db.memoryStore = global.db.memoryStore ? global.db.memoryStore : JSON.stringify(store.toJSON());
            store.fromJSON(JSON.parse(global.db.memoryStore));
        }
    }
};
