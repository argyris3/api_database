"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SqlEditorModule = void 0;
const common_1 = require("@nestjs/common");
const sql_editor_service_1 = require("./sql-editor.service");
const sql_editor_controller_1 = require("./sql-editor.controller");
const auth_module_1 = require("../auth/auth.module");
const org_role_guards_1 = require("../auth/guards/org-role.guards");
let SqlEditorModule = class SqlEditorModule {
};
exports.SqlEditorModule = SqlEditorModule;
exports.SqlEditorModule = SqlEditorModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.AuthModule],
        providers: [sql_editor_service_1.SqlEditorService, org_role_guards_1.OrgRoleGuard],
        controllers: [sql_editor_controller_1.SqlEditorController],
    })
], SqlEditorModule);
//# sourceMappingURL=sql-editor.module.js.map