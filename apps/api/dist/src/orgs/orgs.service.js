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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrgsService = void 0;
const common_1 = require("@nestjs/common");
const drizzle_orm_1 = require("drizzle-orm");
const crypto_1 = require("crypto");
const slugify_1 = __importDefault(require("slugify"));
const drizzle_service_1 = require("../db/drizzle.service");
const schema_1 = require("../db/schema");
let OrgsService = class OrgsService {
    drizzle;
    constructor(drizzle) {
        this.drizzle = drizzle;
    }
    generateOrgSlug(name) {
        const base = (0, slugify_1.default)(`${name}-org`, { lower: true, strict: true });
        const suffix = (0, crypto_1.randomBytes)(3).toString('hex');
        return `${base}-${suffix}`;
    }
    async getMyOrgs(userId) {
        return this.drizzle.db
            .select({
            id: schema_1.organizations.id,
            name: schema_1.organizations.name,
            slug: schema_1.organizations.slug,
            createdAt: schema_1.organizations.createdAt,
            updatedAt: schema_1.organizations.updatedAt,
            role: schema_1.orgMembers.role,
            projectCount: (0, drizzle_orm_1.sql) `cast(count(distinct ${schema_1.projects.id}) as int)`,
            memberCount: (0, drizzle_orm_1.sql) `(
          select cast(count(*) as int)
          from org_members om
          where om.org_id = ${schema_1.organizations.id}
            and om.removed_at is null
        )`,
        })
            .from(schema_1.orgMembers)
            .innerJoin(schema_1.organizations, (0, drizzle_orm_1.eq)(schema_1.orgMembers.orgId, schema_1.organizations.id))
            .leftJoin(schema_1.projects, (0, drizzle_orm_1.eq)(schema_1.projects.orgId, schema_1.organizations.id))
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.orgMembers.userId, userId), (0, drizzle_orm_1.isNull)(schema_1.orgMembers.removedAt)))
            .groupBy(schema_1.organizations.id, schema_1.orgMembers.role);
    }
    async getOrgBySlug(slug, userId) {
        const [row] = await this.drizzle.db
            .select({
            id: schema_1.organizations.id,
            name: schema_1.organizations.name,
            slug: schema_1.organizations.slug,
            createdAt: schema_1.organizations.createdAt,
            updatedAt: schema_1.organizations.updatedAt,
            role: schema_1.orgMembers.role,
        })
            .from(schema_1.organizations)
            .innerJoin(schema_1.orgMembers, (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.orgMembers.orgId, schema_1.organizations.id), (0, drizzle_orm_1.eq)(schema_1.orgMembers.userId, userId), (0, drizzle_orm_1.isNull)(schema_1.orgMembers.removedAt)))
            .where((0, drizzle_orm_1.eq)(schema_1.organizations.slug, slug))
            .limit(1);
        if (!row)
            throw new common_1.NotFoundException('Organization not found');
        return row;
    }
    async createOrg(dto, userId) {
        const [org] = await this.drizzle.db
            .insert(schema_1.organizations)
            .values({
            name: dto.name,
            slug: this.generateOrgSlug(dto.name),
        })
            .returning();
        await this.drizzle.db.insert(schema_1.orgMembers).values({
            orgId: org.id,
            userId,
            role: 'admin',
        });
        return org;
    }
};
exports.OrgsService = OrgsService;
exports.OrgsService = OrgsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [drizzle_service_1.DrizzleService])
], OrgsService);
//# sourceMappingURL=orgs.service.js.map