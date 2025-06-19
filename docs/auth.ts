import type { RouteOptions, Request, ResponseToolkit } from '@hapi/hapi';
import Joi from 'joi';
import Auth from '../manager/auth';
import Response from '../utils/Response';

const login: RouteOptions = {
  tags: ['api','Auth'],
  description: 'Đăng nhập',
  auth: false,
  validate: {
    payload: Joi.object({
      username: Joi.string().required().description('Tên đăng nhập'),
      password: Joi.string().required().description('Mật khẩu'),
    }),
  },
  handler: async (req, h) => {
    const result = await Auth.login(req);
    return Response(result, h);
  },
};

const logout: RouteOptions = {
  tags: ['api','Auth'],
  description: 'Đăng xuất (invalide token phía client)',
  notes: 'Client chỉ cần xóa token lưu trên localStorage/sessionStorage',
  auth: 'jwt',
  plugins: {
    'hapi-swagger': {
      security: [{ Bearer: [] }]    // <-- Đổi từ Jwt thành Bearer
    }
  },
  handler: async (req: Request, h: ResponseToolkit) => {
    // Nếu cần blacklist, gọi Auth.logout ở đây
    return h
      .response({ status: true, message: 'Đã đăng xuất' })
      .code(200);
  },
};

const getUserMe: RouteOptions = {
  tags: ['api','Auth'],
  description: 'Lấy thông tin user đang login',
  auth: 'jwt',
  plugins: {
    'hapi-swagger': {
      security: [{ Bearer: [] }]    // <-- Đồng bộ với securityDefinitions
    }
  },
  handler: async (request, h) => {
    const userId = (request.auth.credentials as any).user.id;
    const result = await Auth.getMe(userId);
    return h.response(result).code(200);
  },
};

export default { login, logout, getUserMe };
