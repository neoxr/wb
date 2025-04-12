export interface Button {
    buttonId?: string;
    buttonText?: {
        displayText: string;
    };
    nativeFlowInfo?: {
        name: string;
        paramsJson: string;
    };
    type: string;
}
export interface ContactInfo {
    org?: string;
    email?: string;
    website?: string;
    about?: string;
}
export interface Bot {
    jid: string;
    data: any;
}
export interface User {
    _id: string;
    spam_point: number;
}
export interface DetectionOptions {
    prefix: string;
    command: string;
    commands: string[];
    show: boolean;
    users: {
        ban_temporary: number;
        banned: boolean;
        ban_times: number;
    };
    banned_times: number;
    cooldown: {
        hold: (chat: string) => {
            state: boolean;
        };
    };
}
export interface Contact {
    id: string;
    lid?: string;
    name?: string;
    notify?: string;
    verifiedName?: string;
    imgUrl?: string | null | 'changed';
    status?: string;
}
export type WAConnectionState = 'open' | 'connecting' | 'close';
export type ConnectionState = {
    connection: WAConnectionState;
    lastDisconnect?: {
        error: Error | undefined;
        date: Date;
    };
    isNewLogin?: boolean;
    qr?: string;
    receivedPendingNotifications?: boolean;
    legacy?: {
        phoneConnected: boolean;
        user?: Contact;
    };
    isOnline?: boolean;
};
export type WAPresence = 'unavailable' | 'available' | 'composing' | 'recording' | 'paused';
export interface PresenceData {
    lastKnownPresence: WAPresence;
    lastSeen?: number;
}
