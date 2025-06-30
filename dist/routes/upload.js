"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const upload_1 = __importDefault(require("../docs/upload"));
const uploadRoutes = [
    {
        method: 'POST',
        path: '/api/upload/prepare',
        options: upload_1.default,
    },
];
exports.default = uploadRoutes;
