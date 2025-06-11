// src/Types/User.ts
export interface IUser {
   username: string;
   name: string;
   email: string;
   password: string;
   phone: string;
   role: 'user' | 'admin';
   createdAt: Date;
}
