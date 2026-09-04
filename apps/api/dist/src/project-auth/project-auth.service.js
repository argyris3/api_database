"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectAuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const resend_1 = require("resend");
const bcrypt = __importStar(require("bcrypt"));
const drizzle_orm_1 = require("drizzle-orm");
const drizzle_service_1 = require("../db/drizzle.service");
const schema_1 = require("../db/schema");
const constants_1 = require("@apiDatabase/constants");
let ProjectAuthService = class ProjectAuthService {
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
    async getProject(projectSlug) {
        const [project] = await this.drizzle.db
            .select()
            .from(schema_1.projects)
            .where((0, drizzle_orm_1.eq)(schema_1.projects.slug, projectSlug))
            .limit(1);
        if (!project)
            throw new common_1.NotFoundException('Project not found');
        return project;
    }
    async ensureAuthUsersTable(dbSchema) {
        await this.drizzle.db.execute(drizzle_orm_1.sql.raw(`
      CREATE TABLE IF NOT EXISTS "${dbSchema}"."auth_users" (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT,
        email_verified BOOLEAN NOT NULL DEFAULT FALSE,
        provider TEXT NOT NULL DEFAULT 'email',
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `));
    }
    signToken(userId, email, projectId, secret) {
        return this.jwtService.sign({ sub: userId, email, projectId }, { secret, expiresIn: '7d' });
    }
    async signUp(projectSlug, dto) {
        const project = await this.getProject(projectSlug);
        await this.ensureAuthUsersTable(project.dbSchema);
        const existing = await this.drizzle.db.execute((0, drizzle_orm_1.sql) `
      SELECT id FROM ${drizzle_orm_1.sql.identifier(project.dbSchema)}.auth_users
      WHERE email = ${dto.email}
    `);
        if (existing.rows.length > 0) {
            throw new common_1.ConflictException('Email already registered');
        }
        const passwordHash = await bcrypt.hash(dto.password, 12);
        const result = await this.drizzle.db.execute((0, drizzle_orm_1.sql) `
      INSERT INTO ${drizzle_orm_1.sql.identifier(project.dbSchema)}.auth_users
        (email, password_hash, provider)
      VALUES (${dto.email}, ${passwordHash}, ${constants_1.AUTH_PROVIDERS.EMAIL})
      RETURNING id, email
    `);
        const user = result.rows[0];
        const accessToken = this.signToken(user.id, user.email, project.id, project.authJwtSecret);
        return { user: { id: user.id, email: user.email }, accessToken };
    }
    async signIn(projectSlug, dto) {
        const project = await this.getProject(projectSlug);
        await this.ensureAuthUsersTable(project.dbSchema);
        const result = await this.drizzle.db.execute((0, drizzle_orm_1.sql) `
      SELECT id, email, password_hash
      FROM ${drizzle_orm_1.sql.identifier(project.dbSchema)}.auth_users
      WHERE email = ${dto.email}
    `);
        const user = result.rows[0];
        if (!user?.password_hash) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const match = await bcrypt.compare(dto.password, user.password_hash);
        if (!match)
            throw new common_1.UnauthorizedException('Invalid credentials');
        const accessToken = this.signToken(user.id, user.email, project.id, project.authJwtSecret);
        return { user: { id: user.id, email: user.email }, accessToken };
    }
    async sendMagicLink(projectSlug, email) {
        const project = await this.getProject(projectSlug);
        await this.ensureAuthUsersTable(project.dbSchema);
        const existing = await this.drizzle.db.execute((0, drizzle_orm_1.sql) `
      SELECT id FROM ${drizzle_orm_1.sql.identifier(project.dbSchema)}.auth_users
      WHERE email = ${email}
    `);
        if (existing.rows.length === 0) {
            await this.drizzle.db.execute((0, drizzle_orm_1.sql) `
        INSERT INTO ${drizzle_orm_1.sql.identifier(project.dbSchema)}.auth_users
          (email, provider, email_verified)
        VALUES (${email}, ${constants_1.AUTH_PROVIDERS.EMAIL}, true)
      `);
        }
        const linkToken = this.jwtService.sign({ email, projectId: project.id }, { secret: project.authJwtSecret, expiresIn: constants_1.MAGIC_LINK_EXPIRES_IN });
        const apiUrl = this.configService.get('API_URL');
        const magicLinkUrl = `${apiUrl}/projects/${projectSlug}/auth/magic-link/verify?token=${linkToken}`;
        await this.resend.emails.send({
            from: 'Supavolt <onboarding@resend.dev>',
            to: email,
            subject: 'Your magic link',
            html: `
        <p>Click to sign in (expires in 15 minutes):</p>
        <a href="${magicLinkUrl}">Sign in</a>
      `,
        });
        return { message: 'Magic link sent' };
    }
    async verifyMagicLink(projectSlug, token) {
        const project = await this.getProject(projectSlug);
        let payload;
        try {
            payload = this.jwtService.verify(token, {
                secret: project.authJwtSecret,
            });
        }
        catch {
            throw new common_1.BadRequestException('Invalid or expired magic link');
        }
        const result = await this.drizzle.db.execute((0, drizzle_orm_1.sql) `
        SELECT id, email FROM ${drizzle_orm_1.sql.identifier(project.dbSchema)}.auth_users
        WHERE email = ${payload.email}
      `);
        const user = result.rows[0];
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const accessToken = this.signToken(user.id, user.email, project.id, project.authJwtSecret);
        return { user: { id: user.id, email: user.email }, accessToken };
    }
    buildGoogleAuthUrl(clientId, redirectUri) {
        const params = new URLSearchParams({
            client_id: clientId,
            redirect_uri: redirectUri,
            response_type: 'code',
            scope: 'openid email profile',
        });
        return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    }
    buildGithubAuthUrl(clientId, redirectUri) {
        const params = new URLSearchParams({
            client_id: clientId,
            redirect_uri: redirectUri,
            scope: 'user:email',
        });
        return `https://github.com/login/oauth/authorize?${params.toString()}`;
    }
    async handleGoogleCallback(projectSlug, code) {
        const project = await this.getProject(projectSlug);
        await this.ensureAuthUsersTable(project.dbSchema);
        if (!project.googleClientId || !project.googleClientSecret) {
            throw new common_1.BadRequestException('Google OAuth not configured for this project');
        }
        const apiUrl = this.configService.get('API_URL');
        const redirectUri = `${apiUrl}/projects/${projectSlug}/auth/google/callback`;
        const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                code,
                client_id: project.googleClientId,
                client_secret: project.googleClientSecret,
                redirect_uri: redirectUri,
                grant_type: 'authorization_code',
            }),
        });
        const tokenData = (await tokenRes.json());
        const profileRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', { headers: { Authorization: `Bearer ${tokenData.access_token}` } });
        const profile = (await profileRes.json());
        return this.findOrCreateOAuthUser(project, profile.email, constants_1.AUTH_PROVIDERS.GOOGLE);
    }
    async handleGithubCallback(projectSlug, code) {
        const project = await this.getProject(projectSlug);
        await this.ensureAuthUsersTable(project.dbSchema);
        if (!project.githubClientId || !project.githubClientSecret) {
            throw new common_1.BadRequestException('GitHub OAuth not configured for this project');
        }
        const apiUrl = this.configService.get('API_URL');
        const redirectUri = `${apiUrl}/projects/${projectSlug}/auth/github/callback`;
        const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                client_id: project.githubClientId,
                client_secret: project.githubClientSecret,
                code,
                redirect_uri: redirectUri,
            }),
        });
        const tokenData = (await tokenRes.json());
        const profileRes = await fetch('https://api.github.com/user/emails', {
            headers: {
                Authorization: `Bearer ${tokenData.access_token}`,
                Accept: 'application/vnd.github+json',
            },
        });
        const emails = (await profileRes.json());
        const primary = emails.find((e) => e.primary) ?? emails[0];
        if (!primary?.email) {
            throw new common_1.BadRequestException('Could not read email from GitHub');
        }
        return this.findOrCreateOAuthUser(project, primary.email, constants_1.AUTH_PROVIDERS.GITHUB);
    }
    async findOrCreateOAuthUser(project, email, provider) {
        const existing = await this.drizzle.db.execute((0, drizzle_orm_1.sql) `
        SELECT id, email FROM ${drizzle_orm_1.sql.identifier(project.dbSchema)}.auth_users
        WHERE email = ${email}
      `);
        let user = existing.rows[0];
        if (!user) {
            const result = await this.drizzle.db.execute((0, drizzle_orm_1.sql) `
          INSERT INTO ${drizzle_orm_1.sql.identifier(project.dbSchema)}.auth_users
            (email, provider, email_verified)
          VALUES (${email}, ${provider}, true)
          RETURNING id, email
        `);
            user = result.rows[0];
        }
        const accessToken = this.signToken(user.id, user.email, project.id, project.authJwtSecret);
        return { user: { id: user.id, email: user.email }, accessToken };
    }
    async getUsers(projectSlug) {
        const project = await this.getProject(projectSlug);
        await this.ensureAuthUsersTable(project.dbSchema);
        const result = await this.drizzle.db.execute((0, drizzle_orm_1.sql) `
      SELECT id, email, email_verified, provider, created_at
      FROM ${drizzle_orm_1.sql.identifier(project.dbSchema)}.auth_users
      ORDER BY created_at DESC
    `);
        return result.rows.map((row) => ({
            id: row.id,
            email: row.email,
            emailVerified: row.email_verified,
            provider: row.provider,
            createdAt: row.created_at,
        }));
    }
    async getOAuthSettings(projectSlug) {
        const project = await this.getProject(projectSlug);
        return {
            siteUrl: project.siteUrl,
            googleClientId: project.googleClientId,
            googleClientSecret: project.googleClientSecret,
            githubClientId: project.githubClientId,
            githubClientSecret: project.githubClientSecret,
        };
    }
    resolveSiteUrl(project) {
        return (project.siteUrl ??
            this.configService.get('WEB_URL') ??
            'http://localhost:3001');
    }
    async getSiteUrlForProject(projectSlug) {
        const project = await this.getProject(projectSlug);
        return this.resolveSiteUrl(project);
    }
    async updateOAuthSettings(projectSlug, settings) {
        const project = await this.getProject(projectSlug);
        const [updated] = await this.drizzle.db
            .update(schema_1.projects)
            .set(settings)
            .where((0, drizzle_orm_1.eq)(schema_1.projects.id, project.id))
            .returning();
        return updated;
    }
};
exports.ProjectAuthService = ProjectAuthService;
exports.ProjectAuthService = ProjectAuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [drizzle_service_1.DrizzleService,
        jwt_1.JwtService,
        config_1.ConfigService])
], ProjectAuthService);
//# sourceMappingURL=project-auth.service.js.map