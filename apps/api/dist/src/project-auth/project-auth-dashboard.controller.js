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
exports.ProjectAuthDashboardController = void 0;
const common_1 = require("@nestjs/common");
const project_auth_service_1 = require("./project-auth.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth-guard");
const org_role_guards_1 = require("../auth/guards/org-role.guards");
let ProjectAuthDashboardController = class ProjectAuthDashboardController {
    projectAuthService;
    constructor(projectAuthService) {
        this.projectAuthService = projectAuthService;
    }
    getUsers(projectSlug) {
        return this.projectAuthService.getUsers(projectSlug);
    }
    getSettings(projectSlug) {
        return this.projectAuthService.getOAuthSettings(projectSlug);
    }
    updateSettings(projectSlug, settings) {
        return this.projectAuthService.updateOAuthSettings(projectSlug, settings);
    }
};
exports.ProjectAuthDashboardController = ProjectAuthDashboardController;
__decorate([
    (0, common_1.Get)('users'),
    __param(0, (0, common_1.Param)('projectSlug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProjectAuthDashboardController.prototype, "getUsers", null);
__decorate([
    (0, common_1.Get)('settings'),
    __param(0, (0, common_1.Param)('projectSlug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProjectAuthDashboardController.prototype, "getSettings", null);
__decorate([
    (0, common_1.Post)('settings'),
    __param(0, (0, common_1.Param)('projectSlug')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ProjectAuthDashboardController.prototype, "updateSettings", null);
exports.ProjectAuthDashboardController = ProjectAuthDashboardController = __decorate([
    (0, common_1.Controller)('orgs/:slug/projects/:projectSlug/auth'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, org_role_guards_1.OrgRoleGuard),
    __metadata("design:paramtypes", [project_auth_service_1.ProjectAuthService])
], ProjectAuthDashboardController);
//# sourceMappingURL=project-auth-dashboard.controller.js.map