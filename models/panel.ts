// src/models/panel.ts
import { Schema, model, Document } from 'mongoose';

export interface IPanel extends Document {
   _id:        string;
  image_url:  string;
  sort_order: number;
  createdAt:  Date;
}

const panelSchema = new Schema<IPanel>(
  {
    image_url:  { type: String, required: true },
    sort_order: { type: Number, required: true, default: 0 }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

export default model<IPanel>('Panel', panelSchema);
