"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUploadOptions = exports.postUploadOptions = void 0;
const joi_1 = __importDefault(require("joi"));
const upload_1 = require("../manager/upload");
const upload_2 = require("../manager/upload"); // nhớ import hàm xoá
/**
 * POST /api/upload
 * Chuẩn bị và upload file, trả về URL public
 */
exports.postUploadOptions = {
    tags: ['api', 'Upload'],
    description: 'Chuẩn bị và upload file, trả về URL public',
    auth: false,
    notes: 'Client gửi lên file, server trả về URL public sau khi upload xong',
    plugins: {
        'hapi-swagger': {
            payloadType: 'form',
            consumes: ['multipart/form-data'],
            produces: ['application/json'],
        },
    },
    payload: {
        maxBytes: 4 * 1024 * 1024,
        output: 'file',
        parse: true,
        multipart: true,
    },
    validate: {
        payload: joi_1.default.object({
            file: joi_1.default.any()
                .meta({ swaggerType: 'file' })
                .required()
                .description('Ảnh cần upload'),
        }).required(),
        failAction: (_request, _h, err) => {
            throw err;
        },
    },
    response: {
        status: {
            200: joi_1.default.object({
                url: joi_1.default.string().uri().required().description('URL public của file đã upload'),
                key: joi_1.default.string().required().description('Key của file trong UploadThing')
            }).label('UploadResponse'),
        },
    },
    handler: async (request, h) => {
        const raw = request.payload;
        const file = raw.file;
        if (!file?.path) {
            return h.response({ error: 'No file received' }).code(400);
        }
        try {
            // 1) Prepare
            const prepareList = [{
                    name: file.filename,
                    size: file.bytes,
                    type: file.headers['content-type'],
                    customId: null,
                }];
            const { data } = await (0, upload_1.prepareUpload)(prepareList);
            // 2) Upload
            const uploaded = await (0, upload_1.uploadFile)(data[0], file.path);
            // 3) Trả về URL + key + jwt
            return h.response({
                url: data[0].fileUrl,
                key: data[0].key
            }).code(200);
        }
        catch (err) {
            console.error('❌ POST /api/upload failed:', err);
            return h
                .response({ success: false, message: err.message })
                .code(500);
        }
    }
};
/**
 * DELETE /api/upload
 * Xóa một file đã upload trên UploadThing
 */
exports.deleteUploadOptions = {
    tags: ['api', 'Upload'],
    description: 'Xóa một file đã upload trên UploadThing',
    auth: false,
    plugins: {
        'hapi-swagger': {
            payloadType: 'json',
            consumes: ['application/json'],
            produces: ['application/json'],
        },
    },
    payload: {
        parse: true,
        multipart: false,
    },
    validate: {
        payload: joi_1.default.object({
            fileKeys: joi_1.default.array().items(joi_1.default.string().required()).min(1).required().description('Mảng key của các file cần xóa'),
        }).required(),
    },
    handler: async (req, h) => {
        const { fileKeys } = req.payload;
        try {
            const deletedCount = await (0, upload_2.deleteUpload)(fileKeys);
            return h.response({ success: true, deletedCount }).code(200);
        }
        catch (err) {
            console.error('❌ DeleteUpload Error:', err);
            return h
                .response({ success: false, message: err.message })
                .code(err.message.includes('404') ? 404 : 502);
        }
    }
};
exports.default = { postUploadOptions: exports.postUploadOptions, deleteUploadOptions: exports.deleteUploadOptions };
