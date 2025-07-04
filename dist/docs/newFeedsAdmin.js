"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNewFeedById = exports.updateNewFeedById = exports.getNewFeedById = exports.listNewFeeds = exports.createNewFeeds = void 0;
const joi_1 = __importDefault(require("joi"));
const newFeedsAdmin_1 = __importDefault(require("../manager/newFeedsAdmin"));
// POST /api/newFeeds
exports.createNewFeeds = {
    auth: false,
    tags: ['api', 'NewFeeds'],
    description: 'Tạo bài đăng kèm upload ảnh/video',
    payload: {
        allow: ['application/json', 'multipart/form-data'],
        multipart: true,
        parse: true,
        output: 'data',
        maxBytes: 20 * 1024 * 1024,
    },
    validate: {
        payload: joi_1.default.object({
            title: joi_1.default.string().required().description('Tiêu đề bài viết'),
            excerpt: joi_1.default.string().required().description('Đoạn tóm tắt ngắn'),
            content: joi_1.default.string().required().description('Nội dung HTML của bài viết'),
            media: joi_1.default.alternatives()
                .try(joi_1.default.string(), joi_1.default.array().items(joi_1.default.object({ key: joi_1.default.string().required(), url: joi_1.default.string().uri().required(), type: joi_1.default.string().valid('image', 'video').required() })))
                .default('[]')
                .description('Mảng media hoặc JSON-string'),
            publishedAt: joi_1.default.date().optional().description('Ngày đăng'),
            category: joi_1.default.string().optional().description('Chủ đề hoặc phân loại'),
        }).unknown(false),
        failAction: 'error'
    },
    handler: async (request, h) => {
        const payload = request.payload;
        let mediaArr = [];
        if (typeof payload.media === 'string') {
            try {
                mediaArr = JSON.parse(payload.media);
            }
            catch {
                return h.response({ message: 'Invalid media JSON' }).code(400);
            }
        }
        else {
            mediaArr = payload.media;
        }
        const dto = {
            title: payload.title,
            excerpt: payload.excerpt,
            content: payload.content,
            media: mediaArr,
            publishedAt: payload.publishedAt ? new Date(payload.publishedAt) : undefined,
            category: payload.category,
        };
        const result = await newFeedsAdmin_1.default.postNewFeeds(dto);
        return h.response(result.status ? result.data : { message: result.message }).code(result.statusCode);
    }
};
// GET /api/newFeeds
exports.listNewFeeds = {
    auth: false,
    tags: ['api', 'NewFeeds'],
    description: 'Lấy danh sách tất cả bài đăng',
    response: {
        status: {
            200: joi_1.default.array().items(joi_1.default.object({
                id: joi_1.default.string().required(),
                title: joi_1.default.string().required(),
                excerpt: joi_1.default.string().required(),
                content: joi_1.default.string().required(),
                media: joi_1.default.array().items(joi_1.default.object({ key: joi_1.default.string().required(), url: joi_1.default.string().uri().required(), type: joi_1.default.string().valid('image', 'video').required() })).required(),
                publishedAt: joi_1.default.date().required(),
                category: joi_1.default.string().required(),
            }))
        },
        failAction: (request, h, err) => { console.error('🛑 listNewFeeds validation error:', err); throw err; }
    },
    handler: async (_request, h) => {
        const result = await newFeedsAdmin_1.default.fetchNewFeeds();
        return h.response(result.status ? result.data : { message: result.message }).code(result.statusCode);
    }
};
// GET /api/newFeeds/{id}
exports.getNewFeedById = {
    auth: false,
    tags: ['api', 'NewFeeds'],
    description: 'Lấy chi tiết bài đăng theo ID',
    validate: { params: joi_1.default.object({ id: joi_1.default.string().length(24).hex().required() }), failAction: 'error' },
    response: {
        status: {
            200: joi_1.default.object({
                id: joi_1.default.string().required(),
                title: joi_1.default.string().required(),
                excerpt: joi_1.default.string().required(),
                content: joi_1.default.string().required(),
                media: joi_1.default.array().items(joi_1.default.object({ key: joi_1.default.string().required(), url: joi_1.default.string().uri().required(), type: joi_1.default.string().valid('image', 'video').required() })).required(),
                publishedAt: joi_1.default.date().required(),
                category: joi_1.default.string().required(),
            }),
            404: joi_1.default.object({ message: joi_1.default.string().required() })
        },
        failAction: (request, h, err) => { console.error('🛑 getNewFeedById validation error:', err); throw err; }
    },
    handler: async (request, h) => {
        const { id } = request.params;
        const result = await newFeedsAdmin_1.default.fetchNewFeedById(id);
        return h.response(result.status ? result.data : { message: result.message }).code(result.statusCode);
    }
};
// PUT /api/newFeeds/{id}
exports.updateNewFeedById = {
    auth: false,
    tags: ['api', 'NewFeeds'],
    description: 'Cập nhật nội dung hoặc media của bài đăng',
    validate: {
        params: joi_1.default.object({ id: joi_1.default.string().length(24).hex().required() }),
        payload: joi_1.default.object({
            content: joi_1.default.string().optional(),
            media: joi_1.default.alternatives()
                .try(joi_1.default.string(), joi_1.default.array().items(joi_1.default.object({
                key: joi_1.default.string().required(),
                url: joi_1.default.string().uri().required(),
                type: joi_1.default.string().valid('image', 'video').required()
            })))
                .optional()
        }).unknown(false),
        failAction: 'error'
    },
    handler: async (request, h) => {
        const { id } = request.params;
        const raw = request.payload;
        let mediaArr;
        if (raw.media !== undefined) {
            mediaArr = typeof raw.media === 'string'
                ? JSON.parse(raw.media)
                : raw.media;
        }
        const dto = {
            ...(raw.content && { content: raw.content }),
            ...(mediaArr && { media: mediaArr })
        };
        const res = await newFeedsAdmin_1.default.updateNewFeed(id, dto);
        return h
            .response(res.status ? res.data : { message: res.message })
            .code(res.statusCode);
    }
};
// DELETE /api/newFeeds/{id}
exports.deleteNewFeedById = {
    auth: false,
    tags: ['api', 'NewFeeds'],
    description: 'Xóa bài đăng theo ID',
    validate: {
        params: joi_1.default.object({ id: joi_1.default.string().length(24).hex().required() }),
        failAction: 'error'
    },
    handler: async (request, h) => {
        const { id } = request.params;
        const result = await newFeedsAdmin_1.default.deleteNewFeed(id);
        if (!result.status) {
            // lỗi 404 hoặc 500 → trả message
            return h.response({ message: result.message }).code(result.statusCode);
        }
        // thành công 204 → không có body
        return h.response().code(204);
    }
};
