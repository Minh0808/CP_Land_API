import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error('❌ Thiếu biến MONGODB_URI trong .env');
}

export default async function connectDB() {
  try {
    await mongoose.connect(uri!);
    console.log('✅ Đã kết nối MongoDB thành công');
  } catch (err) {
    console.error('❌ Kết nối MongoDB thất bại:', err);
    process.exit(1);
  }
}
