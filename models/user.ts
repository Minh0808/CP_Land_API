// src/models/User.ts
import { Schema, model, Document } from 'mongoose';  // ← giá trị import
import bcrypt from 'bcrypt';
import type { IUser } from '../Types/user';          // ← chỉ type-import IUser

// 1) IUserDocument là Document + IUser
interface IUserDocument extends Document, IUser {
  passwordHash: string;
  comparePassword(candidate: string): Promise<boolean>;
}

const userSchema = new Schema<IUserDocument>(
  {
      username:     { type: String, required: true, unique: true, lowercase: true, trim: true },
      name:         { type: String, required: true, trim: true },
      email:        { type: String, required: true, unique: true, lowercase: true, trim: true },
      passwordHash: { type: String, required: true },
      phone:        { type: String, required: true },
      role:         { type: String, required: true, default: 'user', enum: ['user','admin'] },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(_doc, ret) {
        delete ret.passwordHash;
        delete ret.__v;
      },
    },
    toObject: { virtuals: true }
  }
);

// 2) Virtual field
userSchema.virtual('password').set(function (this: IUserDocument, plain: string) {
   const salt = bcrypt.genSaltSync(10);
   this.passwordHash = bcrypt.hashSync(plain, salt);
});

// 3) Method comparePassword
userSchema.methods.comparePassword = function (this: IUserDocument, candidate: string) {
   return bcrypt.compare(candidate, this.passwordHash);
};

// 4) Export model
export default model<IUserDocument>('User', userSchema);
