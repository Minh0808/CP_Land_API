"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/models/panel.ts
const mongoose_1 = require("mongoose");
const panelSchema = new mongoose_1.Schema({
    image_url: { type: String, required: true },
    sort_order: { type: Number, required: true, default: 0 }
}, {
    timestamps: { createdAt: true, updatedAt: false }
});
exports.default = (0, mongoose_1.model)('Panel', panelSchema);
