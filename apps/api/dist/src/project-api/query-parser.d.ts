export interface ParsedQuery {
    select: string[];
    filters: FilterClause[];
    orderBy: OrderClause | null;
    limit: number;
    offset: number;
}
interface FilterClause {
    column: string;
    operator: string;
    value: string;
}
interface OrderClause {
    column: string;
    direction: 'ASC' | 'DESC';
}
export declare function parseQueryParams(params: Record<string, string>): ParsedQuery;
export declare function buildWhereClause(filters: FilterClause[]): string;
export {};
