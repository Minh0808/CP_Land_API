// src/models/Signup.ts
import dotenv from 'dotenv';
dotenv.config();

import { Schema, model, Document } from 'mongoose';
import nodemailer from 'nodemailer';

export interface ISignup extends Document {
   name:  string;
  email:     string;
  phone:     string;
  createdAt: Date;
}

// Tạo transporter cho Gmail (không bật logger/debug)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MANAGE_EMAIL,
    pass: process.env.EMAIL_PASS
  }
});

// Định nghĩa schema
const signupSchema = new Schema<ISignup>(
  {
      name:  { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

// Hook gửi mail sau khi save, không in log
signupSchema.post('save', async function (doc: ISignup) {
  try {
    const signupTime = doc.createdAt.toLocaleString('vi-VN', {
      timeZone: 'Asia/Ho_Chi_Minh',
      year:     'numeric', month: '2-digit', day: '2-digit',
      hour:     '2-digit', minute: '2-digit', second: '2-digit',
      hour12:   false
    });

    await transporter.sendMail({
      from:    `"CP Land Website" <${process.env.MANAGE_EMAIL}>`,
      to:      process.env.ADMIN_EMAIL,
      subject: '📣 New Signup from Website',
      html: `
        <h3>Người dùng mới đăng ký:</h3>
        <p><strong>Ten:</strong> ${doc.name}</p>
        <p><strong>Email:</strong> ${doc.email}</p>
        <p><strong>SĐT:</strong> ${doc.phone}</p>
        <p><em>Thời gian:</em> ${signupTime}</p>
      `
    });
  } catch {
    // lỗi gửi mail sẽ bị silent fail
  }
});

export default model<ISignup>('Signup', signupSchema);
