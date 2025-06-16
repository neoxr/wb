import { AxiosRequestConfig } from 'axios';
declare class Fetcher {
    _get(url: string, options?: AxiosRequestConfig): Promise<any>;
    _post(url: string, payload: any, options?: AxiosRequestConfig): Promise<any>;
    _direct(url: string, options?: AxiosRequestConfig): Promise<string>;
}
declare const _default: Fetcher;
export default _default;
