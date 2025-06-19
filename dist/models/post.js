"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postModel = void 0;
exports.streamToBuffer = streamToBuffer;
const mongoose_1 = require("mongoose");
const addressSchema = new mongoose_1.Schema({
    provinceCode: { type: String, required: true },
    provinceName: { type: String, required: true },
    districtCode: { type: String, required: true },
    districtName: { type: String, required: true },
    wardCode: { type: String, required: true },
    wardName: { type: String, required: true },
    street: { type: String }
});
const imageSchema = new mongoose_1.Schema({
    data: { type: Buffer, required: true },
    contentType: { type: String, required: true }
}, { _id: false });
const postSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    description: { type: String, default: '' },
    propertyType: { type: String, required: true },
    price: { type: Number, required: true },
    area: { type: Number, required: true },
    address: { type: addressSchema, required: true },
    images: { type: [imageSchema], required: true }
}, { timestamps: true });
async function streamToBuffer(stream) {
    const chunks = [];
    for await (const chunk of stream) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    return Buffer.concat(chunks);
}
exports.postModel = (0, mongoose_1.model)('Post', postSchema);
// bắt buộc phải export IPost để dùng ở docs và manager:
// export type { IPost };
