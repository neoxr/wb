import 'rootpath';
declare class Session {
    constructor();
    init: () => void;
    backup: (client: any, dir: string) => Promise<void>;
    restore: (client: any, dir: string) => Promise<void>;
    isBackupExist: (client: any) => Promise<boolean>;
}
declare const _default: Session;
export default _default;
