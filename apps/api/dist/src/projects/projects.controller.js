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
exports.ProjectsController = void 0;
const common_1 = require("@nestjs/common");
const projects_service_1 = require("./projects.service");
const create_project_dto_1 = require("./dto/create-project.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth-guard");
const org_role_guards_1 = require("../auth/guards/org-role.guards");
const require_org_role_decorator_1 = require("../auth/decorators/require-org-role-decorator");
const current_user_decorator_1 = require("../auth/decorators/current-user-decorator");
let ProjectsController = class ProjectsController {
    projectsService;
    constructor(projectsService) {
        this.projectsService = projectsService;
    }
    getProjects(slug, user) {
        return this.projectsService.getProjectsForOrg(slug, user.sub);
    }
    getProject(slug, projectSlug, user) {
        return this.projectsService.getProjectBySlug(slug, projectSlug, user.sub);
    }
    createProject(slug, dto) {
        return this.projectsService.createProject(slug, dto);
    }
};
exports.ProjectsController = ProjectsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Param)('slug')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "getProjects", null);
__decorate([
    (0, common_1.Get)(':projectSlug'),
    __param(0, (0, common_1.Param)('slug')),
    __param(1, (0, common_1.Param)('projectSlug')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "getProject", null);
__decorate([
    (0, common_1.Post)(),
    (0, require_org_role_decorator_1.RequireOrgRole)('admin'),
    __param(0, (0, common_1.Param)('slug')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_project_dto_1.CreateProjectDto]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "createProject", null);
exports.ProjectsController = ProjectsController = __decorate([
    (0, common_1.Controller)('orgs/:slug/projects'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, org_role_guards_1.OrgRoleGuard),
    __metadata("design:paramtypes", [projects_service_1.ProjectsService])
], ProjectsController);
//# sourceMappingURL=projects.controller.js.map