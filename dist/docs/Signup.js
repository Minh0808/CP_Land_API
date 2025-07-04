"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signupPost = exports.signupHealth = void 0;
const joi_1 = __importDefault(require("joi"));
const Response_1 = __importDefault(require("../utils/Response"));
const Signup_1 = __importDefault(require("../manager/Signup"));
exports.signupHealth = {
    tags: ['api', 'Signup'],
    description: 'Health check for signup service',
    auth: false,
    handler: async (_req, h) => {
        const result = await Signup_1.default.health();
        return h.response(result).code(result.statusCode);
    }
};
exports.signupPost = {
    tags: ['api', 'Signup'],
    description: 'Người dùng đăng ký nhận thông tin',
    auth: false,
    validate: {
        payload: joi_1.default.object({
            name: joi_1.default.string().required().description('Tên người dùng'),
            email: joi_1.default.string().email().required().description('Email của user'),
            phone: joi_1.default.string().required().description('Số điện thoại')
        })
    },
    handler: async (req, h) => {
        const { name, email, phone } = req.payload;
        const result = await Signup_1.default.register(name, email, phone);
        return (0, Response_1.default)(result, h);
    }
};
