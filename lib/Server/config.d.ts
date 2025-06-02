import { Collection } from '../Utils/types';
declare global {
    var creator: string;
    var appStatus: {
        reqGet: (req: any, params: string[]) => {
            status: boolean;
            creator?: string;
            msg?: string;
        };
        reqPost: (req: any, params: string[]) => {
            status: boolean;
            creator?: string;
            msg?: string;
        };
        url: (url: string) => {
            status: boolean;
            creator?: string;
            msg?: string;
        };
        number: (str: number) => {
            status: boolean;
            creator?: string;
            msg?: string;
        };
        error: (msg?: string) => {
            creator: string;
            status: false;
            msg: string;
        };
    };
}
export declare const allowedIPs: any[];
export declare const collection: Collection[];
