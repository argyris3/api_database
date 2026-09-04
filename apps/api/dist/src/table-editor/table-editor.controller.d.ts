import { TableEditorService } from './table-editor.service';
import { CreateTableDto } from './dto/create-table.dto';
import { AddColumnDto } from './dto/alter-table.dto';
export declare class TableEditorController {
    private tableEditorService;
    constructor(tableEditorService: TableEditorService);
    getTables(slug: string, projectSlug: string): Promise<string[]>;
    getTableRows(slug: string, projectSlug: string, tableName: string, limit?: string, offset?: string): Promise<{
        rows: Record<string, unknown>[];
        count: number;
    }>;
    getTableInfo(slug: string, projectSlug: string, tableName: string): Promise<import("@apiDatabase/types").TableInfo>;
    createTable(slug: string, projectSlug: string, dto: CreateTableDto): Promise<void>;
    addColumn(slug: string, projectSlug: string, tableName: string, dto: AddColumnDto): Promise<void>;
    dropColumn(slug: string, projectSlug: string, tableName: string, columnName: string): Promise<void>;
    deleteTable(slug: string, projectSlug: string, tableName: string): Promise<void>;
    updateRow(slug: string, projectSlug: string, tableName: string, pkValue: string, body: {
        pkColumn: string;
        updates: Record<string, unknown>;
    }): Promise<void>;
}
