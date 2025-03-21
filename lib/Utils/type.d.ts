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
