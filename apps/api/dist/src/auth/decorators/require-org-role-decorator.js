"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequireOrgRole = exports.ORG_ROLE_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.ORG_ROLE_KEY = 'orgRole';
const RequireOrgRole = (role) => (0, common_1.SetMetadata)(exports.ORG_ROLE_KEY, role);
exports.RequireOrgRole = RequireOrgRole;
//# sourceMappingURL=require-org-role-decorator.js.map