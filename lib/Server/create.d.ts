import { Application } from 'express';
import { Route } from '../Utils/types';
declare class RouteLoader {
    private app;
    private middleware;
    private routeFiles;
    constructor(app: Application, middleware: any);
    getRouteFiles(dir: string): string[];
    load(dir: string): void;
    defineRoute(route: Route): void;
}
export default RouteLoader;
