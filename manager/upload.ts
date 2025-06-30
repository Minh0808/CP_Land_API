// src/manager/upload.ts
import { request } from 'undici';
import FormData from 'form-data';
import fs from 'fs';
import { promisify } from 'util';

export interface uploadFile {
  name: string;
  size: number;
  type: string;
  customId: string | null;
}
export interface UploadThingItem {
  fileUrl: string;
  fileType: string;
  fileName: string;
  key: string;
  url: string;
  fields: Record<string,string>;
  pollingJwt: string;
  pollingUrl: string;
  customId: string | null;
}
export interface PrepareResult {
  data: UploadThingItem[];
}

const API_ENDPOINT = 'https://api.uploadthing.com/v6/uploadFiles';
const API_DELETE = 'https://api.uploadthing.com/v6/deleteFiles';

const API_KEY = process.env.UPLOADTHING_SECRET!;

export async function prepareUpload(
  files: uploadFile[],
  acl = 'public-read',
  metadata: any = null,
  contentDisposition = 'inline'
): Promise<PrepareResult> {
  const body = { files, acl, metadata, contentDisposition };
  const res = await request(API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-uploadthing-api-key': API_KEY,
      'x-uploadthing-version': '6.4.0',
      'x-uploadthing-be-adapter': 'hapi',
    },
    body: JSON.stringify(body),
  });

  if (res.statusCode >= 400) {
    let errBody: any;
    try { errBody = await res.body.json(); }
    catch { errBody = await res.body.text(); }
    throw new Error(`UploadThing Error [${res.statusCode}]: ${
      typeof errBody === 'string' ? errBody : JSON.stringify(errBody)
    }`);
  }
  return res.body.json() as Promise<PrepareResult>;
}

/**
 * Thực upload file lên presigned URL.
 * @param item Một phần tử từ result.data
 * @param filePath Đường dẫn tới file tạm
 */
export async function uploadFile(item: UploadThingItem, filePath: string): Promise<string> {
  const form = new FormData();

  // 1) đính kèm tất cả các field presigned
  for (const [k, v] of Object.entries(item.fields)) {
    form.append(k, v);
  }
  // 2) đính kèm file
  form.append('file', fs.createReadStream(filePath), {
    filename: item.fileName,
    contentType: item.fileType,
    knownLength: fs.statSync(filePath).size,  // cho form-data biết độ dài file
  });

  // 3) tính tổng Content-Length
  const getLength = promisify(form.getLength.bind(form));
  const length = await getLength();

  // 4) dựng headers, bao gồm Content-Type và Content-Length
  const headers = {
    ...form.getHeaders(),           // multipart/form-data; boundary=...
    'Content-Length': String(length),       // chiều dài toàn bộ body
  };

  // 5) gửi request
  const res = await request(item.url, {
    method: 'POST',
    headers,
    body: form as any,              // undici chấp nhận stream
  });

  if (res.statusCode >= 400) {
    const text = await res.body.text();
    throw new Error(`S3 Upload Error [${res.statusCode}]: ${text}`);
  }

  // thành công, trả về URL public
  return item.fileUrl;
}

export async function deleteUpload(keys: string[]) {
  // body theo spec: bạn chỉ cần truyền fileKeys (và nếu muốn customIds)
  const body = {
    fileKeys: keys
  };

  const res = await request(API_DELETE, {
    method: 'POST',
    headers: {
      'Content-Type':           'application/json',
      'X-Uploadthing-Api-Key':  API_KEY,
      'X-Uploadthing-Version':  '6.4.0',
    },
    body: JSON.stringify(body),
  });

  if (res.statusCode >= 400) {
    const text = await res.body.text();
    throw new Error(`UploadThing Delete Error [${res.statusCode}]: ${text}`);
  }

  // payload ví dụ: { success: true, deletedCount: 1 }
  const data = await res.body.json() as { success: boolean; deletedCount: number };
  if (!data.success) {
    throw new Error(`UploadThing Delete Error: deletedCount=${data.deletedCount}`);
  }
  return data.deletedCount;
}