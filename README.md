# API RESTful con Arquitectura Hexagonal

Una API RESTful implementada siguiendo los principios de **Arquitectura Hexagonal** utilizando **TypeScript**, **Express**, **Bun**, **TypeORM** y **SQLite/PostgreSQL**.

## 📖 Documentación Swagger

La documentación completa de la API está disponible en Swagger UI:

- **Development**: http://localhost:3000/api-docs
- **Staging**: http://localhost:3000/api-docs

> **Nota**: Swagger solo está disponible en los ambientes de development y staging.

## 🏗️ Arquitectura

Este proyecto implementa una arquitectura hexagonal (también conocida como "Ports and Adapters") que separa la lógica de negocio de los detalles de implementación:

### Capas de la Arquitectura

1. **Capa de Dominio** (`src/modules/auth/domain/`)
   - **Entities**: `User`, `Role` - Objetos con identidad y reglas de negocio
   - **Ports**: Interfaces que definen contratos (repositorios, servicios)
   - **Value Objects**: `Password` - Objetos inmutables sin identidad
   - **Types**: Definiciones de tipos del dominio

2. **Capa de Aplicación** (`src/modules/auth/application/`)
   - **Use Cases**: Casos de uso específicos del negocio
   - **Services**: Coordinan múltiples use cases
   - **Mappers**: Transforman datos entre capas
   - **Validators**: Validan datos de entrada

3. **Capa de Infraestructura** (`src/modules/auth/infrastructure/`)
   - **Inbound Adapters**: Controllers, Routes, Middlewares, DTOs
   - **Outbound Adapters**: Repositories, Services externos, Persistencia
   - **Factories**: Creación de dependencias
   - **Dependencies**: Inyección de dependencias

### Diagrama de Arquitectura Hexagonal

```
┌─────────────────────────────────────────────────────────────────┐
│                    INBOUND ADAPTERS (HTTP)                      │
├─────────────────────────────────────────────────────────────────┤
│  Controllers  │  Routes  │  Middlewares  │  DTOs  │  Validation │
│  ┌─────────┐  │ ┌─────┐  │  ┌─────────┐  │ ┌───┐  │  ┌────────┐ │
│  │ Auth    │  │ │Auth │  │  │ Auth    │  │ │Req│  │  │ Class  │ │
│  │ User    │  │ │User │  │  │ Valid   │  │ │Res│  │  │ Valid  │ │
│  │ Public  │  │ │Pub  │  │  │ CORS    │  │ │DTO│  │  │        │ │
│  └─────────┘  │ └─────┘  │  └─────────┘  │ └───┘  │  └────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    CAPA DE APLICACIÓN                           │
├─────────────────────────────────────────────────────────────────┤
│  Use Cases        │  Services      │  Mappers    │  Validators  │
│  ┌─────────────┐  │ ┌───────────┐  │ ┌────────┐  │ ┌─────────┐  │
│  │ Signup      │  │ │ Auth      │  │ │ User   │  │ │ Auth    │  │
│  │ Login       │  │ │ Service   │  │ │ Mapper │  │ │ Valid   │  │
│  │ GetProfile  │  │ │           │  │ │        │  │ │         │  │
│  │ GetUsers    │  │ │           │  │ │        │  │ │         │  │
│  └─────────────┘  │ └───────────┘  │ └────────┘  │ └─────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌────────────────────────────────────────────────────────────────────┐
│                      CAPA DE DOMINIO                               │
├────────────────────────────────────────────────────────────────────┤
│  Entities        │  Ports (Interfaces)  │  Value Objects  │ Types  │
│  ┌─────────────┐ │ ┌─────────────────┐  │ ┌─────────────┐ │ ┌────┐ │
│  │ User        │ │ │ IUserRepository │  │ │ Password    │ │ │User│ │
│  │ Role        │ │ │ IRoleRepository │  │ │ (VO)        │ │ │Auth│ │
│  │ (Business   │ │ │ IPasswordService│  │ │             │ │ │Type│ │
│  │  Logic)     │ │ │ ITokenService   │  │ │             │ │ │    │ │
│  └─────────────┘ │ └─────────────────┘  │ └─────────────┘ │ └────┘ │
└────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌───────────────────────────────────────────────────────────────────┐
│                   OUTBOUND ADAPTERS                               │
├───────────────────────────────────────────────────────────────────┤
│  Repositories     │  Services        │  Persistence  │  Factories │
│  ┌─────────────┐  │ ┌─────────────┐  │ ┌──────────┐  │ ┌────────┐ │
│  │ Postgres    │  │ │ Bcrypt      │  │ │ User     │  │ │ Repo   │ │
│  │ User Repo   │  │ │ Password    │  │ │ Role     │  │ │ Service│ │
│  │ Postgres    │  │ │ JWT Token   │  │ │ Entities │  │ │ Factory│ │
│  │ Role Repo   │  │ │ Service     │  │ │ (TypeORM)│  │ │        │ │
│  └─────────────┘  │ └─────────────┘  │ └──────────┘  │ └────────┘ │
└───────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌───────────────────────────────────────────────────────────────────┐
│                    INFRAESTRUCTURA                                │
├───────────────────────────────────────────────────────────────────┤
│  Database (SQLite/PostgreSQL)  │  External Services (JWT, bcrypt) │
└───────────────────────────────────────────────────────────────────┘
```

