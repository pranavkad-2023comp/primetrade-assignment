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
      { url: 'https://primetrade-assignment-production-c054.up.railway.app', description: 'Production' },
      { url: 'http://localhost:5000', description: 'Local' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },
      schemas: {
        RegisterInput: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name:     { type: 'string', example: 'John Doe' },
            email:    { type: 'string', example: 'john@example.com' },
            password: { type: 'string', example: 'password123' },
            role:     { type: 'string', enum: ['user', 'admin'], example: 'user' },
          },
        },
        LoginInput: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email:    { type: 'string', example: 'john@example.com' },
            password: { type: 'string', example: 'password123' },
          },
        },
        TaskInput: {
          type: 'object',
          required: ['title'],
          properties: {
            title:       { type: 'string', example: 'My Task' },
            description: { type: 'string', example: 'Task details' },
            status:      { type: 'string', enum: ['todo', 'in-progress', 'done'], example: 'todo' },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
    paths: {
      '/api/v1/auth/register': {
        post: {
          tags: ['Auth'],
          summary: 'Register a new user',
          requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/RegisterInput' } } } },
          responses: { 201: { description: 'User registered successfully' }, 409: { description: 'Email already exists' } },
        },
      },
      '/api/v1/auth/login': {
        post: {
          tags: ['Auth'],
          summary: 'Login user',
          requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginInput' } } } },
          responses: { 200: { description: 'Login successful' }, 401: { description: 'Invalid credentials' } },
        },
      },
      '/api/v1/auth/me': {
        get: {
          tags: ['Auth'],
          summary: 'Get current logged-in user',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Current user data' }, 401: { description: 'Unauthorized' } },
        },
      },
      '/api/v1/tasks': {
        get: {
          tags: ['Tasks'],
          summary: 'Get all my tasks',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'List of tasks' } },
        },
        post: {
          tags: ['Tasks'],
          summary: 'Create a new task',
          security: [{ bearerAuth: [] }],
          requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/TaskInput' } } } },
          responses: { 201: { description: 'Task created' } },
        },
      },
      '/api/v1/tasks/{id}': {
        get: {
          tags: ['Tasks'],
          summary: 'Get single task',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Task data' }, 404: { description: 'Not found' } },
        },
        patch: {
          tags: ['Tasks'],
          summary: 'Update a task',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/TaskInput' } } } },
          responses: { 200: { description: 'Task updated' } },
        },
        delete: {
          tags: ['Tasks'],
          summary: 'Delete a task',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Task deleted' } },
        },
      },
      '/api/v1/tasks/admin/all': {
        get: {
          tags: ['Tasks'],
          summary: 'Admin - Get ALL tasks',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'All tasks' }, 403: { description: 'Forbidden' } },
        },
      },
    },
  },
  apis: [],
};

export const setupSwagger = (app: Express): void => {
  const spec = swaggerJsdoc(options);
//   app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(spec));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(spec));
  console.log('📄 Swagger Docs available at http://localhost:5000/api/docs');
};
