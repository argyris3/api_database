import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DrizzleService } from '../../db/drizzle.service';
export declare class OrgRoleGuard implements CanActivate {
    private drizzle;
    private reflector;
    constructor(drizzle: DrizzleService, reflector: Reflector);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
