declare class Chiper {
    algorithm: string;
    secretKey: Buffer;
    iv: Buffer;
    constructor(secretKey: string);
    encrypt: (text: string) => string;
    decrypt: (text: string) => string;
}
export default Chiper;
