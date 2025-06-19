"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const user_1 = __importDefault(require("../manager/user"));
const createUser = {
    tags: ['api', 'User'],
    description: 'Tạo người dùng mới',
    auth: false,
    validate: {
        payload: joi_1.default.object({
            username: joi_1.default.string().required().description('Tên dăng nhập người dụng'),
            name: joi_1.default.string().required().description('Tên người dụng'),
            email: joi_1.default.string().email().required().description('Email người dụng'),
            phone: joi_1.default.string().required().description('Sđt người dụng'),
            password: joi_1.default.string().min(6).required().description('Mật khảu người dụng'),
            role: joi_1.default.string().optional().description('Quyền người dụng')
        }),
    },
    handler: async (request, h) => {
        const result = await user_1.default.createUser(request.payload);
        return h.response(result).code(201);
    },
};
const getUser = {
    tags: ['api', 'User'],
    description: 'Lấy thông tin user theo username',
    auth: 'jwt',
    plugins: {
        'hapi-swagger': {
            security: [{ Bearer: [] }] // <-- Đổi từ Jwt thành Bearer
        }
    },
    validate: {
        params: joi_1.default.object({
            username: joi_1.default.string().min(3).max(30).required().description('Username của user')
        })
    },
    handler: async (request, h) => {
        const { username } = request.params;
        const result = await user_1.default.getUserByUsername(username);
        return h.response(result).code(200);
    }
};
exports.default = { createUser, getUser };
