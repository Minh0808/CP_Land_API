"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/models/User.ts
const mongoose_1 = require("mongoose"); // ← giá trị import
const bcrypt_1 = __importDefault(require("bcrypt"));
const userSchema = new mongoose_1.Schema({
    username: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    phone: { type: String, required: true },
    role: { type: String, required: true, default: 'user', enum: ['user', 'admin'] },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform(_doc, ret) {
            delete ret.passwordHash;
            delete ret.__v;
        },
    },
    toObject: { virtuals: true }
});
// 2) Virtual field
userSchema.virtual('password').set(function (plain) {
    const salt = bcrypt_1.default.genSaltSync(10);
    this.passwordHash = bcrypt_1.default.hashSync(plain, salt);
});
// 3) Method comparePassword
userSchema.methods.comparePassword = function (candidate) {
    return bcrypt_1.default.compare(candidate, this.passwordHash);
};
// 4) Export model
exports.default = (0, mongoose_1.model)('User', userSchema);
