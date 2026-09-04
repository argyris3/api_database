import { DrizzleService } from '../db/drizzle.service';
import { UpdateRoleDto } from './dto/update-role.dto';
export declare class MembersService {
    private drizzle;
    constructor(drizzle: DrizzleService);
    getMembers(orgSlug: string): Promise<{
        id: string;
        role: "admin" | "developer";
        createdAt: Date;
        user: {
            id: string;
            name: string | null;
            email: string;
            avatarUrl: string | null;
        };
    }[]>;
    updateRole(orgSlug: string, memberId: string, dto: UpdateRoleDto): Promise<{
        id: string;
        orgId: string;
        userId: string;
        role: "admin" | "developer";
        createdAt: Date;
        removedAt: Date | null;
    }>;
    removeMember(orgSlug: string, memberId: string): Promise<{
        message: string;
    }>;
    private ensureNotLastAdmin;
}
