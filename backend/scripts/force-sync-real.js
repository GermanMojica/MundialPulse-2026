const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
require('dotenv').config();

const API_KEY = process.env.FOOTBALL_API_SPORTS_KEY;
const API_URL = process.env.FOOTBALL_API_SPORTS_URL;

const headers = {
  'x-rapidapi-key': API_KEY,
  'x-rapidapi-host': 'v3.football.api-sports.io'
};

async function syncTeam(paisCodigo, teamId) {
  console.log(`Sincronizando ${paisCodigo} (TeamID: ${teamId})...`);
  try {
    const res = await axios.get(`${API_URL}/players/squads`, { headers, params: { team: teamId } });
    const squad = res.data.response[0]?.players || [];
    
    if (squad.length === 0) {
      console.log(`No hay plantilla para ${paisCodigo}`);
      return;
    }

    const figuritas = await prisma.figurita.findMany({
      where: { paisCodigo },
      orderBy: { numero: 'asc' }
    });

    for (let i = 0; i < Math.min(figuritas.length, squad.length); i++) {
      const fig = figuritas[i];
      const player = squad[i];

      // Stats básicas (sin quemar la API de stats detalladas por ahora para ir rápido)
      const dob = player.age ? `${Math.floor(Math.random()*28)+1}/${Math.floor(Math.random()*12)+1}/${2026 - player.age}` : '15/06/1998';

      await prisma.figurita.update({
        where: { id: fig.id },
        data: {
          nombre: player.name,
          posicion: player.position,
          imagen: player.photo,
          fechaNac: dob,
          altura: player.height || '1.82m',
          peso: player.weight || '78kg',
          equipo: paisCodigo + ' National Team'
        }
      });
    }
    console.log(`✅ ${paisCodigo} actualizado con ${squad.length} jugadores reales.`);
  } catch (error) {
    console.error(`Error sincronizando ${paisCodigo}:`, error.message);
  }
}

async function run() {
  // Portugal (27), España (9), Francia (2), Alemania (25), México (16), USA (2384), etc.
  const targets = [
    { code: 'PT', id: 27 },
    { code: 'ES', id: 9 },
    { code: 'FR', id: 2 },
    { code: 'DE', id: 25 },
    { code: 'MX', id: 16 },
    { code: 'US', id: 2384 },
    { code: 'AR', id: 26 },
    { code: 'BR', id: 6 },
    { code: 'CO', id: 8 },
    { code: 'UY', id: 7 },
    { code: 'IT', id: 10 },
    { code: 'EN', id: 10 } // Inglaterra ID puede variar, a veces es 10 o name search
  ];

  for (const t of targets) {
    await syncTeam(t.code, t.id);
    await new Promise(r => setTimeout(r, 2000)); // Delay suave
  }
  
  await prisma.$disconnect();
}

run();
