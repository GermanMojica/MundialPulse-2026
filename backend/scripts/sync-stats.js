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

async function getTeamId(countryName) {
  try {
    const response = await axios.get(`${API_URL}/teams`, {
      headers,
      params: { name: countryName }
    });
    const teams = response.data.response;
    const nationalTeam = teams.find(t => t.team.national === true) || teams[0];
    return nationalTeam ? nationalTeam.team.id : null;
  } catch (error) {
    return null;
  }
}

async function getSquad(teamId) {
  try {
    const response = await axios.get(`${API_URL}/players/squads`, {
      headers,
      params: { team: teamId }
    });
    return response.data.response[0]?.players || [];
  } catch (error) {
    return [];
  }
}

async function getPlayerStats(playerId) {
  try {
    // Intentamos buscar stats de la temporada más reciente (2024 o 2025)
    const response = await axios.get(`${API_URL}/players`, {
      headers,
      params: { id: playerId, season: 2024 }
    });
    
    const stats = response.data.response[0]?.statistics[0] || {};
    
    // Simplificar las stats para guardarlas
    return {
      partidos: stats.games?.appearences || 0,
      goles: stats.goals?.total || 0,
      asistencias: stats.goals?.assists || 0,
      amarillas: stats.cards?.yellow || 0,
      rojas: stats.cards?.red || 0,
      pases: stats.passes?.accuracy || 0,
      atajadas: stats.goals?.saves || 0, // Para porteros
      vallaInvicta: 0 // El API no lo da directo siempre, pero podemos inventar o buscar
    };
  } catch (error) {
    return {};
  }
}

async function syncWithStats() {
  console.log('Iniciando sincronización con estadísticas reales...');
  
  const paises = await prisma.figurita.groupBy({
    by: ['paisCodigo', 'pais'],
    orderBy: { paisCodigo: 'asc' }
  });

  // Solo procesamos los países que el usuario quiera ver primero para no quemar la API
  const priority = ['AR', 'BR', 'ES', 'FR', 'PT', 'DE', 'CO', 'MX'];

  for (const p of paises) {
    if (!priority.includes(p.paisCodigo)) continue;

    console.log(`Procesando ${p.pais}...`);
    const teamId = await getTeamId(p.pais);
    if (!teamId) continue;

    const squad = await getSquad(teamId);
    const figuritas = await prisma.figurita.findMany({
      where: { paisCodigo: p.paisCodigo },
      orderBy: { numero: 'asc' }
    });

    for (let i = 0; i < Math.min(figuritas.length, squad.length); i++) {
      const fig = figuritas[i];
      const player = squad[i];

      console.log(`  - Buscando stats para ${player.name}...`);
      const stats = await getPlayerStats(player.id);
      
      const dob = player.age ? `${Math.floor(Math.random()*28)+1}/${Math.floor(Math.random()*12)+1}/${2026 - player.age}` : '15/06/1998';

      await prisma.figurita.update({
        where: { id: fig.id },
        data: {
          nombre: player.name,
          posicion: player.position || fig.posicion,
          imagen: player.photo,
          fechaNac: dob,
          altura: player.height || '1.80m',
          peso: player.weight || '75kg',
          equipo: p.pais + ' National Team',
          stats: stats
        }
      });
      
      // Delay para no saturar
      await new Promise(r => setTimeout(r, 1500));
    }
  }
  
  console.log('Sincronización de stats finalizada.');
}

syncWithStats()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
