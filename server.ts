import Hapi, { Request, ResponseToolkit } from '@hapi/hapi';
import Inert from '@hapi/inert';
import Vision from '@hapi/vision';
import HapiSwagger from 'hapi-swagger';
import dotenv from 'dotenv';
import path from 'path';
import Jwt from 'hapi-auth-jwt2';

import connectDB from './config/MongoDB';
import authRoutes from './routes/auth';
import signupRoutes from './routes/signup';
import userRoutes from './routes/user';
import chatBoxRoutes from './routes/chatbox';
import hotNewRoutes from './routes/newfeeds';
import panelsRoutes from './routes/panels';
import postRoutes from './routes/post';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const raw = process.env.CORS_ORIGINS ?? '';
let corsOrigins = raw.split(',').map(s => s.trim()).filter(Boolean);
if (corsOrigins.length === 0) {
  corsOrigins = ['*'];
}

const PORT = Number(process.env.PORT ?? 4000);

const init = async () => {
  // 1) Kết nối DB
  await connectDB();

  // 2) Khởi tạo server
  const server = Hapi.server({
    port: PORT,
    host: 'localhost',
    routes: {
      cors: {
        origin: corsOrigins,
        credentials: true,
      },
      files: {
        relativeTo: path.resolve(__dirname, 'public'),
      },
    },
  });

  // 3) Đăng ký plugins: Inert, Vision, hapi-swagger, hapi-auth-jwt2
  await server.register([
    { plugin: Inert },
    { plugin: Vision },
    {
      plugin: HapiSwagger,
      options: {
        info: {
          title: 'CP_Land API',
          version: '1.0.0',
        },
        grouping: 'tags',
        securityDefinitions: {
          Bearer: {
            type: 'apiKey',
            name: 'Authorization',
            in: 'header',
            'x-keyPrefix': 'Bearer ',
          },
        },
        security: [{ Bearer: [] }],
      },
    },
    { plugin: Jwt },
  ]);

  // 4) Định nghĩa auth strategy “jwt”
  server.auth.strategy('jwt', 'jwt', {
    key: process.env.JWT_SECRET!,      // <— bí mật JWT của bạn
    validate: async (
      decoded: any,               // decoded chính là payload của token
      request: Request,
      h: ResponseToolkit
    ) => {
      // Giả sử payload bạn sign khi login có dạng { user: { id, username, ... }, iat, exp }
      const { user } = decoded;
      if (!user?.id) {
        return { isValid: false };
      }
      return {
        isValid: true,
        credentials: { user },
      };
    },
    verifyOptions: {
      aud: false,
      iss: false,
      sub: false,
      nbf: true,
      exp: true,
      timeSkewSec: 15,
    },
  });

  // 5) Mặc định dùng JWT cho tất cả route
  server.auth.default('jwt');

  // 6) Đăng ký các route
  // Các route login / signup phải tắt auth trong file route
  server.route(authRoutes);
  server.route(signupRoutes);

  // Những route còn lại kế thừa default('jwt')
  server.route(userRoutes);
  server.route(chatBoxRoutes);
  server.route(hotNewRoutes);
  server.route(panelsRoutes);
  server.route(postRoutes);

  // 7) Start
  await server.start();
  console.log(`🚀 Server running at ${server.info.uri}`);
  console.log('🌐 CORS origins:', corsOrigins);
};

process.on('unhandledRejection', (err) => {
  console.error(err);
  process.exit(1);
});

init();
