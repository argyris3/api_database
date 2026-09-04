import { MembersService } from './members.service';
import { InviteService } from './invite.service';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InviteMemberDto } from './dto/invite-member-dto';
export declare class MembersController {
    private membersService;
    private inviteService;
    constructor(membersService: MembersService, inviteService: InviteService);
    getMembers(slug: string): Promise<{
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
    updateRole(slug: string, memberId: string, dto: UpdateRoleDto): Promise<{
        id: string;
        orgId: string;
        userId: string;
        role: "admin" | "developer";
        createdAt: Date;
        removedAt: Date | null;
    }>;
    removeMember(slug: string, memberId: string): Promise<{
        message: string;
    }>;
    sendInvite(slug: string, dto: InviteMemberDto): Promise<{
        message: string;
    }>;
}
