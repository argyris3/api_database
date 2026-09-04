"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storageBuckets = exports.bucketAccessEnum = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const projects_1 = require("./projects");
exports.bucketAccessEnum = (0, pg_core_1.pgEnum)('bucket_access', ['public', 'private']);
exports.storageBuckets = (0, pg_core_1.pgTable)('storage_buckets', {
    id: (0, pg_core_1.uuid)().defaultRandom().primaryKey(),
    projectId: (0, pg_core_1.uuid)('project_id')
        .notNull()
        .references(() => projects_1.projects.id, { onDelete: 'cascade' }),
    name: (0, pg_core_1.text)('name').notNull(),
    access: (0, exports.bucketAccessEnum)('access').notNull().default('public'),
    createdAt: (0, pg_core_1.timestamp)('created_at').notNull().defaultNow(),
});
//# sourceMappingURL=storage-buckets.js.map