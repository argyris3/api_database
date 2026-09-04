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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const constants_1 = require("@apiDatabase/constants");
const auth_service_1 = require("./auth.service");
const register_dto_1 = require("./dto/register.dto");
const login_dto_1 = require("./dto/login.dto");
const jwt_auth_guard_1 = require("./guards/jwt-auth-guard");
const current_user_decorator_1 = require("./decorators/current-user-decorator");
const invite_service_1 = require("../members/invite.service");
let AuthController = class AuthController {
    authService;
    configService;
    inviteService;
    constructor(authService, configService, inviteService) {
        this.authService = authService;
        this.configService = configService;
        this.inviteService = inviteService;
    }
    async register(dto, res) {
        const tokens = await this.authService.register(dto);
        this.authService.setTokenCookies(res, tokens);
        return { message: 'Registered successfully' };
    }
    async login(dto, res) {
        const tokens = await this.authService.login(dto);
        this.authService.setTokenCookies(res, tokens);
        return { message: 'Logged in successfully' };
    }
    logout(res) {
        this.authService.clearTokenCookies(res);
        return { message: 'Logged out successfully' };
    }
    async refresh(req, res) {
        const refreshToken = req.cookies[constants_1.COOKIE_KEYS.REFRESH_TOKEN];
        const tokens = await this.authService.refreshTokens(refreshToken);
        this.authService.setTokenCookies(res, tokens);
        return { message: 'Tokens refreshed' };
    }
    me(user) {
        return user;
    }
    googleLogin() {
        return { url: this.authService.getGoogleAuthUrl() };
    }
    async googleCallback(code, res) {
        const tokens = await this.authService.handleGoogleCallback(code);
        this.authService.setTokenCookies(res, tokens);
        return res.redirect(`${this.configService.get('WEB_URL')}/dashboard`);
    }
    githubLogin() {
        return { url: this.authService.getGithubAuthUrl() };
    }
    async githubCallback(code, res) {
        const tokens = await this.authService.handleGithubCallback(code);
        this.authService.setTokenCookies(res, tokens);
        return res.redirect(`${this.configService.get('WEB_URL')}/dashboard`);
    }
    async acceptInvite(token, res) {
        await this.inviteService.acceptInvite(token);
        return res.redirect(`${this.configService.get('WEB_URL')}/dashboard`);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Post)('refresh'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('me'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "me", null);
__decorate([
    (0, common_1.Get)('google'),
    (0, common_1.Redirect)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "googleLogin", null);
__decorate([
    (0, common_1.Get)('google/callback'),
    __param(0, (0, common_1.Query)('code')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleCallback", null);
__decorate([
    (0, common_1.Get)('github'),
    (0, common_1.Redirect)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "githubLogin", null);
__decorate([
    (0, common_1.Get)('github/callback'),
    __param(0, (0, common_1.Query)('code')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "githubCallback", null);
__decorate([
    (0, common_1.Get)('invite/accept'),
    __param(0, (0, common_1.Query)('token')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "acceptInvite", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        config_1.ConfigService,
        invite_service_1.InviteService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map