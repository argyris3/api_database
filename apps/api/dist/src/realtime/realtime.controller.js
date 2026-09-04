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
exports.RealtimeController = void 0;
const common_1 = require("@nestjs/common");
const drizzle_orm_1 = require("drizzle-orm");
const trigger_service_1 = require("./trigger.service");
const drizzle_service_1 = require("../db/drizzle.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth-guard");
const org_role_guards_1 = require("../auth/guards/org-role.guards");
const schema_1 = require("../db/schema");
let RealtimeController = class RealtimeController {
    triggerService;
    drizzle;
    constructor(triggerService, drizzle) {
        this.triggerService = triggerService;
        this.drizzle = drizzle;
    }
    async getProject(orgSlug, projectSlug) {
        const [row] = await this.drizzle.db
            .select({ id: schema_1.projects.id, dbSchema: schema_1.projects.dbSchema })
            .from(schema_1.projects)
            .innerJoin(schema_1.organizations, (0, drizzle_orm_1.eq)(schema_1.projects.orgId, schema_1.organizations.id))
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.organizations.slug, orgSlug), (0, drizzle_orm_1.eq)(schema_1.projects.slug, projectSlug)))
            .limit(1);
        if (!row)
            throw new common_1.NotFoundException('Project not found');
        return row;
    }
    async enableRealtime(slug, projectSlug, tableName) {
        const project = await this.getProject(slug, projectSlug);
        await this.triggerService.enableRealtime(project.dbSchema, project.id, tableName);
        return { message: `Realtime enabled for ${tableName}` };
    }
    async disableRealtime(slug, projectSlug, tableName) {
        const project = await this.getProject(slug, projectSlug);
        await this.triggerService.disableRealtime(project.dbSchema, tableName);
        return { message: `Realtime disabled for ${tableName}` };
    }
};
exports.RealtimeController = RealtimeController;
__decorate([
    (0, common_1.Post)(':tableName/enable'),
    __param(0, (0, common_1.Param)('slug')),
    __param(1, (0, common_1.Param)('projectSlug')),
    __param(2, (0, common_1.Param)('tableName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], RealtimeController.prototype, "enableRealtime", null);
__decorate([
    (0, common_1.Delete)(':tableName/disable'),
    __param(0, (0, common_1.Param)('slug')),
    __param(1, (0, common_1.Param)('projectSlug')),
    __param(2, (0, common_1.Param)('tableName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], RealtimeController.prototype, "disableRealtime", null);
exports.RealtimeController = RealtimeController = __decorate([
    (0, common_1.Controller)('orgs/:slug/projects/:projectSlug/realtime'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, org_role_guards_1.OrgRoleGuard),
    __metadata("design:paramtypes", [trigger_service_1.TriggerService,
        drizzle_service_1.DrizzleService])
], RealtimeController);
//# sourceMappingURL=realtime.controller.js.map