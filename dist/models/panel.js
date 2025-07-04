"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/models/panel.ts
const mongoose_1 = require("mongoose");
const imageSchema = new mongoose_1.Schema({
    url: { type: String, required: true },
    key: { type: String, required: true },
    contentType: { type: String, required: true },
}, { _id: false });
const panelSchema = new mongoose_1.Schema({
    images: { type: [imageSchema], required: true },
    sort_order: { type: Number, required: true }
});
exports.default = (0, mongoose_1.model)('Panel', panelSchema);
