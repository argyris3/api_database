import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { DrizzleService } from '../db/drizzle.service';
export declare class InviteService {
    private drizzle;
    private jwtService;
    private configService;
    private resend;
    constructor(drizzle: DrizzleService, jwtService: JwtService, configService: ConfigService);
    sendInvite(orgSlug: string, email: string): Promise<{
        message: string;
    }>;
    acceptInvite(token: string): Promise<{
        message: string;
        email?: undefined;
    } | {
        message: string;
        email: string;
    }>;
}
