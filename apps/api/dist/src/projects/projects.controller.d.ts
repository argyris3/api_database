import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import type { JwtPayload } from '@apiDatabase/types';
export declare class ProjectsController {
    private projectsService;
    constructor(projectsService: ProjectsService);
    getProjects(slug: string, user: JwtPayload): Promise<{
        id: string;
        name: string;
        slug: string;
        projectUrl: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getProject(slug: string, projectSlug: string, user: JwtPayload): Promise<{
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
    createProject(slug: string, dto: CreateProjectDto): Promise<{
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
