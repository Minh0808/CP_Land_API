"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepareUpload = prepareUpload;
// src/manager/uploadthing.ts
const undici_1 = require("undici");
const API_ENDPOINT = 'https://api.uploadthing.com/v6/uploadFiles';
const API_KEY = process.env.UPLOADTHING_SECRET;
async function prepareUpload(files, acl = 'public-read', metadata = null, contentDisposition = 'inline') {
    const body = { files, acl, metadata, contentDisposition };
    const res = await (0, undici_1.request)(API_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-uploadthing-api-key': API_KEY,
            'x-uploadthing-version': '6.4.0',
            'x-uploadthing-be-adapter': 'hapi',
        },
        body: JSON.stringify(body),
    });
    if (res.statusCode >= 400) {
        const errBody = await res.body.text();
        throw new Error(`UploadThing Error [${res.statusCode}]: ${errBody}`);
    }
    return res.body.json();
}
