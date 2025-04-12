"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const form_data_1 = __importDefault(require("form-data"));
const file_type_1 = require("file-type");
const { upload, short } = require('@neoxr/helper');
const creator = '@neoxr.js – Wildan Izzudin';
class Scraper {
    constructor() {
        this.chatAI = (bid, key, text) => new Promise(async (resolve) => {
            try {
                const json = await (await axios_1.default.get(`http://api.brainshop.ai/get?bid=${bid}&key=${key}&uid=neoxr&msg=${encodeURI(text)}`)).data;
                if (typeof json.cnt == 'undefined')
                    return resolve({
                        creator,
                        status: false
                    });
                resolve({
                    creator,
                    status: true,
                    msg: json.cnt
                });
            }
            catch (e) {
                console.log(e);
                return resolve({
                    creator,
                    status: false
                });
            }
        });
        this.simsimi = (text, lang = 'id') => {
            return new Promise(async (resolve) => {
                try {
                    let json = await (await axios_1.default.post('https://simsimi.vn/web/simtalk', `text=${encodeURI(text)}&lc=${lang}`, {
                        headers: {
                            'Accept': '*/*',
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                            'Referer': 'https://simsimi.net/',
                            'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0.1; SM-J500G) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Mobile Safari/537.36'
                        }
                    })).data;
                    if (json.success.match(new RegExp('Aku tidak mengerti', 'g')))
                        return resolve({
                            creator,
                            status: false
                        });
                    resolve({
                        creator,
                        status: true,
                        msg: json.success
                    });
                }
                catch (e) {
                    console.log(e);
                    return resolve({
                        creator,
                        status: false
                    });
                }
            });
        };
        this.simsimiV2 = (text) => {
            return new Promise(async (resolve) => {
                try {
                    let json = await (await axios_1.default.get(`https://api.simsimi.net/v2/?text=${encodeURI(text)}&lc=id`)).data;
                    if (json.success.match(new RegExp('Aku tidak mengerti', 'g')))
                        return resolve({
                            creator,
                            status: false
                        });
                    resolve({
                        creator,
                        status: true,
                        msg: json.success
                    });
                }
                catch (e) {
                    console.log(e);
                    return resolve({
                        creator,
                        status: false
                    });
                }
            });
        };
        this.shorten = (url) => {
            return new Promise(async (resolve) => {
                try {
                    const json = await short(url);
                    resolve(json);
                }
                catch (e) {
                    console.log(e);
                    resolve({
                        creator,
                        status: false,
                        msg: e.message
                    });
                }
            });
        };
        this.uploadImage = (str) => new Promise(async (resolve) => {
            try {
                const file = Buffer.isBuffer(str) ? str : str.startsWith('http') ? await (await axios_1.default.get(str, { responseType: 'arraybuffer' })).data : str;
                const { ext } = await (0, file_type_1.fromBuffer)(Buffer.from(file)) ?? { ext: 'bin' };
                let form = new form_data_1.default();
                form.append('file', Buffer.from(file), `image.${ext}`);
                const json = await (await axios_1.default.post('https://s.neoxr.eu/api/image-uploader', form, {
                    headers: form.getHeaders()
                })).data;
                resolve(json);
            }
            catch (e) {
                console.log(e);
                resolve({
                    creator,
                    status: false,
                    msg: e.message
                });
            }
        });
        this.uploadImageV2 = (buffer) => {
            return new Promise(async (resolve, reject) => {
                try {
                    const json = await upload(buffer);
                    resolve(json);
                }
                catch (e) {
                    console.log(e);
                    return resolve({
                        creator,
                        status: false,
                        msg: e.message
                    });
                }
            });
        };
        this.uploadImageV3 = async (str) => {
            return new Promise(async (resolve) => {
                try {
                    const image = Buffer.isBuffer(str) ? str : str.startsWith('http') ? await (await axios_1.default.get(str, { responseType: 'arraybuffer' })).data : str;
                    const { ext } = await (0, file_type_1.fromBuffer)(image) ?? { ext: 'bin' };
                    let form = new form_data_1.default();
                    form.append('file', Buffer.from(image), `image.${ext}`);
                    const json = await (await axios_1.default.post('https://telegra.ph/upload', form, {
                        headers: {
                            'Accept': '*/*',
                            'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0.1; SM-J500G) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Mobile Safari/537.36',
                            'Origin': 'https://telegra.ph',
                            'Referer': 'https://telegra.ph',
                            'Referrer-Policy': 'strict-origin-when-cross-origin',
                            'sec-ch-ua': '"Chromium";v="107", "Not=A?Brand";v="24"',
                            'sec-ch-ua-platform': 'Android',
                            'sec-fetch-dest': 'empty',
                            'sec-fetch-mode': 'cors',
                            'sec-fetch-site': 'same-origin',
                            'x-requested-with': 'XMLHttpRequest',
                            ...form.getHeaders()
                        }
                    })).data;
                    if (!json || json.length < 1)
                        return resolve({
                            creator,
                            status: false,
                            msg: 'Failed to upload!'
                        });
                    resolve({
                        creator,
                        status: true,
                        data: {
                            url: `https://telegra.ph${json[0].src}`
                        }
                    });
                }
                catch (e) {
                    console.log(e);
                    resolve({
                        creator,
                        status: false,
                        msg: e.message
                    });
                }
            });
        };
        this.uploadFile = (buffer, extention) => {
            return new Promise(async (resolve, reject) => {
                try {
                    const json = await upload(buffer, extention);
                    resolve(json);
                }
                catch (e) {
                    console.log(e);
                    return resolve({
                        creator,
                        status: false,
                        msg: e.message
                    });
                }
            });
        };
        this.uploadFileV2 = (buffer, name) => {
            return new Promise(async (resolve) => {
                try {
                    if (!Buffer.isBuffer(buffer))
                        return resolve({
                            status: false
                        });
                    let { ext } = await (0, file_type_1.fromBuffer)(buffer) || {};
                    let extention = (typeof ext == 'undefined') ? 'txt' : ext;
                    let form = new form_data_1.default();
                    form.append('file', buffer, `${name}.${extention}`);
                    const json = await (await (0, node_fetch_1.default)('https://file.io/', {
                        method: 'POST',
                        headers: {
                            Accept: '*/*',
                            'Accept-Language': 'en-US,enq=0.9',
                            'User-Agent': 'GoogleBot'
                        },
                        body: form
                    })).json();
                    if (!json.success)
                        return resolve({
                            creator,
                            status: false
                        });
                    delete json.success;
                    delete json.status;
                    resolve({
                        creator,
                        status: true,
                        data: json
                    });
                }
                catch (e) {
                    resolve({
                        creator,
                        status: false
                    });
                }
            });
        };
        this.toJpg = async (str) => {
            return new Promise(async (resolve) => {
                try {
                    const parse = await (await axios_1.default.get('https://tiny-img.com/webp/'));
                    const cookie = parse?.headers?.['set-cookie']?.join('; ') || 'token=12345';
                    const image = Buffer.isBuffer(str) ? str : str.startsWith('http') ? await (await axios_1.default.get(str, { responseType: 'arraybuffer' })).data : str;
                    let form = new form_data_1.default();
                    form.append('file', Buffer.from(image), `${(Math.random() + 1).toString(36).substring(7)}.webp`);
                    const json = await (await axios_1.default.post('https://tiny-img.com/app/webp-files/', form, {
                        headers: {
                            'Accept': '*/*',
                            'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0.1; SM-J500G) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Mobile Safari/537.36',
                            'Origin': 'https://tiny-img.com/',
                            'Referer': 'https://tiny-img.com',
                            'Referrer-Policy': 'strict-origin-when-cross-origin',
                            'sec-ch-ua': '"Chromium";v="107", "Not=A?Brand";v="24"',
                            'sec-ch-ua-platform': 'Android',
                            'sec-fetch-dest': 'empty',
                            'sec-fetch-mode': 'cors',
                            'sec-fetch-site': 'same-origin',
                            cookie,
                            ...form.getHeaders(),
                            'x-requested-with': 'XMLHttpRequest'
                        }
                    })).data;
                    if (!json.success)
                        return resolve({
                            creator,
                            status: false,
                            msg: 'Failed to convert!'
                        });
                    resolve({
                        creator,
                        status: true,
                        data: {
                            url: json.optimized_image_url
                        }
                    });
                }
                catch (e) {
                    resolve({
                        creator,
                        status: false,
                        msg: e.message
                    });
                }
            });
        };
    }
}
exports.default = new Scraper;
