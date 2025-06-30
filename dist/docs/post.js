"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePostDoc = exports.putPost = exports.postPost = exports.getSinglePost = exports.getAllPosts = void 0;
const joi_1 = __importDefault(require("joi"));
const Response_1 = __importDefault(require("../utils/Response"));
const post_1 = require("../manager/post");
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
            provinceCode: joi_1.default.string().required(),
            provinceName: joi_1.default.string().required(),
            districtCode: joi_1.default.string().required(),
            districtName: joi_1.default.string().required(),
            wardCode: joi_1.default.string().required(),
            wardName: joi_1.default.string().required(),
            street: joi_1.default.string().allow(''),
            images: joi_1.default.array()
                .items(joi_1.default.object({
                url: joi_1.default.string().uri().required(),
                contentType: joi_1.default.string().required()
            }))
                .min(1)
                .required()
        })
    },
    handler: async (req, h) => {
        const p = req.payload;
        // Build payload theo IPost
        const body = {
            title: p.title,
            description: p.description || '',
            propertyType: p.propertyType,
            price: p.price,
            area: p.area,
            address: {
                provinceCode: p.provinceCode,
                provinceName: p.provinceName,
                districtCode: p.districtCode,
                districtName: p.districtName,
                wardCode: p.wardCode,
                wardName: p.wardName,
                street: p.street || ''
            },
            images: p.images.map(img => ({
                url: img.url,
                contentType: img.contentType
            }))
        };
        const result = await (0, post_1.createPost)(body);
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
        // chỉ validate kiểu object, cho phép bất kỳ key nào
        payload: joi_1.default.object().unknown(true)
    },
    handler: async (req, h) => {
        // Bỏ luôn chuyện validate nội dung, chỉ cast payload thành Partial<IPost>
        const updates = req.payload;
        // Gọi manager với dto linh hoạt
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
        const result = await (0, post_1.deletePost)(req.params.id);
        return (0, Response_1.default)(result, h);
    }
};
