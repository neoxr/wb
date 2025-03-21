"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const child_process_1 = require("child_process");
const stream_1 = require("stream");
const functions_1 = __importDefault(require("./functions"));
class Converter {
    constructor() {
        this.ffmpeg = (buffer, args = [], ext = '', ext2 = '') => new Promise(async (resolve, reject) => {
            try {
                let tmp = 'temp/' + functions_1.default.uuid() + '.' + ext;
                let out = tmp + '.' + ext2;
                await fs_1.default.promises.writeFile(tmp, buffer);
                (0, child_process_1.spawn)('ffmpeg', [
                    '-y',
                    '-i', tmp,
                    ...args,
                    out
                ])
                    .on('error', reject)
                    .on('close', async (code) => {
                    try {
                        await fs_1.default.promises.unlink(tmp);
                        if (code !== 0)
                            return reject(code);
                        resolve(await fs_1.default.promises.readFile(out));
                        await fs_1.default.promises.unlink(out);
                    }
                    catch (e) {
                        reject(e);
                    }
                });
            }
            catch (e) {
                reject(e);
            }
        });
        this.toAudio = (buffer, ext) => {
            return this.ffmpeg(buffer, [
                '-vn',
                '-ac', '2',
                '-b:a', '128k',
                '-ar', '44100',
                '-f', 'mp3'
            ], ext, 'mp3');
        };
        this.toPTT = (buffer, ext) => {
            return this.ffmpeg(buffer, [
                '-vn',
                '-c:a', 'libopus',
                '-b:a', '128k',
                '-vbr', 'on',
                '-compression_level', '10'
            ], ext, 'opus');
        };
        this.toVideo = (buffer, ext) => {
            return this.ffmpeg(buffer, [
                '-c:v', 'libx264',
                '-c:a', 'aac',
                '-ab', '128k',
                '-ar', '44100',
                '-crf', '32',
                '-preset', 'slow'
            ], ext, 'mp4');
        };
        this.toMp3 = (inputFile) => new Promise((resolve, reject) => {
            const passThroughStream = new stream_1.PassThrough();
            const chunks = [];
            (0, fluent_ffmpeg_1.default)(inputFile)
                .toFormat('mp3')
                .on('error', (err) => {
                console.error(`Error during conversion: ${err.message}`);
                reject(err);
            })
                .on('end', () => { })
                .pipe(passThroughStream);
            passThroughStream.on('data', (chunk) => {
                chunks.push(chunk);
            });
            passThroughStream.on('end', () => {
                const buffer = Buffer.concat(chunks);
                resolve(buffer);
            });
            passThroughStream.on('error', (err) => {
                console.error(`Stream error: ${err.message}`);
                reject(err);
            });
        });
    }
}
exports.default = new Converter;
