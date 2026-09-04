"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableEditorService = void 0;
const common_1 = require("@nestjs/common");
const drizzle_orm_1 = require("drizzle-orm");
const drizzle_service_1 = require("../db/drizzle.service");
const schema_1 = require("../db/schema");
let TableEditorService = class TableEditorService {
    drizzle;
    constructor(drizzle) {
        this.drizzle = drizzle;
    }
    assertSafeIdentifier(name, label) {
        if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name)) {
            throw new common_1.BadRequestException(`Invalid ${label}: ${name}`);
        }
    }
    mapPgTypeToColumnType(pgType) {
        const map = {
            text: 'text',
            'character varying': 'text',
            integer: 'integer',
            bigint: 'bigint',
            boolean: 'boolean',
            'timestamp with time zone': 'timestamp',
            'timestamp without time zone': 'timestamp',
            uuid: 'uuid',
            jsonb: 'jsonb',
            numeric: 'numeric',
            array: 'array',
        };
        return map[pgType] ?? 'text';
    }
    mapType(type) {
        const map = {
            text: 'TEXT',
            integer: 'INTEGER',
            bigint: 'BIGINT',
            boolean: 'BOOLEAN',
            timestamp: 'TIMESTAMPTZ',
            uuid: 'UUID',
            jsonb: 'JSONB',
            numeric: 'NUMERIC',
            array: 'ARRAY',
        };
        return map[type] ?? 'TEXT';
    }
    formatDefault(value, type) {
        const trimmed = value.trim();
        if (!trimmed)
            return '';
        if (/^(now\(\)|gen_random_uuid\(\)|current_timestamp)$/i.test(trimmed)) {
            return trimmed;
        }
        if (type === 'boolean')
            return trimmed;
        if (type === 'integer' || type === 'bigint' || type === 'numeric') {
            return trimmed;
        }
        if (type === 'jsonb')
            return `'${trimmed.replace(/'/g, "''")}'::jsonb`;
        return `'${trimmed.replace(/'/g, "''")}'`;
    }
    async getProjectSchema(orgSlug, projectSlug) {
        const [row] = await this.drizzle.db
            .select({ dbSchema: schema_1.projects.dbSchema })
            .from(schema_1.projects)
            .innerJoin(schema_1.organizations, (0, drizzle_orm_1.eq)(schema_1.projects.orgId, schema_1.organizations.id))
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.organizations.slug, orgSlug), (0, drizzle_orm_1.eq)(schema_1.projects.slug, projectSlug)))
            .limit(1);
        if (!row)
            throw new common_1.NotFoundException('Project not found');
        return row.dbSchema;
    }
    async getTables(orgSlug, projectSlug) {
        const schema = await this.getProjectSchema(orgSlug, projectSlug);
        const result = await this.drizzle.db.execute(`SELECT table_name
       FROM information_schema.tables
       WHERE table_schema = '${schema}'
         AND table_type = 'BASE TABLE'
       ORDER BY table_name ASC`);
        return result.rows.map((r) => r.table_name);
    }
    async getTableInfo(orgSlug, projectSlug, tableName) {
        this.assertSafeIdentifier(tableName, 'table name');
        const schema = await this.getProjectSchema(orgSlug, projectSlug);
        const columnsResult = await this.drizzle.db.execute(`SELECT column_name, data_type, is_nullable, column_default
       FROM information_schema.columns
       WHERE table_schema = '${schema}'
         AND table_name = '${tableName}'
       ORDER BY ordinal_position ASC`);
        const pkResult = await this.drizzle.db.execute(`SELECT kcu.column_name
       FROM information_schema.table_constraints tc
       JOIN information_schema.key_column_usage kcu
         ON tc.constraint_name = kcu.constraint_name
         AND tc.table_schema = kcu.table_schema
       WHERE tc.constraint_type = 'PRIMARY KEY'
         AND tc.table_schema = '${schema}'
         AND tc.table_name = '${tableName}'`);
        const pkColumns = new Set(pkResult.rows.map((r) => r.column_name));
        const fkResult = await this.drizzle.db.execute(`SELECT
         kcu.column_name,
         ccu.table_name AS foreign_table_name,
         ccu.column_name AS foreign_column_name
       FROM information_schema.table_constraints tc
       JOIN information_schema.key_column_usage kcu
         ON tc.constraint_name = kcu.constraint_name
         AND tc.table_schema = kcu.table_schema
       JOIN information_schema.constraint_column_usage ccu
         ON ccu.constraint_name = tc.constraint_name
       WHERE tc.constraint_type = 'FOREIGN KEY'
         AND tc.table_schema = '${schema}'
         AND tc.table_name = '${tableName}'`);
        const fkMap = new Map(fkResult.rows.map((r) => [
            r.column_name,
            { table: r.foreign_table_name, column: r.foreign_column_name },
        ]));
        const columns = columnsResult.rows.map((col) => ({
            name: col.column_name,
            type: this.mapPgTypeToColumnType(col.data_type),
            isNullable: col.is_nullable === 'YES',
            isPrimaryKey: pkColumns.has(col.column_name),
            defaultValue: col.column_default,
            foreignKey: fkMap.get(col.column_name) ?? null,
        }));
        if (columns.length === 0) {
            throw new common_1.NotFoundException(`Table "${tableName}" not found`);
        }
        return { name: tableName, columns };
    }
    isMissingTableError(err) {
        const code = err &&
            typeof err === 'object' &&
            'cause' in err &&
            err.cause &&
            typeof err.cause === 'object' &&
            'code' in err.cause
            ? String(err.cause.code)
            : null;
        return code === '42P01';
    }
    async getTableRows(orgSlug, projectSlug, tableName, limit = 100, offset = 0) {
        this.assertSafeIdentifier(tableName, 'table name');
        const schema = await this.getProjectSchema(orgSlug, projectSlug);
        try {
            const [rowsResult, countResult] = await Promise.all([
                this.drizzle.db.execute(`SELECT * FROM "${schema}"."${tableName}" LIMIT ${limit} OFFSET ${offset}`),
                this.drizzle.db.execute(`SELECT COUNT(*) as count FROM "${schema}"."${tableName}"`),
            ]);
            return {
                rows: rowsResult.rows,
                count: parseInt(countResult.rows[0]?.count ?? '0', 10),
            };
        }
        catch (err) {
            if (this.isMissingTableError(err)) {
                throw new common_1.NotFoundException(`Table "${tableName}" not found`);
            }
            throw err;
        }
    }
    async createTable(orgSlug, projectSlug, dto) {
        this.assertSafeIdentifier(dto.name, 'table name');
        const schema = await this.getProjectSchema(orgSlug, projectSlug);
        const pkCols = dto.columns.filter((c) => c.isPrimaryKey);
        const columnDefs = dto.columns.map((col) => {
            this.assertSafeIdentifier(col.name, 'column name');
            if (col.foreignKeyTable) {
                this.assertSafeIdentifier(col.foreignKeyTable, 'foreign key table');
            }
            if (col.foreignKeyColumn) {
                this.assertSafeIdentifier(col.foreignKeyColumn, 'foreign key column');
            }
            const parts = [];
            let colDef = `"${col.name}" ${this.mapType(col.type)}`;
            if (col.isPrimaryKey && col.type === 'bigint' && !col.defaultValue) {
                colDef += ' GENERATED ALWAYS AS IDENTITY';
            }
            parts.push(colDef);
            if (col.isPrimaryKey && pkCols.length === 1)
                parts.push('PRIMARY KEY');
            if (!col.isNullable && !col.isPrimaryKey)
                parts.push('NOT NULL');
            if (col.defaultValue) {
                parts.push(`DEFAULT ${this.formatDefault(col.defaultValue, col.type)}`);
            }
            return parts.join(' ');
        });
        const pkConstraint = pkCols.length > 1
            ? `PRIMARY KEY (${pkCols.map((c) => `"${c.name}"`).join(', ')})`
            : null;
        const fkConstraints = dto.columns
            .filter((col) => col.foreignKeyTable && col.foreignKeyColumn)
            .map((col) => `FOREIGN KEY ("${col.name}") REFERENCES "${schema}"."${col.foreignKeyTable}" ("${col.foreignKeyColumn}")`);
        const allDefs = [
            ...columnDefs,
            ...(pkConstraint ? [pkConstraint] : []),
            ...fkConstraints,
        ].join(', ');
        await this.drizzle.db.execute(`CREATE TABLE "${schema}"."${dto.name}" (${allDefs})`);
    }
    async deleteTable(orgSlug, projectSlug, tableName) {
        this.assertSafeIdentifier(tableName, 'table name');
        const schema = await this.getProjectSchema(orgSlug, projectSlug);
        await this.drizzle.db.execute(`DROP TABLE IF EXISTS "${schema}"."${tableName}"`);
    }
    async addColumn(orgSlug, projectSlug, tableName, dto) {
        this.assertSafeIdentifier(tableName, 'table name');
        this.assertSafeIdentifier(dto.name, 'column name');
        const schema = await this.getProjectSchema(orgSlug, projectSlug);
        let colDef = `"${dto.name}" ${this.mapType(dto.type)}`;
        if (dto.defaultValue) {
            colDef += ` DEFAULT ${this.formatDefault(dto.defaultValue, dto.type)}`;
        }
        await this.drizzle.db.execute(`ALTER TABLE "${schema}"."${tableName}" ADD COLUMN ${colDef}`);
    }
    async dropColumn(orgSlug, projectSlug, tableName, columnName) {
        this.assertSafeIdentifier(tableName, 'table name');
        this.assertSafeIdentifier(columnName, 'column name');
        const schema = await this.getProjectSchema(orgSlug, projectSlug);
        await this.drizzle.db.execute(`ALTER TABLE "${schema}"."${tableName}" DROP COLUMN "${columnName}"`);
    }
    async updateRow(orgSlug, projectSlug, tableName, pkColumn, pkValue, updates) {
        this.assertSafeIdentifier(tableName, 'table name');
        this.assertSafeIdentifier(pkColumn, 'primary key column');
        Object.keys(updates).forEach((col) => this.assertSafeIdentifier(col, 'column name'));
        const schema = await this.getProjectSchema(orgSlug, projectSlug);
        const setFragments = Object.entries(updates).map(([col, val]) => (0, drizzle_orm_1.sql) `${drizzle_orm_1.sql.identifier(col)} = ${val}`);
        await this.drizzle.db.execute((0, drizzle_orm_1.sql) `UPDATE ${drizzle_orm_1.sql.identifier(schema)}.${drizzle_orm_1.sql.identifier(tableName)}
          SET ${drizzle_orm_1.sql.join(setFragments, (0, drizzle_orm_1.sql) `, `)}
          WHERE ${drizzle_orm_1.sql.identifier(pkColumn)} = ${pkValue}`);
    }
};
exports.TableEditorService = TableEditorService;
exports.TableEditorService = TableEditorService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [drizzle_service_1.DrizzleService])
], TableEditorService);
//# sourceMappingURL=table-editor.service.js.map