"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const post_1 = require("../docs/post");
const postsRoutes = [
    { method: 'GET', path: '/api/posts', options: post_1.getAllPosts },
    { method: 'GET', path: '/api/posts/{id}', options: post_1.getSinglePost },
    { method: 'POST', path: '/api/posts', options: post_1.postPost },
    { method: 'PUT', path: '/api/posts/{id}', options: post_1.putPost },
    { method: 'DELETE', path: '/api/posts/{id}', options: post_1.deletePostDoc }
];
exports.default = postsRoutes;
