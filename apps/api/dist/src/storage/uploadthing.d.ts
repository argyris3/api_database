import { FileRoute } from 'uploadthing/types';
export declare const storageRouter: {
    bucketUploader: FileRoute<{
        input: undefined;
        output: null;
        errorShape: any;
    }>;
};
export type OurStorageRouter = typeof storageRouter;
