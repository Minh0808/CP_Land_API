import path from 'path';
import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CP_Land API',
      version: '1.0.0',
      description: 'API docs cho dự án CP_Land',
    },
    servers: [
      { url: 'http://localhost:4000' },
    ],
  },
  apis: [
    // thêm đường dẫn đến các file YAML
    path.resolve(__dirname, '../docs/*.yaml'),
  ],
};

export const swaggerSpec = swaggerJSDoc(options);
