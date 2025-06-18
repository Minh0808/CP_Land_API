// src/manager/post.ts
import { postModel, IPost, IAddress, IImage } from '../models/post';

// DTO để trả về client
export interface ImageDTO {
  data:        string;  // data URI: "data:image/jpeg;base64,…"
  contentType: string;
}

export interface PostDTO {
  id:           string;
  title:        string;
  description:  string;
  propertyType: string;
  price:        number;
  area:         number;
  address:      IAddress;
  images:       ImageDTO[];
  createdAt:    Date;
  updatedAt:    Date;
}

export interface ManagerResult<T = any> {
  status:     boolean;
  message:    string;
  data?:      T;
  statusCode: number;
}

// helper chuyển IImage → ImageDTO
function toDTO(img: IImage): ImageDTO {
  const b64 = img.data.toString('base64');
  return {
    data:        `data:${img.contentType};base64,${b64}`,
    contentType: img.contentType
  };
}

export async function listPosts(): Promise<ManagerResult<PostDTO[]>> {
  try {
    const docs = await postModel.find().sort('-createdAt').exec();
    const data = docs.map(d => ({
      id:           d._id.toString(),
      title:        d.title,
      description:  d.description,
      propertyType: d.propertyType,
      price:        d.price,
      area:         d.area,
      address:      d.address,
      images:       d.images.map(toDTO),
      createdAt:    d.createdAt,
      updatedAt:    d.updatedAt
    }));
    return { status: true, message: 'FETCH_SUCCESS', data, statusCode: 200 };
  } catch (err: any) {
    console.error(err);
    return { status: false, message: err.message, statusCode: 500 };
  }
}

export async function getPost(id: string): Promise<ManagerResult<PostDTO>> {
  try {
    const d = await postModel.findById(id).exec();
    if (!d) return { status: false, message: 'NOT_FOUND', statusCode: 404 };
    const data: PostDTO = {
      id:           d._id.toString(),
      title:        d.title,
      description:  d.description,
      propertyType: d.propertyType,
      price:        d.price,
      area:         d.area,
      address:      d.address,
      images:       d.images.map(toDTO),
      createdAt:    d.createdAt,
      updatedAt:    d.updatedAt
    };
    return { status: true, message: 'FETCH_SUCCESS', data, statusCode: 200 };
  } catch (err: any) {
    console.error(err);
    return { status: false, message: err.message, statusCode: 500 };
  }
}

export async function createPost(
  body: Omit<IPost, 'createdAt' | 'updatedAt'>
): Promise<ManagerResult<PostDTO>> {
  try {
    const d = await postModel.create(body);
    const data: PostDTO = {
      id:           d._id.toString(),
      title:        d.title,
      description:  d.description,
      propertyType: d.propertyType,
      price:        d.price,
      area:         d.area,
      address:      d.address,
      images:       d.images.map(toDTO),
      createdAt:    d.createdAt,
      updatedAt:    d.updatedAt
    };
    return { status: true, message: 'CREATE_SUCCESS', data, statusCode: 201 };
  } catch (err: any) {
    console.error(err);
    return { status: false, message: err.message, statusCode: 500 };
  }
}

export async function updatePost(
  id: string,
  body: Partial<Omit<IPost, 'createdAt' | 'updatedAt'>>
): Promise<ManagerResult<PostDTO>> {
  try {
    const d = await postModel.findByIdAndUpdate(id, body, { new: true }).exec();
    if (!d) return { status: false, message: 'NOT_FOUND', statusCode: 404 };
    const data: PostDTO = {
      id:           d._id.toString(),
      title:        d.title,
      description:  d.description,
      propertyType: d.propertyType,
      price:        d.price,
      area:         d.area,
      address:      d.address,
      images:       d.images.map(toDTO),
      createdAt:    d.createdAt,
      updatedAt:    d.updatedAt
    };
    return { status: true, message: 'UPDATE_SUCCESS', data, statusCode: 200 };
  } catch (err: any) {
    console.error(err);
    return { status: false, message: err.message, statusCode: 500 };
  }
}

export async function deletePost(id: string): Promise<ManagerResult<{id:string}>> {
  try {
    const d = await postModel.findByIdAndDelete(id).exec();
    if (!d) return { status: false, message: 'NOT_FOUND', statusCode: 404 };
    return { status: true, message: 'DELETE_SUCCESS', data: { id }, statusCode: 200 };
  } catch (err: any) {
    console.error(err);
    return { status: false, message: err.message, statusCode: 500 };
  }
}