## 🚀 Características

- ✅ **Autenticación JWT** con tokens seguros
- ✅ **Cifrado de contraseñas** con bcrypt
- ✅ **Validación de entrada** con class-validator
- ✅ **Middleware de seguridad** con Helmet
- ✅ **Rate limiting** para protección contra ataques
- ✅ **CORS** configurado
- ✅ **Base de datos** con TypeORM (SQLite/PostgreSQL)
- ✅ **Pruebas unitarias, integración y E2E**
- ✅ **Manejo de errores** centralizado
- ✅ **Logging** estructurado
- ✅ **Documentación Swagger** completa
- ✅ **4 ambientes configurados** (dev, test, staging, production)
- ✅ **Configuración flexible de base de datos** por ambiente

## 📋 Endpoints

### Públicos
- `GET /api/public/welcome` - Mensaje de bienvenida
- `GET /health` - Health check del servidor

### Autenticación
- `POST /api/auth/signup` - Registro de usuario
- `POST /api/auth/login` - Inicio de sesión

### Usuarios (Protegidos)
- `GET /api/user/profile` - Perfil del usuario autenticado
- `GET /api/users` - Lista de usuarios (solo administradores)

### Documentación
- `GET /api-docs` - Documentación Swagger (solo en dev/staging)

## 🛠️ Stack Tecnológico

- **Runtime**: Bun
- **Lenguaje**: TypeScript
- **Framework**: Express.js
- **ORM**: TypeORM
- **Base de datos**: SQLite (desarrollo) / PostgreSQL (producción)
- **Autenticación**: JWT
- **Validación**: class-validator
- **Testing**: Bun Test
- **Seguridad**: Helmet, bcrypt, express-rate-limit

## 📦 Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd ts_hexagonal_architecture
```

2. **Instalar dependencias**
```bash
bun install
```

3. **Configurar variables de entorno**
```bash
# Copiar archivo de ejemplo
cp env.example env.local

# Editar configuración local (opcional)
# El archivo env.local sobrescribe las configuraciones por defecto
```

4. **Configurar base de datos**
```bash
# La base de datos se crea automáticamente al iniciar el servidor
# Los roles se crean automáticamente en el primer inicio
```

## ⚡ Inicio Rápido

### Opción 1: Desarrollo Local
```bash
# 1. Clonar e instalar
git clone <repository-url>
cd ts_hexagonal_architecture
bun install

# 2. Iniciar servidor
bun run dev

# 3. Verificar funcionamiento
curl http://localhost:3000/health

# 4. Ver documentación Swagger
# Abrir: http://localhost:3000/api-docs
```

### Opción 2: Con Postman
```bash
# 1. Iniciar servidor
bun run dev

# 2. Importar colección de Postman
# - Hexagonal_Architecture_API.postman_collection.json
# - Hexagonal_Architecture_Environments.postman_environment.json

# 3. Ejecutar flujo de pruebas en Postman
```

### Opción 3: Ejecutar Tests
```bash
# Ejecutar todos los tests
bun test

