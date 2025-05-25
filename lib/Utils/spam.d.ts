import { User, DetectionOptions } from './type';
export default class SpamDetector {
    users: User[];
    RESET_TIMER: number;
    HOLD_TIMER: number;
    PERMANENT_THRESHOLD: number;
    NOTIFY_THRESHOLD: number;
    BANNED_THRESHOLD: number;
    constructor(options?: {
        RESET_TIMER?: number;
        HOLD_TIMER?: number;
        PERMANENT_THRESHOLD?: number;
        NOTIFY_THRESHOLD?: number;
        BANNED_THRESHOLD?: number;
    });
    pushId: (id: string) => void;
    peek: (id: string) => User | undefined;
    detection: (client: any, m: any, options: DetectionOptions) => {
        state: string;
        msg?: undefined;
    } | {
        state: string;
        msg: string;
    } | undefined;
}
