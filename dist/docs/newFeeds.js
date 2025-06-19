"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const newFeeds_1 = require("../manager/newFeeds");
const getHotReal = {
    tags: ['api', 'News'],
    description: 'Lấy RSS Bất động sản nóng của VnExpress',
    auth: false,
    handler: async (_req, h) => {
        const result = await (0, newFeeds_1.fetchHotRealEstate)();
        return h.response(result).code(200);
    }
};
exports.default = { getHotReal };
