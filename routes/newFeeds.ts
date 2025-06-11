// src/routes/rssNews.ts
import { ServerRoute } from '@hapi/hapi';
import  RSS  from '../docs/newFeeds';

const rssNewsRoutes: ServerRoute[] = [
  { method: 'GET', path:'/rss/hot-real', options: RSS.getHotReal }
];

export default rssNewsRoutes;
