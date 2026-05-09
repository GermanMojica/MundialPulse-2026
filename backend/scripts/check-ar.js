const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkAR() {
  const count = await prisma.figurita.count({ where: { paisCodigo: 'AR' } });
  const sample = await prisma.figurita.findFirst({ where: { paisCodigo: 'AR' } });
  console.log('Total AR:', count);
  console.log('Sample AR:', sample);
  await prisma.$disconnect();
}

checkAR();
