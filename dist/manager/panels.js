"use strict";
// src/manager/Panels.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const panel_1 = __importDefault(require("../models/panel"));
/** Chuyển IPanel → PanelDTO */
function toDTO(doc) {
    return {
        id: doc._id.toString(),
        image_url: doc.image_url,
        sort_order: doc.sort_order,
        createdAt: doc.createdAt
    };
}
/** 1) List panels */
async function listPanels() {
    try {
        const docs = await panel_1.default.find().sort('sort_order').exec();
        return { status: true, message: 'FETCH_SUCCESS', data: docs.map(toDTO), statusCode: 200 };
    }
    catch (err) {
        return { status: false, message: err.message, statusCode: 500 };
    }
}
/** 2) Create panel mới (chỉ nhận JSON với image_url và optional sort_order) */
async function createPanel(payload) {
    try {
        // Tính sort_order tự động nếu không có
        const max = await panel_1.default.findOne().sort('-sort_order').exec();
        const order = payload.sort_order ?? ((max?.sort_order ?? 0) + 1);
        const doc = await panel_1.default.create({
            image_url: payload.image_url,
            sort_order: order
        });
        return { status: true, message: 'CREATE_SUCCESS', data: toDTO(doc), statusCode: 201 };
    }
    catch (err) {
        return { status: false, message: err.message, statusCode: 500 };
    }
}
/** 3) Update panel (cho phép update image_url và/or sort_order) */
async function updatePanel(id, payload) {
    try {
        const doc = await panel_1.default.findById(id).exec();
        if (!doc)
            return { status: false, message: 'NOT_FOUND', statusCode: 404 };
        if (payload.image_url)
            doc.image_url = payload.image_url;
        if (payload.sort_order !== undefined)
            doc.sort_order = payload.sort_order;
        await doc.save();
        return { status: true, message: 'UPDATE_SUCCESS', data: toDTO(doc), statusCode: 200 };
    }
    catch (err) {
        return { status: false, message: err.message, statusCode: 500 };
    }
}
/** 4) Delete panel */
async function deletePanel(id) {
    try {
        const doc = await panel_1.default.findByIdAndDelete(id).exec();
        if (!doc)
            return { status: false, message: 'NOT_FOUND', statusCode: 404 };
        return { status: true, message: 'DELETE_SUCCESS', data: { id }, statusCode: 200 };
    }
    catch (err) {
        return { status: false, message: err.message, statusCode: 500 };
    }
}
exports.default = { listPanels, createPanel, updatePanel, deletePanel };
