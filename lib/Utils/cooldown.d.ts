type CooldownEntry = {
    _id: string;
    timer: number;
};
export default class Spam {
    delay: number;
    cooldown: Map<string, CooldownEntry[]>;
    constructor(delay: number);
    /**
     * Mendapatkan array cooldown untuk client ID tertentu.
     * Jika belum ada, maka akan dibuatkan array kosong baru.
     * @param clientId - ID unik dari instance client (client.user.id)
     * @returns Array cooldown untuk client tersebut
     */
    private getClientCooldowns;
    /**
     * Memeriksa apakah sebuah ID sedang dalam masa cooldown untuk klien tertentu.
     * @param clientId - ID unik dari instance client
     * @param id - ID yang akan dicek (misal: m.chat atau m.sender)
     */
    isHold: (clientId: string, id: string) => CooldownEntry | undefined;
    /**
     * Menambahkan ID ke daftar cooldown untuk klien tertentu.
     * @param clientId - ID unik dari instance client
     * @param id - ID yang akan dimasukkan (misal: m.chat atau m.sender)
     */
    pushId: (clientId: string, id: string) => void;
    /**
     * Logika utama untuk menahan (hold) dan mereset cooldown.
     * Metode ini telah diperbarui untuk memerlukan clientId.
     * @param clientId - ID unik dari instance client
     * @param id - ID yang akan ditahan (misal: m.chat)
     */
    hold: (clientId: string, id: string) => {
        state: boolean;
    };
    /**
     * Hanya memeriksa status cooldown tanpa mengubahnya.
     * Metode ini telah diperbarui untuk memerlukan clientId.
     * @param clientId - ID unik dari instance client
     * @param id - ID yang akan dicek
     */
    check: (clientId: string, id: string) => {
        state: boolean;
    };
}
export {};
