import type { NextFunction, Request, Response } from 'express';
import { StorageService } from './storage.service';
declare class SaveObjectDto {
    name: string;
    size: number;
    type: string;
    utKey: string;
    url: string;
}
export declare class ProjectStorageController {
    private storageService;
    constructor(storageService: StorageService);
    private getProjectKey;
    private assertWriteAccess;
    getObjects(req: Request, projectSlug: string, bucketName: string): Promise<{
        id: string;
        bucketId: string;
        name: string;
        size: number;
        mimeType: string;
        utKey: string;
        url: string;
        createdAt: Date;
    }[]>;
    handleUpload(req: Request, res: Response, next: NextFunction, projectSlug: string, bucketName: string): Promise<void>;
    saveObject(req: Request, projectSlug: string, bucketName: string, file: SaveObjectDto): Promise<{
        url: string;
        name: string;
        id: string;
        createdAt: Date;
        bucketId: string;
        size: number;
        mimeType: string;
        utKey: string;
    }>;
    deleteObject(req: Request, projectSlug: string, objectId: string): Promise<{
        message: string;
    }>;
    getSignedUrl(req: Request, projectSlug: string, objectId: string): Promise<{
        url: string;
    }>;
}
export {};
