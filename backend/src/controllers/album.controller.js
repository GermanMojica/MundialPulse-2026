const prisma = require('../models/db');

// Necesitamos importar el io. Asumiendo que podemos obtenerlo de app o de un módulo.
// Se puede acceder a req.app.get('io') en las rutas, pero para funciones internas
// es mejor pedirlo como parámetro o tratar de obtenerlo del servidor.
let ioInstance;
try {
  ioInstance = require('../../server').io;
} catch (e) {
  // Ignorar si hay problema de require circular, usaremos req.app.get('io') cuando sea posible.
}

// FUNCIÓN 1 — getMiAlbum
const getMiAlbum = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Traer todos los países únicos y contar sus figuritas totales
    const paisesFigCount = await prisma.figurita.groupBy({
      by: ['paisCodigo', 'pais'],
      _count: { _all: true },
      orderBy: { paisCodigo: 'asc' }
    });

    // Traer la colección del usuario
    const coleccion = await prisma.coleccionFiguritas.findMany({
      where: { userId },
      include: { figurita: { select: { paisCodigo: true } } }
    });

    // Agrupar colección por país
    const obtenidasPorPais = {};
    let totalFiguritas = 0;
    coleccion.forEach(item => {
      const codigo = item.figurita.paisCodigo;
      obtenidasPorPais[codigo] = (obtenidasPorPais[codigo] || 0) + 1;
      totalFiguritas++;
    });

    let totalPosiblesGlobal = 0;

    // Combinar: todos los países + progreso del usuario
    const paises = paisesFigCount.map(p => {
      const totalEnPais = p._count._all;
      totalPosiblesGlobal += totalEnPais;
      const obtenidas = obtenidasPorPais[p.paisCodigo] || 0;
      
      return {
        paisCodigo: p.paisCodigo,
        pais: p.pais,
        totalObtenidas: obtenidas,
        totalEnPais: totalEnPais,
        porcentaje: Math.round((obtenidas / totalEnPais) * 100)
      };
    });

    const porcentajeGlobal = totalPosiblesGlobal > 0 
      ? Math.round((totalFiguritas / totalPosiblesGlobal) * 100) 
      : 0;

    return res.json({
      totalFiguritas,
      totalPosibles: totalPosiblesGlobal,
      porcentajeGlobal,
      paises
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al obtener el álbum" });
  }
};

