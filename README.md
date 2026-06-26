# Interseguro Challenge - Node.js API

Esta es la segunda API (backend en Node.js) para el Desafío Técnico de Interseguro. Su principal función es recibir el resultado de la factorización QR (Matrices `Q` y `R`) calculada por la primera API en Go, calcular estadísticas avanzadas sobre dichas matrices y devolver el resultado de manera segura.

## Características Técnicas

- **Framework**: NestJS (sustituyendo a Express por requerimientos de la librería de arquitectura).
- **Arquitectura Hexagonal Estricta**: Construida utilizando **`hexa-mod`**, una poderosa librería diseñada para crear arquitecturas hexagonales basadas en módulos de forma exclusiva para NestJS.
- **Loggers Dinámicos**: Implementación de **`use-term`**, una librería que provee un logger dinámico, estético y con múltiples funcionalidades, integrado directamente como `CustomLogger` dentro del core de NestJS.
- **Seguridad (JWT)**: Autenticación gestionada mediante JWT (`@nestjs/passport`), con una capa de control de sesión en base de datos (`logged` boolean) para prevenir múltiples inicios de sesión simultáneos, además de soporte para Refresh Tokens.
- **Base de Datos**: PostgreSQL, con esquemas gestionados mediante **Prisma ORM**.
- **Documentación API**: Interfaces expuestas y auto-documentadas con **Swagger**.
- **Contenerización**: Empaquetado en **Docker** para su fácil distribución y despliegue.

---

## Prerrequisitos

- Node.js v18 o superior (si se corre en local sin Docker)
- Docker y Docker Compose

---

## Instalación y Despliegue Rápido (Docker)

El proyecto viene preparado con un `docker-compose.yml` que levantará tanto la base de datos PostgreSQL como la propia aplicación de Node.js, e insertará un usuario de prueba automáticamente.

```bash
docker-compose up --build -d
```

Una vez que los contenedores estén levantados, la API estará disponible en:
`http://localhost:4000`

> **Nota sobre Prisma en Alpine**: La imagen de Docker ya incluye las librerías necesarias (`openssl`) y un proceso de pre-compilación del script de _seeding_ (`seed.ts` a `seed.js`) para evitar problemas de resolución de módulos `.ts` nativos con versiones recientes de Node.js en Alpine.

> **Usuario de prueba autogenerado**:
> - **Username**: `testuser`
> - **Password**: `password123`

---

## Ejecución Local (Desarrollo)

Si deseas probar el código en un entorno de desarrollo local sin ejecutar la API mediante Docker, sigue estos pasos:

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Levantar Base de Datos PostgreSQL**:
   (Puedes usar el docker-compose solo para la DB comentando el servicio `api`)
   ```bash
   docker compose build --no-cache
   docker compose up -d
   ```

3. **Variables de Entorno**:
   Crea un archivo `.env` en la raíz (puedes copiar el contenido existente) y asegúrate de tener:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5433/auth_db?schema=public"
   JWT_SECRET="supersecret_interseguro_jwt_key"
   ```

4. **Sincronizar ORM y Crear Semilla**:
   ```bash
   npx prisma db push
   npx prisma generate
   npx tsc --esModuleInterop prisma/seed.ts
   npx prisma db seed
   ```

5. **Iniciar Servidor**:
   ```bash
   npm run start:dev
   ```

---

## Documentación API (Swagger)

Gracias a `@nestjs/swagger`, puedes probar todos los endpoints de forma visual.
Cuando el servidor esté corriendo, visita:

👉 **[http://localhost:4000/docs](http://localhost:4000/docs)**

### Flujo de Prueba
1. Opcionalmente, ejecuta el endpoint `POST /auth/seed` para crear el usuario de prueba inicial (`testuser` / `password123`) si no has ejecutado el seeder de Prisma.
2. Ve al endpoint `POST /auth/login` e ingresa el payload con `testuser` y `password123`.
3. Copia el `accessToken` devuelto.
4. Arriba a la derecha, haz clic en **Authorize** y pega el token.
5. Ahora podrás ejecutar el endpoint `POST /api/matrices/stats` enviando el payload QR.

---

## Librerías Destacadas

### hexa-mod
Se ha empleado esta librería para estructurar cada módulo (`Auth` y `Matrix`) bajo el patrón de **Arquitectura Hexagonal**. Todo caso de uso (`application/use-cases`), puerto e implementación (`infrastructure/adapters`), e interfaz pura de negocio (`domain/interfaces`) reside en su propio espacio desacoplado de las dependencias externas, logrando un código limpio y mantenible nativo en NestJS.

### use-term
En lugar de depender de los logs planos de Nest, se implementó `use-term` dentro de la capa `config/logger.ts`. Esto permite formatear las salidas de la consola con un logger dinámico, claro y amigable para el desarrollador, brindando toda su capacidad visual al arranque y ejecución del servidor.
