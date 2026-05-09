const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const axios = require('axios');
require('dotenv').config();

const API_KEY = process.env.FOOTBALL_API_SPORTS_KEY;
const headers = { 'x-rapidapi-key': API_KEY };

const TEAM_IDS = {
  "AR": 26, "BR": 6, "FR": 2, "ES": 9, "PT": 27, "DE": 25, "IT": 10, "EN": 10,
  "NL": 15, "BE": 1, "HR": 3, "UY": 7, "CO": 8, "MX": 16, "US": 2384, "MA": 31,
  "SN": 13, "JP": 12, "KR": 17, "SA": 23, "EG": 32, "TN": 28, "DZ": 29,
  "CH": 14, "SE": 11, "DK": 21, "PL": 24, "TR": 20, "AU": 18, "NZ": 19, "CA": 52,
  "EC": 1183, "PY": 1184, "PE": 1185, "CL": 1186, "VE": 1187, "BO": 1188,
  "IQ": 22, "IR": 22, "QA": 1567, "UZ": 1572, "JO": 1573, "ZA": 33, "GH": 34,
  "NG": 35, "CM": 36, "CI": 37, "BA": 38, "CZ": 39, "SC": 40
};

async function syncTeamPlayers(paisCodigo, teamId) {
  console.log(`🔍 Sincronizando jugadores reales para ${paisCodigo} (TeamID: ${teamId})...`);
  try {
    // Usamos el endpoint de players con temporada 2024 para asegurar datos reales de selección
    const response = await axios.get(`https://v3.football.api-sports.io/players?team=${teamId}&season=2024`, { headers });
    const playersData = response.data.response;
    
    if (!playersData || playersData.length === 0) {
      console.warn(`⚠️ No se encontraron jugadores para ${paisCodigo}`);
      return;
    }

    const figuritas = await prisma.figurita.findMany({
      where: { paisCodigo },
      orderBy: { numero: 'asc' }
    });

    for (let i = 0; i < figuritas.length; i++) {
      const fig = figuritas[i];
      const p = playersData[i % playersData.length].player;
      const s = playersData[i % playersData.length].statistics[0];

      await prisma.figurita.update({
        where: { id: fig.id },
        data: {
          nombre: p.name,
          posicion: s.games.position || fig.posicion,
          imagen: p.photo,
          fechaNac: p.birth?.date || '15/06/1995',
          altura: p.height || '1.80m',
          peso: p.weight || '75kg',
          equipo: fig.pais + ' National Team',
          stats: {
            partidos: s.games.appearences || 0,
            goles: s.goals.total || 0,
            asistencias: s.goals.assists || 0,
            pases: s.passes.accuracy || 0,
            amarillas: s.cards.yellow || 0,
            rojas: s.cards.red || 0
          }
        }
      });
    }
    console.log(`✅ ${paisCodigo} sincronizado con ${playersData.length} jugadores reales.`);
  } catch (error) {
    if (error.response?.status === 429) {
      console.log('⏳ Límite alcanzado. Esperando 60s...');
      await new Promise(r => setTimeout(r, 60000));
      return syncTeamPlayers(paisCodigo, teamId);
    }
    console.error(`❌ Error en ${paisCodigo}:`, error.message);
  }
}

async function run() {
  console.log('🚀 INICIANDO SINCRONIZACIÓN FINAL V3 🚀');
  const codes = Object.keys(TEAM_IDS);
  for (const code of codes) {
    await syncTeamPlayers(code, TEAM_IDS[code]);
    await new Promise(r => setTimeout(r, 1500));
  }
  console.log('✨ SINCRONIZACIÓN FINAL COMPLETADA ✨');
}

run().catch(console.error).finally(() => prisma.$disconnect());
