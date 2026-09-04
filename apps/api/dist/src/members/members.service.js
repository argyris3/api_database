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
exports.MembersService = void 0;
const common_1 = require("@nestjs/common");
const drizzle_orm_1 = require("drizzle-orm");
const drizzle_service_1 = require("../db/drizzle.service");
const schema_1 = require("../db/schema");
let MembersService = class MembersService {
    drizzle;
    constructor(drizzle) {
        this.drizzle = drizzle;
    }
    async getMembers(orgSlug) {
        return this.drizzle.db
            .select({
            id: schema_1.orgMembers.id,
            role: schema_1.orgMembers.role,
            createdAt: schema_1.orgMembers.createdAt,
            user: {
                id: schema_1.users.id,
                name: schema_1.users.name,
                email: schema_1.users.email,
                avatarUrl: schema_1.users.avatarUrl,
            },
        })
            .from(schema_1.orgMembers)
            .innerJoin(schema_1.organizations, (0, drizzle_orm_1.eq)(schema_1.orgMembers.orgId, schema_1.organizations.id))
            .innerJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.orgMembers.userId, schema_1.users.id))
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.organizations.slug, orgSlug), (0, drizzle_orm_1.isNull)(schema_1.orgMembers.removedAt)));
    }
    async updateRole(orgSlug, memberId, dto) {
        if (dto.role === 'developer') {
            await this.ensureNotLastAdmin(orgSlug, memberId);
        }
        const [updated] = await this.drizzle.db
            .update(schema_1.orgMembers)
            .set({ role: dto.role })
            .where((0, drizzle_orm_1.eq)(schema_1.orgMembers.id, memberId))
            .returning();
        if (!updated)
            throw new common_1.NotFoundException('Member not found');
        return updated;
    }
    async removeMember(orgSlug, memberId) {
        await this.ensureNotLastAdmin(orgSlug, memberId);
        const [updated] = await this.drizzle.db
            .update(schema_1.orgMembers)
            .set({ removedAt: new Date() })
            .where((0, drizzle_orm_1.eq)(schema_1.orgMembers.id, memberId))
            .returning();
        if (!updated)
            throw new common_1.NotFoundException('Member not found');
        return { message: 'Member removed' };
    }
    async ensureNotLastAdmin(orgSlug, memberId) {
        const admins = await this.drizzle.db
            .select({ id: schema_1.orgMembers.id })
            .from(schema_1.orgMembers)
            .innerJoin(schema_1.organizations, (0, drizzle_orm_1.eq)(schema_1.orgMembers.orgId, schema_1.organizations.id))
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.organizations.slug, orgSlug), (0, drizzle_orm_1.eq)(schema_1.orgMembers.role, 'admin'), (0, drizzle_orm_1.isNull)(schema_1.orgMembers.removedAt)));
        const targetIsAdmin = admins.some((a) => a.id === memberId);
        if (targetIsAdmin && admins.length === 1) {
            throw new common_1.BadRequestException('Cannot remove or demote the last admin of an organization');
        }
    }
};
exports.MembersService = MembersService;
exports.MembersService = MembersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [drizzle_service_1.DrizzleService])
], MembersService);
//# sourceMappingURL=members.service.js.map