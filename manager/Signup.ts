// src/manager/Signup.ts
import dotenv from 'dotenv';
dotenv.config();

import { sendSignupNotification } from '../models/Signup';

export interface SignupDTO {
   name:  string;
  email:     string;
  phone:     string;
  createdAt: string;
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

export async function register(
  name: string,
  email: string,
  phone: string
): Promise<ManagerResult<SignupDTO>> {
  try {
    // 1) Gửi mail ngay khi có request đăng ký
    await sendSignupNotification(name, email, phone);

    // 2) Trả về DTO giả (hoặc chỉ name,email,phone nếu bạn không cần createdAt)
    const now = new Date().toISOString();
    const data: SignupDTO = { name, email, phone, createdAt: now };

    return {
      status: true,
      message: 'Đăng ký thành công. Email xác nhận đã được gửi cho quản trị.',
      data,
      statusCode: 200
    };
  } catch (err: any) {
    console.error('[Signup] register error:', err);
    return {
      status: false,
      message: 'Có lỗi khi gửi mail. Vui lòng thử lại sau.',
      statusCode: 500
    };
  }
}
export default { health, register };
