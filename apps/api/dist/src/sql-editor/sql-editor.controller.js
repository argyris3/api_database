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
exports.SqlEditorController = void 0;
const common_1 = require("@nestjs/common");
const sql_editor_service_1 = require("./sql-editor.service");
const execute_query_dto_1 = require("./dto/execute-query.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth-guard");
const org_role_guards_1 = require("../auth/guards/org-role.guards");
let SqlEditorController = class SqlEditorController {
    sqlEditorService;
    constructor(sqlEditorService) {
        this.sqlEditorService = sqlEditorService;
    }
    executeQuery(slug, projectSlug, dto) {
        return this.sqlEditorService.executeQuery(slug, projectSlug, dto.sql);
    }
    getHistory(slug, projectSlug) {
        return this.sqlEditorService.getHistory(slug, projectSlug);
    }
};
exports.SqlEditorController = SqlEditorController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Param)('slug')),
    __param(1, (0, common_1.Param)('projectSlug')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, execute_query_dto_1.ExecuteQueryDto]),
    __metadata("design:returntype", void 0)
], SqlEditorController.prototype, "executeQuery", null);
__decorate([
    (0, common_1.Get)('history'),
    __param(0, (0, common_1.Param)('slug')),
    __param(1, (0, common_1.Param)('projectSlug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], SqlEditorController.prototype, "getHistory", null);
exports.SqlEditorController = SqlEditorController = __decorate([
    (0, common_1.Controller)('orgs/:slug/projects/:projectSlug/sql'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, org_role_guards_1.OrgRoleGuard),
    __metadata("design:paramtypes", [sql_editor_service_1.SqlEditorService])
], SqlEditorController);
//# sourceMappingURL=sql-editor.controller.js.map