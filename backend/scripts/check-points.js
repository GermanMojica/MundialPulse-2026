const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkPoints() {
  const email = 'german@mundialpulse.com';
  const user = await prisma.user.findFirst({
    where: { 
      OR: [
        { email: email },
        { username: 'German' }
      ]
    },
    include: { puntos: true }
  });

  if (user) {
    console.log(`Usuario: ${user.username} (${user.email})`);
    console.log(`Puntos Totales: ${user.puntos?.total || 0}`);
    console.log(`Puntos Gastados: ${user.puntos?.gastados || 0}`);
    console.log(`Balance: ${(user.puntos?.total || 0) - (user.puntos?.gastados || 0)}`);
  } else {
    console.log('Usuario no encontrado');
  }

  await prisma.$disconnect();
}

checkPoints();
