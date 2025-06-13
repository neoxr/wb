import { Request, Response, NextFunction } from 'express';
import { Method } from '../Utils/types';
interface RouteConfig {
    restrict?: boolean;
    authorize?: boolean;
    rpm?: boolean;
    error?: boolean;
    requires?: ((req: Request, res: Response, next: NextFunction) => void) | false;
    validator?: (req: Request, res: Response, next: NextFunction) => void;
    method: Method;
    parameter?: string[];
    [key: string]: any;
}
declare const _default: (route: RouteConfig) => ((req: Request, res: Response, next: NextFunction) => void)[];
export default _default;
