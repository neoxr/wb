declare class Scraper {
    chatAI: (bid: string, key: string, text: string) => Promise<any>;
    simsimi: (text: string, lang?: string) => Promise<any>;
    simsimiV2: (text: string) => Promise<any>;
    shorten: (url: string) => Promise<any>;
    uploadImage: (str: string | Buffer) => Promise<any>;
    uploadImageV2: (buffer: Buffer) => Promise<any>;
    uploadImageV3: (str: string | Buffer) => Promise<any>;
    uploadFile: (buffer: Buffer, extention: string) => Promise<any>;
    uploadFileV2: (buffer: Buffer, name: string) => Promise<any>;
    toJpg: (str: string | Buffer) => Promise<any>;
    getSmtc: () => any;
}
declare const _default: Scraper;
export default _default;
