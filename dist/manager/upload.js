"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepareUpload = prepareUpload;
exports.uploadFile = uploadFile;
exports.deleteUpload = deleteUpload;
// src/manager/upload.ts
const undici_1 = require("undici");
const form_data_1 = __importDefault(require("form-data"));
const fs_1 = __importDefault(require("fs"));
const util_1 = require("util");
const API_ENDPOINT = 'https://api.uploadthing.com/v6/uploadFiles';
const API_DELETE = 'https://api.uploadthing.com/v6/deleteFiles';
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
        let errBody;
        try {
            errBody = await res.body.json();
        }
        catch {
            errBody = await res.body.text();
        }
        throw new Error(`UploadThing Error [${res.statusCode}]: ${typeof errBody === 'string' ? errBody : JSON.stringify(errBody)}`);
    }
    return res.body.json();
}
/**
 * Thực upload file lên presigned URL.
 * @param item Một phần tử từ result.data
 * @param filePath Đường dẫn tới file tạm
 */
async function uploadFile(item, filePath) {
    const form = new form_data_1.default();
    // 1) đính kèm tất cả các field presigned
    for (const [k, v] of Object.entries(item.fields)) {
        form.append(k, v);
    }
    // 2) đính kèm file
    form.append('file', fs_1.default.createReadStream(filePath), {
        filename: item.fileName,
        contentType: item.fileType,
        knownLength: fs_1.default.statSync(filePath).size, // cho form-data biết độ dài file
    });
    // 3) tính tổng Content-Length
    const getLength = (0, util_1.promisify)(form.getLength.bind(form));
    const length = await getLength();
    // 4) dựng headers, bao gồm Content-Type và Content-Length
    const headers = {
        ...form.getHeaders(), // multipart/form-data; boundary=...
        'Content-Length': String(length), // chiều dài toàn bộ body
    };
    // 5) gửi request
    const res = await (0, undici_1.request)(item.url, {
        method: 'POST',
        headers,
        body: form, // undici chấp nhận stream
    });
    if (res.statusCode >= 400) {
        const text = await res.body.text();
        throw new Error(`S3 Upload Error [${res.statusCode}]: ${text}`);
    }
    // thành công, trả về URL public
    return item.fileUrl;
}
async function deleteUpload(keys) {
    // body theo spec: bạn chỉ cần truyền fileKeys (và nếu muốn customIds)
    const body = {
        fileKeys: keys
    };
    const res = await (0, undici_1.request)(API_DELETE, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Uploadthing-Api-Key': API_KEY,
            'X-Uploadthing-Version': '6.4.0',
        },
        body: JSON.stringify(body),
    });
    if (res.statusCode >= 400) {
        const text = await res.body.text();
        throw new Error(`UploadThing Delete Error [${res.statusCode}]: ${text}`);
    }
    // payload ví dụ: { success: true, deletedCount: 1 }
    const data = await res.body.json();
    if (!data.success) {
        throw new Error(`UploadThing Delete Error: deletedCount=${data.deletedCount}`);
    }
    return data.deletedCount;
}
