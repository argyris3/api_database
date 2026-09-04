"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryHistory = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const projects_1 = require("./projects");
exports.queryHistory = (0, pg_core_1.pgTable)('query_history', {
    id: (0, pg_core_1.uuid)().defaultRandom().primaryKey(),
    projectId: (0, pg_core_1.uuid)('project_id')
        .notNull()
        .references(() => projects_1.projects.id, { onDelete: 'cascade' }),
    sql: (0, pg_core_1.text)('sql').notNull(),
    executionTimeMs: (0, pg_core_1.integer)('execution_time_ms').notNull(),
    rowCount: (0, pg_core_1.integer)('row_count').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').notNull().defaultNow(),
});
//# sourceMappingURL=query-history.js.map