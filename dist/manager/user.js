"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = createUser;
exports.getUserByUsername = getUserByUsername;
// src/manager/user.ts
const user_1 = __importDefault(require("../models/user"));
const bcrypt_1 = __importDefault(require("bcrypt"));
async function createUser(input) {
    try {
        // 1) Check trùng email & username
        if (await user_1.default.exists({ email: input.email })) {
            return { status: false, message: 'EMAIL_ALREADY_EXISTS', statusCode: 400 };
        }
        if (await user_1.default.exists({ username: input.username })) {
            return { status: false, message: 'USERNAME_ALREADY_EXISTS', statusCode: 400 };
        }
        // 2) Hash password
        const salt = await bcrypt_1.default.genSalt(10);
        const passwordHash = await bcrypt_1.default.hash(input.password, salt);
        // 3) Tạo document mới
        const newUser = new user_1.default({
            username: input.username,
            name: input.name,
            email: input.email,
            passwordHash,
            phone: input.phone,
            role: input.role || 'user',
        });
        // 4) Lưu xuống DB
        const saved = await newUser.save();
        // 5) Trả về data (toJSON đã loại bỏ passwordHash & __v)
        const { id, username, name, email, phone, role, createdAt } = saved.toJSON();
        return {
            status: true,
            message: 'USER_CREATED',
            data: { id, username, name, email, phone, role, createdAt },
            statusCode: 201,
        };
    }
    catch (err) {
        console.error('createUser error:', err);
        return {
            status: false,
            message: err.message || 'INTERNAL_ERROR',
            statusCode: 500,
        };
    }
}
/**
 * Tìm user theo username (không phải _id).
 */
async function getUserByUsername(username) {
    try {
        const userDoc = await user_1.default.findOne({ username }).select('-passwordHash');
        if (!userDoc) {
            return { status: false, message: 'USER_NOT_FOUND', statusCode: 404 };
        }
        const { id, username: u, name, email, phone, role, createdAt } = userDoc.toJSON();
        return {
            status: true,
            message: 'USER_FETCHED',
            data: { id, username: u, name, email, phone, role, createdAt },
            statusCode: 200,
        };
    }
    catch (err) {
        console.error('getUserByUsername error:', err);
        return {
            status: false,
            message: err.message || 'INTERNAL_ERROR',
            statusCode: 500,
        };
    }
}
exports.default = {
    createUser,
    getUserByUsername
};
