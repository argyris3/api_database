import { DrizzleService } from '../db/drizzle.service';
import type { QueryResult } from '@apiDatabase/types';
export declare class SqlEditorService {
    private drizzle;
    constructor(drizzle: DrizzleService);
    private assertSafeIdentifier;
    private parseSingleStatement;
    private getNeonClient;
    private normalizePgResult;
    private getProject;
    executeQuery(orgSlug: string, projectSlug: string, querySql: string): Promise<QueryResult>;
    getHistory(orgSlug: string, projectSlug: string): Promise<{
        id: string;
        projectId: string;
        sql: string;
        executionTimeMs: number;
        rowCount: number;
        createdAt: Date;
    }[]>;
}
