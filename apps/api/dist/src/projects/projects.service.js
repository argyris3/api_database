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
exports.ProjectsService = void 0;
const common_1 = require("@nestjs/common");
const drizzle_orm_1 = require("drizzle-orm");
const crypto_1 = require("crypto");
const slugify_1 = __importDefault(require("slugify"));
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const drizzle_service_1 = require("../db/drizzle.service");
const schema_1 = require("../db/schema");
const constants_1 = require("@apiDatabase/constants");
let ProjectsService = class ProjectsService {
    drizzle;
    jwtService;
    configService;
    constructor(drizzle, jwtService, configService) {
        this.drizzle = drizzle;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    generateProjectSlug(name) {
        const base = (0, slugify_1.default)(name, { lower: true, strict: true });
        const suffix = (0, crypto_1.randomBytes)(3).toString('hex');
        return `${base}-${suffix}`;
    }
    generateDbSchema() {
        return `proj_${(0, crypto_1.randomBytes)(4).toString('hex')}`;
    }
    signProjectKey(projectId, role) {
        return this.jwtService.sign({ projectId, role }, {
            secret: this.configService.get('PROJECT_JWT_SECRET'),
            expiresIn: '100y',
        });
    }
    async provisionSchema(dbSchema) {
        await this.drizzle.db.execute(`CREATE SCHEMA IF NOT EXISTS "${dbSchema}"`);
    }
    async getProjectsForOrg(orgSlug, userId) {
        return this.drizzle.db
            .select({
            id: schema_1.projects.id,
            name: schema_1.projects.name,
            slug: schema_1.projects.slug,
            projectUrl: schema_1.projects.projectUrl,
            createdAt: schema_1.projects.createdAt,
            updatedAt: schema_1.projects.updatedAt,
        })
            .from(schema_1.projects)
            .innerJoin(schema_1.organizations, (0, drizzle_orm_1.eq)(schema_1.projects.orgId, schema_1.organizations.id))
            .innerJoin(schema_1.orgMembers, (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.orgMembers.orgId, schema_1.organizations.id), (0, drizzle_orm_1.eq)(schema_1.orgMembers.userId, userId), (0, drizzle_orm_1.isNull)(schema_1.orgMembers.removedAt)))
            .where((0, drizzle_orm_1.eq)(schema_1.organizations.slug, orgSlug));
    }
    async getProjectBySlug(orgSlug, projectSlug, userId) {
        const [row] = await this.drizzle.db
            .select()
            .from(schema_1.projects)
            .innerJoin(schema_1.organizations, (0, drizzle_orm_1.eq)(schema_1.projects.orgId, schema_1.organizations.id))
            .innerJoin(schema_1.orgMembers, (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.orgMembers.orgId, schema_1.organizations.id), (0, drizzle_orm_1.eq)(schema_1.orgMembers.userId, userId), (0, drizzle_orm_1.isNull)(schema_1.orgMembers.removedAt)))
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.organizations.slug, orgSlug), (0, drizzle_orm_1.eq)(schema_1.projects.slug, projectSlug)))
            .limit(1);
        if (!row)
            throw new common_1.NotFoundException('Project not found');
        return row;
    }
    async createProject(orgSlug, dto) {
        const [org] = await this.drizzle.db
            .select()
            .from(schema_1.organizations)
            .where((0, drizzle_orm_1.eq)(schema_1.organizations.slug, orgSlug))
            .limit(1);
        if (!org)
            throw new common_1.NotFoundException('Organization not found');
        const projectSlug = this.generateProjectSlug(dto.name);
        const dbSchema = this.generateDbSchema();
        const projectUrl = `${this.configService.get('API_URL')}/projects/${projectSlug}`;
        await this.provisionSchema(dbSchema);
        const authJwtSecret = (0, crypto_1.randomBytes)(32).toString('hex');
        const [project] = await this.drizzle.db
            .insert(schema_1.projects)
            .values({
            orgId: org.id,
            name: dto.name,
            slug: projectSlug,
            dbSchema,
            projectUrl,
            anonKey: '',
            serviceRoleKey: '',
            authJwtSecret,
        })
            .returning();
        const anonKey = this.signProjectKey(project.id, constants_1.PROJECT_KEY_ROLES.ANON);
        const serviceRoleKey = this.signProjectKey(project.id, constants_1.PROJECT_KEY_ROLES.SERVICE_ROLE);
        const [updated] = await this.drizzle.db
            .update(schema_1.projects)
            .set({ anonKey, serviceRoleKey })
            .where((0, drizzle_orm_1.eq)(schema_1.projects.id, project.id))
            .returning();
        return updated;
    }
};
exports.ProjectsService = ProjectsService;
exports.ProjectsService = ProjectsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [drizzle_service_1.DrizzleService,
        jwt_1.JwtService,
        config_1.ConfigService])
], ProjectsService);
//# sourceMappingURL=projects.service.js.map