"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createToken;
// src/utils/token.ts
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// 1) Secret key
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';
// 2) Lấy expiresIn từ env, ép kiểu về SignOptions['expiresIn']
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || '1h');
function createToken(payload) {
    const options = {
        algorithm: 'HS256', // khai báo rõ thuật toán
        expiresIn: JWT_EXPIRES_IN, // đã được ép kiểu đúng union
    };
    try {
        const token = jsonwebtoken_1.default.sign(payload, JWT_SECRET, options);
        return token;
    }
    catch (err) {
        // Thống kê lỗi lên console để debug
        console.error('❌ Error when signing JWT:', err);
        // Tùy bạn: có thể re-throw để cho upper layer bắt tiếp
        throw err;
        // Hoặc trả về chuỗi rỗng / null / mã lỗi tùy cách xử lý của bạn
    }
}
