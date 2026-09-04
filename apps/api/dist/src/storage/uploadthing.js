"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storageRouter = void 0;
const express_1 = require("uploadthing/express");
const f = (0, express_1.createUploadthing)();
exports.storageRouter = {
    bucketUploader: f({
        blob: {
            maxFileSize: '512MB',
            maxFileCount: 10,
        },
    }).onUploadComplete((data) => {
        console.log('UploadThing upload complete:', data.file.name);
    }),
};
//# sourceMappingURL=uploadthing.js.map