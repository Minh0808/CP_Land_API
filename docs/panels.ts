// src/docs/panels.ts
import { RouteOptions, Request, ResponseToolkit } from '@hapi/hapi';
import Joi from 'joi';
import Panel, { CreatePanelInput } from '../manager/panels';
import {deleteUpload, prepareUpload, uploadFile} from '../manager/upload';
import { imagesURL } from '../models/panel';

export const getPanels: RouteOptions = {
   tags: ['api','Panels'],
   description: 'Lấy danh sách toàn bộ panels',
   auth: false,
   handler: async (req: Request, h: ResponseToolkit) => {
      const { data: panels, statusCode } = await Panel.listPanels();
      return h.response(panels).code(statusCode);
   }
};

export const getPanelById: RouteOptions = {
  tags: ['api','Panels'],
  description: 'Lấy 1 panel theo ID',
  auth: false,
  validate: {
    params: Joi.object({
      id: Joi.string().length(24).required().description('ID của panel')
    })
  },
  handler: async (req, h) => {
    const id = req.params.id as string;
    const { data: panel, statusCode } = await Panel.getPanel(id);
    if (!panel) {
      return h.response({ error: 'NOT_FOUND' }).code(404);
    }
    return h.response(panel).code(statusCode);
  }
};


export const postPanel: RouteOptions = {
  tags:        ['api','Panels'],
  description: 'Tạo mới một panel (upload file lên UploadThing rồi lưu vào DB)',
  auth:        false,
  plugins: {
    'hapi-swagger': {
      payloadType: 'form',
      consumes:    ['multipart/form-data'],
      produces:    ['application/json']
    }
  },
  payload: {
    parse:     true,
    multipart: true,
    maxBytes:  5 * 1024 * 1024,
    output:    'file',
  },
  validate: {
    payload: Joi.object({
      file: Joi.object()
        .meta({ swaggerType: 'file' })
        .required()
        .description('File ảnh cần upload'),
      sort_order: Joi.number().integer().optional()
        .description('Thứ tự panel (nếu không gửi, tự cấp +1)')
    })
  },
  handler: async (req: Request, h: ResponseToolkit) => {
    // 1. Lấy ra file và sort_order
    const { file, sort_order } = req.payload as {
      file: { path: string; filename: string; headers: Record<string,string>; bytes: number };
      sort_order?: number;
    };

    // Validate
    if (!file?.path) {
      return h.response({ error: 'Thiếu file upload' }).code(400);
    }

    // 2. Chuẩn bị presigned URL
    const prep = await prepareUpload([{
      name: file.filename,
      size: file.bytes,
      type: file.headers['content-type']!,
      customId: null,
    }]);

    // 3. Upload lên UploadThing
    //    uploadFile sẽ trả về public URL (string)
    const publicUrl = await uploadFile(prep.data[0], file.path);

    // 4. Xây mảng imagesURL[] theo model
    const images: imagesURL[] = [{
      url: publicUrl,
      key: prep.data[0].key,
      contentType: prep.data[0].fileType,
    }];

    // 5. Build payload cho manager
    const input: CreatePanelInput = {
      images,
      sort_order: sort_order ?? 0,
    };

    // 6. Gọi tạo mới và trả về client
    const result = await Panel.createPanel(input);
    return h.response(result.data).code(result.statusCode);
  }
};

export const putPanel: RouteOptions = {
  tags:        ['api','Panels'],
  description: 'Cập nhật panel theo ID (có thể upload file mới và/hoặc cập nhật sort_order)',
  auth:        false,
  plugins: {
    'hapi-swagger': {
      payloadType: 'file',
      consumes:    ['multipart/form-data'],
      produces:    ['application/json'],
    },
  },
  payload: {
    parse:     true,
    multipart: true,
    maxBytes:  5 * 1024 * 1024,
    output:    'file',
  },
  validate: {
    params: Joi.object({
      id: Joi.string().length(24).required().description('ID của panel cần cập nhật'),
    }),
    payload: Joi.object({
      file: Joi.object()
        .meta({ swaggerType: 'file' })
        .optional()
        .description('File upload (nếu muốn thay ảnh)'),
      sort_order: Joi.number().integer().optional().description('Thứ tự panel'),
    }),
  },
  handler: async (req: Request, h: ResponseToolkit) => {
    const id = req.params.id as string;

    // 1) Lấy panel cũ
    const { data: existing, statusCode: fetchCode } = await Panel.getPanel(id);
    if (!existing) {
      return h.response({ error: 'NOT_FOUND' }).code(404);
    }

    // 2) Rút payload từ client
    const { file, sort_order } = req.payload as {
      file?: { path: string; filename: string; headers: Record<string,string>; bytes: number };
      sort_order?: number;
    };

    // 3) Chuẩn bị object updates
    const updates: Partial<CreatePanelInput> = {};

    // 4) Nếu có upload file mới
    if (file?.path) {
      // 4.1) chuẩn bị presigned URL
      const prep = await prepareUpload([{
        name: file.filename,
        size: file.bytes,
        type: file.headers['content-type']!,
        customId: null,
      }]);
      const item = prep.data[0];

      // 4.2) upload lên S3
      const publicUrl = await uploadFile(item, file.path);

      // 4.3) build new image object
      const newImg: imagesURL = {
        url: publicUrl,
        key: item.key,
        contentType: item.fileType,
      };

      // 4.4) so sánh keys, nếu khác thì xóa cũ và gán ảnh mới
      const oldKeys = existing.images.map(i => i.key);
      if (!oldKeys.includes(newImg.key)) {
        await deleteUpload(oldKeys);        // xóa ảnh cũ nếu cần
        updates.images = [newImg];         // gán mảng chỉ chứa ảnh mới
      }
      // nếu key trùng, không động đến trường images
    }

    // 5) Cập nhật sort_order nếu client gửi
    if (typeof sort_order === 'number') {
      updates.sort_order = sort_order;
    }

    // 6) Gọi manager để cập nhật
    const result = await Panel.updatePanel(id, updates as CreatePanelInput);

    // 7) Trả về đúng phần data
    return h.response(result.data).code(result.statusCode);
  },
};


export const deletePanelDoc: RouteOptions = {
  tags:        ['api','Panels'],
  description: 'Xóa panel theo ID',
  auth:        false,
  validate: {
    params: Joi.object({
      id: Joi.string().length(24).required().description('ID của panel cần xóa')
    })
  },
  handler: async (req: Request, h: ResponseToolkit) => {
    const {data: panel} = await Panel.getPanel(req.params.id);
    if (!panel) {
      return h.response({ error: 'NOT_FOUND' }).code(404);
    }
    if(panel.images.length > 0) {
      await deleteUpload(panel.images.map(i => i.key));
    }
    const result = await Panel.deletePanel(req.params.id);
    return h.response(result.data).code(result.statusCode);
  }
};
