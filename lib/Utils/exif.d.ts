declare class Exif {
    imageToWebp(media: Buffer): Promise<Buffer>;
    videoToWebp(media: Buffer): Promise<Buffer>;
    writeExifImg(media: Buffer, metadata: {
        packname?: string;
        author?: string;
        categories?: string[];
    }): Promise<string | undefined>;
    writeExifWebp(media: Buffer, metadata: {
        packname?: string;
        author?: string;
        categories?: string[];
    }): Promise<string | undefined>;
    writeExifVid(media: Buffer, metadata: {
        packname?: string;
        author?: string;
        categories?: string[];
    }): Promise<string | undefined>;
}
declare const _default: Exif;
export default _default;
