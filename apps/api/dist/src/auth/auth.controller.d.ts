import type { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import type { JwtPayload } from '@apiDatabase/types';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { InviteService } from "../members/invite.service";
export declare class AuthController {
    private authService;
    private configService;
    private inviteService;
    constructor(authService: AuthService, configService: ConfigService, inviteService: InviteService);
    register(dto: RegisterDto, res: Response): Promise<{
        message: string;
    }>;
    login(dto: LoginDto, res: Response): Promise<{
        message: string;
    }>;
    logout(res: Response): {
        message: string;
    };
    refresh(req: Request, res: Response): Promise<{
        message: string;
    }>;
    me(user: JwtPayload): JwtPayload;
    googleLogin(): {
        url: string;
    };
    googleCallback(code: string, res: Response): Promise<void>;
    githubLogin(): {
        url: string;
    };
    githubCallback(code: string, res: Response): Promise<void>;
    acceptInvite(token: string, res: Response): Promise<void>;
}
