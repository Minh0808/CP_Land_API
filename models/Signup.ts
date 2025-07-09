// src/utils/mailer.ts
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MANAGE_EMAIL,
    pass: process.env.EMAIL_PASS
  }
});

export async function sendSignupNotification(name: string, email: string, phone: string) {
  const signupTime = new Date().toLocaleString('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false
  });
  await transporter.sendMail({
    from: `"CP Land Website" <${process.env.MANAGE_EMAIL}>`,
    to: process.env.ADMIN_EMAIL,
    subject: '📣 New Signup từ Website',
    html: `
      <h3>Người dùng mới đăng ký:</h3>
      <p><strong>Tên:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>SĐT:</strong> ${phone}</p>
      <p><em>Thời gian:</em> ${signupTime}</p>
    `
  });
}
