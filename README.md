# MundialPulse 2026 ⚽

Plataforma premium para el seguimiento en tiempo real, predicciones y comunidad del Mundial 2026 (USA, México, Canadá).

## 🚀 Tecnologías
- **Frontend**: React + Vite, TailwindCSS 4, Framer Motion, React Query, Socket.IO Client, Leaflet.
- **Backend**: Node.js, Express, Socket.IO, Prisma ORM, Redis (Upstash), Web-Push.
- **Base de Datos**: PostgreSQL (Neon.tech).

## 📦 Instalación Local

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/mundial-pulse.git
cd mundial-pulse
```

### 2. Configurar el Backend
```bash
cd backend
npm install
cp .env.example .env
# Configura tus variables en .env
npx prisma generate
npm run dev
```

### 3. Configurar el Frontend
```bash
cd ../frontend
npm install
npm run dev
```

## 🌍 Despliegue (Deploy)

### Backend (Railway)
1. Crea un proyecto en [Railway.app](https://railway.app/).
2. Conecta tu repositorio.
3. Agrega las siguientes variables de entorno:
   - `DATABASE_URL`: Tu conexión de Neon.tech.
   - `REDIS_URL`: Tu conexión de Upstash.
   - `JWT_SECRET`: Una clave segura.
   - `FOOTBALL_API_KEY`: De football-data.org.
   - `VAPID_PUBLIC_KEY` / `VAPID_PRIVATE_KEY`: Generadas con `web-push`.
4. El comando de inicio será automático gracias al `railway.json` y `Procfile`.

### Frontend (Vercel)
1. Crea un proyecto en [Vercel](https://vercel.com/).
2. Conecta la carpeta `frontend`.
3. Configura las variables:
   - `VITE_API_URL`: URL de tu backend en Railway + `/api`.
   - `VITE_SOCKET_URL`: URL de tu backend en Railway.
4. Vercel detectará el build command `npm run build` y la carpeta `dist`.

### Base de Datos (Neon.tech)
1. Crea un proyecto en [Neon.tech](https://neon.tech/).
2. Copia la URL de conexión y úsala en `DATABASE_URL`.
3. Ejecuta `npm run migrate` desde el backend local para preparar las tablas.

## 📱 PWA
MundialPulse es una **Progressive Web App**. Puedes instalarla desde el navegador en Android e iOS para recibir notificaciones push de goles en tiempo real.

## 📄 Licencia
Este proyecto es de código abierto bajo la licencia MIT.
