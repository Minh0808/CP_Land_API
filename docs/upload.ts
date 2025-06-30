// src/docs/upload.swagger.ts
import type { RouteOptions, Request, ResponseToolkit } from '@hapi/hapi';
import Joi from 'joi';
import { prepareUpload, uploadFile } from '../manager/upload';
import { deleteUpload } from '../manager/upload'; // nhớ import hàm xoá

/**
 * POST /api/upload
 * Chuẩn bị và upload file, trả về URL public
 */
export const postUploadOptions: RouteOptions = {
  tags: ['api', 'Upload'],
  description: 'Chuẩn bị và upload file, trả về URL public',
  auth: false,
  notes: 'Client gửi lên file, server trả về URL public sau khi upload xong',
  plugins: {
    'hapi-swagger': {
      payloadType: 'form',
      consumes: ['multipart/form-data'],
      produces: ['application/json'],
    },
  },
  payload: {
    maxBytes: 4 * 1024 * 1024,
    output: 'file',
    parse: true,
    multipart: true,
  },
  validate: {
    payload: Joi.object({
      file: Joi.any()
        .meta({ swaggerType: 'file' })
        .required()
        .description('Ảnh cần upload'),
    }).required(),
    failAction: (_request, _h, err) => {
      throw err;
    },
  },
  response: {
    status: {
      200: Joi.object({
        url: Joi.string().uri().required().description('URL public của file đã upload'),
        key: Joi.string().required().description('Key của file trong UploadThing')
      }).label('UploadResponse'),
    },
  },
  handler: async (request: Request, h: ResponseToolkit) => {
  const raw = request.payload as any;
  const file = raw.file as {
    path: string;
    filename: string;
    headers: Record<string, string>;
    bytes: number;
  };

  if (!file?.path) {
    return h.response({ error: 'No file received' }).code(400);
  }

  try {

    // 1) Prepare
    const prepareList = [{
      name: file.filename,
      size: file.bytes,
      type: file.headers['content-type']!,
      customId: null,
    }];
    const { data } = await prepareUpload(prepareList);

    // 2) Upload
    const uploaded = await uploadFile(data[0], file.path);

    // 3) Trả về URL + key + jwt
    return h.response({
      url:        data[0].fileUrl,
      key:        data[0].key
    }).code(200);

  } catch (err: any) {
    console.error('❌ POST /api/upload failed:', err);
    return h
      .response({ success: false, message: err.message })
      .code(500);
  }
}
};

/**
 * DELETE /api/upload
 * Xóa một file đã upload trên UploadThing
 */
export const deleteUploadOptions: RouteOptions = {
  tags: ['api', 'Upload'],
  description: 'Xóa một file đã upload trên UploadThing',
  auth: false,
  plugins: {
    'hapi-swagger': {
      payloadType: 'json',
      consumes: ['application/json'],
      produces: ['application/json'],
    },
  },
  payload: {
    parse: true,
    multipart: false,
  },
  validate: {
    payload: Joi.object({
      fileKeys: Joi.array().items(Joi.string().required()).min(1).required().description('Mảng key của các file cần xóa'),
    }).required(),
  },
  handler: async (req, h) => {
   const { fileKeys } = req.payload as { fileKeys: string[] }
    try {
      const deletedCount = await deleteUpload(fileKeys);
      return h.response({ success: true, deletedCount }).code(200);
    } catch (err: any) {
      console.error('❌ DeleteUpload Error:', err);
      return h
        .response({ success: false, message: err.message })
        .code(err.message.includes('404') ? 404 : 502);
    }
  }
};

export default { postUploadOptions, deleteUploadOptions };