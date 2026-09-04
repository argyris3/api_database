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
exports.ProjectApiService = void 0;
const common_1 = require("@nestjs/common");
const drizzle_orm_1 = require("drizzle-orm");
const drizzle_service_1 = require("../db/drizzle.service");
const schema_1 = require("../db/schema");
const query_parser_1 = require("./query-parser");
let ProjectApiService = class ProjectApiService {
    drizzle;
    constructor(drizzle) {
        this.drizzle = drizzle;
    }
    assertSafeIdentifier(name, label) {
        if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name)) {
            throw new common_1.BadRequestException(`Invalid ${label}: ${name}`);
        }
    }
    formatLiteral(value) {
        if (value === null || value === undefined)
            return 'NULL';
        if (typeof value === 'boolean')
            return value ? 'TRUE' : 'FALSE';
        if (typeof value === 'number' && Number.isFinite(value)) {
            return String(value);
        }
        if (typeof value === 'string') {
            return `'${value.replace(/'/g, "''")}'`;
        }
        if (typeof value === 'object') {
            return `'${JSON.stringify(value).replace(/'/g, "''")}'::jsonb`;
        }
        throw new common_1.BadRequestException('Unsupported column value');
    }
    async resolveProjectSchema(projectId, projectSlug) {
        const [project] = await this.drizzle.db
            .select({ dbSchema: schema_1.projects.dbSchema, slug: schema_1.projects.slug })
            .from(schema_1.projects)
            .where((0, drizzle_orm_1.eq)(schema_1.projects.id, projectId))
            .limit(1);
        if (!project)
            throw new common_1.NotFoundException('Project not found');
        if (project.slug !== projectSlug) {
            throw new common_1.ForbiddenException('API key does not match this project URL');
        }
        return project.dbSchema;
    }
    async getPrimaryKeyColumn(schema, tableName) {
        const result = await this.drizzle.db.execute(`SELECT kcu.column_name
       FROM information_schema.table_constraints tc
       JOIN information_schema.key_column_usage kcu
         ON tc.constraint_name = kcu.constraint_name
         AND tc.table_schema = kcu.table_schema
       WHERE tc.constraint_type = 'PRIMARY KEY'
         AND tc.table_schema = '${schema}'
         AND tc.table_name = '${tableName}'
       ORDER BY kcu.ordinal_position ASC
       LIMIT 1`);
        const pk = result.rows[0]?.column_name;
        if (!pk) {
            throw new common_1.BadRequestException(`Table "${tableName}" has no primary key`);
        }
        return pk;
    }
    async getRows(projectId, projectSlug, tableName, rawParams) {
        this.assertSafeIdentifier(tableName, 'table name');
        const schema = await this.resolveProjectSchema(projectId, projectSlug);
        const { select, filters, orderBy, limit, offset } = (0, query_parser_1.parseQueryParams)(rawParams);
        const columns = select.length > 0 ? select.map((c) => `"${c}"`).join(', ') : '*';
        const where = (0, query_parser_1.buildWhereClause)(filters);
        const order = orderBy
            ? `ORDER BY "${orderBy.column}" ${orderBy.direction}`
            : '';
        const sql = `
      SELECT ${columns}
      FROM "${schema}"."${tableName}"
      ${where}
      ${order}
      LIMIT ${limit}
      OFFSET ${offset}
    `;
        const result = await this.drizzle.db.execute(sql);
        return result.rows;
    }
    async insertRow(projectId, projectSlug, tableName, body) {
        this.assertSafeIdentifier(tableName, 'table name');
        const schema = await this.resolveProjectSchema(projectId, projectSlug);
        const entries = Object.entries(body);
        if (entries.length === 0) {
            throw new common_1.BadRequestException('Request body cannot be empty');
        }
        entries.forEach(([col]) => this.assertSafeIdentifier(col, 'column name'));
        const columns = entries.map(([c]) => `"${c}"`).join(', ');
        const values = entries.map(([, v]) => this.formatLiteral(v)).join(', ');
        const sql = `
      INSERT INTO "${schema}"."${tableName}" (${columns})
      VALUES (${values})
      RETURNING *
    `;
        const result = await this.drizzle.db.execute(sql);
        return result.rows[0];
    }
    async updateRow(projectId, projectSlug, tableName, rowId, body) {
        this.assertSafeIdentifier(tableName, 'table name');
        const schema = await this.resolveProjectSchema(projectId, projectSlug);
        const pkColumn = await this.getPrimaryKeyColumn(schema, tableName);
        const entries = Object.entries(body);
        if (entries.length === 0) {
            throw new common_1.BadRequestException('Request body cannot be empty');
        }
        entries.forEach(([col]) => this.assertSafeIdentifier(col, 'column name'));
        const setClauses = entries
            .map(([col, val]) => `"${col}" = ${this.formatLiteral(val)}`)
            .join(', ');
        const sql = `
      UPDATE "${schema}"."${tableName}"
      SET ${setClauses}
      WHERE "${pkColumn}" = ${this.formatLiteral(rowId)}
      RETURNING *
    `;
        const result = await this.drizzle.db.execute(sql);
        if (!result.rows[0])
            throw new common_1.NotFoundException('Row not found');
        return result.rows[0];
    }
    async deleteRow(projectId, projectSlug, tableName, rowId) {
        this.assertSafeIdentifier(tableName, 'table name');
        const schema = await this.resolveProjectSchema(projectId, projectSlug);
        const pkColumn = await this.getPrimaryKeyColumn(schema, tableName);
        const sql = `
      DELETE FROM "${schema}"."${tableName}"
      WHERE "${pkColumn}" = ${this.formatLiteral(rowId)}
      RETURNING *
    `;
        const result = await this.drizzle.db.execute(sql);
        if (!result.rows[0])
            throw new common_1.NotFoundException('Row not found');
        return result.rows[0];
    }
};
exports.ProjectApiService = ProjectApiService;
exports.ProjectApiService = ProjectApiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [drizzle_service_1.DrizzleService])
], ProjectApiService);
//# sourceMappingURL=project-api.service.js.map