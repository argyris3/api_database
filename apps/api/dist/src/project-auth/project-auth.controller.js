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
exports.ProjectAuthController = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const project_auth_service_1 = require("./project-auth.service");
const signup_dto_1 = require("./dto/signup.dto");
const signin_dto_1 = require("./dto/signin.dto");
const magic_link_dto_1 = require("./dto/magic-link.dto");
let ProjectAuthController = class ProjectAuthController {
    projectAuthService;
    configService;
    constructor(projectAuthService, configService) {
        this.projectAuthService = projectAuthService;
        this.configService = configService;
    }
    signUp(projectSlug, dto) {
        return this.projectAuthService.signUp(projectSlug, dto);
    }
    signIn(projectSlug, dto) {
        return this.projectAuthService.signIn(projectSlug, dto);
    }
    sendMagicLink(projectSlug, dto) {
        return this.projectAuthService.sendMagicLink(projectSlug, dto.email);
    }
    verifyMagicLink(projectSlug, token) {
        return this.projectAuthService.verifyMagicLink(projectSlug, token);
    }
    async googleLogin(projectSlug, res) {
        const settings = await this.projectAuthService.getOAuthSettings(projectSlug);
        if (!settings.googleClientId) {
            return res.status(400).json({ message: 'Google OAuth not configured' });
        }
        const apiUrl = this.configService.get('API_URL');
        const redirectUri = `${apiUrl}/projects/${projectSlug}/auth/google/callback`;
        const url = this.projectAuthService.buildGoogleAuthUrl(settings.googleClientId, redirectUri);
        return res.redirect(url);
    }
    async googleCallback(projectSlug, code, res) {
        const result = await this.projectAuthService.handleGoogleCallback(projectSlug, code);
        const webUrl = await this.projectAuthService.getSiteUrlForProject(projectSlug);
        return res.redirect(`${webUrl}/?access_token=${result.accessToken}`);
    }
    async githubLogin(projectSlug, res) {
        const settings = await this.projectAuthService.getOAuthSettings(projectSlug);
        if (!settings.githubClientId) {
            return res.status(400).json({ message: 'GitHub OAuth not configured' });
        }
        const apiUrl = this.configService.get('API_URL');
        const redirectUri = `${apiUrl}/projects/${projectSlug}/auth/github/callback`;
        const url = this.projectAuthService.buildGithubAuthUrl(settings.githubClientId, redirectUri);
        return res.redirect(url);
    }
    async githubCallback(projectSlug, code, res) {
        const result = await this.projectAuthService.handleGithubCallback(projectSlug, code);
        const webUrl = await this.projectAuthService.getSiteUrlForProject(projectSlug);
        return res.redirect(`${webUrl}/?access_token=${result.accessToken}`);
    }
};
exports.ProjectAuthController = ProjectAuthController;
__decorate([
    (0, common_1.Post)('signup'),
    __param(0, (0, common_1.Param)('projectSlug')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, signup_dto_1.SignUpDto]),
    __metadata("design:returntype", void 0)
], ProjectAuthController.prototype, "signUp", null);
__decorate([
    (0, common_1.Post)('signin'),
    __param(0, (0, common_1.Param)('projectSlug')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, signin_dto_1.SignInDto]),
    __metadata("design:returntype", void 0)
], ProjectAuthController.prototype, "signIn", null);
__decorate([
    (0, common_1.Post)('magic-link'),
    __param(0, (0, common_1.Param)('projectSlug')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, magic_link_dto_1.MagicLinkDto]),
    __metadata("design:returntype", void 0)
], ProjectAuthController.prototype, "sendMagicLink", null);
__decorate([
    (0, common_1.Get)('magic-link/verify'),
    __param(0, (0, common_1.Param)('projectSlug')),
    __param(1, (0, common_1.Query)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ProjectAuthController.prototype, "verifyMagicLink", null);
__decorate([
    (0, common_1.Get)('google'),
    __param(0, (0, common_1.Param)('projectSlug')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProjectAuthController.prototype, "googleLogin", null);
__decorate([
    (0, common_1.Get)('google/callback'),
    __param(0, (0, common_1.Param)('projectSlug')),
    __param(1, (0, common_1.Query)('code')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], ProjectAuthController.prototype, "googleCallback", null);
__decorate([
    (0, common_1.Get)('github'),
    __param(0, (0, common_1.Param)('projectSlug')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProjectAuthController.prototype, "githubLogin", null);
__decorate([
    (0, common_1.Get)('github/callback'),
    __param(0, (0, common_1.Param)('projectSlug')),
    __param(1, (0, common_1.Query)('code')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], ProjectAuthController.prototype, "githubCallback", null);
exports.ProjectAuthController = ProjectAuthController = __decorate([
    (0, common_1.Controller)('projects/:projectSlug/auth'),
    __metadata("design:paramtypes", [project_auth_service_1.ProjectAuthService,
        config_1.ConfigService])
], ProjectAuthController);
//# sourceMappingURL=project-auth.controller.js.map