"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const chatSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    reply: { type: String, required: true },
    createdAt: { type: Date, default: () => new Date() },
});
exports.default = (0, mongoose_1.model)('Chat', chatSchema);
