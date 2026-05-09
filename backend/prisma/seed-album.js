const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const grupos = [
  // Grupo A
  { pais: "México", codigo: "MX", leyenda: "Hirving Lozano", dato: "Apodado 'Chucky', es uno de los jugadores más rápidos y desequilibrantes de México." },
  { pais: "Sudáfrica", codigo: "ZA", leyenda: "Percy Tau", dato: "Conocido como el 'León de Judá', es uno de los atacantes más peligrosos de África." },
  { pais: "Corea del Sur", codigo: "KR", leyenda: "Son Heung-min", dato: "Considerado el mejor futbolista asiático de la historia, ganador de la Bota de Oro de la Premier League." },
  { pais: "República Checa", codigo: "CZ", leyenda: "Tomáš Souček", dato: "Capitán de la selección, destaca por su increíble despliegue físico y juego aéreo." },
  
  // Grupo B
  { pais: "Canadá", codigo: "CA", leyenda: "Alphonso Davies", dato: "Uno de los laterales más rápidos del mundo, pilar ofensivo de la selección canadiense." },
  { pais: "Bosnia y Herzegovina", codigo: "BA", leyenda: "Edin Džeko", dato: "Goleador histórico y leyenda absoluta del fútbol bosnio." },
  { pais: "Qatar", codigo: "QA", leyenda: "Akram Afif", dato: "MVP de la Copa Asiática, es el cerebro ofensivo de la selección qatarí." },
  { pais: "Suiza", codigo: "CH", leyenda: "Granit Xhaka", dato: "Líder del mediocampo suizo, fundamental en la creación y recuperación." },

  // Grupo C
  { pais: "Brasil", codigo: "BR", leyenda: "Vinícius Jr.", dato: "Considerado uno de los mejores atacantes del mundo, figura clave del Real Madrid." },
  { pais: "Marruecos", codigo: "MA", leyenda: "Achraf Hakimi", dato: "Lateral derecho de clase mundial, fundamental en la histórica campaña de Marruecos en 2022." },
  { pais: "Haití", codigo: "HT", leyenda: "Duckens Nazon", dato: "Goleador clave que ha guiado a Haití en las eliminatorias de CONCACAF." },
  { pais: "Escocia", codigo: "SC", leyenda: "Andy Robertson", dato: "Capitán escocés, uno de los laterales izquierdos con más asistencias en la Premier League." },

  // Grupo D
  { pais: "Estados Unidos", codigo: "US", leyenda: "Christian Pulisic", dato: "Conocido como 'Capitán América', el referente del equipo anfitrión." },
  { pais: "Paraguay", codigo: "PY", leyenda: "Miguel Almirón", dato: "Jugador más rápido y dinámico del equipo guaraní, figura en la Premier League." },
  { pais: "Australia", codigo: "AU", leyenda: "Mathew Ryan", dato: "Histórico arquero y capitán de los 'Socceroos', con múltiples participaciones mundialistas." },
  { pais: "Turquía", codigo: "TR", leyenda: "Arda Güler", dato: "La gran joya del fútbol turco, talento puro en el mediocampo ofensivo." },

  // Grupo E
  { pais: "Alemania", codigo: "DE", leyenda: "Florian Wirtz", dato: "Uno de los talentos jóvenes más brillantes de Alemania, clave en el Leverkusen." },
  { pais: "Curazao", codigo: "CW", leyenda: "Leandro Bacuna", dato: "Líder del equipo caribeño con amplia experiencia en el fútbol europeo." },
  { pais: "Costa de Marfil", codigo: "CI", leyenda: "Sébastien Haller", dato: "Goleador letal y símbolo de resiliencia, héroe de la Copa Africana 2024." },
  { pais: "Ecuador", codigo: "EC", leyenda: "Moisés Caicedo", dato: "El motor del mediocampo ecuatoriano, el fichaje más caro en la historia de la Premier League." },

  // Grupo F
  { pais: "Países Bajos", codigo: "NL", leyenda: "Virgil van Dijk", dato: "Capitán neerlandés, considerado por muchos años el mejor defensor central del mundo." },
  { pais: "Japón", codigo: "JP", leyenda: "Takefusa Kubo", dato: "El 'Messi japonés', su regate y visión de juego lo hacen impredecible." },
  { pais: "Suecia", codigo: "SE", leyenda: "Alexander Isak", dato: "Delantero letal, el máximo referente ofensivo de la nueva generación sueca." },
  { pais: "Túnez", codigo: "TN", leyenda: "Wahbi Khazri", dato: "Leyenda del fútbol tunecino, especialista en tiros libres y goles importantes." },

  // Grupo G
  { pais: "Bélgica", codigo: "BE", leyenda: "Kevin De Bruyne", dato: "Considerado el mejor mediocampista del mundo por múltiples temporadas consecutivas." },
  { pais: "Egipto", codigo: "EG", leyenda: "Mohamed Salah", dato: "El 'Faraón', máximo goleador africano en la historia de la Premier League." },
  { pais: "Irán", codigo: "IR", leyenda: "Mehdi Taremi", dato: "Máximo goleador de Irán, letal delantero en el fútbol europeo." },
  { pais: "Nueva Zelanda", codigo: "NZ", leyenda: "Clayton Lewis", dato: "El eje en el mediocampo de los 'All Whites', clave en la clasificación." },

  // Grupo H
  { pais: "España", codigo: "ES", leyenda: "Pedri", dato: "El cerebro del mediocampo español, ganador del Golden Boy." },
  { pais: "Cabo Verde", codigo: "CV", leyenda: "Ryan Mendes", dato: "Goleador histórico y capitán del equipo de los 'Tubarões Azuis'." },
  { pais: "Arabia Saudita", codigo: "SA", leyenda: "Salem Al-Dawsari", dato: "Autor del legendario gol contra Argentina en el Mundial 2022." },
  { pais: "Uruguay", codigo: "UY", leyenda: "Federico Valverde", dato: "Motor del mediocampo charrúa, destaca por sus impresionantes remates de larga distancia." },

  // Grupo I
  { pais: "Francia", codigo: "FR", leyenda: "Kylian Mbappé", dato: "Segundo jugador más joven en marcar en una final mundialista, con solo 19 años en 2018." },
  { pais: "Senegal", codigo: "SN", leyenda: "Sadio Mané", dato: "El mejor jugador en la historia de Senegal, campeón de África." },
  { pais: "Irak", codigo: "IQ", leyenda: "Amjad Attwan", dato: "Motor del mediocampo iraquí, clave en el juego físico y táctico." },
  { pais: "Noruega", codigo: "NO", leyenda: "Erling Haaland", dato: "Goleador histórico de la Champions League, máximo artillero de la Premier League." },

  // Grupo J
  { pais: "Argentina", codigo: "AR", leyenda: "Lionel Messi", dato: "Máximo goleador histórico del Mundial con 13 goles, ganó su tercera Copa del Mundo en Qatar 2022." },
  { pais: "Argelia", codigo: "DZ", leyenda: "Riyad Mahrez", dato: "Capitán argelino, ganador de múltiples títulos en Inglaterra y figura histórica." },
  { pais: "Austria", codigo: "AT", leyenda: "Marcel Sabitzer", dato: "Especialista en tiros libres y el gran referente del equipo austriaco." },
  { pais: "Jordania", codigo: "JO", leyenda: "Yazan Al-Naimat", dato: "Héroe en la histórica final de la Copa Asiática 2024 para Jordania." },

  // Grupo K
  { pais: "Portugal", codigo: "PT", leyenda: "Cristiano Ronaldo", dato: "Máximo goleador histórico en selecciones masculinas con más de 130 goles." },
  { pais: "Congo DR", codigo: "CD", leyenda: "Chancel Mbemba", dato: "Capitán incombustible y líder defensivo indiscutible del Congo." },
  { pais: "Uzbekistán", codigo: "UZ", leyenda: "Eldor Shomurodov", dato: "Goleador histórico y capitán de los 'Lobos Blancos'." },
  { pais: "Colombia", codigo: "CO", leyenda: "Luis Díaz", dato: "Extremo desequilibrante, la gran figura del ataque colombiano en Europa." },

  // Grupo L
  { pais: "Inglaterra", codigo: "EN", leyenda: "Jude Bellingham", dato: "Ganador del Golden Boy y estrella del mediocampo inglés." },
  { pais: "Croacia", codigo: "HR", leyenda: "Luka Modrić", dato: "Balón de Oro 2018, primer jugador distinto a Messi y Ronaldo en ganarlo en 10 años." },
  { pais: "Ghana", codigo: "GH", leyenda: "Mohammed Kudus", dato: "El talento más brillante de Ghana, jugador de gran regate y llegada." },
  { pais: "Panamá", codigo: "PA", leyenda: "Rolando Blackburn", dato: "Goleador experimentado, figura icónica del equipo canalero." }
];

