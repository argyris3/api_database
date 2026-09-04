import { OrgsService } from './orgs.service';
import { CreateOrgDto } from './dto/create-org.dto';
import type { JwtPayload } from '@apiDatabase/types';
export declare class OrgsController {
    private orgsService;
    constructor(orgsService: OrgsService);
    getMyOrgs(user: JwtPayload): Promise<{
        id: string;
        name: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        role: "admin" | "developer";
        projectCount: number;
        memberCount: number;
    }[]>;
    getOrgBySlug(slug: string, user: JwtPayload): Promise<{
        id: string;
        name: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        role: "admin" | "developer";
    }>;
    createOrg(dto: CreateOrgDto, user: JwtPayload): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
    }>;
}
