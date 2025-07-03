// src/models/newFeeds.ts
import { Schema, model, Document, Types } from 'mongoose';

/** Kiểu metadata cho từng media item */
export interface IMedia {
  key:   string;
  url:   string;
  type:  'image' | 'video';
}

/** -- INPUT TYPE -- */
/** Payload mà client sẽ POST lên: chỉ gồm content + media[] */
export interface NewFeedsCreateInput {
  title:       string;
  excerpt:     string;
  content:     string;
  media:       IMedia[];
  publishedAt?: Date;
  category?:   string;
}

/** -- MONGOOSE DOCUMENT -- */
/** Đây là interface cho document trong Mongo */
export interface INewFeeds extends Document {
 _id:         Types.ObjectId;
  title:       string;
  excerpt:     string;
  content:     string;
  media:       IMedia[];
  publishedAt: Date;
  category:    string;
  createdAt:   Date;
  updatedAt:   Date;
}

/** -- OUTPUT DTO -- */
/** Kiểu mà bạn sẽ trả về client sau khi tạo xong */
export interface NewFeedsDTO {
  id:          string;
  title:       string;
  excerpt:     string;
  content:     string;
  media:       IMedia[];
  publishedAt: string;  // serialize thành ISO string
  category:    string;
}

/** -- MONGOOSE SCHEMA & MODEL -- */
const MediaSchema = new Schema<IMedia>(
  {
    key:  { type: String, required: true },
    url:  { type: String, required: true },
    type: { type: String, enum: ['image','video'], required: true },
  },
  { _id: false }
);

const NewFeedsSchema = new Schema<INewFeeds>(
  {
    title:       { type: String, required: true },
    excerpt:     { type: String, required: true },
    content:     { type: String, required: true },
    media:       { type: [MediaSchema], default: [] },
    publishedAt: { type: Date, default: () => new Date() },
    category:    { type: String, default: 'Tin tức' },
  },
  {
    timestamps: true,
    toJSON:    { virtuals: true },
    toObject:  { virtuals: true },
  }
);

// virtual 'id' để khi toJSON() có luôn .id string
NewFeedsSchema.virtual('id').get(function (this: INewFeeds) {
  return this._id.toHexString();
});

export const NewFeedsModel = model<INewFeeds>('NewFeeds', NewFeedsSchema);
