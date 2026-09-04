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
exports.TableEditorController = void 0;
const common_1 = require("@nestjs/common");
const table_editor_service_1 = require("./table-editor.service");
const create_table_dto_1 = require("./dto/create-table.dto");
const alter_table_dto_1 = require("./dto/alter-table.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth-guard");
const org_role_guards_1 = require("../auth/guards/org-role.guards");
let TableEditorController = class TableEditorController {
    tableEditorService;
    constructor(tableEditorService) {
        this.tableEditorService = tableEditorService;
    }
    getTables(slug, projectSlug) {
        return this.tableEditorService.getTables(slug, projectSlug);
    }
    getTableRows(slug, projectSlug, tableName, limit, offset) {
        return this.tableEditorService.getTableRows(slug, projectSlug, tableName, limit ? parseInt(limit, 10) : 100, offset ? parseInt(offset, 10) : 0);
    }
    getTableInfo(slug, projectSlug, tableName) {
        return this.tableEditorService.getTableInfo(slug, projectSlug, tableName);
    }
    createTable(slug, projectSlug, dto) {
        return this.tableEditorService.createTable(slug, projectSlug, dto);
    }
    addColumn(slug, projectSlug, tableName, dto) {
        return this.tableEditorService.addColumn(slug, projectSlug, tableName, dto);
    }
    dropColumn(slug, projectSlug, tableName, columnName) {
        return this.tableEditorService.dropColumn(slug, projectSlug, tableName, columnName);
    }
    deleteTable(slug, projectSlug, tableName) {
        return this.tableEditorService.deleteTable(slug, projectSlug, tableName);
    }
    updateRow(slug, projectSlug, tableName, pkValue, body) {
        return this.tableEditorService.updateRow(slug, projectSlug, tableName, body.pkColumn, pkValue, body.updates);
    }
};
exports.TableEditorController = TableEditorController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Param)('slug')),
    __param(1, (0, common_1.Param)('projectSlug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], TableEditorController.prototype, "getTables", null);
__decorate([
    (0, common_1.Get)(':tableName/rows'),
    __param(0, (0, common_1.Param)('slug')),
    __param(1, (0, common_1.Param)('projectSlug')),
    __param(2, (0, common_1.Param)('tableName')),
    __param(3, (0, common_1.Query)('limit')),
    __param(4, (0, common_1.Query)('offset')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], TableEditorController.prototype, "getTableRows", null);
__decorate([
    (0, common_1.Get)(':tableName'),
    __param(0, (0, common_1.Param)('slug')),
    __param(1, (0, common_1.Param)('projectSlug')),
    __param(2, (0, common_1.Param)('tableName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], TableEditorController.prototype, "getTableInfo", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Param)('slug')),
    __param(1, (0, common_1.Param)('projectSlug')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, create_table_dto_1.CreateTableDto]),
    __metadata("design:returntype", void 0)
], TableEditorController.prototype, "createTable", null);
__decorate([
    (0, common_1.Patch)(':tableName/columns'),
    __param(0, (0, common_1.Param)('slug')),
    __param(1, (0, common_1.Param)('projectSlug')),
    __param(2, (0, common_1.Param)('tableName')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, alter_table_dto_1.AddColumnDto]),
    __metadata("design:returntype", void 0)
], TableEditorController.prototype, "addColumn", null);
__decorate([
    (0, common_1.Delete)(':tableName/columns/:columnName'),
    __param(0, (0, common_1.Param)('slug')),
    __param(1, (0, common_1.Param)('projectSlug')),
    __param(2, (0, common_1.Param)('tableName')),
    __param(3, (0, common_1.Param)('columnName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", void 0)
], TableEditorController.prototype, "dropColumn", null);
__decorate([
    (0, common_1.Delete)(':tableName'),
    __param(0, (0, common_1.Param)('slug')),
    __param(1, (0, common_1.Param)('projectSlug')),
    __param(2, (0, common_1.Param)('tableName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], TableEditorController.prototype, "deleteTable", null);
__decorate([
    (0, common_1.Patch)(':tableName/rows/:pkValue'),
    __param(0, (0, common_1.Param)('slug')),
    __param(1, (0, common_1.Param)('projectSlug')),
    __param(2, (0, common_1.Param)('tableName')),
    __param(3, (0, common_1.Param)('pkValue')),
    __param(4, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, Object]),
    __metadata("design:returntype", void 0)
], TableEditorController.prototype, "updateRow", null);
exports.TableEditorController = TableEditorController = __decorate([
    (0, common_1.Controller)('orgs/:slug/projects/:projectSlug/tables'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, org_role_guards_1.OrgRoleGuard),
    __metadata("design:paramtypes", [table_editor_service_1.TableEditorService])
], TableEditorController);
//# sourceMappingURL=table-editor.controller.js.map