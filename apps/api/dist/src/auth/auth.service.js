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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const bcrypt = __importStar(require("bcrypt"));
const crypto_1 = require("crypto");
const slugify_1 = __importDefault(require("slugify"));
const drizzle_orm_1 = require("drizzle-orm");
const constants_1 = require("@apiDatabase/constants");
const drizzle_service_1 = require("../db/drizzle.service");
const schema_1 = require("../db/schema");
let AuthService = class AuthService {
    drizzle;
    jwtService;
    configService;
    constructor(drizzle, jwtService, configService) {
        this.drizzle = drizzle;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    setTokenCookies(res, tokens) {
        const isProduction = this.configService.get('NODE_ENV') === 'production';
        res.cookie(constants_1.COOKIE_KEYS.ACCESS_TOKEN, tokens.accessToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'lax',
            maxAge: 15 * 60 * 1000,
        });
        res.cookie(constants_1.COOKIE_KEYS.REFRESH_TOKEN, tokens.refreshToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
    }
    clearTokenCookies(res) {
        res.clearCookie(constants_1.COOKIE_KEYS.ACCESS_TOKEN);
        res.clearCookie(constants_1.COOKIE_KEYS.REFRESH_TOKEN);
    }
    generateOrgSlug(name) {
        const base = (0, slugify_1.default)(`${name}-org`, { lower: true, strict: true });
        const suffix = (0, crypto_1.randomBytes)(3).toString('hex');
        return `${base}-${suffix}`;
    }
    signTokens(userId, email) {
        const payload = { sub: userId, email };
        const accessToken = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_ACCESS_SECRET'),
            expiresIn: this.configService.get('JWT_ACCESS_EXPIRES_IN'),
        });
        const refreshToken = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_REFRESH_SECRET'),
            expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
        });
        return { accessToken, refreshToken };
    }
    async register(dto) {
        const existing = await this.drizzle.db
            .select()
            .from(schema_1.users)
            .where((0, drizzle_orm_1.eq)(schema_1.users.email, dto.email))
            .limit(1);
        if (existing.length > 0) {
            throw new common_1.ConflictException('Email already in use');
        }
        const passwordHash = await bcrypt.hash(dto.password, 12);
        const [user] = await this.drizzle.db
            .insert(schema_1.users)
            .values({ email: dto.email, name: dto.name, passwordHash })
            .returning();
        const [org] = await this.drizzle.db
            .insert(schema_1.organizations)
            .values({
            name: `${dto.name}'s Org`,
            slug: this.generateOrgSlug(dto.name),
        })
            .returning();
        await this.drizzle.db.insert(schema_1.orgMembers).values({
            orgId: org.id,
            userId: user.id,
            role: 'admin',
        });
        return this.signTokens(user.id, user.email);
    }
    async login(dto) {
        const [user] = await this.drizzle.db
            .select()
            .from(schema_1.users)
            .where((0, drizzle_orm_1.eq)(schema_1.users.email, dto.email))
            .limit(1);
        if (!user || !user.passwordHash) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const passwordMatch = await bcrypt.compare(dto.password, user.passwordHash);
        if (!passwordMatch) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        return this.signTokens(user.id, user.email);
    }
    async refreshTokens(refreshToken) {
        try {
            const payload = this.jwtService.verify(refreshToken, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
            });
            const [user] = await this.drizzle.db
                .select()
                .from(schema_1.users)
                .where((0, drizzle_orm_1.eq)(schema_1.users.id, payload.sub))
                .limit(1);
            if (!user)
                throw new common_1.UnauthorizedException();
            return this.signTokens(user.id, user.email);
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
    }
    async handleOAuthUser(profile) {
        let [user] = await this.drizzle.db
            .select()
            .from(schema_1.users)
            .where((0, drizzle_orm_1.eq)(schema_1.users.email, profile.email))
            .limit(1);
        if (!user) {
            const [newUser] = await this.drizzle.db
                .insert(schema_1.users)
                .values({
                email: profile.email,
                name: profile.name,
                avatarUrl: profile.avatarUrl,
            })
                .returning();
            user = newUser;
            const [org] = await this.drizzle.db
                .insert(schema_1.organizations)
                .values({
                name: `${profile.name}'s Org`,
                slug: this.generateOrgSlug(profile.name),
            })
                .returning();
            await this.drizzle.db.insert(schema_1.orgMembers).values({
                orgId: org.id,
                userId: user.id,
                role: 'admin',
            });
        }
        return this.signTokens(user.id, user.email);
    }
    getGoogleAuthUrl() {
        const params = new URLSearchParams({
            client_id: this.configService.get('GOOGLE_CLIENT_ID'),
            redirect_uri: this.configService.get('GOOGLE_CALLBACK_URL'),
            response_type: 'code',
            scope: 'openid email profile',
            access_type: 'offline',
        });
        return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    }
    async handleGoogleCallback(code) {
        const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                code,
                client_id: this.configService.get('GOOGLE_CLIENT_ID'),
                client_secret: this.configService.get('GOOGLE_CLIENT_SECRET'),
                redirect_uri: this.configService.get('GOOGLE_CALLBACK_URL'),
                grant_type: 'authorization_code',
            }),
        });
        const tokenData = (await tokenRes.json());
        const profileRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${tokenData.access_token}` },
        });
        const profile = (await profileRes.json());
        return this.handleOAuthUser({
            email: profile.email,
            name: profile.name,
            avatarUrl: profile.picture ?? null,
        });
    }
    getGithubAuthUrl() {
        const params = new URLSearchParams({
            client_id: this.configService.get('GITHUB_CLIENT_ID'),
            redirect_uri: this.configService.get('GITHUB_CALLBACK_URL'),
            scope: 'read:user user:email',
        });
        return `https://github.com/login/oauth/authorize?${params.toString()}`;
    }
    async handleGithubCallback(code) {
        const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                client_id: this.configService.get('GITHUB_CLIENT_ID'),
                client_secret: this.configService.get('GITHUB_CLIENT_SECRET'),
                code,
                redirect_uri: this.configService.get('GITHUB_CALLBACK_URL'),
            }),
        });
        const tokenData = (await tokenRes.json());
        const profileRes = await fetch('https://api.github.com/user', {
            headers: {
                Authorization: `Bearer ${tokenData.access_token}`,
                Accept: 'application/vnd.github+json',
            },
        });
        const profile = (await profileRes.json());
        let email = profile.email;
        if (!email) {
            const emailRes = await fetch('https://api.github.com/user/emails', {
                headers: {
                    Authorization: `Bearer ${tokenData.access_token}`,
                    Accept: 'application/vnd.github+json',
                },
            });
            const emails = (await emailRes.json());
            email = emails.find((e) => e.primary && e.verified)?.email ?? null;
        }
        return this.handleOAuthUser({
            email: email,
            name: profile.name ?? profile.login,
            avatarUrl: profile.avatar_url ?? null,
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [drizzle_service_1.DrizzleService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map