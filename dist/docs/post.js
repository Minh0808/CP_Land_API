"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePostDoc = exports.putPost = exports.postPost = exports.getSinglePost = exports.getAllPosts = void 0;
const joi_1 = __importDefault(require("joi"));
const Response_1 = __importDefault(require("../utils/Response"));
const post_1 = require("../manager/post");
const upload_1 = require("../manager/upload");
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
            payloadType: 'json',
            consumes: ['application/json'],
            produces: ['application/json']
        }
    },
    payload: {
        parse: true,
        multipart: false,
        maxBytes: 20000000
    },
    validate: {
        payload: joi_1.default.object({
            title: joi_1.default.string().required(),
            description: joi_1.default.string().allow(''),
            propertyType: joi_1.default.string().required(),
            price: joi_1.default.number().required(),
            area: joi_1.default.number().required(),
            address: joi_1.default.object({
                provinceCode: joi_1.default.string().required(),
                provinceName: joi_1.default.string().required(),
                districtCode: joi_1.default.string().required(),
                districtName: joi_1.default.string().required(),
                wardCode: joi_1.default.string().required(),
                wardName: joi_1.default.string().required(),
                street: joi_1.default.string().allow(''),
            }).required(),
            images: joi_1.default.array()
                .items(joi_1.default.object({
                url: joi_1.default.string().uri().required(),
                key: joi_1.default.string().required(),
                contentType: joi_1.default.string().required()
            }))
                .min(1)
                .max(10)
                .required()
        })
    },
    handler: async (req, h) => {
        const p = req.payload;
        const result = await (0, post_1.createPost)(p);
        return (0, Response_1.default)(result, h);
    }
};
exports.putPost = {
    tags: ['api', 'Posts'],
    description: 'Cập nhật bất kỳ trường nào của bài đăng',
    auth: false,
    plugins: {
        'hapi-swagger': {
            payloadType: 'json',
            consumes: ['application/json'],
            produces: ['application/json']
        }
    },
    payload: {
        parse: true,
        multipart: false,
        maxBytes: 20000000
    },
    validate: {
        params: joi_1.default.object({
            id: joi_1.default.string().length(24).required().description('ID của bài đăng')
        }),
        payload: joi_1.default.object().unknown(true)
    },
    handler: async (req, h) => {
        const updates = req.payload;
        const { data: post } = await (0, post_1.getPost)(req.params.id);
        if (!post)
            return (0, Response_1.default)({ message: 'Post not found' }, h);
        if (Array.isArray(updates.images)) {
            const newKeys = new Set(updates.images.map((image) => image.key));
            const oldKeys = post.images.map((image) => image.key);
            const deleteKeys = oldKeys.filter(key => !newKeys.has(key));
            if (deleteKeys.length > 0)
                await (0, upload_1.deleteUpload)(deleteKeys);
        }
        const result = await (0, post_1.updatePost)(req.params.id, updates);
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
        const { data: post } = await (0, post_1.getPost)(req.params.id);
        if (!post)
            return (0, Response_1.default)({ message: 'Post not found' }, h);
        if (post.images.length > 0) {
            const deleteKeys = post.images.map((image) => image.key);
            if (deleteKeys.length > 0)
                await (0, upload_1.deleteUpload)(deleteKeys);
        }
        const result = await (0, post_1.deletePost)(req.params.id);
        return (0, Response_1.default)(result, h);
    }
};
