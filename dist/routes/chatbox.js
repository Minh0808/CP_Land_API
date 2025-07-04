"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chatBox_1 = __importDefault(require("../docs/chatBox"));
const geminiRoutes = [
    { method: 'POST', path: '/chatbox', options: chatBox_1.default.generate }
];
exports.default = geminiRoutes;