// FUNCIÓN 2 — getPaisFiguritas
const getPaisFiguritas = async (req, res) => {
  try {
    const userId = req.user.id;
    const { codigo } = req.params;

    const figuritasPais = await prisma.figurita.findMany({
      where: { paisCodigo: codigo },
      orderBy: { numero: 'asc' }
    });

    if (figuritasPais.length === 0) {
      return res.status(404).json({ error: "País no encontrado" });
    }

    const coleccionUsuario = await prisma.coleccionFiguritas.findMany({
      where: {
        userId,
        figuritaId: { in: figuritasPais.map(f => f.id) }
      }
    });

    const obtenidasIds = new Set(coleccionUsuario.map(c => c.figuritaId));
    const cantidades = {};
    coleccionUsuario.forEach(c => cantidades[c.figuritaId] = c.cantidad);

    const figuritas = figuritasPais.map(fig => {
      if (obtenidasIds.has(fig.id)) {
        return {
          ...fig,
          obtenida: true,
          cantidad: cantidades[fig.id]
        };
      } else {
        return {
          id: fig.id,
          numero: fig.numero,
          nombre: "???",
          pais: fig.pais,
          paisCodigo: fig.paisCodigo,
          posicion: fig.posicion,
          rareza: fig.rareza,
          datosCurioso: null,
          obtenida: false,
          cantidad: 0
        };
      }
    });

    return res.json({
      pais: figuritasPais[0].pais,
      figuritas
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al obtener figuritas del país" });
  }
};

// FUNCIÓN 3 — getMisPuntos
const getMisPuntos = async (req, res) => {
  try {
    const userId = req.user.id;

    let puntos = await prisma.puntos.findUnique({
      where: { userId }
    });

    if (!puntos) {
      puntos = await prisma.puntos.create({
        data: {
          userId,
          total: 0,
          gastados: 0
        }
      });
    }

    const transacciones = await prisma.transaccionPuntos.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20
    });

    return res.json({
      puntos,
      transacciones
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al obtener puntos" });
  }
};

// FUNCIÓN 4 — abrirSobre
function getRareza(tipo) {
  const r = Math.random();
  if (tipo === "leyenda") {
    if (r < 0.05) return "legendaria";
    if (r < 0.20) return "epica"; // o "épica" dependiendo de BD
    if (r < 0.50) return "rara";
    return "comun"; // o "común" dependiendo de BD
  }
  if (tipo === "premium") {
    if (r < 0.03) return "legendaria";
    if (r < 0.13) return "epica";
    if (r < 0.35) return "rara";
    return "comun";
  }
  // basico
  if (r < 0.02) return "legendaria";
  if (r < 0.10) return "epica";
  if (r < 0.30) return "rara";
  return "comun";
}

// Adaptación por tildes en DB actual (épica, común)
function normalizarRareza(rarezaBase) {
  if (rarezaBase === 'epica') return 'épica';
  if (rarezaBase === 'comun') return 'común';
  return rarezaBase;
}

const abrirSobre = async (req, res) => {
  try {
    const userId = req.user.id;
    const { tipo } = req.body;
    
    const costos = { basico: 500, premium: 1000, leyenda: 2000 };
    const cantidades = { basico: 5, premium: 10, leyenda: 15 };

    if (!costos[tipo]) {
      return res.status(400).json({ error: "Tipo de sobre inválido" });
    }

    const costo = costos[tipo];
    const n = cantidades[tipo];

    const puntosUser = await prisma.puntos.findUnique({
      where: { userId }
    });

    const saldo = puntosUser ? (puntosUser.total - puntosUser.gastados) : 0;

    if (!puntosUser || saldo < costo) {
      return res.status(400).json({ error: "Puntos insuficientes" });
    }

    const figuritasObtenidas = [];

    // Descontar puntos y registrar transacción
    await prisma.$transaction([
      prisma.puntos.update({
        where: { userId },
        data: { gastados: { increment: costo } }
      }),
      prisma.transaccionPuntos.create({
        data: {
          userId,
          cantidad: -costo,
          tipo: "compra_sobre",
          descripcion: `Compra de sobre ${tipo}`
        }
      })
    ]);

    for (let i = 0; i < n; i++) {
      const rarezaDeseada = normalizarRareza(getRareza(tipo));
      const count = await prisma.figurita.count({ where: { rareza: rarezaDeseada } });
      
      let figurita = null;
      if (count > 0) {
        figurita = await prisma.figurita.findFirst({
          where: { rareza: rarezaDeseada },
          skip: Math.floor(Math.random() * count)
        });
      } else {
        // Fallback si no hay de esa rareza
        const countC = await prisma.figurita.count({ where: { rareza: 'común' } });
        figurita = await prisma.figurita.findFirst({
          where: { rareza: 'común' },
          skip: Math.floor(Math.random() * countC)
        });
      }

      if (figurita) {
        const existente = await prisma.coleccionFiguritas.findUnique({
          where: {
            userId_figuritaId: { userId, figuritaId: figurita.id }
          }
        });

        if (existente) {
          await prisma.coleccionFiguritas.update({
            where: { id: existente.id },
            data: { cantidad: { increment: 1 } }
          });
          figuritasObtenidas.push({ ...figurita, esNueva: false });
        } else {
          await prisma.coleccionFiguritas.create({
            data: {
              userId,
              figuritaId: figurita.id,
              cantidad: 1
            }
          });
          figuritasObtenidas.push({ ...figurita, esNueva: true });
        }
      }
    }

    const nuevoPuntaje = saldo - costo;
    
    // Intentar emitir
    const reqIo = req.app ? req.app.get('io') : ioInstance;
    if (reqIo) {
      reqIo.to(`user-${userId}`).emit("puntos:actualizados", { 
        nuevoPuntaje,
        puntosGanados: -costo,
        motivo: `Compra sobre ${tipo}`
      });
    }

    return res.json({
      figuritasObtenidas,
      puntosRestantes: nuevoPuntaje
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al abrir el sobre" });
  }
};

// FUNCIÓN 5 — calcularPuntosPrediccion
const calcularPuntosPrediccion = async (partidoId, io) => {
  try {
    // Necesitamos el resultado real del partido
    // Se asume que viene por algún lado, pero como el usuario pide que sea interna
    // debemos poder obtener el marcador real de fútbol.
    // Asumiremos que el frontend o cron nos manda el resultado real, o está en otra tabla.
    // Dado que el requerimiento es abstracto sobre la fuente del resultado,
    // supongamos que lo pasamos como parte del evento del cron (el cron llama con partidoId y score).
    // Aquí implementamos la lógica base que se adapta.
    
    // (Para ser fieles al prompt: "Busca todas las predicciones de ese partido")
    const predicciones = await prisma.prediccion.findMany({
      where: { partidoId }
    });

    if (predicciones.length === 0) return;

    // Obtener info del partido desde el API de futbol (pseudo-código, o lo pasamos como args)
    // Para simplificar, asumamos que tenemos un getScoreReal(partidoId) si no se inyecta.
    // Modificaremos la firma para aceptar el resultado real: 
    // calcularPuntosPrediccion = async (partidoId, realLocal, realVisitante, io)
  } catch (err) {
    console.error(err);
  }
};

// Versión inyectada
const calcularPuntosPrediccionInterna = async (partidoId, realLocal, realVisitante, ioObj) => {
  try {
    const predicciones = await prisma.prediccion.findMany({
      where: { partidoId }
    });

    for (const pred of predicciones) {
      const { golesLocal, golesVisitante, userId } = pred;
      
      let puntosSumar = 0;
      let tipoTransaccion = "prediccion_ganador";
      
      const difPred = golesLocal - golesVisitante;
      const difReal = realLocal - realVisitante;
      
      if (golesLocal === realLocal && golesVisitante === realVisitante) {
        puntosSumar = 5;
        tipoTransaccion = "prediccion_exacta";
      } else {
        const ganadorPred = difPred > 0 ? 'L' : difPred < 0 ? 'V' : 'E';
        const ganadorReal = difReal > 0 ? 'L' : difReal < 0 ? 'V' : 'E';
        
        if (ganadorPred === ganadorReal) {
          puntosSumar += 2;
          if (difPred === difReal) {
            puntosSumar += 1; // +1 extra por diferencia de goles
          }
        }
      }

      if (puntosSumar > 0) {
        // Upsert en Puntos
        let p = await prisma.puntos.findUnique({ where: { userId } });
        if (p) {
          p = await prisma.puntos.update({
            where: { userId },
            data: { total: { increment: puntosSumar } }
          });
        } else {
          p = await prisma.puntos.create({
            data: { userId, total: 200 + puntosSumar, gastados: 0 }
          });
        }

        await prisma.transaccionPuntos.create({
          data: {
            userId,
            cantidad: puntosSumar,
            tipo: tipoTransaccion,
            descripcion: `Puntos por partido ${partidoId}`
          }
        });

        if (ioObj) {
          ioObj.to(`user-${userId}`).emit("puntos:actualizados", {
            nuevoPuntaje: p.total - p.gastados,
            puntosGanados: puntosSumar,
            motivo: `Predicción partido ${partidoId}`
          });
        }
      }
    }
  } catch (error) {
    console.error("Error calculando puntos:", error);
  }
};

// FUNCIÓN 6 — darSobreRegistro
const darSobreRegistro = async (userId) => {
  try {
    // 1. Crea registro Puntos con total 200
    await prisma.puntos.create({
      data: {
        userId,
        total: 200,
        gastados: 0
      }
    });

    // 2. Inserta TransaccionPuntos +200 pts
    await prisma.transaccionPuntos.create({
      data: {
        userId,
        cantidad: 200,
        tipo: "registro",
        descripcion: "Bienvenido a MundialPulse"
      }
    });

    // 3. Abrir sobre "basico" sin descontar puntos
    const figuritasObtenidas = [];
    const n = 5;

    for (let i = 0; i < n; i++) {
      const rarezaDeseada = normalizarRareza(getRareza("basico"));
      const count = await prisma.figurita.count({ where: { rareza: rarezaDeseada } });
      
      let figurita = null;
      if (count > 0) {
        figurita = await prisma.figurita.findFirst({
          where: { rareza: rarezaDeseada },
          skip: Math.floor(Math.random() * count)
        });
      } else {
        const countC = await prisma.figurita.count({ where: { rareza: 'común' } });
        figurita = await prisma.figurita.findFirst({
          where: { rareza: 'común' },
          skip: Math.floor(Math.random() * countC)
        });
      }

      if (figurita) {
        figuritasObtenidas.push(figurita);

        const existente = await prisma.coleccionFiguritas.findUnique({
          where: {
            userId_figuritaId: { userId, figuritaId: figurita.id }
          }
        });

        if (existente) {
          await prisma.coleccionFiguritas.update({
            where: { id: existente.id },
            data: { cantidad: { increment: 1 } }
          });
        } else {
          await prisma.coleccionFiguritas.create({
            data: {
              userId,
              figuritaId: figurita.id,
              cantidad: 1
            }
          });
        }
      }
    }

    return figuritasObtenidas;
  } catch (error) {
    console.error("Error al dar sobre de registro:", error);
    return [];
  }
};

module.exports = {
  getMiAlbum,
  getPaisFiguritas,
  getMisPuntos,
  abrirSobre,
  calcularPuntosPrediccionInterna,
  darSobreRegistro
};
