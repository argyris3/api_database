import { SqlEditorService } from './sql-editor.service';
import { ExecuteQueryDto } from './dto/execute-query.dto';
export declare class SqlEditorController {
    private sqlEditorService;
    constructor(sqlEditorService: SqlEditorService);
    executeQuery(slug: string, projectSlug: string, dto: ExecuteQueryDto): Promise<import("@apiDatabase/types").QueryResult>;
    getHistory(slug: string, projectSlug: string): Promise<{
        id: string;
        projectId: string;
        sql: string;
        executionTimeMs: number;
        rowCount: number;
        createdAt: Date;
    }[]>;
}
