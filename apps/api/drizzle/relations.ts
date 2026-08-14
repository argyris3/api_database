import { relations } from "drizzle-orm/relations";
import { organizations, projects, orgMembers, users, queryHistory, storageBuckets, storageObjects } from "./schema";

export const projectsRelations = relations(projects, ({one, many}) => ({
	organization: one(organizations, {
		fields: [projects.orgId],
		references: [organizations.id]
	}),
	queryHistories: many(queryHistory),
	storageBuckets: many(storageBuckets),
}));

export const organizationsRelations = relations(organizations, ({many}) => ({
	projects: many(projects),
	orgMembers: many(orgMembers),
}));

export const orgMembersRelations = relations(orgMembers, ({one}) => ({
	organization: one(organizations, {
		fields: [orgMembers.orgId],
		references: [organizations.id]
	}),
	user: one(users, {
		fields: [orgMembers.userId],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	orgMembers: many(orgMembers),
}));

export const queryHistoryRelations = relations(queryHistory, ({one}) => ({
	project: one(projects, {
		fields: [queryHistory.projectId],
		references: [projects.id]
	}),
}));

export const storageBucketsRelations = relations(storageBuckets, ({one, many}) => ({
	project: one(projects, {
		fields: [storageBuckets.projectId],
		references: [projects.id]
	}),
	storageObjects: many(storageObjects),
}));

export const storageObjectsRelations = relations(storageObjects, ({one}) => ({
	storageBucket: one(storageBuckets, {
		fields: [storageObjects.bucketId],
		references: [storageBuckets.id]
	}),
}));