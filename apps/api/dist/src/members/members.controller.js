"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MembersController = void 0;
const common_1 = require("@nestjs/common");
const members_service_1 = require("./members.service");
const invite_service_1 = require("./invite.service");
const update_role_dto_1 = require("./dto/update-role.dto");
const invite_member_dto_1 = require("./dto/invite-member-dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth-guard");
const org_role_guards_1 = require("../auth/guards/org-role.guards");
const require_org_role_decorator_1 = require("../auth/decorators/require-org-role-decorator");
let MembersController = class MembersController {
    membersService;
    inviteService;
    constructor(membersService, inviteService) {
        this.membersService = membersService;
        this.inviteService = inviteService;
    }
    getMembers(slug) {
        return this.membersService.getMembers(slug);
    }
    updateRole(slug, memberId, dto) {
        return this.membersService.updateRole(slug, memberId, dto);
    }
    removeMember(slug, memberId) {
        return this.membersService.removeMember(slug, memberId);
    }
    sendInvite(slug, dto) {
        return this.inviteService.sendInvite(slug, dto.email);
    }
};
exports.MembersController = MembersController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MembersController.prototype, "getMembers", null);
__decorate([
    (0, common_1.Patch)(':memberId/role'),
    (0, require_org_role_decorator_1.RequireOrgRole)('admin'),
    __param(0, (0, common_1.Param)('slug')),
    __param(1, (0, common_1.Param)('memberId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_role_dto_1.UpdateRoleDto]),
    __metadata("design:returntype", void 0)
], MembersController.prototype, "updateRole", null);
__decorate([
    (0, common_1.Delete)(':memberId'),
    (0, require_org_role_decorator_1.RequireOrgRole)('admin'),
    __param(0, (0, common_1.Param)('slug')),
    __param(1, (0, common_1.Param)('memberId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], MembersController.prototype, "removeMember", null);
__decorate([
    (0, common_1.Post)('invite'),
    (0, require_org_role_decorator_1.RequireOrgRole)('admin'),
    __param(0, (0, common_1.Param)('slug')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, invite_member_dto_1.InviteMemberDto]),
    __metadata("design:returntype", void 0)
], MembersController.prototype, "sendInvite", null);
exports.MembersController = MembersController = __decorate([
    (0, common_1.Controller)('orgs/:slug/members'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, org_role_guards_1.OrgRoleGuard),
    __metadata("design:paramtypes", [members_service_1.MembersService,
        invite_service_1.InviteService])
], MembersController);
//# sourceMappingURL=members.controller.js.map