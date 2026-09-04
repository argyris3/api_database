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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectStorageController = void 0;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const constants_1 = require("@apiDatabase/constants");
const express_1 = require("uploadthing/express");
const storage_service_1 = require("./storage.service");
const uploadthing_1 = require("./uploadthing");
const project_key_guard_1 = require("../project-api/project-key.guard");
const common_2 = require("@nestjs/common");
class SaveObjectDto {
    name;
    size;
    type;
    utKey;
    url;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SaveObjectDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SaveObjectDto.prototype, "size", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SaveObjectDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SaveObjectDto.prototype, "utKey", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SaveObjectDto.prototype, "url", void 0);
const utHandler = (0, express_1.createRouteHandler)({ router: uploadthing_1.storageRouter });
let ProjectStorageController = class ProjectStorageController {
    storageService;
    constructor(storageService) {
        this.storageService = storageService;
    }
    getProjectKey(req) {
        return req['projectKey'];
    }
    assertWriteAccess(req) {
        const { role } = this.getProjectKey(req);
        if (role !== constants_1.PROJECT_KEY_ROLES.SERVICE_ROLE) {
            throw new common_2.ForbiddenException('Write operations require the service role key');
        }
    }
    async getObjects(req, projectSlug, bucketName) {
        const { projectId } = this.getProjectKey(req);
        await this.storageService.assertProjectSlug(projectId, projectSlug);
        const bucket = await this.storageService.getBucketByName(projectId, bucketName);
        return this.storageService.getObjects(bucket.id);
    }
    async handleUpload(req, res, next, projectSlug, bucketName) {
        this.assertWriteAccess(req);
        const { projectId } = this.getProjectKey(req);
        await this.storageService.assertProjectSlug(projectId, projectSlug);
        await this.storageService.getBucketByName(projectId, bucketName);
        const originalUrl = req.url;
        const queryIndex = originalUrl.indexOf('?');
        const query = queryIndex >= 0 ? originalUrl.slice(queryIndex) : '';
        req.url = `/${query}`;
        utHandler(req, res, (err) => {
            req.url = originalUrl;
            if (err)
                next(err);
        });
    }
    async saveObject(req, projectSlug, bucketName, file) {
        this.assertWriteAccess(req);
        const { projectId } = this.getProjectKey(req);
        await this.storageService.assertProjectSlug(projectId, projectSlug);
        const bucket = await this.storageService.getBucketByName(projectId, bucketName);
        return this.storageService.saveObject(bucket.id, file);
    }
    async deleteObject(req, projectSlug, objectId) {
        this.assertWriteAccess(req);
        const { projectId } = this.getProjectKey(req);
        await this.storageService.assertProjectSlug(projectId, projectSlug);
        return this.storageService.deleteObject(objectId);
    }
    async getSignedUrl(req, projectSlug, objectId) {
        const { projectId } = this.getProjectKey(req);
        await this.storageService.assertProjectSlug(projectId, projectSlug);
        return this.storageService.getSignedUrl(objectId);
    }
};
exports.ProjectStorageController = ProjectStorageController;
__decorate([
    (0, common_1.Get)('buckets/:bucketName/objects'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('projectSlug')),
    __param(2, (0, common_1.Param)('bucketName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], ProjectStorageController.prototype, "getObjects", null);
__decorate([
    (0, common_1.All)('buckets/:bucketName/upload'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Next)()),
    __param(3, (0, common_1.Param)('projectSlug')),
    __param(4, (0, common_1.Param)('bucketName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function, String, String]),
    __metadata("design:returntype", Promise)
], ProjectStorageController.prototype, "handleUpload", null);
__decorate([
    (0, common_1.Post)('buckets/:bucketName/objects'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('projectSlug')),
    __param(2, (0, common_1.Param)('bucketName')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, SaveObjectDto]),
    __metadata("design:returntype", Promise)
], ProjectStorageController.prototype, "saveObject", null);
__decorate([
    (0, common_1.Delete)('objects/:objectId'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('projectSlug')),
    __param(2, (0, common_1.Param)('objectId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], ProjectStorageController.prototype, "deleteObject", null);
__decorate([
    (0, common_1.Get)('objects/:objectId/signed-url'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('projectSlug')),
    __param(2, (0, common_1.Param)('objectId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], ProjectStorageController.prototype, "getSignedUrl", null);
exports.ProjectStorageController = ProjectStorageController = __decorate([
    (0, common_1.Controller)('projects/:projectSlug/storage'),
    (0, common_1.UseGuards)(project_key_guard_1.ProjectKeyGuard),
    __metadata("design:paramtypes", [storage_service_1.StorageService])
], ProjectStorageController);
//# sourceMappingURL=project-storage.controller.js.map