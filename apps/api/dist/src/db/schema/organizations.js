"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orgMembers = exports.organizations = exports.orgRoleEnum = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const users_1 = require("./users");
exports.orgRoleEnum = (0, pg_core_1.pgEnum)('org_role', ['admin', 'developer']);
exports.organizations = (0, pg_core_1.pgTable)('organizations', {
    id: (0, pg_core_1.uuid)().defaultRandom().primaryKey(),
    name: (0, pg_core_1.text)('name').notNull(),
    slug: (0, pg_core_1.text)('slug').notNull().unique(),
    createdAt: (0, pg_core_1.timestamp)('created_at').notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').notNull().defaultNow(),
});
exports.orgMembers = (0, pg_core_1.pgTable)('org_members', {
    id: (0, pg_core_1.uuid)().defaultRandom().primaryKey(),
    orgId: (0, pg_core_1.uuid)('org_id')
        .notNull()
        .references(() => exports.organizations.id, { onDelete: 'cascade' }),
    userId: (0, pg_core_1.uuid)('user_id')
        .notNull()
        .references(() => users_1.users.id, { onDelete: 'cascade' }),
    role: (0, exports.orgRoleEnum)('role').notNull().default('developer'),
    createdAt: (0, pg_core_1.timestamp)('created_at').notNull().defaultNow(),
    removedAt: (0, pg_core_1.timestamp)('removed_at'),
});
//# sourceMappingURL=organizations.js.map