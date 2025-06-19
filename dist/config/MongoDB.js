"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = connectDB;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const uri = process.env.MONGODB_URI;
if (!uri) {
    throw new Error('❌ Thiếu biến MONGODB_URI trong .env');
}
async function connectDB() {
    try {
        await mongoose_1.default.connect(uri);
        console.log('✅ Đã kết nối MongoDB thành công');
    }
    catch (err) {
        console.error('❌ Kết nối MongoDB thất bại:', err);
        process.exit(1);
    }
}
