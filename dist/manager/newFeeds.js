"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchHotRealEstate = fetchHotRealEstate;
// src/manager/News.ts
const axios_1 = __importDefault(require("axios"));
const xml2js_1 = require("xml2js");
const cheerio_1 = require("cheerio");
const RSS_URL = 'https://vnexpress.net/rss/bat-dong-san.rss';
async function fetchHotRealEstate() {
    try {
        // 1) Lấy XML
        const response = await axios_1.default.get(RSS_URL, {
            responseType: 'text',
            headers: { 'Accept': 'application/rss+xml' }
        });
        const xml = response.data;
        // 2) Parse
        const result = await (0, xml2js_1.parseStringPromise)(xml, { trim: true });
        const items = result.rss.channel[0].item || [];
        // 3) Map thành NewsItem
        const news = items.slice(0, 12).map(item => {
            const title = item.title?.[0] || '';
            const link = item.link?.[0] || '';
            const pubDateRaw = item.pubDate?.[0] || '';
            const pubDate = new Date(pubDateRaw);
            const descHtml = item.description?.[0] || '';
            const $ = (0, cheerio_1.load)(descHtml);
            const image = $('img').first().attr('src') || '';
            $('img').remove();
            const summary = $.root().text().trim();
            return { title, link, pubDate, image, summary };
        });
        return {
            status: true,
            message: 'FETCH_SUCCESS',
            data: news,
            statusCode: 200
        };
    }
    catch (err) {
        console.error('[News Manager] Error fetching RSS:', err);
        return {
            status: false,
            message: err.message || 'FETCH_FAILED',
            statusCode: err.response?.status || 500
        };
    }
}
