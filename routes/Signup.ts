// src/routes/signup.ts
import { ServerRoute } from '@hapi/hapi';
import { signupHealth, signupPost } from '../docs/Signup';

const signupRoutes: ServerRoute[] = [
  { method: 'GET',  path: '/api/signup', options: signupHealth },
  { method: 'POST', path: '/api/signup', options: signupPost }
];

export default signupRoutes;
