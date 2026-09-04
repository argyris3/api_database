"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseQueryParams = parseQueryParams;
exports.buildWhereClause = buildWhereClause;
const common_1 = require("@nestjs/common");
const constants_1 = require("@apiDatabase/constants");
function assertSafeIdentifier(name, label) {
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name)) {
        throw new common_1.BadRequestException(`Invalid ${label}: ${name}`);
    }
}
function formatSqlValue(operator, rawValue) {
    const value = rawValue.replace(/;/g, '');
    if (operator === 'IS') {
        return value.toUpperCase() === 'NULL' ? 'NULL' : 'NOT NULL';
    }
    if (operator === 'LIKE' || operator === 'ILIKE') {
        return `'${value.replace(/'/g, "''")}'`;
    }
    if (value.toLowerCase() === 'true' || value.toLowerCase() === 'false') {
        return value.toLowerCase();
    }
    if (/^-?\d+(\.\d+)?$/.test(value)) {
        return value;
    }
    return `'${value.replace(/'/g, "''")}'`;
}
function parseQueryParams(params) {
    const filters = [];
    let select = [];
    let orderBy = null;
    let limit = 100;
    let offset = 0;
    for (const [key, value] of Object.entries(params)) {
        if (constants_1.RESERVED_QUERY_PARAMS.has(key)) {
            switch (key) {
                case 'select':
                    select = value
                        .split(',')
                        .map((c) => c.trim())
                        .filter(Boolean);
                    select.forEach((col) => assertSafeIdentifier(col, 'select column'));
                    break;
                case 'order': {
                    const [col, dir] = value.split('.');
                    assertSafeIdentifier(col, 'order column');
                    orderBy = {
                        column: col,
                        direction: dir?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC',
                    };
                    break;
                }
                case 'limit':
                    limit = Math.min(parseInt(value, 10) || 100, 1000);
                    break;
                case 'offset':
                    offset = Math.max(parseInt(value, 10) || 0, 0);
                    break;
            }
            continue;
        }
        assertSafeIdentifier(key, 'filter column');
        const dotIndex = value.indexOf('.');
        if (dotIndex === -1)
            continue;
        const operator = value.slice(0, dotIndex);
        const filterValue = value.slice(dotIndex + 1);
        if (!(operator in constants_1.FILTER_OPERATORS))
            continue;
        filters.push({
            column: key,
            operator: constants_1.FILTER_OPERATORS[operator],
            value: filterValue,
        });
    }
    return { select, filters, orderBy, limit, offset };
}
function buildWhereClause(filters) {
    if (filters.length === 0)
        return '';
    const clauses = filters.map(({ column, operator, value }) => {
        const sqlValue = formatSqlValue(operator, value);
        if (operator === 'IS') {
            return `"${column}" IS ${sqlValue}`;
        }
        if (operator === 'LIKE' || operator === 'ILIKE') {
            return `"${column}" ${operator} ${sqlValue}`;
        }
        return `"${column}" ${operator} ${sqlValue}`;
    });
    return `WHERE ${clauses.join(' AND ')}`;
}
//# sourceMappingURL=query-parser.js.map