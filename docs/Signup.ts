// src/docs/signup.ts
import { RouteOptions, Request, ResponseToolkit } from '@hapi/hapi';
import Joi from 'joi';
import Response from '../utils/Response';
import Signup from '../manager/Signup';
export const signupHealth: RouteOptions = {
  tags:        ['api', 'Signup'],
  description: 'Health check for signup service',
  auth:        false,
  handler:     async (_req: Request, h: ResponseToolkit) => {
    const result = await  Signup.health();
    return h.response(result).code(result.statusCode);
  }
};

export const signupPost: RouteOptions = {
  tags:        ['api', 'Signup'],
  description: 'Người dùng đăng ký nhận thông tin',
  auth:        false,
  validate:    {
    payload: Joi.object({
      name: Joi.string().trim().optional().default('Khách hàng').description('Tên người dùng'),
      email: Joi.string().email().required().description('Email của user'),
      phone: Joi.string().required().description('Số điện thoại')
    })
    .unknown(true)
  },
  handler:     async (req: Request, h: ResponseToolkit) => {
   const { name, email, phone } = req.payload as 
   { name: string; email: string; phone: string };
    const result = await Signup.register(name, email, phone);
    return Response(result, h);
  }
};
