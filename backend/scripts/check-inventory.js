const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkInventory() {
  try {
    const counts = await prisma.figurita.groupBy({
      by: ['paisCodigo'],
      _count: { _all: true }
    });
    
    console.log('--- INVENTARIO DE FIGURITAS ---');
    if (counts.length === 0) {
      console.log('No hay ninguna figurita en la base de datos.');
    } else {
      counts.forEach(c => {
        console.log(`${c.paisCodigo}: ${c._count._all} figuritas`);
      });
    }
    
    const total = await prisma.figurita.count();
    console.log('Total global:', total);
    
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

checkInventory();
