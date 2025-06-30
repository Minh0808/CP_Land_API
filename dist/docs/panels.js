"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePanelDoc = exports.putPanel = exports.postPanel = exports.getPanels = void 0;
const joi_1 = __importDefault(require("joi"));
const panels_1 = __importDefault(require("../manager/panels"));
exports.getPanels = {
    tags: ['api', 'Panels'],
    description: 'Lấy danh sách toàn bộ panels',
    auth: false,
    handler: async (_req, h) => {
        const result = await panels_1.default.listPanels();
        return h.response(result).code(result.statusCode);
    }
};
exports.postPanel = {
    tags: ['api', 'Panels'],
    description: 'Tạo mới một panel (chỉ nhận URL từ UploadThing)',
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
    },
    validate: {
        payload: joi_1.default.object({
            image_url: joi_1.default.string().uri().required()
                .description('URL của ảnh, lấy từ UploadThing frontend'),
            sort_order: joi_1.default.number().integer().optional()
                .description('Thứ tự panel (nếu không gửi, tự cấp +1)')
        })
    },
    handler: async (req, h) => {
        const payload = req.payload;
        const result = await panels_1.default.createPanel(payload);
        return h.response(result).code(result.statusCode);
    }
};
exports.putPanel = {
    tags: ['api', 'Panels'],
    description: 'Cập nhật panel theo ID (chỉ nhận URL mới)',
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
    },
    validate: {
        params: joi_1.default.object({
            id: joi_1.default.string().length(24).required().description('ID của panel')
        }),
        payload: joi_1.default.object({
            image_url: joi_1.default.string().uri().required()
                .description('URL của ảnh mới, lấy từ UploadThing frontend'),
            sort_order: joi_1.default.number().integer().optional()
                .description('Thứ tự mới (nếu muốn cập nhật)')
        })
    },
    handler: async (req, h) => {
        const id = req.params.id;
        const payload = req.payload;
        const result = await panels_1.default.updatePanel(id, payload);
        return h.response(result).code(result.statusCode);
    }
};
exports.deletePanelDoc = {
    tags: ['api', 'Panels'],
    description: 'Xóa panel theo ID',
    auth: false,
    validate: {
        params: joi_1.default.object({
            id: joi_1.default.string().length(24).required().description('ID của panel cần xóa')
        })
    },
    handler: async (req, h) => {
        const id = req.params.id;
        const result = await panels_1.default.deletePanel(id);
        return h.response(result).code(result.statusCode);
    }
};
