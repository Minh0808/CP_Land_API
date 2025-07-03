import { ServerRoute } from '@hapi/hapi';
import { createNewFeeds, listNewFeeds, getNewFeedById, updateNewFeedById, deleteNewFeedById } from '../docs/newFeedsAdmin';

const NewfeedsAdminRoutes: ServerRoute[] = [
   { method: 'GET', path:'/api/rss-news', options: listNewFeeds },
   { method: 'GET', path:'/api/rss-news/{id}', options: getNewFeedById },
   { method: 'POST', path:'/api/newFeeds-admin', options: createNewFeeds },
   { method: 'PUT', path:'/api/newFeeds-admin/{id}', options: updateNewFeedById },
   { method: 'DELETE', path:'/api/newFeeds-admin/{id}', options: deleteNewFeedById }
];

export default NewfeedsAdminRoutes;
