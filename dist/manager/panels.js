"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/manager/Panels.ts
const panel_1 = __importDefault(require("../models/panel"));
/** Đọc một ReadableStream thành Buffer */
async function streamToBuffer(streamFile) {
    const chunks = [];
    for await (const chunk of streamFile) {
        chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
    }
    return Buffer.concat(chunks);
}
/** Chuyển Buffer + mimeType thành Data-URL */
function bufferToDataURL(buffer, mimeType) {
    const b64 = buffer.toString('base64');
    return `data:${mimeType};base64,${b64}`;
}
/** Chuyển IPanel thành PanelDTO */
function toDTO(doc) {
    return {
        id: doc._id,
        image_url: doc.image_url,
        sort_order: doc.sort_order,
        createdAt: doc.createdAt
    };
}
// 1) List panels
async function listPanels() {
    try {
        const docs = await panel_1.default.find().sort('sort_order').exec();
        const data = docs.map(toDTO);
        return { status: true, message: 'FETCH_SUCCESS', data, statusCode: 200 };
    }
    catch (err) {
        return { status: false, message: err.message, statusCode: 500 };
    }
}
// 2) Create panel mới
async function createPanel(payload) {
    try {
        // Tính sort_order
        let order = payload.sort_order !== undefined
            ? Number(payload.sort_order)
            : ((await panel_1.default.findOne().sort('-sort_order').exec())?.sort_order ?? 0) + 1;
        // Xác định image_url:
        let image_url;
        if (payload.file) {
            // client upload file
            const buffer = await streamToBuffer(payload.file);
            const mimeType = payload.file.hapi.headers['content-type'];
            image_url = bufferToDataURL(buffer, mimeType);
        }
        else if (typeof payload.image_url === 'string') {
            image_url = payload.image_url;
        }
        else {
            throw new Error('Missing file or image_url');
        }
        // Lưu vào Mongo
        const doc = await panel_1.default.create({ image_url, sort_order: order });
        return {
            status: true,
            message: 'CREATE_SUCCESS',
            data: toDTO(doc),
            statusCode: 201
        };
    }
    catch (err) {
        return { status: false, message: err.message, statusCode: 500 };
    }
}
// 3) Update panel
async function updatePanel(id, payload) {
    try {
        const existing = await panel_1.default.findById(id).exec();
        if (!existing) {
            return { status: false, message: 'NOT_FOUND', statusCode: 404 };
        }
        // Cập nhật sort_order nếu có
        existing.sort_order = payload.sort_order !== undefined
            ? Number(payload.sort_order)
            : existing.sort_order;
        // Cập nhật image_url
        if (payload.file) {
            const buffer = await streamToBuffer(payload.file);
            const mimeType = payload.file.hapi.headers['content-type'];
            existing.image_url = bufferToDataURL(buffer, mimeType);
        }
        else if (typeof payload.image_url === 'string') {
            existing.image_url = payload.image_url;
        }
        await existing.save();
        return {
            status: true,
            message: 'UPDATE_SUCCESS',
            data: toDTO(existing),
            statusCode: 200
        };
    }
    catch (err) {
        return { status: false, message: err.message, statusCode: 500 };
    }
}
// 4) Delete panel
async function deletePanel(id) {
    try {
        const doc = await panel_1.default.findByIdAndDelete(id).exec();
        if (!doc) {
            return { status: false, message: 'NOT_FOUND', statusCode: 404 };
        }
        return {
            status: true,
            message: 'DELETE_SUCCESS',
            data: { id },
            statusCode: 200
        };
    }
    catch (err) {
        return { status: false, message: err.message, statusCode: 500 };
    }
}
exports.default = {
    listPanels,
    createPanel,
    updatePanel,
    deletePanel
};
