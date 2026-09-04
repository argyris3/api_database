import type { NextFunction, Request, Response } from 'express';
import { StorageService } from './storage.service';
import type { BucketAccess } from '@apiDatabase/types';
declare class CreateBucketDto {
    name: string;
    access: BucketAccess;
}
declare class SaveObjectDto {
    name: string;
    size: number;
    type: string;
    utKey: string;
    url: string;
}
export declare class StorageController {
    private storageService;
    constructor(storageService: StorageService);
    getBuckets(slug: string, projectSlug: string): Promise<{
        id: string;
        projectId: string;
        name: string;
        access: "public" | "private";
        createdAt: Date;
    }[]>;
    createBucket(slug: string, projectSlug: string, dto: CreateBucketDto): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        projectId: string;
        access: "public" | "private";
    }>;
    deleteBucket(bucketId: string): Promise<{
        message: string;
    }>;
    getObjects(bucketId: string): Promise<{
        id: string;
        bucketId: string;
        name: string;
        size: number;
        mimeType: string;
        utKey: string;
        url: string;
        createdAt: Date;
    }[]>;
    handleUpload(req: Request, res: Response, next: NextFunction): void;
    saveObject(bucketId: string, file: SaveObjectDto): Promise<{
        url: string;
        name: string;
        id: string;
        createdAt: Date;
        bucketId: string;
        size: number;
        mimeType: string;
        utKey: string;
    }>;
    deleteObject(objectId: string): Promise<{
        message: string;
    }>;
    getSignedUrl(objectId: string): Promise<{
        url: string;
    }>;
}
export {};
