
import mongoose, { Schema, model } from 'mongoose';

export interface IAddress {
  provinceCode: string;
  provinceName: string;
  districtCode: string;
  districtName: string;
  wardCode:     string;
  wardName:     string;
  street?:      string;
}

export interface IPost{
  title:        string;
  description:  string;
  propertyType: string;
  price:        number;
  area:         number;
  address:      IAddress;
  images:       string[];      // rel paths like '/uploads/…'
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

const postSchema = new Schema<IPost>(
  {
    title:        { type: String, required: true },
    description:  { type: String, default: '' },
    propertyType: { type: String, required: true },
    price:        { type: Number, required: true },
    area:         { type: Number, required: true },
    address:      { type: addressSchema, required: true },
    images:       { type: [String], required: true }
  },
  {
    timestamps: true
  }
);

export const postModel = model<IPost, mongoose.Model<IPost>>('Post', postSchema);
