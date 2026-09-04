import { OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { RealtimeEvent } from '@apiDatabase/types';
type NotifyCallback = (event: RealtimeEvent) => void;
export declare class RealtimeService implements OnModuleDestroy {
    private configService;
    private listeners;
    constructor(configService: ConfigService);
    private getListenConnectionString;
    subscribe(projectId: string, tableName: string, callback: NotifyCallback): Promise<void>;
    unsubscribe(projectId: string, tableName: string, callback: NotifyCallback): void;
    onModuleDestroy(): Promise<void>;
}
export {};
