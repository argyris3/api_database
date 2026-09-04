import type { Request as ExpressRequest } from 'express';
import { ProjectApiService } from './project-api.service';
export declare class ProjectApiController {
    private projectApiService;
    constructor(projectApiService: ProjectApiService);
    private getProjectKey;
    private assertWriteAccess;
    getRows(req: ExpressRequest, projectSlug: string, table: string, query: Record<string, string>): Promise<Record<string, unknown>[]>;
    insertRow(req: ExpressRequest, projectSlug: string, table: string, body: Record<string, unknown>): Promise<Record<string, unknown>>;
    updateRow(req: ExpressRequest, projectSlug: string, table: string, id: string, body: Record<string, unknown>): Promise<Record<string, unknown>>;
    deleteRow(req: ExpressRequest, projectSlug: string, table: string, id: string): Promise<Record<string, unknown>>;
}
