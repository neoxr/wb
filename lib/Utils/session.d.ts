import 'rootpath';
declare class Session {
    session: any;
    BACKUP_DIR: string;
    constructor(session: any);
    init: () => void;
    backup: (client: any, dir: string) => Promise<void>;
    restore: (client: any, dir: string) => Promise<void>;
    isBackupExist: (client: any) => Promise<boolean>;
}
export default Session;
