import type { ColumnType } from '@apiDatabase/types';
export declare class AddColumnDto {
    name: string;
    type: ColumnType;
    defaultValue?: string;
}
