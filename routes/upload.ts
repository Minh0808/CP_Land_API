// src/routes/upload.ts
import type { ServerRoute } from '@hapi/hapi';
import {postUploadOptions, deleteUploadOptions} from '../docs/upload';

const uploadRoutes: ServerRoute[] = [
  {
    method: 'POST',
    path: '/api/upload',
    options: postUploadOptions,
  },

  {
    method: 'DELETE',
    path: '/api/upload',
    options: deleteUploadOptions,
  }
];

export default uploadRoutes;
