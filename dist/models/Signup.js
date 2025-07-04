"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/models/Signup.ts
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = require("mongoose");
const nodemailer_1 = __importDefault(require("nodemailer"));
dotenv_1.default.config();
// Tạo transporter cho Gmail (không bật logger/debug)
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MANAGE_EMAIL,
        pass: process.env.EMAIL_PASS
    }
});
// Định nghĩa schema
const signupSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true }
}, {
    timestamps: { createdAt: true, updatedAt: false }
});
// Hook gửi mail sau khi save, không in log
signupSchema.post('save', async function (doc) {
    try {
        const signupTime = doc.createdAt.toLocaleString('vi-VN', {
            timeZone: 'Asia/Ho_Chi_Minh',
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit', second: '2-digit',
            hour12: false
        });
        await transporter.sendMail({
            from: `"CP Land Website" <${process.env.MANAGE_EMAIL}>`,
            to: process.env.ADMIN_EMAIL,
            subject: '📣 New Signup from Website',
            html: `
        <h3>Người dùng mới đăng ký:</h3>
        <p><strong>Ten:</strong> ${doc.name}</p>
        <p><strong>Email:</strong> ${doc.email}</p>
        <p><strong>SĐT:</strong> ${doc.phone}</p>
        <p><em>Thời gian:</em> ${signupTime}</p>
      `
        });
    }
    catch {
        // lỗi gửi mail sẽ bị silent fail
    }
});
exports.default = (0, mongoose_1.model)('Signup', signupSchema);
