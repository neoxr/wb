"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const os_1 = require("os");
const crypto_1 = __importDefault(require("crypto"));
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const node_webpmux_1 = __importDefault(require("node-webpmux"));
const path_1 = __importDefault(require("path"));
class Exif {
    async imageToWebp(media) {
        let tmpFileOut = path_1.default.join((0, os_1.tmpdir)(), `${crypto_1.default.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`);
        let tmpFileIn = path_1.default.join((0, os_1.tmpdir)(), `${crypto_1.default.randomBytes(6).readUIntLE(0, 6).toString(36)}.jpg`);
        fs_1.default.writeFileSync(tmpFileIn, media);
        await new Promise((resolve, reject) => {
            (0, fluent_ffmpeg_1.default)(tmpFileIn)
                .on("error", reject)
                .on("end", () => resolve(true))
                .addOutputOptions([
                '-vf', 'scale=320:320:force_original_aspect_ratio=decrease,pad=320:320:(ow-iw)/2:(oh-ih)/2:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse',
                '-q:v', '80'
            ])
                .toFormat('webp')
                .save(tmpFileOut);
        });
        let buff = fs_1.default.readFileSync(tmpFileOut);
        fs_1.default.unlinkSync(tmpFileOut);
        fs_1.default.unlinkSync(tmpFileIn);
        return buff;
    }
    async videoToWebp(media) {
        let tmpFileOut = path_1.default.join((0, os_1.tmpdir)(), `${crypto_1.default.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`);
        let tmpFileIn = path_1.default.join((0, os_1.tmpdir)(), `${crypto_1.default.randomBytes(6).readUIntLE(0, 6).toString(36)}.mp4`);
        fs_1.default.writeFileSync(tmpFileIn, media);
        await new Promise((resolve, reject) => {
            (0, fluent_ffmpeg_1.default)(tmpFileIn)
                .on("error", reject)
                .on("end", () => resolve(true))
                .addOutputOptions([
                "-vcodec",
                "libwebp",
                "-vf",
                "scale=320:320:force_original_aspect_ratio=decrease,pad=320:320:(ow-iw)/2:(oh-ih)/2:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse",
                "-loop", "0", "-ss", "00:00:00", "-t", "00:00:05",
                "-preset",
                "default",
                "-an",
                "-vsync",
                "0"
            ]).toFormat("webp").save(tmpFileOut);
        });
        let buff = fs_1.default.readFileSync(tmpFileOut);
        fs_1.default.unlinkSync(tmpFileOut);
        fs_1.default.unlinkSync(tmpFileIn);
        return buff;
    }
    async writeExifImg(media, metadata) {
        let wMedia = await this.imageToWebp(media);
        let tmpFileIn = path_1.default.join((0, os_1.tmpdir)(), `${crypto_1.default.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`);
        let tmpFileOut = path_1.default.join((0, os_1.tmpdir)(), `${crypto_1.default.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`);
        fs_1.default.writeFileSync(tmpFileIn, wMedia);
        if (metadata.packname || metadata.author) {
            let img = new node_webpmux_1.default.Image();
            let json = {
                "sticker-pack-id": "neoxrbot",
                "sticker-pack-name": metadata.packname,
                "sticker-pack-publisher": metadata.author,
                "emojis": metadata.categories ? metadata.categories : [""],
                "web-rest-api": "https://api.neoxr.my.id"
            };
            let exifAttr = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00]);
            let jsonBuff = Buffer.from(JSON.stringify(json), "utf-8");
            let exif = Buffer.concat([exifAttr, jsonBuff]);
            exif.writeUIntLE(jsonBuff.length, 14, 4);
            await img.load(tmpFileIn);
            fs_1.default.unlinkSync(tmpFileIn);
            img.exif = exif;
            await img.save(tmpFileOut);
            return tmpFileOut;
        }
    }
    async writeExifWebp(media, metadata) {
        let tmpFileIn = path_1.default.join((0, os_1.tmpdir)(), `${crypto_1.default.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`);
        let tmpFileOut = path_1.default.join((0, os_1.tmpdir)(), `${crypto_1.default.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`);
        fs_1.default.writeFileSync(tmpFileIn, media);
        if (metadata.packname || metadata.author) {
            let img = new node_webpmux_1.default.Image();
            let json = {
                "sticker-pack-id": "neoxrbot",
                "sticker-pack-name": metadata.packname,
                "sticker-pack-publisher": metadata.author,
                "emojis": metadata.categories ? metadata.categories : [""],
                "web-rest-api": "https://api.neoxr.my.id"
            };
            let exifAttr = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00]);
            let jsonBuff = Buffer.from(JSON.stringify(json), "utf-8");
            let exif = Buffer.concat([exifAttr, jsonBuff]);
            exif.writeUIntLE(jsonBuff.length, 14, 4);
            await img.load(tmpFileIn);
            fs_1.default.unlinkSync(tmpFileIn);
            img.exif = exif;
            await img.save(tmpFileOut);
            return tmpFileOut;
        }
    }
    async writeExifVid(media, metadata) {
        let wMedia = await this.videoToWebp(media);
        let tmpFileIn = path_1.default.join((0, os_1.tmpdir)(), `${crypto_1.default.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`);
        let tmpFileOut = path_1.default.join((0, os_1.tmpdir)(), `${crypto_1.default.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`);
        fs_1.default.writeFileSync(tmpFileIn, wMedia);
        if (metadata.packname || metadata.author) {
            let img = new node_webpmux_1.default.Image();
            let json = {
                "sticker-pack-id": "neoxrbot",
                "sticker-pack-name": metadata.packname,
                "sticker-pack-publisher": metadata.author,
                "emojis": metadata.categories ? metadata.categories : [""],
                "web-rest-api": "https://api.neoxr.my.id"
            };
            let exifAttr = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00]);
            let jsonBuff = Buffer.from(JSON.stringify(json), "utf-8");
            let exif = Buffer.concat([exifAttr, jsonBuff]);
            exif.writeUIntLE(jsonBuff.length, 14, 4);
            await img.load(tmpFileIn);
            fs_1.default.unlinkSync(tmpFileIn);
            img.exif = exif;
            await img.save(tmpFileOut);
            return tmpFileOut;
        }
    }
}
exports.default = new Exif;
