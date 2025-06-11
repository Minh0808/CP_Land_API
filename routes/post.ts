// src/routes/posts.ts
import { ServerRoute } from '@hapi/hapi';
import {
  getAllPosts,
  getSinglePost,
  postPost,
  putPost,
  deletePostDoc
} from '../docs/post';

const postsRoutes: ServerRoute[] = [
  { method: 'GET',    path: '/api/posts',       options: getAllPosts },
  { method: 'GET',    path: '/api/posts/{id}',  options: getSinglePost },
  { method: 'POST',   path: '/api/posts',       options: postPost },
  { method: 'PUT',    path: '/api/posts/{id}',  options: putPost },
  { method: 'DELETE', path: '/api/posts/{id}',  options: deletePostDoc }
];

export default postsRoutes;
