"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewFeedsModel = void 0;
// src/models/newFeeds.ts
const mongoose_1 = require("mongoose");
/** -- MONGOOSE SCHEMA & MODEL -- */
const MediaSchema = new mongoose_1.Schema({
    key: { type: String, required: true },
    url: { type: String, required: true },
    type: { type: String, enum: ['image', 'video'], required: true },
}, { _id: false });
const NewFeedsSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    media: { type: [MediaSchema], default: [] },
    publishedAt: { type: Date, default: () => new Date() },
    category: { type: String, default: 'Tin tức' },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
// virtual 'id' để khi toJSON() có luôn .id string
NewFeedsSchema.virtual('id').get(function () {
    return this._id.toHexString();
});
exports.NewFeedsModel = (0, mongoose_1.model)('NewFeeds', NewFeedsSchema);
