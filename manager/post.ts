
import { postModel, IPost, IAddress } from '../models/post'

export interface PostDTO {
  id:           string;
  title:        string;
  description:  string;
  propertyType: string;
  price:        number;
  area:         number;
  address:      IAddress;
  images:       string[];
  createdAt:    Date;
  updatedAt:    Date;
}

export interface ManagerResult<T = any> {
  status:     boolean;
  message:    string;
  data?:      T;
  statusCode: number;
}

// 1) List all posts
export async function listPosts(): Promise<ManagerResult<PostDTO[]>> {
  try {
    // dùng .lean<IPost>() để TS hiểu docs là IPost & { _id: ObjectId }[]
    const docs = await postModel.find()
      .sort('-createdAt')
      .exec();

    const data: PostDTO[] = docs.map(d => ({
      id:           d._id.toString(),
      title:        d.title,
      description:  d.description,
      propertyType: d.propertyType,
      price:        d.price,
      area:         d.area,
      address:      d.address,
      images:       d.images,
      createdAt:    d.createdAt,
      updatedAt:    d.updatedAt
    }));

    return { status: true, message: 'FETCH_SUCCESS', data, statusCode: 200 };
  } catch (err: any) {
    console.error('[Posts] list error', err);
    return { status: false, message: err.message, statusCode: 500 };
  }
}

// 2) Get single post by id
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
      images:       d.images,
      createdAt:    d.createdAt,
      updatedAt:    d.updatedAt
    };
    return { status: true, message: 'FETCH_SUCCESS', data, statusCode: 200 };
  } catch (err: any) {
    console.error('[Posts] get error', err);
    return { status: false, message: err.message, statusCode: 500 };
  }
}

// 3) Create new post
export async function createPost(
  body: Omit<PostDTO, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<ManagerResult<PostDTO>> {
  try {
    // create() trả về Document<IPost>, không cần .lean() ở đây
    const d = await postModel.create(body);

    const data: PostDTO = {
      id:           d._id.toString(),
      title:        d.title,
      description:  d.description,
      propertyType: d.propertyType,
      price:        d.price,
      area:         d.area,
      address:      d.address,
      images:       d.images,
      createdAt:    d.createdAt,
      updatedAt:    d.updatedAt
    };
    return { status: true, message: 'CREATE_SUCCESS', data, statusCode: 201 };
  } catch (err: any) {
    console.error('[Posts] create error', err);
    return { status: false, message: err.message, statusCode: 500 };
  }
}

// 4) Update existing post
export async function updatePost(
  id: string,
  body: Partial<Omit<PostDTO, 'id' | 'createdAt' | 'updatedAt'>>,
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
      images:       d.images,
      createdAt:    d.createdAt,
      updatedAt:    d.updatedAt
    };
    return { status: true, message: 'UPDATE_SUCCESS', data, statusCode: 200 };
  } catch (err: any) {
    console.error('[Posts] update error', err);
    return { status: false, message: err.message, statusCode: 500 };
  }
}

// 5) Delete post
export async function deletePost(id: string): Promise<ManagerResult<{ id: string }>> {
  try {
    const d = await postModel.findByIdAndDelete(id).lean<IPost>().exec();
    if (!d) return { status: false, message: 'NOT_FOUND', statusCode: 404 };
    return { status: true, message: 'DELETE_SUCCESS', data: { id }, statusCode: 200 };
  } catch (err: any) {
    console.error('[Posts] delete error', err);
    return { status: false, message: err.message, statusCode: 500 };
  }
}
export { IAddress };