# Ver resultados: 19 tests pasando ✅
```

## 🌍 Ambientes de Ejecución

El proyecto está configurado para funcionar en 4 ambientes diferentes:

### 1. Development (Desarrollo)
```bash
# Con SQLite (por defecto)
bun run dev

# Con PostgreSQL
bun run dev:postgres
```
- **Base de datos**: SQLite por defecto, configurable con PostgreSQL
- **Swagger**: ✅ Habilitado en `/api-docs`
- **Puerto**: 3000

### 2. Test (Testing)
```bash
# Con SQLite (por defecto)
bun test

# Con PostgreSQL
bun test:postgres
```
- **Base de datos**: SQLite por defecto, configurable con PostgreSQL
- **Swagger**: ❌ Deshabilitado
- **Puerto**: 3001

### 3. Staging (Pre-producción)
```bash
# Con PostgreSQL (por defecto)
bun run start:staging

# Con SQLite
NODE_ENV=staging USE_SQLITE=true bun run src/index.ts
```
- **Base de datos**: PostgreSQL por defecto, configurable con SQLite
- **Swagger**: ✅ Habilitado en `/api-docs`
- **Puerto**: 3000

### 4. Production (Producción)
```bash
# Solo con PostgreSQL
bun run start:prod
```
- **Base de datos**: Solo PostgreSQL (no permite SQLite)
- **Swagger**: ❌ Deshabilitado
- **Puerto**: 3000

## 🚀 Comandos de Ejecución

### Desarrollo
```bash
# Iniciar servidor de desarrollo
bun run dev

# Iniciar con PostgreSQL
bun run dev:postgres
```

### Testing
```bash
# Ejecutar tests
bun test

# Tests con PostgreSQL
bun test:postgres

# Tests en modo watch
bun test:watch

# Tests con cobertura
bun test:coverage
```

### Staging
```bash
# Iniciar en staging
bun run start:staging
```

### Producción
```bash
# Build para producción
bun run build:prod

# Iniciar en producción
bun run start:prod
```

## 🧪 Pruebas

```bash
# Ejecutar todas las pruebas
bun test

# Pruebas unitarias
bun test tests/unit/

# Pruebas de integración
bun test tests/integration/

# Pruebas E2E
bun test tests/e2e/

# Con cobertura
bun test:coverage

# Tests en modo watch
bun test:watch
```

## 📊 Ejemplos de Uso

### 1. Registro de Usuario
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

**Respuesta exitosa (201):**
```json
{
  "message": "User created successfully",
  "user": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": {
      "id": "c3f4c921-4e52-4fd5-b86c-1256c167416d",
      "name": "user",
      "description": "Standard user role with limited access"
    },
    "isActive": true,
    "createdAt": "2025-09-13T06:00:00.000Z",
    "updatedAt": "2025-09-13T06:00:00.000Z"
  }
}
```

**Respuesta de error (400):**
```json
{
  "error": "User with email user@example.com already exists"
}
```

### 2. Inicio de Sesión
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'
```

**Respuesta exitosa (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhMWIyYzNkNC1lNWY2LTc4OTAtYWJjZC1lZjEyMzQ1Njc4OTAiLCJlbWFpbCI6InVzZXJAZXhhbXBsZS5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTc1NzQzNTM5LCJleHAiOjE3NTc1MjE3Mzl9.example-signature",
  "user": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user"
  }
}
```

**Respuesta de error (401):**
```json
{
  "error": "Invalid email or password"
}
```

### 3. Obtener Perfil (con token)
```bash
curl -X GET http://localhost:3000/api/user/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Respuesta exitosa (200):**
```json
{
  "user": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "firstName": "John",
    "lastName": "Doe",
    "role": {
      "id": "c3f4c921-4e52-4fd5-b86c-1256c167416d",
      "name": "user",
      "description": "Standard user role with limited access"
    },
    "isActive": true,
    "createdAt": "2025-09-13T06:00:00.000Z",
    "updatedAt": "2025-09-13T06:00:00.000Z"
  }
}
```

**Respuesta de error (401):**
```json
{
  "error": "No token provided"
}
```

**Respuesta de error (404):**
```json
{
  "error": "User not found"
}
```

