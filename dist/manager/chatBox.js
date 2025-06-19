"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
async function generateReply(message) {
    const key = process.env.GEMINI_API_KEY;
    const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
    try {
        const body = {
            contents: [
                {
                    parts: [
                        { text: `Bạn là trợ lý CP LAND. ${message}` }
                    ]
                }
            ]
        };
        const apiRes = await axios_1.default.post(url, body);
        const parts = apiRes.data.candidates?.[0]?.content?.parts || [];
        const reply = parts.map((p) => p.text).join('');
        return {
            status: true,
            message: 'SUCCESS',
            data: { reply },
            statusCode: 200
        };
    }
    catch (err) {
        console.error('Gemini Error:', err.response?.data || err.message);
        return {
            status: false,
            message: err.response?.data?.error?.message || err.message,
            statusCode: err.response?.status || 500
        };
    }
}
exports.default = { generateReply };
