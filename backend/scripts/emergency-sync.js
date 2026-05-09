const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const EMERGENCY_SQUADS = {
  "HR": [
    { name: "Luka Modrić", pos: "Midfielder", photo: "https://media.api-sports.io/football/players/750.png", team: "Real Madrid" },
    { name: "Joško Gvardiol", pos: "Defender", photo: "https://media.api-sports.io/football/players/44503.png", team: "Man City" },
    { name: "Mateo Kovačić", pos: "Midfielder", photo: "https://media.api-sports.io/football/players/2296.png", team: "Man City" },
    { name: "Dominik Livaković", pos: "Goalkeeper", photo: "https://media.api-sports.io/football/players/1454.png", team: "Fenerbahce" },
    { name: "Ivan Perišić", pos: "Midfielder", photo: "https://media.api-sports.io/football/players/597.png", team: "Hajduk Split" },
    { name: "Andrej Kramarić", pos: "Attacker", photo: "https://media.api-sports.io/football/players/25.png", team: "Hoffenheim" },
    { name: "Ante Budimir", pos: "Attacker", photo: "https://media.api-sports.io/football/players/51.png", team: "Osasuna" }
  ],
  "EG": [
    { name: "Mohamed Salah", pos: "Attacker", photo: "https://media.api-sports.io/football/players/306.png", team: "Liverpool" },
    { name: "Mohamed Elneny", pos: "Midfielder", photo: "https://media.api-sports.io/football/players/1446.png", team: "Al Jazira" },
    { name: "Trézéguet", pos: "Attacker", photo: "https://media.api-sports.io/football/players/2180.png", team: "Trabzonspor" },
    { name: "Mostafa Mohamed", pos: "Attacker", photo: "https://media.api-sports.io/football/players/21200.png", team: "Nantes" },
    { name: "Omar Marmoush", pos: "Attacker", photo: "https://media.api-sports.io/football/players/1164.png", team: "Eintracht Frankfurt" }
  ],
  "BE": [
    { name: "Kevin De Bruyne", pos: "Midfielder", photo: "https://media.api-sports.io/football/players/629.png", team: "Man City" },
    { name: "Romelu Lukaku", pos: "Attacker", photo: "https://media.api-sports.io/football/players/907.png", team: "Napoli" },
    { name: "Jérémy Doku", pos: "Attacker", photo: "https://media.api-sports.io/football/players/44501.png", team: "Man City" },
    { name: "Thibaut Courtois", pos: "Goalkeeper", photo: "https://media.api-sports.io/football/players/735.png", team: "Real Madrid" }
  ],
  "JO": [
    { name: "Mousa Al-Tamari", pos: "Attacker", photo: "https://media.api-sports.io/football/players/3268.png", team: "Montpellier" },
    { name: "Yazan Al-Naimat", pos: "Attacker", photo: "https://media.api-sports.io/football/players/112642.png", team: "Al-Arabi" }
  ],
  "BA": [
    { name: "Edin Džeko", pos: "Attacker", photo: "https://media.api-sports.io/football/players/774.png", team: "Fenerbahce" },
    { name: "Ermedin Demirović", pos: "Attacker", photo: "https://media.api-sports.io/football/players/1146.png", team: "Stuttgart" }
  ]
};

async function emergencySync() {
  console.log('🚑 Iniciando Rescate de Plantillas Reales...');
  
  for (const [code, squad] of Object.entries(EMERGENCY_SQUADS)) {
    console.log(`✨ Restaurando ${code}...`);
    const figuritas = await prisma.figurita.findMany({
      where: { paisCodigo: code },
      orderBy: { numero: 'asc' }
    });

    for (let i = 0; i < figuritas.length; i++) {
      const fig = figuritas[i];
      const player = squad[i % squad.length];

      await prisma.figurita.update({
        where: { id: fig.id },
        data: {
          nombre: player.name,
          posicion: player.pos,
          imagen: player.photo,
          equipo: player.team,
          datosCurioso: `Estrella de la selección de ${code} restaurada.`
        }
      });
    }
  }
  console.log('✅ Rescate completado.');
}

emergencySync()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
