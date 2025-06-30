// src/models/panel.ts
import { Schema, model, Document } from 'mongoose';

export interface imagesURL {
   url: string
   key: string
   contentType: string
}

export interface newPanel extends Document {
   images: imagesURL[]
   sort_order: number
}

const imageSchema = new Schema<imagesURL>(
  {
    url:         { type: String, required: true },
    key:         { type: String, required: true },
    contentType: { type: String, required: true },
  },
  { _id: false }
)

const panelSchema = new Schema<newPanel>(
   {
      images:     { type: [imageSchema], required: true },
      sort_order: { type: Number, required: true }
   }
);

export default model<newPanel>('Panel', panelSchema);
