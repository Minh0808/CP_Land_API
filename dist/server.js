"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hapi_1 = __importDefault(require("@hapi/hapi"));
const inert_1 = __importDefault(require("@hapi/inert"));
const vision_1 = __importDefault(require("@hapi/vision"));
const hapi_swagger_1 = __importDefault(require("hapi-swagger"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const hapi_auth_jwt2_1 = __importDefault(require("hapi-auth-jwt2"));
const MongoDB_1 = __importDefault(require("./config/MongoDB"));
const auth_1 = __importDefault(require("./routes/auth"));
const Signup_1 = __importDefault(require("./routes/Signup"));
const user_1 = __importDefault(require("./routes/user"));
const chatbox_1 = __importDefault(require("./routes/chatbox"));
const newFeeds_1 = __importDefault(require("./routes/newFeeds"));
const panels_1 = __importDefault(require("./routes/panels"));
const post_1 = __importDefault(require("./routes/post"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../.env') });
const raw = process.env.CORS_ORIGINS ?? '';
let corsOrigins = raw.split(',').map(s => s.trim()).filter(Boolean);
if (corsOrigins.length === 0) {
    corsOrigins = ['*'];
}
const PORT = Number(process.env.PORT ?? 4000);
const init = async () => {
    // 1) Kết nối DB
    await (0, MongoDB_1.default)();
    // 2) Khởi tạo server
    const server = hapi_1.default.server({
        port: PORT,
        host: 'localhost',
        routes: {
            cors: {
                origin: corsOrigins,
                credentials: true,
            },
            files: {
                relativeTo: path_1.default.resolve(__dirname, 'public'),
            },
        },
    });
    // 3) Đăng ký plugins: Inert, Vision, hapi-swagger, hapi-auth-jwt2
    await server.register([
        { plugin: inert_1.default },
        { plugin: vision_1.default },
        {
            plugin: hapi_swagger_1.default,
            options: {
                info: {
                    title: 'CP_Land API',
                    version: '1.0.0',
                },
                grouping: 'tags',
                securityDefinitions: {
                    Bearer: {
                        type: 'apiKey',
                        name: 'Authorization',
                        in: 'header',
                        'x-keyPrefix': 'Bearer ',
                    },
                },
                security: [{ Bearer: [] }],
            },
        },
        { plugin: hapi_auth_jwt2_1.default },
    ]);
    // 4) Định nghĩa auth strategy “jwt”
    server.auth.strategy('jwt', 'jwt', {
        key: process.env.JWT_SECRET, // <— bí mật JWT của bạn
        validate: async (decoded, // decoded chính là payload của token
        request, h) => {
            // Giả sử payload bạn sign khi login có dạng { user: { id, username, ... }, iat, exp }
            const { user } = decoded;
            if (!user?.id) {
                return { isValid: false };
            }
            return {
                isValid: true,
                credentials: { user },
            };
        },
        verifyOptions: {
            aud: false,
            iss: false,
            sub: false,
            nbf: true,
            exp: true,
            timeSkewSec: 15,
        },
    });
    // 5) Mặc định dùng JWT cho tất cả route
    server.auth.default('jwt');
    // 6) Đăng ký các route
    // Các route login / signup phải tắt auth trong file route
    server.route(auth_1.default);
    server.route(Signup_1.default);
    // Những route còn lại kế thừa default('jwt')
    server.route(user_1.default);
    server.route(chatbox_1.default);
    server.route(newFeeds_1.default);
    server.route(panels_1.default);
    server.route(post_1.default);
    // 7) Start
    await server.start();
    console.log(`🚀 Server running at ${server.info.uri}`);
    console.log('🌐 CORS origins:', corsOrigins);
};
process.on('unhandledRejection', (err) => {
    console.error(err);
    process.exit(1);
});
init();
