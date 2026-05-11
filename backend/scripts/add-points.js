const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addPointsWithTransaction() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'german@mundialpulse.com' }
    });

    if (!user) {
      console.log('❌ Usuario no encontrado');
      return;
    }

    const pointsToAdd = 200000;

    // 1. Actualizar el saldo total
    const puntos = await prisma.puntos.upsert({
      where: { userId: user.id },
      update: { total: { increment: pointsToAdd } },
      create: { userId: user.id, total: pointsToAdd }
    });

    // 2. Registrar la transacción
    await prisma.transaccionPuntos.create({
      data: {
        userId: user.id,
        cantidad: pointsToAdd,
        tipo: 'INGRESO',
        descripcion: 'Premio Especial 200k 💎'
      }
    });

    console.log(`✅ 200,000 puntos registrados. Nuevo saldo total: ${puntos.total}`);
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

addPointsWithTransaction();
