"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("../models/user"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const token_1 = __importDefault(require("../utils/token"));
// Hàm login: tìm user, so khớp mật khẩu, sinh và trả JWT
async function login(req) {
    try {
        const { username, password } = req.payload;
        // 1) Tìm user theo username
        const user = await user_1.default.findOne({ username });
        if (!user) {
            return { status: false, message: 'INVALID_USERNAME', statusCode: 400 };
        }
        // 2) So khớp mật khẩu
        const isMatch = await bcrypt_1.default.compare(password, user.passwordHash);
        if (!isMatch) {
            return { status: false, message: 'INVALID_PASSWORD', statusCode: 400 };
        }
        // 3) Chuẩn bị payload và sinh token
        const payload = {
            user: {
                id: user._id,
                username: user.username,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
            }
        };
        let jwt;
        try {
            jwt = (0, token_1.default)(payload);
        }
        catch (err) {
            console.error('❌ Error generating JWT in Auth.login:', err);
            return { status: false, message: 'TOKEN_GENERATION_FAILED', statusCode: 500 };
        }
        // 4) Trả về kết quả
        return {
            status: true,
            message: 'SUCCESS_LOGIN',
            data: { token: jwt, user: payload.user },
            statusCode: 200,
        };
    }
    catch (err) {
        console.error('❌ Unexpected error in Auth.login:', err);
        return { status: false, message: err.message || 'INTERNAL_SERVER_ERROR', statusCode: 500 };
    }
}
// Hàm getMe: lấy thông tin user từ database
async function getMe(userId) {
    try {
        const user = await user_1.default.findById(userId).select('-passwordHash');
        if (!user) {
            return { status: false, message: 'USER_NOT_FOUND', statusCode: 404 };
        }
        const { _id, username, name, email, phone, role, createdAt } = user;
        return {
            status: true,
            message: 'USER_FETCHED',
            data: { id: _id, username, name, email, phone, role, createdAt },
            statusCode: 200,
        };
    }
    catch (err) {
        console.error('❌ Error in Auth.getMe:', err);
        return { status: false, message: err.message || 'INTERNAL_ERROR', statusCode: 500 };
    }
}
// Hàm logout: client tự xóa token, hoặc blacklist nếu cần
async function logout(req) {
    return {
        status: true,
        message: 'SUCCESS_LOGOUT',
        statusCode: 200,
    };
}
exports.default = { login, getMe, logout };
