
import Mess, { UserMess } from '../models/userMess';
import dotenv from 'dotenv';
dotenv.config();

export interface UserMessDTO {
   name:  string;
  email:     string;
  phone:     string;
  messager:  string;
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
  phone: string,
  messager: string
): Promise<ManagerResult<UserMessDTO>> {
  try {
    // Chỉ lưu document mới; hook post-save sẽ gửi mail
    const doc = (await Mess.create({name, email, phone, messager})) as UserMess;

    const data: UserMessDTO = {
      name:  doc.name,
      email:     doc.email,
      phone:     doc.phone,
      messager:  doc.messager,
      createdAt: doc.createdAt
    };
    return { status: true, message: 'Liên hệ thành công.', data, statusCode: 200 };
  } catch (err: any) {
    console.error('[Signup] register error:', err);
    return { status: false, message: err.message || 'CREATE_ERROR', statusCode: 500 };
  }
}
export default { health, register };