### 4. Lista de Usuarios (solo admins)
```bash
curl -X GET http://localhost:3000/api/users \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"
```

**Respuesta exitosa (200) - Usuario admin:**
```json
{
  "users": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "firstName": "John",
      "lastName": "Doe",
      "role": {
        "id": "c3f4c921-4e52-4fd5-b86c-1256c167416d",
        "name": "user",
        "description": "Standard user role with limited access"
      },
      "isActive": true,
      "createdAt": "2025-09-13T06:00:00.000Z",
      "updatedAt": "2025-09-13T06:00:00.000Z"
    }
  ],
  "count": 1
}
```

**Respuesta de error (403) - Usuario normal:**
```json
{
  "error": "Insufficient permissions to access users list"
}
```

**Respuesta de error (401):**
```json
{
  "error": "No token provided"
}
```

### 5. Health Check
```bash
curl -X GET http://localhost:3000/health
```

**Respuesta exitosa (200):**
```json
{
  "status": "OK",
  "timestamp": "2025-09-13T06:00:00.000Z",
  "uptime": 123.456
}
```

### 6. Mensaje de Bienvenida
```bash
curl -X GET http://localhost:3000/api/public/welcome
```

**Respuesta exitosa (200):**
```json
{
  "message": "Welcome to the Hexagonal Architecture API!",
  "version": "1.0.0",
  "timestamp": "2025-09-13T06:00:00.000Z",
  "endpoints": {
    "public": [
      "GET /api/public/welcome"
    ],
    "auth": [
      "POST /api/auth/signup",
      "POST /api/auth/login"
    ],
    "users": [
      "GET /api/user/profile (protected)",
      "GET /api/users (protected)"
    ]
  }
}
```

### 7. Ejemplo de Validación de Errores
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "invalid-email",
    "password": "123",
    "firstName": "",
    "lastName": ""
  }'
```

**Respuesta de error de validación (400):**
```json
{
  "error": "Validation Error",
  "message": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "email must be an email"
    },
    {
      "field": "password",
      "message": "password must be longer than or equal to 6 characters"
    },
    {
      "field": "firstName",
      "message": "firstName should not be empty"
    },
    {
      "field": "lastName",
      "message": "lastName should not be empty"
    }
  ],
  "timestamp": "2025-09-13T06:00:00.000Z",
  "path": "/api/auth/signup"
}
```

### 8. Ejemplo de Endpoint No Encontrado
```bash
curl -X GET http://localhost:3000/api/nonexistent
```

**Respuesta de error 404:**
```json
{
  "error": "Not found",
  "message": "Route /api/nonexistent not found",
  "timestamp": "2025-09-13T06:00:00.000Z",
  "path": "/api/nonexistent"
}
```

## 📮 Pruebas con Postman

### Importar Colección

1. **Descargar archivos**:
   - `Hexagonal_Architecture_API.postman_collection.json` - Colección de endpoints
   - `Hexagonal_Architecture_Environments.postman_environment.json` - Variables de entorno

2. **Importar en Postman**:
   - Abrir Postman
   - Click en "Import"
   - Seleccionar ambos archivos JSON
   - Click en "Import"

3. **Configurar entorno**:
   - Seleccionar "Hexagonal Architecture - Development" en el dropdown de entornos
   - Verificar que `base_url` esté configurado como `http://localhost:3000`

### Flujo de Pruebas Recomendado

1. **Iniciar servidor**:
   ```bash
   bun run dev
   ```

2. **Ejecutar en Postman**:
   - `Health Check` - Verificar que el servidor esté funcionando
   - `Welcome Message` - Verificar endpoint público
   - `User Signup` - Registrar un nuevo usuario (se guarda automáticamente el user_id)
   - `User Login` - Iniciar sesión (se guarda automáticamente el jwt_token)
   - `Get User Profile` - Obtener perfil (usa el token guardado)
   - `Get Users List` - Probar acceso de admin (debería dar error de permisos)

3. **Pruebas de Error**:
   - `Invalid Login` - Credenciales incorrectas
   - `Access Without Token` - Acceso sin autenticación
   - `Non-existent Endpoint` - Endpoint 404
   - `Invalid Signup Data` - Datos de registro inválidos

