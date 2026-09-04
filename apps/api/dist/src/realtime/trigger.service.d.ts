import { DrizzleService } from '../db/drizzle.service';
export declare class TriggerService {
    private drizzle;
    constructor(drizzle: DrizzleService);
    private assertSafeIdentifier;
    static channelName(projectId: string, tableName: string): string;
    enableRealtime(dbSchema: string, projectId: string, tableName: string): Promise<void>;
    disableRealtime(dbSchema: string, tableName: string): Promise<void>;
}
