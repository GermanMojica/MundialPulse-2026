const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function debugAlbum() {
  try {
    const todosLosPaises = await prisma.figurita.findMany({
      distinct: ['paisCodigo'],
      select: { paisCodigo: true, pais: true },
      orderBy: { paisCodigo: 'asc' }
    });
    console.log('Total países encontrados:', todosLosPaises.length);
    console.log('Primeros 5:', todosLosPaises.slice(0, 5));
    console.log('¿Está PT?:', todosLosPaises.some(p => p.paisCodigo === 'PT'));
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

debugAlbum();
