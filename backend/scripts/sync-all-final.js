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

const NAME_MAPPING = {
  "Alemania": "Germany",
  "Arabia Saudita": "Saudi Arabia",
  "Argelia": "Algeria",
  "Bélgica": "Belgium",
  "Brasil": "Brazil",
  "Camerún": "Cameroon",
  "Canadá": "Canada",
  "Catar": "Qatar",
  "Corea del Sur": "South Korea",
  "Costa de Marfil": "Ivory Coast",
  "Costa Rica": "Costa Rica",
  "Croacia": "Croatia",
  "Dinamarca": "Denmark",
  "Egipto": "Egypt",
  "Escocia": "Scotland",
  "España": "Spain",
  "Estados Unidos": "USA",
  "Francia": "France",
  "Gales": "Wales",
  "Ghana": "Ghana",
  "Holanda": "Netherlands",
  "Países Bajos": "Netherlands",
  "Inglaterra": "England",
  "Irán": "Iran",
  "Irak": "Iraq",
  "Islandia": "Iceland",
  "Italia": "Italy",
  "Japón": "Japan",
  "Marruecos": "Morocco",
  "México": "Mexico",
  "Nigeria": "Nigeria",
  "Noruega": "Norway",
  "Nueva Zelanda": "New Zealand",
  "Panamá": "Panama",
  "Perú": "Peru",
  "Polonia": "Poland",
  "Portugal": "Portugal",
  "República Checa": "Czech Republic",
  "Senegal": "Senegal",
  "Serbia": "Serbia",
  "Sudáfrica": "South Africa",
  "Suecia": "Sweden",
  "Suiza": "Switzerland",
  "Túnez": "Tunisia",
  "Turquía": "Turkey",
  "Uruguay": "Uruguay",
  "Zambia": "Zambia"
};

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getTeamId(countryName) {
  const searchName = NAME_MAPPING[countryName] || countryName;
  try {
    const response = await axios.get(`${API_URL}/teams`, {
      headers,
      params: { name: searchName }
    });
    const teams = response.data.response;
    const nationalTeam = teams.find(t => t.team.national === true);
    return nationalTeam ? nationalTeam.team.id : (teams[0]?.team.id || null);
  } catch (error) {
    if (error.response?.status === 429) {
      console.log('⚠️ Límite de API alcanzado. Esperando 60 segundos...');
      await sleep(60000);
      return getTeamId(countryName);
    }
    return null;
  }
}

async function syncAll() {
  console.log('🚀 Iniciando Sincronización Total con Mapeo de Nombres...');
  const paises = await prisma.figurita.groupBy({
    by: ['paisCodigo', 'pais'],
    orderBy: { pais: 'asc' }
  });

  for (const p of paises) {
    console.log(`\n🌍 Procesando [${p.paisCodigo}] ${p.pais}...`);
    const teamId = await getTeamId(p.pais);
    
    if (!teamId) {
      console.warn(`❌ No se encontró ID para ${p.pais} (Buscado como: ${NAME_MAPPING[p.pais] || p.pais})`);
      continue;
    }

    try {
      const res = await axios.get(`${API_URL}/players/squads`, { headers, params: { team: teamId } });
      const squad = res.data.response[0]?.players || [];
      if (squad.length === 0) continue;

      const figuritas = await prisma.figurita.findMany({
        where: { paisCodigo: p.paisCodigo },
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
            equipo: p.pais + ' National Team'
          }
        });
      }
      console.log(`✅ ${p.pais} sincronizado.`);
    } catch (error) {
      console.error(`❌ Error en ${p.pais}:`, error.message);
    }
    await sleep(2500);
  }
  console.log('\n✨ SINCRONIZACIÓN FINALIZADA ✨');
}

syncAll().catch(console.error).finally(() => prisma.$disconnect());
