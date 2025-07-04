"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ResponseHelper;
function ResponseHelper(result, h // bắt đúng generic của Hapi
) {
    const code = result.statusCode ?? 200;
    return h.response({
        status: result.status,
        message: result.message,
        data: result.data,
    }).code(code);
}
