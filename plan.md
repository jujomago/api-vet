# VetCare API - Proyecto de Desarrollo

## Objetivo
Desarrollar una API REST profesional para una clínica veterinaria siguiendo las mejores prácticas de la industria.

## Guía de Implementación para IA

Actúa como un Senior Backend Developer experto en Node.js y Arquitectura de Software para implementar este proyecto.

### Stack Tecnológico
- **Lenguaje:** TypeScript.
- **Framework:** Express.
- **Base de Datos:** PostgreSQL.
- **Infraestructura:** Docker & Docker Compose (para PostgreSQL).
- **ORM/Query Builder:** Prisma o TypeORM (preferiblemente Prisma por su tipado estricto).
- **Documentación:** Swagger (`swagger-jsdoc` y `swagger-ui-express`).
- **Seguridad:** CORS, JWT (autenticación), Helmet, Bcrypt (hasheo).
- **Validación:** Zod.
- **Logging:** Morgan.

### Arquitectura (Capas/MVC Enriquecido)
1. `src/routes/`: Definición de endpoints.
2. `src/controllers/`: Manejo de request/response.
3. `src/services/`: Lógica de negocio (interacción con DB).
4. `src/models/` o `src/schemas/`: Esquemas de Zod y tipos de Prisma.
5. `src/middlewares/`: Auth (JWT), Error Handler global, Validaciones.
6. `src/config/`: Configuración de DB, variables de entorno.

### Requerimientos Funcionales (MVP)
1. **Auth:** Registro/Login de Veterinarios con JWT.
2. **Mascotas (Pets):** CRUD completo (Nombre, especie, raza, edad, dueño).
3. **Citas (Appointments):** CRUD para agendar visitas.
4. **Protección:** Rutas de Mascotas y Citas protegidas por el middleware JWT.

### Instrucciones de Calidad
- Aplicar principios **SOLID**.
- Implementar **Global Error Handler**.
- Usar **Variables de Entorno** (`.env`).
- Código altamente documentado y tipado.

### Entregables Iniciales
- `docker-compose.yml` para levantar PostgreSQL.
- `package.json` con dependencias completas.
- Estructura de carpetas `src/`.
- Configuración de Swagger.
- Archivo `.env.example`.
