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
exports.StorageController = void 0;
const common_1 = require("@nestjs/common");
const express_1 = require("uploadthing/express");
const class_validator_1 = require("class-validator");
const storage_service_1 = require("./storage.service");
const uploadthing_1 = require("./uploadthing");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth-guard");
const org_role_guards_1 = require("../auth/guards/org-role.guards");
class CreateBucketDto {
    name;
    access;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBucketDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['public', 'private']),
    __metadata("design:type", String)
], CreateBucketDto.prototype, "access", void 0);
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
let StorageController = class StorageController {
    storageService;
    constructor(storageService) {
        this.storageService = storageService;
    }
    getBuckets(slug, projectSlug) {
        return this.storageService.getBuckets(slug, projectSlug);
    }
    createBucket(slug, projectSlug, dto) {
        return this.storageService.createBucket(slug, projectSlug, dto.name, dto.access);
    }
    deleteBucket(bucketId) {
        return this.storageService.deleteBucket(bucketId);
    }
    getObjects(bucketId) {
        return this.storageService.getObjects(bucketId);
    }
    handleUpload(req, res, next) {
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
    saveObject(bucketId, file) {
        return this.storageService.saveObject(bucketId, file);
    }
    deleteObject(objectId) {
        return this.storageService.deleteObject(objectId);
    }
    getSignedUrl(objectId) {
        return this.storageService.getSignedUrl(objectId);
    }
};
exports.StorageController = StorageController;
__decorate([
    (0, common_1.Get)('buckets'),
    __param(0, (0, common_1.Param)('slug')),
    __param(1, (0, common_1.Param)('projectSlug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], StorageController.prototype, "getBuckets", null);
__decorate([
    (0, common_1.Post)('buckets'),
    __param(0, (0, common_1.Param)('slug')),
    __param(1, (0, common_1.Param)('projectSlug')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, CreateBucketDto]),
    __metadata("design:returntype", void 0)
], StorageController.prototype, "createBucket", null);
__decorate([
    (0, common_1.Delete)('buckets/:bucketId'),
    __param(0, (0, common_1.Param)('bucketId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StorageController.prototype, "deleteBucket", null);
__decorate([
    (0, common_1.Get)('buckets/:bucketId/objects'),
    __param(0, (0, common_1.Param)('bucketId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StorageController.prototype, "getObjects", null);
__decorate([
    (0, common_1.All)('buckets/:bucketId/upload'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Next)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", void 0)
], StorageController.prototype, "handleUpload", null);
__decorate([
    (0, common_1.Post)('buckets/:bucketId/objects'),
    __param(0, (0, common_1.Param)('bucketId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, SaveObjectDto]),
    __metadata("design:returntype", void 0)
], StorageController.prototype, "saveObject", null);
__decorate([
    (0, common_1.Delete)('objects/:objectId'),
    __param(0, (0, common_1.Param)('objectId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StorageController.prototype, "deleteObject", null);
__decorate([
    (0, common_1.Get)('objects/:objectId/signed-url'),
    __param(0, (0, common_1.Param)('objectId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StorageController.prototype, "getSignedUrl", null);
exports.StorageController = StorageController = __decorate([
    (0, common_1.Controller)('orgs/:slug/projects/:projectSlug/storage'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, org_role_guards_1.OrgRoleGuard),
    __metadata("design:paramtypes", [storage_service_1.StorageService])
], StorageController);
//# sourceMappingURL=storage.controller.js.map