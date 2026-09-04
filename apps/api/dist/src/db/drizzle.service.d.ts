import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
export declare class DrizzleService implements OnModuleInit {
    private config;
    db: ReturnType<typeof drizzle<typeof schema>>;
    constructor(config: ConfigService);
    onModuleInit(): void;
}
