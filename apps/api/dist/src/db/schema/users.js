"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.users = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.users = (0, pg_core_1.pgTable)('users', {
    id: (0, pg_core_1.uuid)().defaultRandom().primaryKey(),
    email: (0, pg_core_1.text)('email').notNull().unique(),
    name: (0, pg_core_1.text)('name'),
    avatarUrl: (0, pg_core_1.text)('avatar_url'),
    passwordHash: (0, pg_core_1.text)('password_hash'),
    createdAt: (0, pg_core_1.timestamp)('created_at').notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').notNull().defaultNow(),
});
//# sourceMappingURL=users.js.map