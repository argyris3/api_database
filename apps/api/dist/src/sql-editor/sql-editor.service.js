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
exports.SqlEditorService = void 0;
const common_1 = require("@nestjs/common");
const drizzle_orm_1 = require("drizzle-orm");
const drizzle_service_1 = require("../db/drizzle.service");
const schema_1 = require("../db/schema");
let SqlEditorService = class SqlEditorService {
    drizzle;
    constructor(drizzle) {
        this.drizzle = drizzle;
    }
    assertSafeIdentifier(name, label) {
        if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name)) {
            throw new common_1.BadRequestException(`Invalid ${label}: ${name}`);
        }
    }
    parseSingleStatement(querySql) {
        const statements = querySql
            .split(';')
            .map((part) => part.trim())
            .filter((part) => part.length > 0);
        if (statements.length === 0) {
            throw new common_1.BadRequestException('SQL query cannot be empty');
        }
        if (statements.length > 1) {
            throw new common_1.BadRequestException('Only one SQL statement per run. Remove extra statements after a semicolon (e.g. a trailing SELECT).');
        }
        return statements[0];
    }
    getNeonClient() {
        const client = this.drizzle.db.$client;
        if (!client?.transaction) {
            throw new Error('Neon HTTP client is not available');
        }
        return client;
    }
    normalizePgResult(result) {
        const rows = (result.rows ?? []);
        return {
            rows,
            rowCount: result.rowCount ?? rows.length,
            command: result.command ?? 'SELECT',
        };
    }
    async getProject(orgSlug, projectSlug) {
        const [row] = await this.drizzle.db
            .select({
            id: schema_1.projects.id,
            dbSchema: schema_1.projects.dbSchema,
        })
            .from(schema_1.projects)
            .innerJoin(schema_1.organizations, (0, drizzle_orm_1.eq)(schema_1.projects.orgId, schema_1.organizations.id))
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.organizations.slug, orgSlug), (0, drizzle_orm_1.eq)(schema_1.projects.slug, projectSlug)))
            .limit(1);
        if (!row)
            throw new common_1.NotFoundException('Project not found');
        return row;
    }
    async executeQuery(orgSlug, projectSlug, querySql) {
        const project = await this.getProject(orgSlug, projectSlug);
        const statement = this.parseSingleStatement(querySql);
        const normalised = statement.trim().toUpperCase();
        const blocked = ['DROP DATABASE', 'DROP SCHEMA', 'TRUNCATE'];
        if (blocked.some((b) => normalised.startsWith(b))) {
            throw new common_1.BadRequestException('This statement is not allowed');
        }
        this.assertSafeIdentifier(project.dbSchema, 'project schema');
        const start = Date.now();
        try {
            const neonSql = this.getNeonClient();
            const results = await neonSql.transaction((txn) => [
                txn `SET LOCAL search_path TO ${txn.unsafe(`"${project.dbSchema}", public`)}`,
                txn `${txn.unsafe(statement)}`,
            ], { fullResults: true, readOnly: false });
            const executionTimeMs = Date.now() - start;
            const { rows, rowCount, command } = this.normalizePgResult(results[results.length - 1]);
            const columns = rows.length > 0 ? Object.keys(rows[0]) : [];
            await this.drizzle.db.insert(schema_1.queryHistory).values({
                projectId: project.id,
                sql: querySql,
                executionTimeMs,
                rowCount,
            });
            return {
                rows,
                columns,
                rowCount,
                executionTimeMs,
                command,
            };
        }
        catch (err) {
            const message = err instanceof Error ? err.message : 'Query failed';
            throw new common_1.BadRequestException(message);
        }
    }
    async getHistory(orgSlug, projectSlug) {
        const project = await this.getProject(orgSlug, projectSlug);
        return this.drizzle.db
            .select()
            .from(schema_1.queryHistory)
            .where((0, drizzle_orm_1.eq)(schema_1.queryHistory.projectId, project.id))
            .orderBy((0, drizzle_orm_1.desc)(schema_1.queryHistory.createdAt))
            .limit(50);
    }
};
exports.SqlEditorService = SqlEditorService;
exports.SqlEditorService = SqlEditorService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [drizzle_service_1.DrizzleService])
], SqlEditorService);
//# sourceMappingURL=sql-editor.service.js.map