import { DrizzleService } from '../db/drizzle.service';
export declare class ProjectApiService {
    private drizzle;
    constructor(drizzle: DrizzleService);
    private assertSafeIdentifier;
    private formatLiteral;
    resolveProjectSchema(projectId: string, projectSlug: string): Promise<string>;
    private getPrimaryKeyColumn;
    getRows(projectId: string, projectSlug: string, tableName: string, rawParams: Record<string, string>): Promise<Record<string, unknown>[]>;
    insertRow(projectId: string, projectSlug: string, tableName: string, body: Record<string, unknown>): Promise<Record<string, unknown>>;
    updateRow(projectId: string, projectSlug: string, tableName: string, rowId: string, body: Record<string, unknown>): Promise<Record<string, unknown>>;
    deleteRow(projectId: string, projectSlug: string, tableName: string, rowId: string): Promise<Record<string, unknown>>;
}
