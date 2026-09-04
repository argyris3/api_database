import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { DrizzleService } from '../db/drizzle.service';
import { CreateProjectDto } from './dto/create-project.dto';
export declare class ProjectsService {
    private drizzle;
    private jwtService;
    private configService;
    constructor(drizzle: DrizzleService, jwtService: JwtService, configService: ConfigService);
    private generateProjectSlug;
    private generateDbSchema;
    private signProjectKey;
    private provisionSchema;
    getProjectsForOrg(orgSlug: string, userId: string): Promise<{
        id: string;
        name: string;
        slug: string;
        projectUrl: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getProjectBySlug(orgSlug: string, projectSlug: string, userId: string): Promise<{
        organizations: {
            id: string;
            name: string;
            slug: string;
            createdAt: Date;
            updatedAt: Date;
        };
        org_members: {
            id: string;
            orgId: string;
            userId: string;
            role: "admin" | "developer";
            createdAt: Date;
            removedAt: Date | null;
        };
        projects: {
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
        };
    }>;
    createProject(orgSlug: string, dto: CreateProjectDto): Promise<{
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
