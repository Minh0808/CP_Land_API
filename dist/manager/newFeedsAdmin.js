"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/manager/newFeeds.ts
const newFeedsAdmin_1 = require("../models/newFeedsAdmin");
function toDTO(doc) {
    return {
        id: doc._id.toString(),
        title: doc.title,
        excerpt: doc.excerpt,
        content: doc.content,
        media: doc.media.map(m => ({
            key: m.key,
            url: m.url,
            type: m.type
        })),
        publishedAt: doc.publishedAt.toISOString(),
        category: doc.category
    };
}
/**
 * Tạo mới một NewFeeds document
 */
async function postNewFeeds(payload) {
    try {
        const doc = new newFeedsAdmin_1.NewFeedsModel(payload);
        await doc.save();
        return {
            status: true,
            message: 'CREATE_SUCCESS',
            data: toDTO(doc),
            statusCode: 201,
        };
    }
    catch (err) {
        return {
            status: false,
            message: err.message || 'CREATE_FAILED',
            statusCode: 500,
        };
    }
}
/**
 * Lấy danh sách tất cả bài viết, sắp xếp mới nhất trước
 */
async function fetchNewFeeds() {
    try {
        const docs = await newFeedsAdmin_1.NewFeedsModel
            .find()
            .sort({ createdAt: -1 })
            .exec();
        const dtos = docs.map(toDTO);
        return {
            status: true,
            message: 'FETCH_SUCCESS',
            data: dtos,
            statusCode: 200,
        };
    }
    catch (err) {
        return {
            status: false,
            message: err.message || 'FETCH_FAILED',
            statusCode: 500,
        };
    }
}
/**
 * Lấy chi tiết một bài viết theo ID
 */
async function fetchNewFeedById(id) {
    try {
        const doc = await newFeedsAdmin_1.NewFeedsModel.findById(id).exec();
        if (!doc) {
            return {
                status: false,
                message: 'NOT_FOUND',
                statusCode: 404,
            };
        }
        return {
            status: true,
            message: 'FETCH_SUCCESS',
            data: toDTO(doc),
            statusCode: 200,
        };
    }
    catch (err) {
        return {
            status: false,
            message: err.message || 'FETCH_FAILED',
            statusCode: 500,
        };
    }
}
/**
 * Cập nhật một NewFeeds theo ID
 */
async function updateNewFeed(id, payload) {
    try {
        const doc = await newFeedsAdmin_1.NewFeedsModel.findByIdAndUpdate(id, payload, { new: true }).exec();
        if (!doc) {
            return { status: false, message: 'NOT_FOUND', statusCode: 404 };
        }
        return {
            status: true,
            message: 'UPDATE_SUCCESS',
            data: toDTO(doc),
            statusCode: 200,
        };
    }
    catch (err) {
        return {
            status: false,
            message: err.message || 'UPDATE_FAILED',
            statusCode: 500,
        };
    }
}
/**
 * Xóa một NewFeeds theo ID
 */
async function deleteNewFeed(id) {
    try {
        const res = await newFeedsAdmin_1.NewFeedsModel.findByIdAndDelete(id).exec();
        if (!res) {
            return { status: false, message: 'NOT_FOUND', statusCode: 404 };
        }
        return { status: true, message: 'DELETE_SUCCESS', statusCode: 204 };
    }
    catch (err) {
        return {
            status: false,
            message: err.message || 'DELETE_FAILED',
            statusCode: 500,
        };
    }
}
exports.default = {
    postNewFeeds,
    fetchNewFeeds,
    fetchNewFeedById,
    updateNewFeed,
    deleteNewFeed
};
