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
    description: 'Tạo mới một panel',
    auth: false,
    plugins: {
        'hapi-swagger': {
            payloadType: 'form',
            consumes: ['multipart/form-data'],
            produces: ['application/json'],
        }
    },
    payload: {
        allow: ['application/json', 'multipart/form-data'],
        parse: true,
        multipart: true,
        output: 'stream',
        maxBytes: 10 * 1024 * 1024, // 10MB
    },
    validate: {
        payload: joi_1.default.object({
            // Nếu client nhập thẳng URL
            image_url: joi_1.default.string()
                .uri()
                .optional()
                .description('URL của ảnh (nếu không upload file)'),
            // Nếu client upload file
            file: joi_1.default.any()
                .meta({ swaggerType: 'file' })
                .optional()
                .description('Upload file ảnh'),
            sort_order: joi_1.default.number()
                .optional()
                .description('Thứ tự panel (nếu không gửi, hệ thống tự cấp +1)')
        })
            .or('image_url', 'file') // phải có ít nhất 1 trong 2
    },
    handler: async (req, h) => {
        const result = await panels_1.default.createPanel(req.payload);
        return h.response(result).code(result.statusCode);
    }
};
exports.putPanel = {
    tags: ['api', 'Panels'],
    description: 'Cập nhật panel theo ID',
    auth: false,
    validate: {
        params: joi_1.default.object({
            id: joi_1.default.string().length(24).required().description('ID của panel')
        }),
        payload: joi_1.default.object({
            image_url: joi_1.default.string().required().description('URL của ảnh mới'),
            sort_order: joi_1.default.number().integer().required().description('Thứ tự mới')
        })
    },
    handler: async (req, h) => {
        const id = req.params.id;
        const result = await panels_1.default.updatePanel(req.payload, id);
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
// export default {
//   name:     'panels-docs',
//   register: async (server: any) => {
//     server.route([
//       { method: 'GET',    path: '/api/panels',      options: getPanels },
//       { method: 'POST',   path: '/api/panels',      options: postPanel },
//       { method: 'PUT',    path: '/api/panels/{id}', options: putPanel },
//       { method: 'DELETE', path: '/api/panels/{id}', options: deletePanelDoc }
//     ]);
//   }
// };
