// src/docs/signup.ts
import { RouteOptions, Request, ResponseToolkit } from '@hapi/hapi';
import Joi from 'joi';
import Response from '../utils/Response';
import userMess from '../manager/useMess';
export const userMessHealth: RouteOptions = {
  tags:        ['api', 'Messager'],
  description: 'Health check for signup service',
  auth:        false,
  handler:     async (_req: Request, h: ResponseToolkit) => {
    const result = await  userMess.health();
    return h.response(result).code(result.statusCode);
  }
};

export const userMessPost: RouteOptions = {
  tags:        ['api', 'Messager'],
  description: 'Người dùng đăng ký nhận thông tin',
  auth:        false,
  validate:    {
    payload: Joi.object({
      name: Joi.string().required().description('Tên người dùng'),
      email: Joi.string().email().required().description('Email của user'),
      phone: Joi.string().required().description('Số điện thoại'),
      messager: Joi.string().required().description('Nội dung người dùng gửi')
    })
  },
  handler:     async (req: Request, h: ResponseToolkit) => {
   const { name, email, phone, messager } = req.payload as any;
    const result = await userMess.register(name, email, phone, messager);
    return Response(result, h);
  }
};
