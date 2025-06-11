// src/docs/panels.ts
import { RouteOptions, Request, ResponseToolkit } from '@hapi/hapi';
import Joi from 'joi';
import Panel from '../manager/panels';

export const getPanels: RouteOptions = {
  tags:        ['api', 'Panels'],
  description: 'Lấy danh sách toàn bộ panels',
  auth:        false,
  handler: async (_req: Request, h: ResponseToolkit) => {
    const result = await Panel.listPanels();
    return h.response(result).code(result.statusCode)
  }
};

export const postPanel: RouteOptions = {
  tags:        ['api', 'Panels'],
  description: 'Tạo mới một panel',
  auth:        false,
  plugins: {
      'hapi-swagger': {
        payloadType: 'form',
        consumes:    ['multipart/form-data'],
        produces:    ['application/json'],
      }
    },
    payload: {
        allow:     ['application/json', 'multipart/form-data'],
        parse:     true,
        multipart: true,
        output:    'stream',
        maxBytes:  10 * 1024 * 1024,    // 10MB
      },
  validate: {
        payload: Joi.object({
          // Nếu client nhập thẳng URL
          image_url: Joi.string()
            .uri()
            .optional()
            .description('URL của ảnh (nếu không upload file)'),

          // Nếu client upload file
          file: Joi.any()
            .meta({ swaggerType: 'file' })
            .optional()
            .description('Upload file ảnh'),

          sort_order: Joi.number()
            .optional()
            .description('Thứ tự panel (nếu không gửi, hệ thống tự cấp +1)')
        })
        .or('image_url', 'file')  // phải có ít nhất 1 trong 2
      },
  handler: async (req: Request, h: ResponseToolkit) => {
    const result = await Panel.createPanel(req.payload as any);
    return h.response(result).code(result.statusCode)
  }
};

export const putPanel: RouteOptions = {
  tags:        ['api', 'Panels'],
  description: 'Cập nhật panel theo ID',
  auth:        false,
  validate: {
    params: Joi.object({
      id: Joi.string().length(24).required().description('ID của panel')
    }),
    payload: Joi.object({
      image_url:  Joi.string().required().description('URL của ảnh mới'),
      sort_order: Joi.number().integer().required().description('Thứ tự mới')
    })
  },
  handler: async (req: Request, h: ResponseToolkit) => {
    const id = req.params.id as string;
    const result = await Panel.updatePanel(req.payload as any, id);
    return h.response(result).code(result.statusCode)
  }
};

export const deletePanelDoc: RouteOptions = {
  tags:        ['api', 'Panels'],
  description: 'Xóa panel theo ID',
  auth:        false,
  validate: {
    params: Joi.object({
      id: Joi.string().length(24).required().description('ID của panel cần xóa')
    })
  },
  handler: async (req: Request, h: ResponseToolkit) => {
    const id = req.params.id as string;
    const result = await Panel.deletePanel(id);
    return h.response(result).code(result.statusCode)
  }
};

// export default {
//   name:     'panels-docs',
//   register: async (server: any) => {
//     server.route([
//       { method: 'GET',    path: '/api/panels',      options: getPanels },
//       { method: 'POST',   path: '/api/panels',      options: postPanel },
//       { method: 'PUT',    path: '/api/panels/{id}', options: putPanel },
//       { method: 'DELETE', path: '/api/panels/{id}', options: deletePanelDoc }
//     ]);
//   }
// };
