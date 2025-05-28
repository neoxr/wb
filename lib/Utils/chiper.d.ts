import { AxiosInstance } from 'axios';
declare class Chiper {
    algorithm: string;
    secretKey: Buffer;
    iv: Buffer;
    instance: AxiosInstance;
    constructor(secretKey?: string);
    detector(): Promise<any>;
    generateToken(owner: string | number, bot: string | number): Promise<any>;
    verifyToken(token: number, pin: string | number): Promise<any>;
    checkLicense(fingerprint: any, token: any): Promise<any>;
    encrypt: (text: string) => string;
    decrypt: (text: string) => string;
}
export default Chiper;
