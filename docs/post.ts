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
import { IImage } from '../models/post';
import { deleteUpload } from '../manager/upload';

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
      payloadType: 'json',
      consumes: ['application/json'],
      produces: ['application/json']
    }
  },
  payload: {
    parse: true,
    multipart: false,
    maxBytes: 20_000_000 
  },
  validate: {
    payload: Joi.object({
      title:        Joi.string().required(),
      description:  Joi.string().allow(''),
      propertyType: Joi.string().required(),
      price:        Joi.number().required(),
      area:         Joi.number().required(),
      address: Joi.object({
         provinceCode: Joi.string().required(),
         provinceName: Joi.string().required(),
         districtCode: Joi.string().required(),
         districtName: Joi.string().required(),
         wardCode:     Joi.string().required(),
         wardName:     Joi.string().required(),
         street:       Joi.string().allow(''),
      }).required(),
      images:       Joi.array()
                       .items(
                         Joi.object({
                           url:         Joi.string().uri().required(),
                           key:         Joi.string().required(),
                           contentType: Joi.string().required()
                         })
                       )
                       .min(1)
                       .max(10)
                       .required()
    })
  },
  handler: async (req: Request, h: ResponseToolkit) => {
    const p = req.payload as PostDTO
    const result = await createPost(p);
    return Response(result, h);
  }
};


export const putPost: RouteOptions = {
  tags: ['api', 'Posts'],
  description: 'Cập nhật bất kỳ trường nào của bài đăng',
  auth: false,
  plugins: {
    'hapi-swagger': {
      payloadType: 'json',
      consumes: ['application/json'],
      produces: ['application/json']
    }
  },
  payload: {
    parse: true,
    multipart: false,
    maxBytes: 20_000_000
  },
  validate: {
    params: Joi.object({
      id: Joi.string().length(24).required().description('ID của bài đăng')
    }),
    payload: Joi.object().unknown(true)
  },
  handler: async (req: Request, h: ResponseToolkit) => {
   const updates = req.payload as Record<string, any>
    const {data: post} = await getPost(req.params.id);
    if(!post) return Response({message: 'Post not found'}, h);
    if(Array.isArray(updates.images)){
       const newKeys = new Set(updates.images.map((image: IImage) => image.key))
       const oldKeys = post.images.map((image: IImage) => image.key)
       const deleteKeys = oldKeys.filter(key => !newKeys.has(key))
       if(deleteKeys.length > 0) await deleteUpload(deleteKeys);
    }

    const result = await updatePost(req.params.id, updates);
    return Response(result, h);
  }
}

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
   const {data: post} = await getPost(req.params.id);
    if(!post) return Response({message: 'Post not found'}, h);
   if(post.images.length > 0){
      const deleteKeys = post.images.map((image: IImage) => image.key)
      if(deleteKeys.length > 0) await deleteUpload(deleteKeys);
   }
    
    const result = await deletePost(req.params.id);
    return Response(result, h);
  }
};


