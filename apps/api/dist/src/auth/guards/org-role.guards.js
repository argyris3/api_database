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
exports.OrgRoleGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const drizzle_orm_1 = require("drizzle-orm");
const drizzle_service_1 = require("../../db/drizzle.service");
const schema_1 = require("../../db/schema");
const require_org_role_decorator_1 = require("../decorators/require-org-role-decorator");
let OrgRoleGuard = class OrgRoleGuard {
    drizzle;
    reflector;
    constructor(drizzle, reflector) {
        this.drizzle = drizzle;
        this.reflector = reflector;
    }
    async canActivate(context) {
        const requiredRole = this.reflector.get(require_org_role_decorator_1.ORG_ROLE_KEY, context.getHandler());
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const orgSlug = request.params['slug'];
        const [member] = await this.drizzle.db
            .select({ role: schema_1.orgMembers.role })
            .from(schema_1.orgMembers)
            .innerJoin(schema_1.organizations, (0, drizzle_orm_1.eq)(schema_1.orgMembers.orgId, schema_1.organizations.id))
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.organizations.slug, orgSlug), (0, drizzle_orm_1.eq)(schema_1.orgMembers.userId, user.sub), (0, drizzle_orm_1.isNull)(schema_1.orgMembers.removedAt)))
            .limit(1);
        if (!member)
            throw new common_1.NotFoundException('Organization not found');
        if (requiredRole && member.role !== requiredRole) {
            throw new common_1.ForbiddenException('Insufficient permissions');
        }
        request.memberRole = member.role;
        return true;
    }
};
exports.OrgRoleGuard = OrgRoleGuard;
exports.OrgRoleGuard = OrgRoleGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [drizzle_service_1.DrizzleService,
        core_1.Reflector])
], OrgRoleGuard);
//# sourceMappingURL=org-role.guards.js.map