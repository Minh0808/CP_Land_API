// src/docs/post.ts
import { RouteOptions, Request, ResponseToolkit } from '@hapi/hapi';
import Joi from 'joi';
import Response from '../utils/Response';
import {
  listPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  PostDTO
} from '../manager/post';
import { IPost, IAddress, IImage, streamToBuffer } from '../models/post';

// Hapi multipart stream có thêm .hapi.headers
interface FileStream extends NodeJS.ReadableStream {
  hapi: {
    headers: { 'content-type': string };
    filename: string;
  };
}

export const getAllPosts: RouteOptions = {
  tags: ['api', 'Posts'],
  description: 'Lấy danh sách tất cả bài đăng',
  auth: false,
  handler: async (_req: Request, h: ResponseToolkit) => {
    const result = await listPosts();
    return Response(result, h);
  }
};

export const getSinglePost: RouteOptions = {
  tags: ['api', 'Posts'],
  description: 'Lấy chi tiết bài đăng theo ID',
  auth: false,
  validate: {
    params: Joi.object({
      id: Joi.string().length(24).required().description('ID của bài đăng')
    })
  },
  handler: async (req: Request, h: ResponseToolkit) => {
    const result = await getPost(req.params.id as string);
    return Response(result, h);
  }
};

export const postPost: RouteOptions = {
  tags: ['api', 'Posts'],
  description: 'Tạo bài đăng mới',
  auth: false,
  plugins: {
    'hapi-swagger': {
      payloadType: 'form',
      consumes: ['multipart/form-data'],
      produces: ['application/json']
    }
  },
  payload: {
    parse: true,
    multipart: true,
    output: 'stream',
    maxBytes: 20_000_000
  },
  handler: async (req: Request, h: ResponseToolkit) => {
    const p = req.payload as any;

    // 1) Validate bắt buộc
    const required = [
      'title','propertyType','price','area',
      'provinceCode','districtCode','wardCode','images'
    ];
    const missing = required.find(k => p[k] == null);
    if (missing) {
      return h.response({ status: false, message: `MISSING_${missing}` }).code(400);
    }

    // 2) Convert streams → IImage[]
    const raws = Array.isArray(p.images)
      ? (p.images as FileStream[])
      : [p.images as FileStream];
    const images: IImage[] = await Promise.all(
      raws.map(async fs => ({
        data:        await streamToBuffer(fs),
        contentType: fs.hapi.headers['content-type']
      }))
    );

    // 3) Build payload theo IPost
    const body: Omit<IPost,'createdAt'|'updatedAt'> = {
      title:        p.title,
      description:  p.description || '',
      propertyType: p.propertyType,
      price:        Number(p.price),
      area:         Number(p.area),
      address: {
        provinceCode: p.provinceCode,
        provinceName: p.provinceName,
        districtCode: p.districtCode,
        districtName: p.districtName,
        wardCode:     p.wardCode,
        wardName:     p.wardName,
        street:       p.street || ''
      } as IAddress,
      images
    };

    const result = await createPost(body);
    return Response(result, h);
  }
};

export const putPost: RouteOptions = {
  tags: ['api', 'Posts'],
  description: 'Cập nhật bài đăng',
  auth: false,
  plugins: {
    'hapi-swagger': {
      payloadType: 'form',
      consumes: ['multipart/form-data'],
      produces: ['application/json']
    }
  },
  payload: {
    parse: true,
    multipart: true,
    output: 'stream',
    maxBytes: 20_000_000
  },
  validate: {
    params: Joi.object({
      id: Joi.string().length(24).required().description('ID của bài đăng')
    })
  },
  handler: async (req: Request, h: ResponseToolkit) => {
    const p = req.payload as any;
    let images: IImage[] | undefined;

    if (p.images) {
      const raws = Array.isArray(p.images)
        ? (p.images as FileStream[])
        : [p.images as FileStream];
      images = await Promise.all(
        raws.map(async fs => ({
          data:        await streamToBuffer(fs),
          contentType: fs.hapi.headers['content-type']
        }))
      );
    }

    const dto: Partial<Omit<IPost,'createdAt'|'updatedAt'>> = {
      ...(p.title        && { title: p.title }),
      ...(p.description  && { description: p.description }),
      ...(p.propertyType && { propertyType: p.propertyType }),
      ...(p.price        && { price: Number(p.price) }),
      ...(p.area         && { area: Number(p.area) }),
      ...(p.provinceCode && {
        address: {
          provinceCode: p.provinceCode,
          provinceName: p.provinceName,
          districtCode: p.districtCode,
          districtName: p.districtName,
          wardCode:     p.wardCode,
          wardName:     p.wardName,
          street:       p.street || ''
        } as IAddress
      }),
      ...(images && { images })
    };

    const result = await updatePost(req.params.id, dto);
    return Response(result, h);
  }
};

export const deletePostDoc: RouteOptions = {
  tags: ['api', 'Posts'],
  description: 'Xóa bài đăng theo ID',
  auth: false,
  validate: {
    params: Joi.object({
      id: Joi.string().length(24).required().description('ID của bài đăng')
    })
  },
  handler: async (req: Request, h: ResponseToolkit) => {
    const result = await deletePost(req.params.id);
    return Response(result, h);
  }
};
