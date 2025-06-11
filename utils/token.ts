// src/utils/token.ts
import jwt, { Secret, SignOptions } from 'jsonwebtoken';

// 1) Secret key
const JWT_SECRET: Secret = process.env.JWT_SECRET || 'fallback-secret';

// 2) Lấy expiresIn từ env, ép kiểu về SignOptions['expiresIn']
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || '1h') as SignOptions['expiresIn'];

export interface TokenPayload {
  user: {
   //  id:     string;
    username: string;
    name:   string;
    email:  string;
    phone?: string;
    role?:  string;
  };
}

export default function createToken(payload: TokenPayload): string {
  const options: SignOptions = {
    algorithm: 'HS256',         // khai báo rõ thuật toán
    expiresIn: JWT_EXPIRES_IN,  // đã được ép kiểu đúng union
  };

  try {
    const token = jwt.sign(payload, JWT_SECRET, options);
    console.log('✅ JWT generated successfully:', token);
    return token;
  } catch (err) {
    // Thống kê lỗi lên console để debug
    console.error('❌ Error when signing JWT:', err);
    // Tùy bạn: có thể re-throw để cho upper layer bắt tiếp
    throw err;
    // Hoặc trả về chuỗi rỗng / null / mã lỗi tùy cách xử lý của bạn
  }
}
