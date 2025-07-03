// src/manager/newFeeds.ts
import { NewFeedsModel } from '../models/newFeedsAdmin';
import { INewFeeds, NewFeedsCreateInput, NewFeedsDTO } from '../models/newFeedsAdmin';

export interface ManagerResult<T> {
  status:     boolean;
  message:    string;
  data?:      T;
  statusCode: number;
}

function toDTO(doc: INewFeeds): NewFeedsDTO {
  return {
    id:          doc._id.toString(),
    title:       doc.title,
    excerpt:     doc.excerpt,
    content:     doc.content,
    media:       doc.media.map(m => ({
      key:  m.key,
      url:  m.url,
      type: m.type
    })),
    publishedAt: doc.publishedAt.toISOString(),
    category:    doc.category
  };
}

/**
 * Tạo mới một NewFeeds document
 */
async function postNewFeeds(
  payload: NewFeedsCreateInput
): Promise<ManagerResult<NewFeedsDTO>> {
  try {
    const doc = new NewFeedsModel(payload);
    await doc.save();

    return {
      status:     true,
      message:    'CREATE_SUCCESS',
      data:       toDTO(doc),
      statusCode: 201,
    };
  } catch (err: any) {
    return {
      status:     false,
      message:    err.message || 'CREATE_FAILED',
      statusCode: 500,
    };
  }
}

/**
 * Lấy danh sách tất cả bài viết, sắp xếp mới nhất trước
 */
async function fetchNewFeeds(): Promise<ManagerResult<NewFeedsDTO[]>> {
  try {
    const docs = await NewFeedsModel
      .find()
      .sort({ createdAt: -1 })
      .exec();

    const dtos = docs.map(toDTO);
    return {
      status:     true,
      message:    'FETCH_SUCCESS',
      data:       dtos,
      statusCode: 200,
    };
  } catch (err: any) {
    return {
      status:     false,
      message:    err.message || 'FETCH_FAILED',
      statusCode: 500,
    };
  }
}

/**
 * Lấy chi tiết một bài viết theo ID
 */
async function fetchNewFeedById(
  id: string
): Promise<ManagerResult<NewFeedsDTO>> {
  try {
    const doc = await NewFeedsModel.findById(id).exec();
    if (!doc) {
      return {
        status:     false,
        message:    'NOT_FOUND',
        statusCode: 404,
      };
    }
    return {
      status:     true,
      message:    'FETCH_SUCCESS',
      data:       toDTO(doc),
      statusCode: 200,
    };
  } catch (err: any) {
    return {
      status:     false,
      message:    err.message || 'FETCH_FAILED',
      statusCode: 500,
    };
  }
}

/**
 * Cập nhật một NewFeeds theo ID
 */
async function updateNewFeed(
  id: string,
  payload: Partial<NewFeedsCreateInput>
): Promise<ManagerResult<NewFeedsDTO>> {
  try {
    const doc = await NewFeedsModel.findByIdAndUpdate(id, payload, { new: true }).exec();
    if (!doc) {
      return { status: false, message: 'NOT_FOUND', statusCode: 404 };
    }
    return {
      status:     true,
      message:    'UPDATE_SUCCESS',
      data:       toDTO(doc),
      statusCode: 200,
    };
  } catch (err: any) {
    return {
      status:     false,
      message:    err.message || 'UPDATE_FAILED',
      statusCode: 500,
    };
  }
}

/**
 * Xóa một NewFeeds theo ID
 */
async function deleteNewFeed(
  id: string
): Promise<ManagerResult<null>> {
  try {
    const res = await NewFeedsModel.findByIdAndDelete(id).exec();
    if (!res) {
      return { status: false, message: 'NOT_FOUND', statusCode: 404 };
    }
    return { status: true, message: 'DELETE_SUCCESS', statusCode: 204 };
  } catch (err: any) {
    return {
      status:     false,
      message:    err.message || 'DELETE_FAILED',
      statusCode: 500,
    };
  }
}

export default {
  postNewFeeds,
  fetchNewFeeds,
  fetchNewFeedById,
  updateNewFeed,
  deleteNewFeed
};

