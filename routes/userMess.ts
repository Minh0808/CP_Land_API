// src/routes/signup.ts
import { ServerRoute } from '@hapi/hapi';
import { userMessHealth, userMessPost } from '../docs/userMess';

const userMessRoutes: ServerRoute[] = [
  { method: 'GET',  path: '/api/messager', options: userMessHealth },
  { method: 'POST', path: '/api/messager', options: userMessPost }
];

export default userMessRoutes;