function generarJugador(paisNombre, tipo, index) {
  const prefijos = ["J.", "M.", "A.", "D.", "C.", "L.", "R.", "F.", "S.", "K.", "T.", "P."];
  const sufijos = ["Silva", "García", "Smith", "Ivanov", "Kim", "Okocha", "Müller", "Santos", "Ali", "Traoré", "Costa", "Popov"];
  
  const nombreAleatorio = `${prefijos[(index * 7) % prefijos.length]} ${sufijos[(index * 3) % sufijos.length]}`;
  
  if (tipo === 'épica') return `Figura de ${paisNombre} ${index}`;
  if (tipo === 'rara') return `Jugador Destacado ${index}`;
  return `${nombreAleatorio}`; // Nombre genérico para comunes
}

async function main() {
  console.log("Iniciando el seeding de figuritas para el Mundial 2026...");
  const figuritasData = [];
  let numeroActual = 1;

  for (const equipo of grupos) {
    // 1 Legendaria
    figuritasData.push({
      numero: numeroActual++,
      nombre: equipo.leyenda,
      pais: equipo.pais,
      paisCodigo: equipo.codigo,
      posicion: "Delantero/Medio",
      rareza: "legendaria",
      datosCurioso: equipo.dato
    });

    // 3 Épicas
    for (let i = 1; i <= 3; i++) {
      figuritasData.push({
        numero: numeroActual++,
        nombre: generarJugador(equipo.pais, 'épica', i),
        pais: equipo.pais,
        paisCodigo: equipo.codigo,
        posicion: "Medio",
        rareza: "épica",
        datosCurioso: `Un jugador muy importante en la táctica de ${equipo.pais}.`
      });
    }

    // 7 Raras
    for (let i = 1; i <= 7; i++) {
      figuritasData.push({
        numero: numeroActual++,
        nombre: generarJugador(equipo.pais, 'rara', i),
        pais: equipo.pais,
        paisCodigo: equipo.codigo,
        posicion: "Defensa/Medio",
        rareza: "rara",
        datosCurioso: `Suele ser titular indiscutible en la selección de ${equipo.pais}.`
      });
    }

    // 12 Comunes
    for (let i = 1; i <= 12; i++) {
      figuritasData.push({
        numero: numeroActual++,
        nombre: generarJugador(equipo.pais, 'común', i),
        pais: equipo.pais,
        paisCodigo: equipo.codigo,
        posicion: i % 2 === 0 ? "Defensa" : "Portero",
        rareza: "común",
        datosCurioso: `Jugador del plantel de ${equipo.pais} convocado para el Mundial 2026.`
      });
    }
  }

  console.log(`Se generaron ${figuritasData.length} figuritas. Guardando en la base de datos...`);
  
  const result = await prisma.figurita.createMany({
    data: figuritasData,
    skipDuplicates: true,
  });

  console.log(`Se insertaron ${result.count} figuritas correctamente.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
