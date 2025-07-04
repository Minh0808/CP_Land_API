"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = void 0;
const path_1 = __importDefault(require("path"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'CP_Land API',
            version: '1.0.0',
            description: 'API docs cho dự án CP_Land',
        },
        servers: [
            { url: 'http://localhost:4000' },
        ],
    },
    apis: [
        // thêm đường dẫn đến các file YAML
        path_1.default.resolve(__dirname, '../docs/*.yaml'),
    ],
};
exports.swaggerSpec = (0, swagger_jsdoc_1.default)(options);
