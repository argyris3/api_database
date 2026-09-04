import { TriggerService } from './trigger.service';
import { DrizzleService } from '../db/drizzle.service';
export declare class RealtimeController {
    private triggerService;
    private drizzle;
    constructor(triggerService: TriggerService, drizzle: DrizzleService);
    private getProject;
    enableRealtime(slug: string, projectSlug: string, tableName: string): Promise<{
        message: string;
    }>;
    disableRealtime(slug: string, projectSlug: string, tableName: string): Promise<{
        message: string;
    }>;
}
