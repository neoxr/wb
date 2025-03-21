"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const functions_1 = __importDefault(require("./functions"));
class NeoxrCommands {
    constructor() {
        this.plugins = [...new Set([])];
        this.create = async (asyncFlag, object, path) => {
            try {
                object.async = asyncFlag;
                if (!object.error)
                    this.plugins.push(object);
                if (path)
                    functions_1.default.reload(require.resolve(path));
            }
            catch (e) {
                throw new Error(`Plugin Error : ${e.message}`);
            }
        };
    }
}
exports.default = new NeoxrCommands;
functions_1.default.reload(__filename, 3000);
