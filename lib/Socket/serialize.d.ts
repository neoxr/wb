import Message from './message';
declare class Serialize extends Message {
    mention: (text: string) => string[];
    jidNormalize: (parent: any, jid: string) => string;
    bind(parent: any, m: any, Caching?: any | null, bypassDisappearing?: boolean, bot?: (id: string) => boolean): any;
}
declare const _default: Serialize;
export default _default;
