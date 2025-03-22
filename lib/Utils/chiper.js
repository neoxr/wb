"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
class Chiper {
    constructor(secretKey) {
        this.encrypt = (text) => {
            const cipher = crypto_1.default.createCipheriv(this.algorithm, this.secretKey, this.iv);
            let encrypted = cipher.update(text, 'utf8', 'base64');
            encrypted += cipher.final('base64');
            return this.iv.toString('base64') + '.' + encrypted;
        };
        this.decrypt = (text) => {
            const [ivBase64, encryptedData] = text.split('.');
            const ivBuffer = Buffer.from(ivBase64, 'base64');
            const decipher = crypto_1.default.createDecipheriv(this.algorithm, this.secretKey, ivBuffer);
            let decrypted = decipher.update(encryptedData, 'base64', 'utf8');
            decrypted += decipher.final('utf8');
            return decrypted;
        };
        this.algorithm = 'aes-128-cbc';
        this.secretKey = crypto_1.default.createHash('md5').update(secretKey || 'neoxr').digest();
        this.iv = crypto_1.default.randomBytes(16);
    }
}
exports.default = Chiper;
