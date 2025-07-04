"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/manager/Signup.ts
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const Signup_1 = __importDefault(require("../models/Signup"));
/**
 * Health check cho dịch vụ signup
 */
function health() {
    return { status: true, message: 'Signup service ready', statusCode: 200 };
}
async function register(name, email, phone) {
    try {
        // Chỉ lưu document mới; hook post-save sẽ gửi mail
        const doc = (await Signup_1.default.create({ name, email, phone }));
        const data = {
            name: doc.name,
            email: doc.email,
            phone: doc.phone,
            createdAt: doc.createdAt
        };
        return { status: true, message: 'Đăng ký thành công.', data, statusCode: 200 };
    }
    catch (err) {
        console.error('[Signup] register error:', err);
        return { status: false, message: err.message || 'CREATE_ERROR', statusCode: 500 };
    }
}
exports.default = { health, register };
