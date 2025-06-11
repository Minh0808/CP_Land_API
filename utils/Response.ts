// src/utils/Response.ts
import type { ResponseToolkit, ReqRefDefaults } from '@hapi/hapi';

export default function ResponseHelper(
  result: {
    status?: boolean;
    message?: string;
    data?: any;
    statusCode?: number;
  },
  h: ResponseToolkit<ReqRefDefaults>      // bắt đúng generic của Hapi
) {
  const code = result.statusCode ?? 200;
  return h.response({
    status:  result.status,
    message: result.message,
    data:    result.data,
  }).code(code);
}
