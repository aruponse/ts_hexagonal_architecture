import swaggerJsdoc from 'swagger-jsdoc';
import { appConfig } from './app.config';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hexagonal Architecture API',
      version: '1.0.0',
      description: 'API RESTful con Arquitectura Hexagonal usando TypeScript, Express, TypeORM y PostgreSQL',
      contact: {
        name: 'Alfonso',
        email: 'alfonso@example.com',
      },
    },
    servers: [
      {
        url: `http://localhost:${appConfig.port}`,
        description: 'Servidor de desarrollo',
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
      schemas: {
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Tipo de error',
            },
            message: {
              type: 'string',
              description: 'Mensaje de error',
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp del error',
            },
            path: {
              type: 'string',
              description: 'Ruta donde ocurrió el error',
            },
          },
        },
        ValidationError: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              example: 'Validation Error',
            },
            message: {
              type: 'string',
              description: 'Mensaje de validación',
            },
            details: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: {
                    type: 'string',
                    description: 'Campo que falló la validación',
                  },
                  message: {
                    type: 'string',
                    description: 'Mensaje de error específico',
                  },
                },
              },
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
            },
            path: {
              type: 'string',
            },
          },
        },
        SignupRequest: {
          type: 'object',
          required: ['email', 'password', 'firstName', 'lastName'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'Email del usuario',
              example: 'usuario@example.com',
            },
            password: {
              type: 'string',
              minLength: 6,
              description: 'Contraseña del usuario',
              example: 'password123',
            },
            firstName: {
              type: 'string',
              description: 'Nombre del usuario',
              example: 'Juan',
            },
            lastName: {
              type: 'string',
              description: 'Apellido del usuario',
              example: 'Pérez',
            },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'Email del usuario',
              example: 'usuario@example.com',
            },
            password: {
              type: 'string',
              description: 'Contraseña del usuario',
              example: 'password123',
            },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            message: {
              type: 'string',
              example: 'Usuario autenticado exitosamente',
            },
            data: {
              type: 'object',
              properties: {
                user: {
                  $ref: '#/components/schemas/UserResponse',
                },
                token: {
                  type: 'string',
                  description: 'JWT token',
                  example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                },
              },
            },
          },
        },
        UserResponse: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'ID único del usuario',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email del usuario',
            },
            firstName: {
              type: 'string',
              description: 'Nombre del usuario',
            },
            lastName: {
              type: 'string',
              description: 'Apellido del usuario',
            },
            role: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  format: 'uuid',
                },
                name: {
                  type: 'string',
                  example: 'USER',
                },
              },
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de creación',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de última actualización',
            },
          },
        },
        UsersListResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            message: {
              type: 'string',
              example: 'Usuarios obtenidos exitosamente',
            },
            data: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/UserResponse',
              },
            },
            pagination: {
              type: 'object',
              properties: {
                total: {
                  type: 'number',
                  description: 'Total de usuarios',
                },
                page: {
                  type: 'number',
                  description: 'Página actual',
                },
                limit: {
                  type: 'number',
                  description: 'Límite por página',
                },
              },
            },
          },
        },
        WelcomeResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            message: {
              type: 'string',
              example: '¡Bienvenido a la API!',
            },
            data: {
              type: 'object',
              properties: {
                api: {
                  type: 'string',
                  example: 'Hexagonal Architecture API',
                },
                version: {
                  type: 'string',
                  example: '1.0.0',
                },
                timestamp: {
                  type: 'string',
                  format: 'date-time',
                },
              },
            },
          },
        },
        HealthResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'OK',
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
            },
            uptime: {
              type: 'number',
              description: 'Tiempo de actividad en segundos',
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    './src/adapters/inbound/http/routes/*.ts',
    './src/adapters/inbound/http/controllers/*.ts',
  ],
};

export const swaggerSpec = swaggerJsdoc(options);
