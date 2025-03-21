import Message from './message';
export default class Serialize extends Message {
    mention: (text: string) => string[];
    bind(parent: any, m: any, bypassDisappearing?: boolean): any;
}
