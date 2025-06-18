import mongoose, { Schema, model } from 'mongoose';
import { Readable } from 'stream';

export interface IImage {
  data: Buffer;
  contentType: string;
}

export interface IAddress {
  provinceCode: string;
  provinceName: string;
  districtCode: string;
  districtName: string;
  wardCode:     string;
  wardName:     string;
  street?:      string;
}

export interface IPost {
  title:        string;
  description:  string;
  propertyType: string;
  price:        number;
  area:         number;
  address:      IAddress;
  images:       IImage[];
  createdAt:    Date;
  updatedAt:    Date;
}

const addressSchema = new Schema<IAddress>({
  provinceCode: { type: String, required: true },
  provinceName: { type: String, required: true },
  districtCode: { type: String, required: true },
  districtName: { type: String, required: true },
  wardCode:     { type: String, required: true },
  wardName:     { type: String, required: true },
  street:       { type: String }
});

const imageSchema = new Schema<IImage>(
  {
    data:        { type: Buffer, required: true },
    contentType: { type: String, required: true }
  },
  { _id: false }
);

const postSchema = new Schema<IPost>(
  {
    title:        { type: String, required: true },
    description:  { type: String, default: '' },
    propertyType: { type: String, required: true },
    price:        { type: Number, required: true },
    area:         { type: Number, required: true },
    address:      { type: addressSchema, required: true },
    images:       { type: [imageSchema], required: true }
  },
  { timestamps: true }
);

export async function streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

export const postModel = model<IPost>('Post', postSchema);
// bắt buộc phải export IPost để dùng ở docs và manager:
// export type { IPost };
