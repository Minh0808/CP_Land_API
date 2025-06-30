// src/manager/Panels.ts

import Panel, { newPanel, imagesURL } from '../models/panel';

export interface newPanelDTO {
   id: string;
  images:  imagesURL[];
  sort_order: number;
}
export interface CreatePanelInput {
  images: imagesURL[];
  sort_order: number;
}

interface ManagerResult<T = any> {
  status:     boolean;
  message:    string;
  data?:      T;
  statusCode: number;
}

/** Chuyển IPanel → PanelDTO */
function toDTO(doc: newPanel): newPanelDTO {
  return {
    id: doc.id,
    images: doc.images,
    sort_order: doc.sort_order,
  };
}

/** 1) List panels */

async function listPanels(): Promise<ManagerResult<newPanelDTO[]>> {
  try {
    const docs = await Panel.find().sort('sort_order').exec();
    return { status: true, message: 'FETCH_SUCCESS', data: docs.map(toDTO), statusCode: 200 };
  } catch (err: any) {
    return { status: false, message: err.message, statusCode: 500 };
  }
}
export async function getPanel(
  id: string
): Promise<ManagerResult<newPanelDTO>> {
  try {
    const doc = await Panel.findById(id).exec();
    if (!doc) return { status: false, message: 'NOT_FOUND', statusCode: 404 };
    return { status: true, message: 'FETCH_SUCCESS', data: toDTO(doc), statusCode: 200 };
  } catch (err: any) {
    return { status: false, message: err.message, statusCode: 500 };
  }
}

/** 2) Create panel mới (chỉ nhận JSON với image_url và optional sort_order) */
async function createPanel(
  payload: CreatePanelInput
): Promise<ManagerResult<newPanelDTO>> {
   try {
      const doc = await Panel.create(payload);
      await doc.save();
      return { status: true, message: 'CREATE_SUCCESS', data: toDTO(doc), statusCode: 201 };
   } catch (err: any) {
      return { status: false, message: err.message, statusCode: 500 };
   }
}

/** 3) Update panel (cho phép update image_url và/or sort_order) */
async function updatePanel(
  id: string,
  payload: CreatePanelInput
): Promise<ManagerResult<newPanelDTO>> {
  try {
    const doc = await Panel.findById(id).exec();
    if (!doc) return { status: false, message: 'NOT_FOUND', statusCode: 404 };
    if (payload.images) doc.images = payload.images;
    if (payload.sort_order !== undefined) doc.sort_order = payload.sort_order;
    await doc.save();
    return { status: true, message: 'UPDATE_SUCCESS', data: toDTO(doc), statusCode: 200 };
  } catch (err: any) {
    return { status: false, message: err.message, statusCode: 500 };
  }
}

/** 4) Delete panel */
async function deletePanel(id: string): Promise<ManagerResult<{id:string}>> {
  try {
    const doc = await Panel.findByIdAndDelete(id).exec();
    if (!doc) return { status: false, message: 'NOT_FOUND', statusCode: 404 };
    return { status: true, message: 'DELETE_SUCCESS', data: { id }, statusCode: 200 };
  } catch (err: any) {
    return { status: false, message: err.message, statusCode: 500 };
  }
}

export default { getPanel, listPanels, createPanel, updatePanel, deletePanel };