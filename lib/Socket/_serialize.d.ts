import Message from './message';
export default class Serialize extends Message {
    mention: (text: string) => string[];
    jidNormalize: (parent: any, jid: string) => string;
    bind(parent: any, m: any, bypassDisappearing?: boolean, bot?: (id: string) => boolean): any;
}
