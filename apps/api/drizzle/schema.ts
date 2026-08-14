import {
  pgTable,
  unique,
  uuid,
  text,
  timestamp,
  foreignKey,
  integer,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const bucketAccess = pgEnum('bucket_access', ['public', 'private']);
export const orgRole = pgEnum('org_role', ['admin', 'developer']);

export const organizations = pgTable(
  'organizations',
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    name: text().notNull(),
    slug: text().notNull(),
    createdAt: timestamp('created_at', { mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { mode: 'string' })
      .defaultNow()
      .notNull(),
  },
  (table) => [unique('organizations_slug_unique').on(table.slug)],
);

export const users = pgTable(
  'users',
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    email: text().notNull(),
    name: text(),
    avatarUrl: text('avatar_url'),
    passwordHash: text('password_hash'),
    createdAt: timestamp('created_at', { mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { mode: 'string' })
      .defaultNow()
      .notNull(),
  },
  (table) => [unique('users_email_unique').on(table.email)],
);

export const projects = pgTable(
  'projects',
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    orgId: uuid('org_id').notNull(),
    name: text().notNull(),
    slug: text().notNull(),
    dbSchema: text('db_schema').notNull(),
    projectUrl: text('project_url').notNull(),
    anonKey: text('anon_key').notNull(),
    serviceRoleKey: text('service_role_key').notNull(),
    createdAt: timestamp('created_at', { mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { mode: 'string' })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.orgId],
      foreignColumns: [organizations.id],
      name: 'projects_org_id_organizations_id_fk',
    }).onDelete('cascade'),
    unique('projects_slug_unique').on(table.slug),
    unique('projects_db_schema_unique').on(table.dbSchema),
    unique('projects_project_url_unique').on(table.projectUrl),
  ],
);

export const orgMembers = pgTable(
  'org_members',
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    orgId: uuid('org_id').notNull(),
    userId: uuid('user_id').notNull(),
    role: orgRole().default('developer').notNull(),
    createdAt: timestamp('created_at', { mode: 'string' })
      .defaultNow()
      .notNull(),
    removedAt: timestamp('removed_at', { mode: 'string' }),
  },
  (table) => [
    foreignKey({
      columns: [table.orgId],
      foreignColumns: [organizations.id],
      name: 'org_members_org_id_organizations_id_fk',
    }).onDelete('cascade'),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: 'org_members_user_id_users_id_fk',
    }).onDelete('cascade'),
  ],
);

export const queryHistory = pgTable(
  'query_history',
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    projectId: uuid('project_id').notNull(),
    sql: text().notNull(),
    executionTimeMs: integer('execution_time_ms').notNull(),
    rowCount: integer('row_count').notNull(),
    createdAt: timestamp('created_at', { mode: 'string' })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.projectId],
      foreignColumns: [projects.id],
      name: 'query_history_project_id_projects_id_fk',
    }).onDelete('cascade'),
  ],
);

export const storageBuckets = pgTable(
  'storage_buckets',
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    projectId: uuid('project_id').notNull(),
    name: text().notNull(),
    access: bucketAccess().default('public').notNull(),
    createdAt: timestamp('created_at', { mode: 'string' })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.projectId],
      foreignColumns: [projects.id],
      name: 'storage_buckets_project_id_projects_id_fk',
    }).onDelete('cascade'),
  ],
);

export const storageObjects = pgTable(
  'storage_objects',
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    bucketId: uuid('bucket_id').notNull(),
    name: text().notNull(),
    size: integer().notNull(),
    mimeType: text('mime_type').notNull(),
    utKey: text('ut_key').notNull(),
    url: text().default('').notNull(),
    createdAt: timestamp('created_at', { mode: 'string' })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.bucketId],
      foreignColumns: [storageBuckets.id],
      name: 'storage_objects_bucket_id_storage_buckets_id_fk',
    }).onDelete('cascade'),
  ],
);
