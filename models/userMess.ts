// src/models/Signup.ts
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
dotenv.config();

// Tạo transporter cho Gmail (không bật logger/debug)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MANAGE_EMAIL,
    pass: process.env.EMAIL_PASS
  }
});

// Hook gửi mail sau khi save, không in log
export async function sendMessNotification(name: string, email: string, phone: string, messager: string) {
  try {
    const signupTime = new Date().toLocaleString('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false
  });

    await transporter.sendMail({
      from:    `"CP Land Website" <${process.env.MANAGE_EMAIL}>`,
      to:      process.env.ADMIN_EMAIL,
      subject: 'Người dùng liên hệ từ website',
      html: `
        <h3>Người dùng vừa liên hệ:</h3>
        <p><strong>Ten:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>SĐT:</strong> ${phone}</p>
        <p><strong>Nội dung:</strong> ${messager}</p>
        <p><em>Thời gian:</em> ${signupTime}</p>
      `
    });
  } catch {
    // lỗi gửi mail sẽ bị silent fail
  }
}
