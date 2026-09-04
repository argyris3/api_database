import { ProjectAuthService } from './project-auth.service';
export declare class ProjectAuthDashboardController {
    private projectAuthService;
    constructor(projectAuthService: ProjectAuthService);
    getUsers(projectSlug: string): Promise<{
        id: string;
        email: string;
        emailVerified: boolean;
        provider: string;
        createdAt: string;
    }[]>;
    getSettings(projectSlug: string): Promise<{
        siteUrl: string | null;
        googleClientId: string | null;
        googleClientSecret: string | null;
        githubClientId: string | null;
        githubClientSecret: string | null;
    }>;
    updateSettings(projectSlug: string, settings: {
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