### Variables Automáticas

La colección incluye scripts que automáticamente guardan:
- `jwt_token` - Token JWT después del login
- `user_id` - ID del usuario después del signup/login
- `user_email` - Email del usuario
- `user_role` - Rol del usuario

### Cambiar Ambiente

Para probar en diferentes ambientes, modifica la variable `base_url`:
- **Development**: `http://localhost:3000`
- **Staging**: `http://localhost:3000` (con `NODE_ENV=staging`)
- **Test**: `http://localhost:3001` (con `NODE_ENV=test`)

## 🔧 Scripts Útiles

```bash
# Los roles se crean automáticamente al iniciar la aplicación
# Los usuarios se pueden crear a través de la API de signup

# Verificar usuarios en base de datos
# Usar la API GET /api/users para listar usuarios

# Generar migración
bun run migration:generate -n MigrationName

# Ejecutar migraciones
bun run migration:run

# Revertir migración
bun run migration:revert
```

## 🏛️ Estructura del Proyecto

```
src/
├── adapters/                      # Adaptadores (Infraestructura)
│   ├── inbound/                   # Adaptadores de Entrada
│   │   ├── dependencies.ts        # Inyección de dependencias
│   │   └── http/                  # Adaptadores HTTP
│   │       ├── controllers/       # Controladores REST
│   │       │   ├── auth.controller.ts
│   │       │   ├── public.controller.ts
│   │       │   ├── user.controller.ts
│   │       │   └── welcome.controller.ts
│   │       ├── middlewares/       # Middlewares HTTP
│   │       │   ├── auth.middleware.ts
│   │       │   ├── error.middleware.ts
│   │       │   └── validation.middleware.ts
│   │       └── routes/            # Rutas HTTP
│   │           ├── auth.router.ts
│   │           ├── index.routes.ts
│   │           ├── public.router.ts
│   │           ├── router.ts
│   │           └── user.router.ts
│   └── outbound/                  # Adaptadores de Salida
│       ├── config/                # Configuraciones
│       │   ├── app.config.ts      # Configuración de la aplicación
│       │   ├── database.config.ts # Configuración de base de datos
│       │   └── swagger.config.ts  # Configuración de Swagger
│       ├── persistence/           # Persistencia
│       │   └── typeorm/           # TypeORM
│       │       ├── entities/      # Entidades de base de datos
│       │       │   ├── role.entity.ts
│       │       │   └── user.entity.ts
│       │       ├── migrations/    # Migraciones
│       │       │   ├── 001_initial_schema.ts
│       │       │   └── 1700000000000-InitialRoles.ts
│       │       └── repositories/  # Repositorios
│       │           ├── postgres.role.repository.ts
│       │           └── postgres.user.repository.ts
│       └── security/              # Servicios de seguridad
│           ├── bcrypt.password.service.ts
│           └── jwt.token.service.ts
├── application/                   # Capa de Aplicación
│   ├── dto/                       # Data Transfer Objects
│   │   ├── auth.response.dto.ts
│   │   ├── login.request.dto.ts
│   │   ├── signup.request.dto.ts
│   │   └── user.response.dto.ts
│   ├── mappers/                   # Mappers de datos
│   │   └── user.mapper.ts
│   ├── services/                  # Servicios de aplicación
│   │   ├── auth.service.ts
│   │   ├── user.service.ts
│   │   └── welcome.service.ts
│   └── use_cases/                 # Casos de uso
│       ├── get_profile.use_case.ts
│       ├── get_users.use_case.ts
│       ├── login.use_case.ts
│       └── signup.use_case.ts
├── config/                        # Configuraciones globales
│   └── env.ts                     # Configuración de variables de entorno
├── domain/                        # Capa de Dominio
│   ├── exceptions/                # Excepciones del dominio
│   │   ├── domain.exception.ts
│   │   └── validation.exception.ts
│   ├── models/                    # Modelos de dominio
│   │   ├── auth.ts
│   │   ├── role.ts
│   │   └── user.ts
│   └── ports/                     # Puertos (Interfaces)
│       ├── inbound/               # Puertos de entrada
│       │   ├── auth.port.ts
│       │   └── user.port.ts
│       └── outbound/              # Puertos de salida
│           ├── password.service.port.ts
│           ├── role.repository.port.ts
│           ├── token.service.port.ts
│           └── user.repository.port.ts
└── index.ts                       # Punto de entrada de la aplicación
```

