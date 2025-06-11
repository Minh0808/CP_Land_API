// src/docs/posts.ts
import { RouteOptions, Request, ResponseToolkit } from '@hapi/hapi';
import Joi from 'joi';
import {
  listPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  PostDTO,
  IAddress
} from '../manager/post';
import Response from '../utils/Response';

export const getAllPosts: RouteOptions = {
  tags:        ['api', 'Posts'],
  description: 'Lấy danh sách tất cả bài đăng',
  auth:        false,
  handler: async (_req: Request, h: ResponseToolkit) => {
    const result = await listPosts();
    return Response(result, h);
  }
};

export const getSinglePost: RouteOptions = {
  tags:        ['api', 'Posts'],
  description: 'Lấy chi tiết bài đăng theo ID',
  auth:        false,
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
  tags:        ['api', 'Posts'],
  description: 'Tạo bài đăng mới',
  auth:        false,
  validate: {
    payload: Joi.object({
      title:        Joi.string().required().description('Tiêu đề bài đăng'),
      description:  Joi.string().optional().description('Mô tả'),
      propertyType: Joi.string().required().description('Loại bất động sản'),
      price:        Joi.number().required().description('Giá'),
      area:         Joi.number().required().description('Diện tích'),
      address:      Joi.object<IAddress>({
        provinceCode: Joi.string().required(),
        provinceName: Joi.string().required(),
        districtCode: Joi.string().required(),
        districtName: Joi.string().required(),
        wardCode:     Joi.string().required(),
        wardName:     Joi.string().required(),
        street:       Joi.string().optional()
      }).required(),
      images:       Joi.array().items(Joi.string()).min(1).required().description('Danh sách URL ảnh')
    })
  },
  handler: async (req: Request, h: ResponseToolkit) => {
    const payload = req.payload as Omit<PostDTO, 'id' | 'createdAt' | 'updatedAt'>;
    const result = await createPost(payload);
    return Response(result, h);
  }
};

export const putPost: RouteOptions = {
  tags:        ['api', 'Posts'],
  description: 'Cập nhật bài đăng',
  auth:        false,
  validate: {
    params: Joi.object({
      id: Joi.string().length(24).required().description('ID của bài đăng')
    }),
    payload: Joi.object({
      title:        Joi.string().optional().description('Tiêu đề bài đăng'),
      description:  Joi.string().optional().description('Mô tả'),
      propertyType: Joi.string().optional().description('Loại bất động sản'),
      price:        Joi.number().optional().description('Giá'),
      area:         Joi.number().optional().description('Diện tích'),
      address:      Joi.object<Partial<IAddress>>({
        provinceCode: Joi.string().optional(),
        provinceName: Joi.string().optional(),
        districtCode: Joi.string().optional(),
        districtName: Joi.string().optional(),
        wardCode:     Joi.string().optional(),
        wardName:     Joi.string().optional(),
        street:       Joi.string().optional()
      }).optional(),
      images:       Joi.array().items(Joi.string()).optional().description('Danh sách URL ảnh mới')
    }).min(1)
  },
  handler: async (req: Request, h: ResponseToolkit) => {
    const id      = req.params.id as string;
    const payload = req.payload as Partial<Omit<PostDTO, 'id' | 'createdAt' | 'updatedAt'>>;
    const result  = await updatePost(id, payload);
    return Response(result, h);
  }
};

export const deletePostDoc: RouteOptions = {
  tags:        ['api', 'Posts'],
  description: 'Xoá bài đăng theo ID',
  auth:        false,
  validate: {
    params: Joi.object({
      id: Joi.string().length(24).required().description('ID của bài đăng')
    })
  },
  handler: async (req: Request, h: ResponseToolkit) => {
    const result = await deletePost(req.params.id as string);
    return Response(result, h);
  }
};
