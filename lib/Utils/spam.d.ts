import { User, DetectionOptions } from './types';
export default class SpamDetector {
    users: Map<string, User[]>;
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
    /**
     * Mendapatkan array user untuk client ID tertentu.
     * Jika belum ada, maka akan dibuatkan array kosong baru.
     * @param clientId - ID unik dari instance client (client.user.id)
     * @returns Array user untuk client tersebut
     */
    private getClientUsers;
    /**
     * Menambahkan user baru ke daftar spam untuk client tertentu.
     * @param clientId - ID client
     * @param userId - ID user yang melakukan spam (m.sender)
     */
    pushId: (clientId: string, userId: string) => void;
    /**
     * Mencari data user di dalam daftar spam client tertentu.
     * @param clientId - ID client
     * @param userId - ID user yang ingin dicari
     * @returns Objek User jika ditemukan, atau undefined
     */
    peek: (clientId: string, userId: string) => User | undefined;
    detection: (client: any, m: any, options: DetectionOptions) => {
        state: string;
        msg: string;
    } | {
        state: string;
        msg?: undefined;
    } | undefined;
}
