"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const auth_1 = __importDefault(require("../manager/auth"));
const Response_1 = __importDefault(require("../utils/Response"));
const login = {
    tags: ['api', 'Auth'],
    description: 'Đăng nhập',
    auth: false,
    validate: {
        payload: joi_1.default.object({
            username: joi_1.default.string().required().description('Tên đăng nhập'),
            password: joi_1.default.string().required().description('Mật khẩu'),
        }),
    },
    handler: async (req, h) => {
        const result = await auth_1.default.login(req);
        return (0, Response_1.default)(result, h);
    },
};
const logout = {
    tags: ['api', 'Auth'],
    description: 'Đăng xuất (invalide token phía client)',
    notes: 'Client chỉ cần xóa token lưu trên localStorage/sessionStorage',
    auth: 'jwt',
    plugins: {
        'hapi-swagger': {
            security: [{ Bearer: [] }] // <-- Đổi từ Jwt thành Bearer
        }
    },
    handler: async (req, h) => {
        // Nếu cần blacklist, gọi Auth.logout ở đây
        return h
            .response({ status: true, message: 'Đã đăng xuất' })
            .code(200);
    },
};
const getUserMe = {
    tags: ['api', 'Auth'],
    description: 'Lấy thông tin user đang login',
    auth: 'jwt',
    plugins: {
        'hapi-swagger': {
            security: [{ Bearer: [] }] // <-- Đồng bộ với securityDefinitions
        }
    },
    handler: async (request, h) => {
        const userId = request.auth.credentials.user.id;
        const result = await auth_1.default.getMe(userId);
        return h.response(result).code(200);
    },
};
exports.default = { login, logout, getUserMe };
