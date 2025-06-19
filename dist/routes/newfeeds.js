"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const newFeeds_1 = __importDefault(require("../docs/newFeeds"));
const rssNewsRoutes = [
    { method: 'GET', path: '/rss/hot-real', options: newFeeds_1.default.getHotReal }
];
exports.default = rssNewsRoutes;
