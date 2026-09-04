import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { DrizzleService } from '../db/drizzle.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private drizzle;
    private jwtService;
    private configService;
    constructor(drizzle: DrizzleService, jwtService: JwtService, configService: ConfigService);
    setTokenCookies(res: Response, tokens: {
        accessToken: string;
        refreshToken: string;
    }): void;
    clearTokenCookies(res: Response): void;
    private generateOrgSlug;
    private signTokens;
    register(dto: RegisterDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    refreshTokens(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    handleOAuthUser(profile: {
        email: string;
        name: string;
        avatarUrl: string | null;
    }): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    getGoogleAuthUrl(): string;
    handleGoogleCallback(code: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    getGithubAuthUrl(): string;
    handleGithubCallback(code: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
}
