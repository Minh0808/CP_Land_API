
import { RouteOptions, Request, ResponseToolkit } from '@hapi/hapi';
import Joi from 'joi';
import  chat  from '../manager/chatBox';

const generate: RouteOptions = {
   tags:        ['api', 'Gemini'],
   description: 'Gửi prompt lên Gemini và nhận về reply',
   auth:        false,
   validate: {
      payload: Joi.object({
         message: Joi.string().required().description('Nội dung người dùng gửi')
      })
   },
   handler: async (req: Request, h: ResponseToolkit) => {
      const { message } = req.payload as { message: string };
      const result = await chat.generateReply(message);
      return h.response({status: result.status, message: result.message, data: result.data}).code(result.statusCode);
   }
}
export default {generate}
