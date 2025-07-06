import { RouteOptions, Request, ResponseToolkit } from '@hapi/hapi';
import Joi from 'joi';
import NewFeeds from '../manager/newFeedsAdmin';
import { IMedia, NewFeedsCreateInput, NewFeedsDTO } from '../models/newFeedsAdmin';

// POST /api/newFeeds
export const createNewFeeds: RouteOptions = {
  auth: false,
  tags: ['api', 'NewFeeds'],
  description: 'Tạo bài đăng kèm upload ảnh/video',
  payload: {
    allow: ['application/json', 'multipart/form-data'],
    multipart: true,
    parse: true,
    output: 'data',
    maxBytes: 20 * 1024 * 1024,
  },
  validate: {
    payload: Joi.object<NewFeedsCreateInput>({
      title:       Joi.string().required().description('Tiêu đề bài viết'),
      excerpt:     Joi.string().required().description('Đoạn tóm tắt ngắn'),
      content:     Joi.string().required().description('Nội dung HTML của bài viết'),
      media: Joi.alternatives()
        .try(
          Joi.string(),
          Joi.array().items(
            Joi.object({ key: Joi.string().required(), url: Joi.string().uri().required(), type: Joi.string().valid('image','video').required() })
          )
        )
        .default('[]')
        .description('Mảng media hoặc JSON-string'),
      publishedAt: Joi.date().optional().description('Ngày đăng'),
      category:    Joi.string().optional().description('Chủ đề hoặc phân loại'),
    }).unknown(false),
    failAction: 'error'
  },
  handler: async (request: Request, h: ResponseToolkit) => {
    const payload = request.payload as { title: string; excerpt: string; content: string; media: string | IMedia[]; publishedAt?: string; category?: string };
    let mediaArr: IMedia[] = [];
    if (typeof payload.media === 'string') {
      try { mediaArr = JSON.parse(payload.media); } catch { return h.response({ message: 'Invalid media JSON' }).code(400); }
    } else {
      mediaArr = payload.media;
    }
    const dto: NewFeedsCreateInput = {
      title:       payload.title,
      excerpt:     payload.excerpt,
      content:     payload.content,
      media:       mediaArr,
      publishedAt: payload.publishedAt ? new Date(payload.publishedAt) : undefined,
      category:    payload.category,
    };
    const result = await NewFeeds.postNewFeeds(dto);
    return h.response(result.status ? result.data! : { message: result.message }).code(result.statusCode);
  }
};

// GET /api/newFeeds
export const listNewFeeds: RouteOptions = {
  auth: false,
  tags: ['api', 'NewFeeds'],
  description: 'Lấy danh sách tất cả bài đăng',
  response: {
    status: {
      200: Joi.array().items(
        Joi.object<NewFeedsDTO>({
          id:          Joi.string().required(),
          title:       Joi.string().required(),
          excerpt:     Joi.string().required(),
          content:     Joi.string().required(),
          media:       Joi.array().items(Joi.object({ key: Joi.string().required(), url: Joi.string().uri().required(), type: Joi.string().valid('image','video').required() })).required(),
          publishedAt: Joi.date().required(),
          category:    Joi.string().required(),
        })
      )
    },
    failAction: (request, h, err) => { console.error('🛑 listNewFeeds validation error:', err); throw err; }
  },
  handler: async (_request: Request, h: ResponseToolkit) => {
    const result = await NewFeeds.fetchNewFeeds();
    return h.response(result.status ? result.data! : { message: result.message }).code(result.statusCode);
  }
};

// GET /api/newFeeds/{id}
export const getNewFeedById: RouteOptions = {
  auth: false,
  tags: ['api', 'NewFeeds'],
  description: 'Lấy chi tiết bài đăng theo ID',
  validate: { params: Joi.object({ id: Joi.string().length(24).hex().required() }), failAction: 'error' },
  response: {
    status: {
      200: Joi.object<NewFeedsDTO>({
        id:          Joi.string().required(),
        title:       Joi.string().required(),
        excerpt:     Joi.string().required(),
        content:     Joi.string().required(),
        media:       Joi.array().items(Joi.object({ key: Joi.string().required(), url: Joi.string().uri().required(), type: Joi.string().valid('image','video').required() })).required(),
        publishedAt: Joi.date().required(),
        category:    Joi.string().required(),
      }),
      404: Joi.object({ message: Joi.string().required() })
    },
    failAction: (request, h, err) => { console.error('🛑 getNewFeedById validation error:', err); throw err; }
  },
  handler: async (request: Request, h: ResponseToolkit) => {
    const { id } = request.params as { id: string };
    const result = await NewFeeds.fetchNewFeedById(id);
    return h.response(result.status ? result.data! : { message: result.message }).code(result.statusCode);
  }
};

// PUT /api/newFeeds/{id}
// PUT /api/newFeeds-admin/{id}
export const updateNewFeedById: RouteOptions = {
  auth: false,
  tags: ['api','NewFeeds'],
  description: 'Cập nhật nội dung hoặc media của bài đăng',
  // ← Thêm payload multipart giống create
  payload: {
    allow: ['application/json','multipart/form-data'],
    multipart: true,
    parse: true,
    output: 'data',
    maxBytes: 20 * 1024 * 1024
  },
  validate: {
    params: Joi.object({ id: Joi.string().length(24).hex().required() }),
    payload: Joi.object<NewFeedsCreateInput>({   // lặp lại schema của create
      title:       Joi.string().optional(),
      excerpt:     Joi.string().optional(),
      content:     Joi.string().optional(),
      media: Joi.alternatives()
        .try(
          Joi.string(),
          Joi.array().items(
            Joi.object({
              key: Joi.string().required(),
              url: Joi.string().uri().required(),
              type: Joi.string().valid('image','video').required()
            })
          )
        )
        .default('[]')
    }).unknown(false),
    failAction: 'error'
  },
  handler: async (request, h) => {
    const { id } = request.params as { id: string };
    const raw = request.payload as any;
    // parse media
    let mediaArr: IMedia[]|undefined;
    if (raw.media != null) {
      mediaArr = typeof raw.media === 'string'
        ? JSON.parse(raw.media)
        : raw.media;
    }
    // build DTO
    const dto: Partial<NewFeedsCreateInput> = {
      ...(raw.title   && { title:   raw.title }),
      ...(raw.excerpt && { excerpt: raw.excerpt }),
      ...(raw.content && { content: raw.content }),
      ...(mediaArr    && { media:   mediaArr  })
    };
    const res = await NewFeeds.updateNewFeed(id, dto);
    return h
      .response(res.status ? res.data! : { message: res.message })
      .code(res.statusCode);
  }
};

// DELETE /api/newFeeds/{id}
export const deleteNewFeedById: RouteOptions = {
  auth:   false,
  tags:   ['api','NewFeeds'],
  description: 'Xóa bài đăng theo ID',
  validate: {
    params: Joi.object({ id: Joi.string().length(24).hex().required() }),
    failAction: 'error'
  },
  handler: async (request, h) => {
    const { id } = request.params as { id: string };
    const result = await NewFeeds.deleteNewFeed(id);

    if (!result.status) {
      // lỗi 404 hoặc 500 → trả message
      return h.response({ message: result.message }).code(result.statusCode);
    }

    // thành công 204 → không có body
    return h.response().code(204);
  }
};

