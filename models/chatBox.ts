
import { Schema, model, Document, Types } from 'mongoose';

export interface IChat extends Document {
  user: Types.ObjectId;
  message: string;
  reply: string;
  createdAt: Date;
}

const chatSchema = new Schema<IChat>({
  user:      { type: Schema.Types.ObjectId, ref: 'User', required: true },
  message:   { type: String, required: true },
  reply:     { type: String, required: true },
  createdAt: { type: Date, default: () => new Date() },
});

export default model<IChat>('Chat', chatSchema);
