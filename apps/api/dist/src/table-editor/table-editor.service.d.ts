import { DrizzleService } from '../db/drizzle.service';
import { CreateTableDto } from './dto/create-table.dto';
import { AddColumnDto } from './dto/alter-table.dto';
import type { TableInfo } from '@apiDatabase/types';
export declare class TableEditorService {
    private drizzle;
    constructor(drizzle: DrizzleService);
    private assertSafeIdentifier;
    private mapPgTypeToColumnType;
    private mapType;
    private formatDefault;
    private getProjectSchema;
    getTables(orgSlug: string, projectSlug: string): Promise<string[]>;
    getTableInfo(orgSlug: string, projectSlug: string, tableName: string): Promise<TableInfo>;
    private isMissingTableError;
    getTableRows(orgSlug: string, projectSlug: string, tableName: string, limit?: number, offset?: number): Promise<{
        rows: Record<string, unknown>[];
        count: number;
    }>;
    createTable(orgSlug: string, projectSlug: string, dto: CreateTableDto): Promise<void>;
    deleteTable(orgSlug: string, projectSlug: string, tableName: string): Promise<void>;
    addColumn(orgSlug: string, projectSlug: string, tableName: string, dto: AddColumnDto): Promise<void>;
    dropColumn(orgSlug: string, projectSlug: string, tableName: string, columnName: string): Promise<void>;
    updateRow(orgSlug: string, projectSlug: string, tableName: string, pkColumn: string, pkValue: string, updates: Record<string, unknown>): Promise<void>;
}
