const {PrismaClient} = require('@prisma/client');
const p = new PrismaClient();

async function fix() {
  // Dar 500 puntos a todos los usuarios sin puntos o con total 0
  const users = await p.user.findMany({ select: { id: true, username: true } });
  console.log('Usuarios encontrados:', users.map(u => u.username));

  for (const user of users) {
    const existing = await p.puntos.findUnique({ where: { userId: user.id } });
    
    if (!existing) {
      await p.puntos.create({ data: { userId: user.id, total: 500, gastados: 0 } });
      await p.transaccionPuntos.create({ 
        data: { userId: user.id, cantidad: 500, tipo: 'registro', descripcion: 'Puntos de bienvenida MundialPulse' } 
      });
      console.log('✅ Puntos creados para:', user.username);
    } else if (existing.total === 0) {
      await p.puntos.update({ where: { userId: user.id }, data: { total: 500 } });
      await p.transaccionPuntos.create({ 
        data: { userId: user.id, cantidad: 500, tipo: 'registro', descripcion: 'Puntos de bienvenida MundialPulse' } 
      });
      console.log('✅ Puntos actualizados para:', user.username);
    } else {
      console.log('ℹ️ Ya tiene puntos:', user.username, '→ total:', existing.total, '| gastados:', existing.gastados);
    }
  }

  await p.$disconnect();
  console.log('✅ Fix completado.');
}

fix().catch(async (e) => {
  console.error(e);
  await p.$disconnect();
});
