import { DrizzleService } from '../db/drizzle.service';
import type { BucketAccess } from '@apiDatabase/types';
export declare class StorageService {
    private drizzle;
    private utapi;
    constructor(drizzle: DrizzleService);
    private getProject;
    getBuckets(orgSlug: string, projectSlug: string): Promise<{
        id: string;
        projectId: string;
        name: string;
        access: "public" | "private";
        createdAt: Date;
    }[]>;
    createBucket(orgSlug: string, projectSlug: string, name: string, access: BucketAccess): Promise<{
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
    saveObject(bucketId: string, file: {
        name: string;
        size: number;
        type: string;
        utKey: string;
        url: string;
    }): Promise<{
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
    assertProjectSlug(projectId: string, projectSlug: string): Promise<void>;
    getBucketByName(projectId: string, bucketName: string): Promise<{
        id: string;
        projectId: string;
        name: string;
        access: "public" | "private";
        createdAt: Date;
    }>;
}
