import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { DrizzleService } from '../db/drizzle.service';
import { projects } from '../db/schema';
import type { SignUpInput, SignInInput } from '@apiDatabase/types';
export declare class ProjectAuthService {
    private drizzle;
    private jwtService;
    private configService;
    private resend;
    constructor(drizzle: DrizzleService, jwtService: JwtService, configService: ConfigService);
    private getProject;
    private ensureAuthUsersTable;
    private signToken;
    signUp(projectSlug: string, dto: SignUpInput): Promise<{
        user: {
            id: string;
            email: string;
        };
        accessToken: string;
    }>;
    signIn(projectSlug: string, dto: SignInInput): Promise<{
        user: {
            id: string;
            email: string;
        };
        accessToken: string;
    }>;
    sendMagicLink(projectSlug: string, email: string): Promise<{
        message: string;
    }>;
    verifyMagicLink(projectSlug: string, token: string): Promise<{
        user: {
            id: string;
            email: string;
        };
        accessToken: string;
    }>;
    buildGoogleAuthUrl(clientId: string, redirectUri: string): string;
    buildGithubAuthUrl(clientId: string, redirectUri: string): string;
    handleGoogleCallback(projectSlug: string, code: string): Promise<{
        user: {
            id: string;
            email: string;
        };
        accessToken: string;
    }>;
    handleGithubCallback(projectSlug: string, code: string): Promise<{
        user: {
            id: string;
            email: string;
        };
        accessToken: string;
    }>;
    private findOrCreateOAuthUser;
    getUsers(projectSlug: string): Promise<{
        id: string;
        email: string;
        emailVerified: boolean;
        provider: string;
        createdAt: string;
    }[]>;
    getOAuthSettings(projectSlug: string): Promise<{
        siteUrl: string | null;
        googleClientId: string | null;
        googleClientSecret: string | null;
        githubClientId: string | null;
        githubClientSecret: string | null;
    }>;
    resolveSiteUrl(project: typeof projects.$inferSelect): string;
    getSiteUrlForProject(projectSlug: string): Promise<string>;
    updateOAuthSettings(projectSlug: string, settings: {
        siteUrl?: string;
        googleClientId?: string;
        googleClientSecret?: string;
        githubClientId?: string;
        githubClientSecret?: string;
    }): Promise<{
        id: string;
        orgId: string;
        name: string;
        slug: string;
        dbSchema: string;
        projectUrl: string;
        anonKey: string;
        serviceRoleKey: string;
        googleClientId: string | null;
        googleClientSecret: string | null;
        githubClientId: string | null;
        githubClientSecret: string | null;
        authJwtSecret: string;
        siteUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
