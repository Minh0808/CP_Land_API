// src/docs/rssNews.ts
import { RouteOptions, Request, ResponseToolkit } from '@hapi/hapi';
import { fetchHotRealEstate, NewsResult } from '../manager/newFeeds';

const getHotReal: RouteOptions = {
  tags:        ['api', 'News'],
  description: 'Lấy RSS Bất động sản nóng của VnExpress',
  auth:        false,
  handler: async (_req: Request, h: ResponseToolkit) => {
    const result: NewsResult = await fetchHotRealEstate();
    return h.response(result).code(200);
  }
}
export default {getHotReal}

