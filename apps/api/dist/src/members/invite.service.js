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
exports.InviteService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const resend_1 = require("resend");
const drizzle_orm_1 = require("drizzle-orm");
const drizzle_service_1 = require("../db/drizzle.service");
const schema_1 = require("../db/schema");
const constants_1 = require("@apiDatabase/constants");
let InviteService = class InviteService {
    drizzle;
    jwtService;
    configService;
    resend;
    constructor(drizzle, jwtService, configService) {
        this.drizzle = drizzle;
        this.jwtService = jwtService;
        this.configService = configService;
        this.resend = new resend_1.Resend(this.configService.get('RESEND_API_KEY'));
    }
    async sendInvite(orgSlug, email) {
        const [org] = await this.drizzle.db
            .select()
            .from(schema_1.organizations)
            .where((0, drizzle_orm_1.eq)(schema_1.organizations.slug, orgSlug))
            .limit(1);
        if (!org)
            throw new common_1.BadRequestException('Organization not found');
        const existingUser = await this.drizzle.db
            .select({ id: schema_1.users.id })
            .from(schema_1.users)
            .where((0, drizzle_orm_1.eq)(schema_1.users.email, email))
            .limit(1);
        if (existingUser.length > 0) {
            const existingMember = await this.drizzle.db
                .select()
                .from(schema_1.orgMembers)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.orgMembers.orgId, org.id), (0, drizzle_orm_1.eq)(schema_1.orgMembers.userId, existingUser[0].id), (0, drizzle_orm_1.isNull)(schema_1.orgMembers.removedAt)))
                .limit(1);
            if (existingMember.length > 0) {
                throw new common_1.BadRequestException('User is already a member of this organization');
            }
        }
        const token = this.jwtService.sign({ email, orgId: org.id, orgName: org.name }, {
            secret: this.configService.get('INVITE_SECRET'),
            expiresIn: constants_1.INVITE_EXPIRES_IN,
        });
        const inviteUrl = `${this.configService.get('API_URL')}/auth/invite/accept?token=${token}`;
        await this.resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: `You've been invited to join ${org.name} on Api_Database`,
            html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <h2>You're invited to join ${org.name}</h2>
          <p>Someone has invited you to collaborate on Api_Database.</p>
          <a
            href="${inviteUrl}"
            style="display: inline-block; background: #000; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 16px 0;">
            Accept invite
          </a>
          <p style="color: #999; font-size: 13px;">This link expires in 24 hours.</p>
        </div>
      `,
        });
        return { message: 'Invite sent' };
    }
    async acceptInvite(token) {
        let payload;
        try {
            payload = this.jwtService.verify(token, {
                secret: this.configService.get('INVITE_SECRET'),
            });
        }
        catch {
            throw new common_1.BadRequestException('Invalid or expired invite link');
        }
        let [user] = await this.drizzle.db
            .select()
            .from(schema_1.users)
            .where((0, drizzle_orm_1.eq)(schema_1.users.email, payload.email))
            .limit(1);
        if (!user) {
            const [newUser] = await this.drizzle.db
                .insert(schema_1.users)
                .values({ email: payload.email })
                .returning();
            user = newUser;
        }
        const existing = await this.drizzle.db
            .select()
            .from(schema_1.orgMembers)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.orgMembers.orgId, payload.orgId), (0, drizzle_orm_1.eq)(schema_1.orgMembers.userId, user.id), (0, drizzle_orm_1.isNull)(schema_1.orgMembers.removedAt)))
            .limit(1);
        if (existing.length > 0) {
            return { message: 'Already a member' };
        }
        await this.drizzle.db.insert(schema_1.orgMembers).values({
            orgId: payload.orgId,
            userId: user.id,
            role: 'developer',
        });
        return { message: 'Invite accepted', email: user.email };
    }
};
exports.InviteService = InviteService;
exports.InviteService = InviteService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [drizzle_service_1.DrizzleService,
        jwt_1.JwtService,
        config_1.ConfigService])
], InviteService);
//# sourceMappingURL=invite.service.js.map