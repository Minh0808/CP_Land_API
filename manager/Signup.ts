// src/manager/Signup.ts
import dotenv from 'dotenv';
dotenv.config();

import Signup, { ISignup } from '../models/Signup';

export interface SignupDTO {
   name:  string;
  email:     string;
  phone:     string;
  createdAt: Date;
}

export interface ManagerResult<T = any> {
  status:     boolean;
  message:    string;
  data?:      T;
  statusCode: number;
}

/**
 * Health check cho dịch vụ signup
 */
function health(): ManagerResult {
  return { status: true, message: 'Signup service ready', statusCode: 200 };
}

async function register(
  name:  string,
  email: string,
  phone: string
): Promise<ManagerResult<SignupDTO>> {
  try {
    // Chỉ lưu document mới; hook post-save sẽ gửi mail
    const doc = (await Signup.create({name, email, phone })) as ISignup;

    const data: SignupDTO = {
      name:  doc.name,
      email:     doc.email,
      phone:     doc.phone,
      createdAt: doc.createdAt
    };
    return { status: true, message: 'Đăng ký thành công.', data, statusCode: 200 };
  } catch (err: any) {
    console.error('[Signup] register error:', err);
    return { status: false, message: err.message || 'CREATE_ERROR', statusCode: 500 };
  }
}
export default { health, register };
