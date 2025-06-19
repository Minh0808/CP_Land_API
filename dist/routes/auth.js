"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = __importDefault(require("../docs/auth"));
const authRoutes = [
    // { method: 'GET', path:'/auth/me', config: Auth.getMe },
    { method: 'POST', path: '/auth/login', options: auth_1.default.login },
    { method: 'GET', path: '/auth/me', options: auth_1.default.getUserMe },
    { method: 'POST', path: '/auth/logout', options: auth_1.default.logout }
];
exports.default = authRoutes;
