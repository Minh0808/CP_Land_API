"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("../docs/user"));
const userRouter = [
    { method: 'POST', path: '/user', options: user_1.default.createUser },
    { method: 'GET', path: '/user/{username}', options: user_1.default.getUser }
];
exports.default = userRouter;
