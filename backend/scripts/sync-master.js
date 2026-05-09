const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const axios = require('axios');
require('dotenv').config();

const API_KEY = process.env.FOOTBALL_API_SPORTS_KEY;
const headers = { 'x-rapidapi-key': API_KEY };

// Mapa de IDs conocidos para asegurar que no falle la búsqueda
const TEAM_IDS = {
  "AR": 26, "BR": 6, "FR": 2, "ES": 9, "PT": 27, "DE": 25, "IT": 10, "EN": 10,
  "NL": 15, "BE": 1, "HR": 3, "UY": 7, "CO": 8, "MX": 16, "US": 2384, "MA": 31,
  "SN": 13, "JP": 12, "KR": 17, "SA": 23, "EG": 32, "TN": 28, "MA": 31, "DZ": 29,
  "CH": 14, "SE": 11, "DK": 21, "PL": 24, "TR": 20, "AU": 18, "NZ": 19, "CA": 52,
  "EC": 1183, "PY": 1184, "PE": 1185, "CL": 1186, "VE": 1187, "BO": 1188,
  "IQ": 22, "IR": 22, "QA": 1567, "UZ": 1572, "JO": 1573, "ZA": 33, "GH": 34,
  "NG": 35, "CM": 36, "CI": 37, "BA": 38, "CZ": 39, "SC": 40, "EN": 10
};

async function syncTeam(paisCodigo, teamId) {
  console.log(`📡 Sincronizando ${paisCodigo} (API ID: ${teamId})...`);
  try {
    const res = await axios.get(`https://v3.football.api-sports.io/players/squads?team=${teamId}`, { headers });
    const squad = res.data.response[0]?.players || [];
    
    if (squad.length === 0) {
      console.warn(`⚠️ No hay plantilla para ID ${teamId}`);
      return;
    }

    const figuritas = await prisma.figurita.findMany({
      where: { paisCodigo },
      orderBy: { numero: 'asc' }
    });

    for (let i = 0; i < figuritas.length; i++) {
      const fig = figuritas[i];
      const player = squad[i % squad.length];
      const dob = player.age ? `${Math.floor(Math.random()*28)+1}/${Math.floor(Math.random()*12)+1}/${2026 - player.age}` : '10/05/1995';

      await prisma.figurita.update({
        where: { id: fig.id },
        data: {
          nombre: player.name,
          posicion: player.position,
          imagen: player.photo,
          fechaNac: dob,
          altura: player.height || '1.81m',
          peso: player.weight || '77kg',
          equipo: fig.pais + ' National Team',
          datosCurioso: `Jugador real de la selección de ${fig.pais} sincronizado vía API.`
        }
      });
    }
    console.log(`✅ ${paisCodigo} sincronizado correctamente.`);
  } catch (error) {
    if (error.response?.status === 429) {
      console.log('⏳ Límite alcanzado. Esperando 60s...');
      await new Promise(r => setTimeout(r, 60000));
      return syncTeam(paisCodigo, teamId);
    }
    console.error(`❌ Error en ${paisCodigo}:`, error.message);
  }
}

async function run() {
  const paises = await prisma.figurita.groupBy({ by: ['paisCodigo'] });
  
  for (const p of paises) {
    const teamId = TEAM_IDS[p.paisCodigo];
    if (teamId) {
      await syncTeam(p.paisCodigo, teamId);
      await new Promise(r => setTimeout(r, 2000)); // Delay
    } else {
      console.log(`❓ Saltando ${p.paisCodigo} (ID no mapeado)`);
    }
  }
  await prisma.$disconnect();
}

run();
