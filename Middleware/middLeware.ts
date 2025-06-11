// src/middleware/authenticate.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Kế thừa Request để gán thêm user payload
export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

export function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  // Lấy header Authorization
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Thiếu hoặc sai định dạng token.' });
    return;
  }

  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as any;
    // Gán thông tin user (payload) lên req để handler sau dùng tiếp
    req.user = {
      userId: payload.userId,
      role: payload.role,
    };
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn.' });
    return;
  }
}