### 📁 Descripción de Capas

#### 🔌 **Adaptadores (Infraestructura)**
- **`adapters/inbound/`** - Adaptadores que reciben peticiones externas
  - **`http/`** - Adaptadores HTTP (REST API)
    - **`controllers/`** - Controladores que manejan las peticiones HTTP
    - **`middlewares/`** - Middlewares para autenticación, validación y manejo de errores
    - **`routes/`** - Definición de rutas y endpoints
- **`adapters/outbound/`** - Adaptadores que se conectan a servicios externos
  - **`config/`** - Configuraciones de la aplicación, base de datos y Swagger
  - **`persistence/`** - Capa de persistencia con TypeORM
  - **`security/`** - Servicios de seguridad (JWT, bcrypt)

#### 🎯 **Aplicación**
- **`dto/`** - Data Transfer Objects para transferencia de datos
- **`mappers/`** - Mappers para transformar datos entre capas
- **`services/`** - Servicios de aplicación que coordinan casos de uso
- **`use_cases/`** - Casos de uso específicos del negocio

#### 🏗️ **Dominio**
- **`exceptions/`** - Excepciones específicas del dominio
- **`models/`** - Modelos de dominio con lógica de negocio
- **`ports/`** - Interfaces que definen contratos
  - **`inbound/`** - Puertos que el dominio expone para recibir peticiones
  - **`outbound/`** - Puertos que el dominio necesita para acceder a servicios externos

#### ⚙️ **Configuración**
- **`config/`** - Configuraciones globales del sistema

## 🔒 Seguridad

- **JWT**: Tokens con expiración configurable
- **bcrypt**: Cifrado de contraseñas con salt rounds
- **Helmet**: Headers de seguridad HTTP
- **Rate Limiting**: Protección contra ataques de fuerza bruta
- **CORS**: Configuración de origen cruzado
- **Validación**: Validación estricta de entrada
- **Sanitización**: Limpieza de datos de entrada

## 📈 Monitoreo

- **Health Check**: Endpoint `/health` para monitoreo
- **Logging**: Logs estructurados con niveles
- **Error Handling**: Manejo centralizado de errores
- **Metrics**: Información de uptime y estado

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📁 Archivos de Configuración

### Variables de Entorno por Ambiente

| Archivo | Ambiente | Base de Datos | Swagger |
|---------|----------|---------------|---------|
| `env.development` | Development | SQLite (configurable) | ✅ |
| `env.test` | Test | SQLite (configurable) | ❌ |
| `env.staging` | Staging | PostgreSQL (configurable) | ✅ |
| `env.production` | Production | Solo PostgreSQL | ❌ |
| `env.local` | Override local | - | - |

### Variables de Entorno Principales

```bash
# Ambiente
NODE_ENV=development|test|staging|production

# Base de datos
USE_SQLITE=true|false
USE_POSTGRES=true|false

# PostgreSQL
PG_HOST=localhost
PG_PORT=5432
PG_USERNAME=postgres
PG_PASSWORD=your-password
PG_DATABASE=hexagonal_api
PG_TEST_DATABASE=hexagonal_api_test

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h

# Servidor
PORT=3000
CORS_ORIGIN=*
LOG_LEVEL=info
```

## 🎯 Próximas Mejoras

- [x] Documentación con Swagger/OpenAPI
- [x] 4 ambientes configurados
- [ ] Cache con Redis
- [ ] Logging con Winston
- [ ] Métricas con Prometheus
- [ ] Dockerización
- [ ] CI/CD con GitHub Actions
- [ ] Tests de carga
- [ ] Internacionalización
- [ ] WebSockets para tiempo real
- [ ] Microservicios

## 📞 Soporte

Si tienes preguntas o necesitas ayuda, por favor:

1. Revisa la documentación
2. Busca en los issues existentes
3. Crea un nuevo issue si es necesario

---

**Desarrollado con ❤️ usando Arquitectura Hexagonal y TypeScript**