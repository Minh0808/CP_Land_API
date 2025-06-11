// src/manager/user.ts
import User from '../models/user';
import bcrypt from 'bcrypt';

export interface CreateUserInput {
  username: string;
  name:     string;
  email:    string;
  password: string;
  phone:    string;
  role?:    'user' | 'admin';
}

export interface UserResult {
  status:     boolean;
  message:    string;
  data?:      any;
  statusCode: number;
}

export async function createUser(input: CreateUserInput): Promise<UserResult> {
  try {
    // 1) Check trùng email & username
    if (await User.exists({ email: input.email })) {
      return { status: false, message: 'EMAIL_ALREADY_EXISTS', statusCode: 400 };
    }
    if (await User.exists({ username: input.username })) {
      return { status: false, message: 'USERNAME_ALREADY_EXISTS', statusCode: 400 };
    }

    // 2) Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(input.password, salt);

    // 3) Tạo document mới
    const newUser = new User({
      username:     input.username,
      name:         input.name,
      email:        input.email,
      passwordHash,
      phone:        input.phone,
      role:         input.role || 'user',
    });

    // 4) Lưu xuống DB
    const saved = await newUser.save();

    // 5) Trả về data (toJSON đã loại bỏ passwordHash & __v)
    const { id, username, name, email, phone, role, createdAt } = saved.toJSON();
    return {
      status:     true,
      message:    'USER_CREATED',
      data:       { id, username, name, email, phone, role, createdAt },
      statusCode: 201,
    };
  } catch (err: any) {
    console.error('createUser error:', err);
    return {
      status:     false,
      message:    err.message || 'INTERNAL_ERROR',
      statusCode: 500,
    };
  }
}

/**
 * Tìm user theo username (không phải _id).
 */
export async function getUserByUsername(username: string): Promise<UserResult> {
  try {
    const userDoc = await User.findOne({ username }).select('-passwordHash');
    if (!userDoc) {
      return { status: false, message: 'USER_NOT_FOUND', statusCode: 404 };
    }

    const { id, username: u, name, email, phone, role, createdAt } = userDoc.toJSON();
    return {
      status:     true,
      message:    'USER_FETCHED',
      data:       { id, username: u, name, email, phone, role, createdAt },
      statusCode: 200,
    };
  } catch (err: any) {
    console.error('getUserByUsername error:', err);
    return {
      status:     false,
      message:    err.message || 'INTERNAL_ERROR',
      statusCode: 500,
    };
  }
}

export default {
  createUser,
  getUserByUsername
};
