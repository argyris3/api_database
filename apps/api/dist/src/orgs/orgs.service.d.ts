import { DrizzleService } from '../db/drizzle.service';
import { CreateOrgDto } from './dto/create-org.dto';
export declare class OrgsService {
    private drizzle;
    constructor(drizzle: DrizzleService);
    private generateOrgSlug;
    getMyOrgs(userId: string): Promise<{
        id: string;
        name: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        role: "admin" | "developer";
        projectCount: number;
        memberCount: number;
    }[]>;
    getOrgBySlug(slug: string, userId: string): Promise<{
        id: string;
        name: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        role: "admin" | "developer";
    }>;
    createOrg(dto: CreateOrgDto, userId: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
    }>;
}
