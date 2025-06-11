// src/manager/Panels.ts
import Panel, { IPanel } from '../models/panel';

export interface PanelDTO {
   id:         string;
  image_url:  string;    // sẽ là "data:image/...;base64,...." hoặc URL client cung cấp
  sort_order: number;
  createdAt:  Date;
}

export interface ManagerResult<T = any> {
  status:     boolean;
  message:    string;
  data?:      T;
  statusCode: number;
}

/** Đọc một ReadableStream thành Buffer */
async function streamToBuffer(streamFile: any): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of streamFile) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

/** Chuyển Buffer + mimeType thành Data-URL */
function bufferToDataURL(buffer: Buffer, mimeType: string): string {
  const b64 = buffer.toString('base64');
  return `data:${mimeType};base64,${b64}`;
}

/** Chuyển IPanel thành PanelDTO */
function toDTO(doc: IPanel): PanelDTO {
  return {
    id:         doc._id,
    image_url:  doc.image_url,
    sort_order: doc.sort_order,
    createdAt:  doc.createdAt
  };
}

// 1) List panels
async function listPanels(): Promise<ManagerResult<PanelDTO[]>> {
  try {
    const docs = await Panel.find().sort('sort_order').exec();
    const data = docs.map(toDTO);
    return { status: true, message: 'FETCH_SUCCESS', data, statusCode: 200 };
  } catch (err: any) {
    return { status: false, message: err.message, statusCode: 500 };
  }
}

// 2) Create panel mới
async function createPanel(payload: any): Promise<ManagerResult<PanelDTO>> {
  try {
    // Tính sort_order
    let order = payload.sort_order !== undefined
      ? Number(payload.sort_order)
      : ((await Panel.findOne().sort('-sort_order').exec())?.sort_order ?? 0) + 1;

    // Xác định image_url:
    let image_url: string;
    if (payload.file) {
      // client upload file
      const buffer   = await streamToBuffer(payload.file);
      const mimeType = payload.file.hapi.headers['content-type'] as string;
      image_url = bufferToDataURL(buffer, mimeType);
    } else if (typeof payload.image_url === 'string') {
      image_url = payload.image_url;
    } else {
      throw new Error('Missing file or image_url');
    }

    // Lưu vào Mongo
    const doc = await Panel.create({ image_url, sort_order: order }) as IPanel;
    return {
      status: true,
      message: 'CREATE_SUCCESS',
      data: toDTO(doc),
      statusCode: 201
    };
  } catch (err: any) {
    return { status: false, message: err.message, statusCode: 500 };
  }
}

// 3) Update panel
async function updatePanel(
  id: string,
  payload: any
): Promise<ManagerResult<PanelDTO>> {
  try {
    const existing = await Panel.findById(id).exec() as IPanel | null;
    if (!existing) {
      return { status: false, message: 'NOT_FOUND', statusCode: 404 };
    }

    // Cập nhật sort_order nếu có
    existing.sort_order = payload.sort_order !== undefined
      ? Number(payload.sort_order)
      : existing.sort_order;

    // Cập nhật image_url
    if (payload.file) {
      const buffer   = await streamToBuffer(payload.file);
      const mimeType = payload.file.hapi.headers['content-type'] as string;
      existing.image_url = bufferToDataURL(buffer, mimeType);
    } else if (typeof payload.image_url === 'string') {
      existing.image_url = payload.image_url;
    }

    await existing.save();
    return {
      status: true,
      message: 'UPDATE_SUCCESS',
      data: toDTO(existing),
      statusCode: 200
    };
  } catch (err: any) {
    return { status: false, message: err.message, statusCode: 500 };
  }
}

// 4) Delete panel
async function deletePanel(
  id: string
): Promise<ManagerResult<{ id: string }>> {
  try {
    const doc = await Panel.findByIdAndDelete(id).exec() as IPanel | null;
    if (!doc) {
      return { status: false, message: 'NOT_FOUND', statusCode: 404 };
    }
    return {
      status: true,
      message: 'DELETE_SUCCESS',
      data: { id },
      statusCode: 200
    };
  } catch (err: any) {
    return { status: false, message: err.message, statusCode: 500 };
  }
}
export default {
  listPanels,
  createPanel,
  updatePanel,
  deletePanel
};
