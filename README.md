# API RESTful con Arquitectura Hexagonal

Una API RESTful implementada siguiendo los principios de **Arquitectura Hexagonal** utilizando **TypeScript**, **Express**, **Bun**, **TypeORM** y **SQLite/PostgreSQL**.

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

## 📋 Endpoints

### Públicos
- `GET /api/public/welcome` - Mensaje de bienvenida
- `GET /health` - Health check

### Autenticación
- `POST /api/auth/signup` - Registro de usuario
- `POST /api/auth/login` - Inicio de sesión
- `GET /api/auth/profile` - Perfil del usuario (protegido)

### Usuarios
- `GET /api/users` - Lista de usuarios (solo administradores)

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
cp env.example .env
```

4. **Configurar base de datos**
```bash
# Para desarrollo (SQLite)
USE_SQLITE=true bun run src/shared/scripts/init-roles.ts

# Para producción (PostgreSQL)
# Configurar variables de entorno de PostgreSQL
bun run migration:run
```

## 🚀 Ejecución

### Desarrollo
```bash
# Con SQLite (recomendado para desarrollo)
USE_SQLITE=true NODE_ENV=development bun run dev

# Con PostgreSQL
NODE_ENV=development bun run dev
```

### Producción
```bash
bun run build
bun run start
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
bun test --coverage
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

### 2. Inicio de Sesión
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'
```

### 3. Obtener Perfil (con token)
```bash
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 4. Lista de Usuarios (solo admins)
```bash
curl -X GET http://localhost:3000/api/users \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"
```

## 🔧 Scripts Útiles

```bash
# Inicializar roles por defecto
bun run src/shared/scripts/init-roles.ts

# Hacer usuario administrador
bun run src/shared/scripts/make-admin.ts user@example.com

# Verificar usuarios en base de datos
bun run src/shared/scripts/check-users.ts

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
├── modules/
│   └── auth/
│       ├── domain/                 # Capa de Dominio
│       │   ├── entities/          # Entidades de negocio
│       │   ├── ports/             # Interfaces/contratos
│       │   ├── types/             # Tipos del dominio
│       │   └── value_objects/     # Value objects
│       ├── application/           # Capa de Aplicación
│       │   ├── services/          # Servicios de aplicación
│       │   ├── use_cases/         # Casos de uso
│       │   ├── mappers/           # Mappers de datos
│       │   └── validators/        # Validadores
│       └── infrastructure/        # Capa de Infraestructura
│           ├── adapters/          # Adaptadores
│           │   ├── http/          # Adaptadores HTTP
│           │   ├── repositories/  # Repositorios
│           │   └── services/      # Servicios externos
│           ├── factories/         # Factories
│           └── dependencies.ts    # Inyección de dependencias
├── shared/                        # Código compartido
│   ├── config/                    # Configuraciones
│   ├── scripts/                   # Scripts utilitarios
│   └── types/                     # Tipos compartidos
└── index.ts                       # Punto de entrada
```

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

## 🎯 Próximas Mejoras

- [ ] Documentación con Swagger/OpenAPI
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