const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function populateDetails() {
  console.log('Actualizando detalles de jugadores...');
  
  const figuritas = await prisma.figurita.findMany();
  
  for (const f of figuritas) {
    // Datos aleatorios pero consistentes por jugador
    const dia = 1 + (f.numero % 28);
    const mes = 1 + (f.numero % 12);
    const año = 1985 + (f.numero % 20);
    
    const altura = (1.65 + (f.numero % 30) / 100).toFixed(2);
    const peso = 65 + (f.numero % 25);
    
    const equipos = ['Real Madrid', 'FC Barcelona', 'Man City', 'Liverpool', 'Bayern Munich', 'PSG', 'Juventus', 'AC Milan', 'Inter', 'Chelsea', 'Arsenal', 'Atletico Madrid'];
    const equipo = equipos[f.numero % equipos.length];

    await prisma.figurita.update({
      where: { id: f.id },
      data: {
        fechaNac: `${dia}/${mes}/${año}`,
        altura: `${altura}m`,
        peso: `${peso}kg`,
        equipo: equipo,
        datosCurioso: `Jugador estrella de ${f.pais}`
      }
    });
  }
  
  console.log('✅ Detalles de 1104 figuritas actualizados.');
  await prisma.$disconnect();
}

populateDetails();
