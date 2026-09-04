import type { OrgRole } from '@apiDatabase/types';
export declare const ORG_ROLE_KEY = "orgRole";
export declare const RequireOrgRole: (role: OrgRole) => import("@nestjs/common").CustomDecorator<string>;
