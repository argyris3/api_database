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
exports.ProjectApiController = void 0;
const common_1 = require("@nestjs/common");
const constants_1 = require("@apiDatabase/constants");
const project_api_service_1 = require("./project-api.service");
const project_key_guard_1 = require("./project-key.guard");
let ProjectApiController = class ProjectApiController {
    projectApiService;
    constructor(projectApiService) {
        this.projectApiService = projectApiService;
    }
    getProjectKey(req) {
        return req['projectKey'];
    }
    assertWriteAccess(req) {
        const { role } = this.getProjectKey(req);
        if (role !== constants_1.PROJECT_KEY_ROLES.SERVICE_ROLE) {
            throw new common_1.ForbiddenException('Write operations require the service role key');
        }
    }
    getRows(req, projectSlug, table, query) {
        const { projectId } = this.getProjectKey(req);
        return this.projectApiService.getRows(projectId, projectSlug, table, query);
    }
    insertRow(req, projectSlug, table, body) {
        this.assertWriteAccess(req);
        const { projectId } = this.getProjectKey(req);
        return this.projectApiService.insertRow(projectId, projectSlug, table, body);
    }
    updateRow(req, projectSlug, table, id, body) {
        this.assertWriteAccess(req);
        const { projectId } = this.getProjectKey(req);
        return this.projectApiService.updateRow(projectId, projectSlug, table, id, body);
    }
    deleteRow(req, projectSlug, table, id) {
        this.assertWriteAccess(req);
        const { projectId } = this.getProjectKey(req);
        return this.projectApiService.deleteRow(projectId, projectSlug, table, id);
    }
};
exports.ProjectApiController = ProjectApiController;
__decorate([
    (0, common_1.Get)(':table'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('projectSlug')),
    __param(2, (0, common_1.Param)('table')),
    __param(3, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, Object]),
    __metadata("design:returntype", void 0)
], ProjectApiController.prototype, "getRows", null);
__decorate([
    (0, common_1.Post)(':table'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('projectSlug')),
    __param(2, (0, common_1.Param)('table')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, Object]),
    __metadata("design:returntype", void 0)
], ProjectApiController.prototype, "insertRow", null);
__decorate([
    (0, common_1.Patch)(':table/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('projectSlug')),
    __param(2, (0, common_1.Param)('table')),
    __param(3, (0, common_1.Param)('id')),
    __param(4, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, Object]),
    __metadata("design:returntype", void 0)
], ProjectApiController.prototype, "updateRow", null);
__decorate([
    (0, common_1.Delete)(':table/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('projectSlug')),
    __param(2, (0, common_1.Param)('table')),
    __param(3, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", void 0)
], ProjectApiController.prototype, "deleteRow", null);
exports.ProjectApiController = ProjectApiController = __decorate([
    (0, common_1.Controller)('projects/:projectSlug/rest'),
    (0, common_1.UseGuards)(project_key_guard_1.ProjectKeyGuard),
    __metadata("design:paramtypes", [project_api_service_1.ProjectApiService])
], ProjectApiController);
//# sourceMappingURL=project-api.controller.js.map