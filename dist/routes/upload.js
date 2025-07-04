"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const upload_1 = require("../docs/upload");
const uploadRoutes = [
    {
        method: 'POST',
        path: '/api/upload',
        options: upload_1.postUploadOptions,
    },
    {
        method: 'DELETE',
        path: '/api/upload',
        options: upload_1.deleteUploadOptions,
    }
];
exports.default = uploadRoutes;
