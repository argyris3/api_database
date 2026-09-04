import type { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { ProjectAuthService } from './project-auth.service';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import { MagicLinkDto } from './dto/magic-link.dto';
export declare class ProjectAuthController {
    private projectAuthService;
    private configService;
    constructor(projectAuthService: ProjectAuthService, configService: ConfigService);
    signUp(projectSlug: string, dto: SignUpDto): Promise<{
        user: {
            id: string;
            email: string;
        };
        accessToken: string;
    }>;
    signIn(projectSlug: string, dto: SignInDto): Promise<{
        user: {
            id: string;
            email: string;
        };
        accessToken: string;
    }>;
    sendMagicLink(projectSlug: string, dto: MagicLinkDto): Promise<{
        message: string;
    }>;
    verifyMagicLink(projectSlug: string, token: string): Promise<{
        user: {
            id: string;
            email: string;
        };
        accessToken: string;
    }>;
    googleLogin(projectSlug: string, res: Response): Promise<void | Response<any, Record<string, any>>>;
    googleCallback(projectSlug: string, code: string, res: Response): Promise<void>;
    githubLogin(projectSlug: string, res: Response): Promise<void | Response<any, Record<string, any>>>;
    githubCallback(projectSlug: string, code: string, res: Response): Promise<void>;
}
