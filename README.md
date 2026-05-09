# MundialPulse 2026

Plataforma interactiva para el Mundial 2026. Predicciones, ranking y seguimiento de partidos en vivo.

## Requisitos Previos

- Node.js (v18 o superior)
- PostgreSQL (puedes usar una instancia en la nube como Neon.tech)

## Instalación

1. Clona el repositorio
2. Instala las dependencias del frontend y del backend:

```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

## Configuración del Backend

1. Ve al directorio `backend`.
2. Crea un archivo `.env` basado en `.env.example`:
```bash
cp .env.example .env
```
3. Configura tu `DATABASE_URL` en el archivo `.env` apuntando a tu base de datos de Neon o PostgreSQL local.
4. Genera el cliente de Prisma y envía el esquema a la base de datos:
```bash
npx prisma generate
npx prisma db push
```

## Iniciar el Proyecto

Para correr ambos servicios localmente en modo desarrollo:

**Terminal 1 (Backend - Puerto 5000)**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend - Puerto 5173)**
```bash
cd frontend
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.
