// src/routes/gemini.ts
import { ServerRoute } from '@hapi/hapi';
import chat  from '../docs/chatBox';

const geminiRoutes: ServerRoute[] = [
   { method:'POST', path:'/chatbox', options: chat.generate }
];

export default geminiRoutes;
