import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'PrimeTrade API',
      version: '1.0.0',
      description: 'Scalable REST API with JWT Auth & Role-Based Access',
    },
    servers: [
      {
        url: 'https://primetrade-assignment-production-c054.up.railway.app',
        description: 'Production Server',
      },
      {
        url: 'http://localhost:5000',
        description: 'Local Development',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/v1/*.ts'],
};

export const setupSwagger = (app: Express): void => {
  const spec = swaggerJsdoc(options);
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(spec));
  console.log('📄 Swagger Docs available at http://localhost:5000/api/docs');
};
