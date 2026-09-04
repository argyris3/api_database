"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableEditorModule = void 0;
const common_1 = require("@nestjs/common");
const auth_module_1 = require("../auth/auth.module");
const table_editor_service_1 = require("./table-editor.service");
const table_editor_controller_1 = require("./table-editor.controller");
const org_role_guards_1 = require("../auth/guards/org-role.guards");
let TableEditorModule = class TableEditorModule {
};
exports.TableEditorModule = TableEditorModule;
exports.TableEditorModule = TableEditorModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.AuthModule],
        providers: [table_editor_service_1.TableEditorService, org_role_guards_1.OrgRoleGuard],
        controllers: [table_editor_controller_1.TableEditorController],
    })
], TableEditorModule);
//# sourceMappingURL=table-editor.module.js.map