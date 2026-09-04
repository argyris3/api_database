"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storageObjects = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const storage_buckets_1 = require("./storage-buckets");
exports.storageObjects = (0, pg_core_1.pgTable)('storage_objects', {
    id: (0, pg_core_1.uuid)().defaultRandom().primaryKey(),
    bucketId: (0, pg_core_1.uuid)('bucket_id')
        .notNull()
        .references(() => storage_buckets_1.storageBuckets.id, { onDelete: 'cascade' }),
    name: (0, pg_core_1.text)('name').notNull(),
    size: (0, pg_core_1.integer)('size').notNull(),
    mimeType: (0, pg_core_1.text)('mime_type').notNull(),
    utKey: (0, pg_core_1.text)('ut_key').notNull(),
    url: (0, pg_core_1.text)('url').notNull().default(''),
    createdAt: (0, pg_core_1.timestamp)('created_at').notNull().defaultNow(),
});
//# sourceMappingURL=storage-objects.js.map