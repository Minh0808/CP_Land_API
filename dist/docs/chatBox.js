"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const chatBox_1 = __importDefault(require("../manager/chatBox"));
const generate = {
    tags: ['api', 'Gemini'],
    description: 'Gửi prompt lên Gemini và nhận về reply',
    auth: false,
    validate: {
        payload: joi_1.default.object({
            message: joi_1.default.string().required().description('Nội dung người dùng gửi')
        })
    },
    handler: async (req, h) => {
        const { message } = req.payload;
        const result = await chatBox_1.default.generateReply(message);
        return h.response({ status: result.status, message: result.message, data: result.data }).code(result.statusCode);
    }
};
exports.default = { generate };
