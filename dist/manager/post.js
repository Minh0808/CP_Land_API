"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listPosts = listPosts;
exports.getPost = getPost;
exports.createPost = createPost;
exports.updatePost = updatePost;
exports.deletePost = deletePost;
// src/manager/post.ts
const post_1 = require("../models/post");
// helper chuyển IImage → ImageDTO
function toDTO(img) {
    return {
        url: img.url,
        key: img.key,
        contentType: img.contentType
    };
}
async function listPosts() {
    try {
        const docs = await post_1.postModel.find().sort('-createdAt').exec();
        const data = docs.map(d => ({
            id: d._id.toString(),
            title: d.title,
            description: d.description,
            propertyType: d.propertyType,
            price: d.price,
            area: d.area,
            address: d.address,
            images: d.images.map(toDTO),
            createdAt: d.createdAt,
            updatedAt: d.updatedAt
        }));
        return { status: true, message: 'FETCH_SUCCESS', data, statusCode: 200 };
    }
    catch (err) {
        console.error(err);
        return { status: false, message: err.message, statusCode: 500 };
    }
}
async function getPost(id) {
    try {
        const d = await post_1.postModel.findById(id).exec();
        if (!d)
            return { status: false, message: 'NOT_FOUND', statusCode: 404 };
        const data = {
            id: d._id.toString(),
            title: d.title,
            description: d.description,
            propertyType: d.propertyType,
            price: d.price,
            area: d.area,
            address: d.address,
            images: d.images.map(toDTO),
            createdAt: d.createdAt,
            updatedAt: d.updatedAt
        };
        return { status: true, message: 'FETCH_SUCCESS', data, statusCode: 200 };
    }
    catch (err) {
        console.error(err);
        return { status: false, message: err.message, statusCode: 500 };
    }
}
async function createPost(body) {
    try {
        const d = await post_1.postModel.create(body);
        const data = {
            id: d._id.toString(),
            title: d.title,
            description: d.description,
            propertyType: d.propertyType,
            price: d.price,
            area: d.area,
            address: d.address,
            images: d.images.map(toDTO),
            createdAt: d.createdAt,
            updatedAt: d.updatedAt
        };
        return { status: true, message: 'CREATE_SUCCESS', data, statusCode: 201 };
    }
    catch (err) {
        console.error(err);
        return { status: false, message: err.message, statusCode: 500 };
    }
}
async function updatePost(id, body) {
    try {
        const d = await post_1.postModel.findByIdAndUpdate(id, body, { new: true }).exec();
        if (!d)
            return { status: false, message: 'NOT_FOUND', statusCode: 404 };
        const data = {
            id: d._id.toString(),
            title: d.title,
            description: d.description,
            propertyType: d.propertyType,
            price: d.price,
            area: d.area,
            address: d.address,
            images: d.images.map(toDTO),
            createdAt: d.createdAt,
            updatedAt: d.updatedAt
        };
        return { status: true, message: 'UPDATE_SUCCESS', data, statusCode: 200 };
    }
    catch (err) {
        console.error(err);
        return { status: false, message: err.message, statusCode: 500 };
    }
}
async function deletePost(id) {
    try {
        const d = await post_1.postModel.findByIdAndDelete(id).exec();
        if (!d)
            return { status: false, message: 'NOT_FOUND', statusCode: 404 };
        return { status: true, message: 'DELETE_SUCCESS', data: { id }, statusCode: 200 };
    }
    catch (err) {
        console.error(err);
        return { status: false, message: err.message, statusCode: 500 };
    }
}
