"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePostDoc = exports.putPost = exports.postPost = exports.getSinglePost = exports.getAllPosts = void 0;
const joi_1 = __importDefault(require("joi"));
const Response_1 = __importDefault(require("../utils/Response"));
const post_1 = require("../manager/post");
const post_2 = require("../models/post");
exports.getAllPosts = {
    tags: ['api', 'Posts'],
    description: 'Lấy danh sách tất cả bài đăng',
    auth: false,
    handler: async (_req, h) => {
        const result = await (0, post_1.listPosts)();
        return (0, Response_1.default)(result, h);
    }
};
exports.getSinglePost = {
    tags: ['api', 'Posts'],
    description: 'Lấy chi tiết bài đăng theo ID',
    auth: false,
    validate: {
        params: joi_1.default.object({
            id: joi_1.default.string().length(24).required().description('ID của bài đăng')
        })
    },
    handler: async (req, h) => {
        const result = await (0, post_1.getPost)(req.params.id);
        return (0, Response_1.default)(result, h);
    }
};
exports.postPost = {
    tags: ['api', 'Posts'],
    description: 'Tạo bài đăng mới',
    auth: false,
    plugins: {
        'hapi-swagger': {
            payloadType: 'form',
            consumes: ['multipart/form-data'],
            produces: ['application/json']
        }
    },
    payload: {
        parse: true,
        multipart: true,
        output: 'stream',
        maxBytes: 20000000
    },
    handler: async (req, h) => {
        const p = req.payload;
        // 1) Validate bắt buộc
        const required = [
            'title', 'propertyType', 'price', 'area',
            'provinceCode', 'districtCode', 'wardCode', 'images'
        ];
        const missing = required.find(k => p[k] == null);
        if (missing) {
            return h.response({ status: false, message: `MISSING_${missing}` }).code(400);
        }
        // 2) Convert streams → IImage[]
        const raws = Array.isArray(p.images)
            ? p.images
            : [p.images];
        const images = await Promise.all(raws.map(async (fs) => ({
            data: await (0, post_2.streamToBuffer)(fs),
            contentType: fs.hapi.headers['content-type']
        })));
        // 3) Build payload theo IPost
        const body = {
            title: p.title,
            description: p.description || '',
            propertyType: p.propertyType,
            price: Number(p.price),
            area: Number(p.area),
            address: {
                provinceCode: p.provinceCode,
                provinceName: p.provinceName,
                districtCode: p.districtCode,
                districtName: p.districtName,
                wardCode: p.wardCode,
                wardName: p.wardName,
                street: p.street || ''
            },
            images
        };
        const result = await (0, post_1.createPost)(body);
        return (0, Response_1.default)(result, h);
    }
};
exports.putPost = {
    tags: ['api', 'Posts'],
    description: 'Cập nhật bài đăng',
    auth: false,
    plugins: {
        'hapi-swagger': {
            payloadType: 'form',
            consumes: ['multipart/form-data'],
            produces: ['application/json']
        }
    },
    payload: {
        parse: true,
        multipart: true,
        output: 'stream',
        maxBytes: 20000000
    },
    validate: {
        params: joi_1.default.object({
            id: joi_1.default.string().length(24).required().description('ID của bài đăng')
        })
    },
    handler: async (req, h) => {
        const p = req.payload;
        let images;
        if (p.images) {
            const raws = Array.isArray(p.images)
                ? p.images
                : [p.images];
            images = await Promise.all(raws.map(async (fs) => ({
                data: await (0, post_2.streamToBuffer)(fs),
                contentType: fs.hapi.headers['content-type']
            })));
        }
        const dto = {
            ...(p.title && { title: p.title }),
            ...(p.description && { description: p.description }),
            ...(p.propertyType && { propertyType: p.propertyType }),
            ...(p.price && { price: Number(p.price) }),
            ...(p.area && { area: Number(p.area) }),
            ...(p.provinceCode && {
                address: {
                    provinceCode: p.provinceCode,
                    provinceName: p.provinceName,
                    districtCode: p.districtCode,
                    districtName: p.districtName,
                    wardCode: p.wardCode,
                    wardName: p.wardName,
                    street: p.street || ''
                }
            }),
            ...(images && { images })
        };
        const result = await (0, post_1.updatePost)(req.params.id, dto);
        return (0, Response_1.default)(result, h);
    }
};
exports.deletePostDoc = {
    tags: ['api', 'Posts'],
    description: 'Xóa bài đăng theo ID',
    auth: false,
    validate: {
        params: joi_1.default.object({
            id: joi_1.default.string().length(24).required().description('ID của bài đăng')
        })
    },
    handler: async (req, h) => {
        const result = await (0, post_1.deletePost)(req.params.id);
        return (0, Response_1.default)(result, h);
    }
};
