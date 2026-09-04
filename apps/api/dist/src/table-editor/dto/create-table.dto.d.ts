import type { CreateTableInput, CreateColumnInput, ColumnType } from '@apiDatabase/types';
export declare class CreateColumnDto implements CreateColumnInput {
    name: string;
    type: ColumnType;
    isNullable: boolean;
    isPrimaryKey: boolean;
    defaultValue?: string;
    foreignKeyTable?: string;
    foreignKeyColumn?: string;
}
export declare class CreateTableDto implements CreateTableInput {
    name: string;
    columns: CreateColumnDto[];
}
