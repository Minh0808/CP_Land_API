"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userMessPost = exports.userMessHealth = void 0;
const joi_1 = __importDefault(require("joi"));
const Response_1 = __importDefault(require("../utils/Response"));
const useMess_1 = __importDefault(require("../manager/useMess"));
exports.userMessHealth = {
    tags: ['api', 'Messager'],
    description: 'Health check for signup service',
    auth: false,
    handler: async (_req, h) => {
        const result = await useMess_1.default.health();
        return h.response(result).code(result.statusCode);
    }
};
exports.userMessPost = {
    tags: ['api', 'Messager'],
    description: 'Người dùng đăng ký nhận thông tin',
    auth: false,
    validate: {
        payload: joi_1.default.object({
            name: joi_1.default.string().required().description('Tên người dùng'),
            email: joi_1.default.string().email().required().description('Email của user'),
            phone: joi_1.default.string().required().description('Số điện thoại'),
            messager: joi_1.default.string().required().description('Nội dung người dùng gửi')
        })
    },
    handler: async (req, h) => {
        const { name, email, phone, messager } = req.payload;
        const result = await useMess_1.default.register(name, email, phone, messager);
        return (0, Response_1.default)(result, h);
    }
};
