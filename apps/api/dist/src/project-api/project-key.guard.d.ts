import { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PROJECT_KEY_ROLES } from '@apiDatabase/constants';
export interface ProjectKeyPayload {
    projectId: string;
    role: typeof PROJECT_KEY_ROLES.ANON | typeof PROJECT_KEY_ROLES.SERVICE_ROLE;
}
export declare class ProjectKeyGuard implements CanActivate {
    private jwtService;
    private configService;
    constructor(jwtService: JwtService, configService: ConfigService);
    canActivate(context: ExecutionContext): boolean;
}
