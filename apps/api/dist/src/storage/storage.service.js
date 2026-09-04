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
exports.StorageService = void 0;
const common_1 = require("@nestjs/common");
const drizzle_orm_1 = require("drizzle-orm");
const server_1 = require("uploadthing/server");
const drizzle_service_1 = require("../db/drizzle.service");
const schema_1 = require("../db/schema");
let StorageService = class StorageService {
    drizzle;
    utapi = new server_1.UTApi();
    constructor(drizzle) {
        this.drizzle = drizzle;
    }
    async getProject(orgSlug, projectSlug) {
        const [row] = await this.drizzle.db
            .select({ id: schema_1.projects.id })
            .from(schema_1.projects)
            .innerJoin(schema_1.organizations, (0, drizzle_orm_1.eq)(schema_1.projects.orgId, schema_1.organizations.id))
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.organizations.slug, orgSlug), (0, drizzle_orm_1.eq)(schema_1.projects.slug, projectSlug)))
            .limit(1);
        if (!row)
            throw new common_1.NotFoundException('Project not found');
        return row;
    }
    async getBuckets(orgSlug, projectSlug) {
        const project = await this.getProject(orgSlug, projectSlug);
        return this.drizzle.db
            .select()
            .from(schema_1.storageBuckets)
            .where((0, drizzle_orm_1.eq)(schema_1.storageBuckets.projectId, project.id));
    }
    async createBucket(orgSlug, projectSlug, name, access) {
        const project = await this.getProject(orgSlug, projectSlug);
        const trimmed = name.trim();
        if (!trimmed) {
            throw new common_1.BadRequestException('Bucket name is required');
        }
        const [bucket] = await this.drizzle.db
            .insert(schema_1.storageBuckets)
            .values({ projectId: project.id, name: trimmed, access })
            .returning();
        return bucket;
    }
    async deleteBucket(bucketId) {
        const objects = await this.drizzle.db
            .select({ utKey: schema_1.storageObjects.utKey })
            .from(schema_1.storageObjects)
            .where((0, drizzle_orm_1.eq)(schema_1.storageObjects.bucketId, bucketId));
        if (objects.length > 0) {
            await this.utapi.deleteFiles(objects.map((o) => o.utKey));
        }
        await this.drizzle.db
            .delete(schema_1.storageBuckets)
            .where((0, drizzle_orm_1.eq)(schema_1.storageBuckets.id, bucketId));
        return { message: 'Bucket deleted' };
    }
    async getObjects(bucketId) {
        return this.drizzle.db
            .select()
            .from(schema_1.storageObjects)
            .where((0, drizzle_orm_1.eq)(schema_1.storageObjects.bucketId, bucketId));
    }
    async saveObject(bucketId, file) {
        const [bucket] = await this.drizzle.db
            .select()
            .from(schema_1.storageBuckets)
            .where((0, drizzle_orm_1.eq)(schema_1.storageBuckets.id, bucketId))
            .limit(1);
        if (!bucket)
            throw new common_1.NotFoundException('Bucket not found');
        const url = bucket.access === 'public' ? file.url : '';
        const [object] = await this.drizzle.db
            .insert(schema_1.storageObjects)
            .values({
            bucketId,
            name: file.name,
            size: file.size,
            mimeType: file.type,
            utKey: file.utKey,
            url,
        })
            .returning();
        return object;
    }
    async deleteObject(objectId) {
        const [object] = await this.drizzle.db
            .select()
            .from(schema_1.storageObjects)
            .where((0, drizzle_orm_1.eq)(schema_1.storageObjects.id, objectId))
            .limit(1);
        if (!object)
            throw new common_1.NotFoundException('File not found');
        await this.utapi.deleteFiles(object.utKey);
        await this.drizzle.db
            .delete(schema_1.storageObjects)
            .where((0, drizzle_orm_1.eq)(schema_1.storageObjects.id, objectId));
        return { message: 'File deleted' };
    }
    async getSignedUrl(objectId) {
        const [object] = await this.drizzle.db
            .select()
            .from(schema_1.storageObjects)
            .where((0, drizzle_orm_1.eq)(schema_1.storageObjects.id, objectId))
            .limit(1);
        if (!object)
            throw new common_1.NotFoundException('File not found');
        const { ufsUrl } = await this.utapi.generateSignedURL(object.utKey, {
            expiresIn: 3600,
        });
        return { url: ufsUrl };
    }
    async assertProjectSlug(projectId, projectSlug) {
        const [project] = await this.drizzle.db
            .select({ slug: schema_1.projects.slug })
            .from(schema_1.projects)
            .where((0, drizzle_orm_1.eq)(schema_1.projects.id, projectId))
            .limit(1);
        if (!project)
            throw new common_1.NotFoundException('Project not found');
        if (project.slug !== projectSlug) {
            throw new common_1.ForbiddenException('API key does not match this project URL');
        }
    }
    async getBucketByName(projectId, bucketName) {
        const [bucket] = await this.drizzle.db
            .select()
            .from(schema_1.storageBuckets)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.storageBuckets.projectId, projectId), (0, drizzle_orm_1.eq)(schema_1.storageBuckets.name, bucketName)))
            .limit(1);
        if (!bucket)
            throw new common_1.NotFoundException('Bucket not found');
        return bucket;
    }
};
exports.StorageService = StorageService;
exports.StorageService = StorageService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [drizzle_service_1.DrizzleService])
], StorageService);
//# sourceMappingURL=storage.service.js.map