declare class Converter {
    ffmpeg: (buffer: Buffer, args?: string[], ext?: string, ext2?: string) => Promise<Buffer>;
    toAudio: (buffer: Buffer, ext: string) => Promise<Buffer>;
    toPTT: (buffer: Buffer, ext: string) => Promise<Buffer>;
    toVideo: (buffer: Buffer, ext: string) => Promise<Buffer>;
    toMp3: (inputFile: Buffer | string) => Promise<Buffer>;
}
declare const _default: Converter;
export default _default;
