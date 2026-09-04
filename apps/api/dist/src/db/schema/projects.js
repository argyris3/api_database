"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projects = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const organizations_1 = require("./organizations");
exports.projects = (0, pg_core_1.pgTable)('projects', {
    id: (0, pg_core_1.uuid)().defaultRandom().primaryKey(),
    orgId: (0, pg_core_1.uuid)('org_id')
        .notNull()
        .references(() => organizations_1.organizations.id, { onDelete: 'cascade' }),
    name: (0, pg_core_1.text)('name').notNull(),
    slug: (0, pg_core_1.text)('slug').notNull().unique(),
    dbSchema: (0, pg_core_1.text)('db_schema').notNull().unique(),
    projectUrl: (0, pg_core_1.text)('project_url').notNull().unique(),
    anonKey: (0, pg_core_1.text)('anon_key').notNull(),
    serviceRoleKey: (0, pg_core_1.text)('service_role_key').notNull(),
    googleClientId: (0, pg_core_1.text)('google_client_id'),
    googleClientSecret: (0, pg_core_1.text)('google_client_secret'),
    githubClientId: (0, pg_core_1.text)('github_client_id'),
    githubClientSecret: (0, pg_core_1.text)('github_client_secret'),
    authJwtSecret: (0, pg_core_1.text)('auth_jwt_secret').notNull(),
    siteUrl: (0, pg_core_1.text)('site_url'),
    createdAt: (0, pg_core_1.timestamp)('created_at').notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').notNull().defaultNow(),
});
//# sourceMappingURL=projects.js.map