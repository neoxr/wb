export default class SpamDetector {
    users: {
        _id: string;
        spam_point: number;
    }[];
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
    pushId: (id: string) => number;
    peek: (id: string) => {
        _id: string;
        spam_point: number;
    } | undefined;
    detection: (client: any, m: any, options?: {
        coldown?: any;
        users?: any;
        prefix?: string;
        command?: string;
        commands?: string[];
        show?: string;
        banned_times?: number;
    }) => {
        state: string;
        msg?: undefined;
    } | {
        state: string;
        msg: string;
    } | undefined;
}
