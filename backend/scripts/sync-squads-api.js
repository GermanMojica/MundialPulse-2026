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
    
    // Buscar el equipo nacional (national: true)
    const teams = response.data.response;
    const nationalTeam = teams.find(t => t.team.national === true) || teams[0];
    
    return nationalTeam ? nationalTeam.team.id : null;
  } catch (error) {
    console.error(`Error buscando equipo ${countryName}:`, error.message);
    return null;
  }
}

async function getSquad(teamId) {
  try {
    const response = await axios.get(`${API_URL}/players/squads`, {
      headers,
      params: { team: teamId }
    });
    
    const squad = response.data.response[0]?.players || [];
    return squad;
  } catch (error) {
    console.error(`Error buscando plantilla para equipo ${teamId}:`, error.message);
    return [];
  }
}

async function syncAll() {
  console.log('Iniciando sincronización de plantillas reales...');
  
  const paises = await prisma.figurita.groupBy({
    by: ['paisCodigo', 'pais'],
    orderBy: { paisCodigo: 'asc' }
  });

  for (const p of paises) {
    console.log(`Procesando ${p.pais}...`);
    const teamId = await getTeamId(p.pais);
    
    if (!teamId) {
      console.warn(`No se encontró ID para ${p.pais}`);
      continue;
    }

    const squad = await getSquad(teamId);
    if (squad.length === 0) {
      console.warn(`No se encontró plantilla para ${p.pais}`);
      continue;
    }

    // Traer las figuritas de este país ordenadas por número
    const figuritas = await prisma.figurita.findMany({
      where: { paisCodigo: p.paisCodigo },
      orderBy: { numero: 'asc' }
    });

    // Actualizar cada figurita con un jugador real
    for (let i = 0; i < figuritas.length; i++) {
      const fig = figuritas[i];
      const player = squad[i % squad.length]; // Por si la plantilla es pequeña

      if (!player) continue;

      // Generar datos aleatorios de stats si no vienen (el API squads no trae todo)
      const dob = player.age ? `${Math.floor(Math.random()*28)+1}/${Math.floor(Math.random()*12)+1}/${2026 - player.age}` : '15/06/1998';
      const height = player.height || '1.82m';
      const weight = player.weight || '78kg';
      
      await prisma.figurita.update({
        where: { id: fig.id },
        data: {
          nombre: player.name,
          posicion: player.position || fig.posicion,
          imagen: player.photo,
          equipo: p.pais + ' National Team', // O dejar el club si lo tuviéramos
          fechaNac: dob,
          altura: height,
          peso: weight
        }
      });
    }
    
    console.log(`✅ ${p.pais} actualizado con ${Math.min(squad.length, figuritas.length)} jugadores reales.`);
    
    // Pequeño delay para no saturar la API (dependiendo del plan)
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('Sincronización finalizada.');
}

syncAll()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
