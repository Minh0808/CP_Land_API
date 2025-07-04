"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const newFeedsAdmin_1 = require("../docs/newFeedsAdmin");
const NewfeedsAdminRoutes = [
    { method: 'GET', path: '/api/rss-news', options: newFeedsAdmin_1.listNewFeeds },
    { method: 'GET', path: '/api/rss-news/{id}', options: newFeedsAdmin_1.getNewFeedById },
    { method: 'POST', path: '/api/newFeeds-admin', options: newFeedsAdmin_1.createNewFeeds },
    { method: 'PUT', path: '/api/newFeeds-admin/{id}', options: newFeedsAdmin_1.updateNewFeedById },
    { method: 'DELETE', path: '/api/newFeeds-admin/{id}', options: newFeedsAdmin_1.deleteNewFeedById }
];
exports.default = NewfeedsAdminRoutes;
