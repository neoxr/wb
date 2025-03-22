"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (store, client) => {
    let isClientJid = client.decodeJid(client.user.id);
    let isExists = (global.db && global.db.bots.length > 0) ? global.db.bots.find(v => v.jid === isClientJid) : false;
    let isObj = isExists ? isExists.data : global.db;
    try {
        store.fromJSON(JSON.parse(isObj.memoryStore));
    }
    catch {
        isObj.memoryStore = isObj.memoryStore ? isObj.memoryStore : JSON.stringify(store.toJSON());
        store.fromJSON(JSON.parse(isObj.memoryStore));
    }
};
