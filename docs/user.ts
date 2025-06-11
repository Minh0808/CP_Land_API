import type { RouteOptions, Request, ResponseToolkit } from '@hapi/hapi';
import Joi from "joi";
import user from '../manager/user';

const createUser: RouteOptions = {
   tags: ['api', 'User'],
   description: 'Tạo người dùng mới',
   auth: false,
   validate: {
      payload: Joi.object({
         username: Joi.string().required().description('Tên dăng nhập người dụng'),
         name: Joi.string().required().description('Tên người dụng'),
         email: Joi.string().email().required().description('Email người dụng'),
         phone: Joi.string().required().description('Sđt người dụng'),
         password: Joi.string().min(6).required().description('Mật khảu người dụng'),
         role: Joi.string().optional().description('Quyền người dụng')
      }),
   },
   handler: async (request: Request, h: ResponseToolkit) => {
      const result = await user.createUser(request.payload as any);
      return h.response(result).code(201);
   },
}

const getUser: RouteOptions = {
   tags: ['api', 'User'],
    description: 'Lấy thông tin user theo username',
    auth: 'jwt',
    plugins: {
    'hapi-swagger': {
      security: [{ Bearer: [] }]    // <-- Đổi từ Jwt thành Bearer
    }
  },
    validate: {
      params: Joi.object({
        username: Joi.string().min(3).max(30).required().description('Username của user')
      })
    },
   handler: async (request: Request, h: ResponseToolkit) => {
    const { username } = request.params as { username: string };
    const result = await user.getUserByUsername(username);
    return h.response(result).code(200);
  }
}
export default { createUser, getUser };
