"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postUploadOptions = void 0;
// src/docs/upload.swagger.ts
const joi_1 = __importDefault(require("joi"));
const upload_1 = require("../manager/upload");
exports.postUploadOptions = {
    tags: ['Upload'],
    description: 'Chuẩn bị upload: trả presigned URLs từ UploadThing',
    notes: 'Client gửi lên thông tin files, nhận về data.url và data.fields để upload',
    plugins: { 'hapi-swagger': { payloadType: 'json' } },
    payload: {
        maxBytes: 2 * 1024 * 1024,
        parse: true,
        output: 'data',
        allow: 'application/json',
    },
    validate: {
        payload: joi_1.default.object({
            files: joi_1.default.array()
                .items(joi_1.default.object({
                name: joi_1.default.string().required(),
                size: joi_1.default.number().required(),
                type: joi_1.default.string().required(),
                customId: joi_1.default.string().allow(null).required(),
            }))
                .required(),
            acl: joi_1.default.string().default('public-read'),
            metadata: joi_1.default.any().allow(null).default(null),
            contentDisposition: joi_1.default.string().default('inline'),
        }),
    },
    response: {
        status: {
            200: joi_1.default.object({
                data: joi_1.default.array().items(joi_1.default.object({
                    fileUrl: joi_1.default.string().uri(),
                    fileType: joi_1.default.string(),
                    fileName: joi_1.default.string(),
                    key: joi_1.default.string(),
                    url: joi_1.default.string().uri(),
                    fields: joi_1.default.object().pattern(/.*/, joi_1.default.string()),
                    pollingJwt: joi_1.default.string(),
                    pollingUrl: joi_1.default.string().uri(),
                    customId: joi_1.default.string().allow(null),
                })),
            }),
        },
    },
    // ← đây là handler gộp luôn vào docs
    handler: async (request, h) => {
        const { files, acl, metadata, contentDisposition } = request.payload;
        try {
            const result = await (0, upload_1.prepareUpload)(files, acl, metadata, contentDisposition);
            return h.response(result).code(200);
        }
        catch (err) {
            console.error(err);
            return h
                .response({ status: false, message: err.message })
                .code(err.message.startsWith('UploadThing Error') ? 502 : 500);
        }
    },
};
exports.default = exports.postUploadOptions;
