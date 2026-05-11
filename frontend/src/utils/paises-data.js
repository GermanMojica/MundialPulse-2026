const PAISES_DATA = {
  // CONMEBOL
  AR: { 
    nombre: "Argentina", 
    bandera: "🇦🇷", 
    colorPrimario: "#74ACDF", 
    teamId: 26, 
    titulos: 3, 
    mejorResultado: "Campeón (1978, 1986, 2022)",
    datoCurioso: "La Albiceleste ha disputado 6 finales del mundo."
  },
  BR: { 
    nombre: "Brasil", 
    bandera: "🇧🇷", 
    colorPrimario: "#009C3B", 
    teamId: 6, 
    titulos: 5, 
    mejorResultado: "Campeón (1958, 1962, 1970, 1994, 2002)",
    datoCurioso: "Es la única selección que ha participado en todos los mundiales."
  },
  CO: { 
    nombre: "Colombia", 
    bandera: "🇨🇴", 
    colorPrimario: "#FCD116", 
    teamId: 8, 
    titulos: 0, 
    mejorResultado: "Cuartos de Final (2014)",
    datoCurioso: "James Rodríguez fue el bota de oro en Brasil 2014."
  },
  UY: { 
    nombre: "Uruguay", 
    bandera: "🇺🇾", 
    colorPrimario: "#0038A8", 
    teamId: 7, 
    titulos: 2, 
    mejorResultado: "Campeón (1930, 1950)",
    datoCurioso: "Ganó el primer mundial de la historia organizado en su casa."
  },
  EC: { 
    nombre: "Ecuador", 
    bandera: "🇪🇨", 
    colorPrimario: "#FFD700", 
    teamId: 2382, 
    titulos: 0, 
    mejorResultado: "Octavos de Final (2006)",
    datoCurioso: "En 2022, Enner Valencia marcó los primeros 3 goles de su selección."
  },
  PE: { 
    nombre: "Perú", 
    bandera: "🇵🇪", 
    colorPrimario: "#D91023", 
    teamId: 1185, 
    titulos: 0, 
    mejorResultado: "Cuartos de Final (1970)",
    datoCurioso: "Teófilo Cubillas es su máximo goleador histórico en mundiales."
  },
  CL: { 
    nombre: "Chile", 
    bandera: "🇨🇱", 
    colorPrimario: "#0039A6", 
    teamId: 1186, 
    titulos: 0, 
    mejorResultado: "Tercer Puesto (1962)",
    datoCurioso: "Fue anfitrión del mundial de 1962."
  },
  PY: { 
    nombre: "Paraguay", 
    bandera: "🇵🇾", 
    colorPrimario: "#D52B1E", 
    teamId: 1184, 
    titulos: 0, 
    mejorResultado: "Cuartos de Final (2010)",
    datoCurioso: "Estuvo a punto de eliminar a la campeona España en 2010."
  },
  VE: { 
    nombre: "Venezuela", 
    bandera: "🇻🇪", 
    colorPrimario: "#F7D117", 
    teamId: 1187, 
    titulos: 0, 
    mejorResultado: "Buscando Clasificar",
    datoCurioso: "Es la única selección de CONMEBOL que no ha ido a un mundial."
  },
  BO: { 
    nombre: "Bolivia", 
    bandera: "🇧🇴", 
    colorPrimario: "#007A33", 
    teamId: 1188, 
    titulos: 0, 
    mejorResultado: "Fase de Grupos (1930, 1950, 1994)",
    datoCurioso: "Su última participación fue en el histórico mundial de USA 94."
  },

  // CONCACAF
  MX: { 
    nombre: "México", 
    bandera: "🇲🇽", 
    colorPrimario: "#006847", 
    teamId: 16, 
    titulos: 0, 
    mejorResultado: "Cuartos de Final (1970, 1986)",
    datoCurioso: "Será el primer país en albergar 3 mundiales distintos."
  },
  US: { 
    nombre: "Estados Unidos", 
    bandera: "🇺🇸", 
    colorPrimario: "#3C3B6E", 
    teamId: 2384, 
    titulos: 0, 
    mejorResultado: "Tercer Puesto (1930)",
    datoCurioso: "Tiene el récord de asistencia media en un mundial (USA 94)."
  },
  CA: { 
    nombre: "Canadá", 
    bandera: "🇨🇦", 
    colorPrimario: "#FF0000", 
    teamId: 5529, 
    titulos: 0, 
    mejorResultado: "Fase de Grupos (1986, 2022)",
    datoCurioso: "Alphonso Davies marcó el primer gol de su historia en 2022."
  },

  // UEFA
  FR: { 
    nombre: "Francia", 
    bandera: "🇫🇷", 
    colorPrimario: "#002395", 
    teamId: 2, 
    titulos: 2, 
    mejorResultado: "Campeón (1998, 2018)",
    datoCurioso: "Ha llegado a la final en 3 de los últimos 7 mundiales."
  },
  ES: { 
    nombre: "España", 
    bandera: "🇪🇸", 
    colorPrimario: "#AA151B", 
    teamId: 9, 
    titulos: 1, 
    mejorResultado: "Campeón (2010)",
    datoCurioso: "Su estilo 'Tiki-Taka' maravilló al mundo en Sudáfrica."
  },
  DE: { 
    nombre: "Alemania", 
    bandera: "🇩🇪", 
    colorPrimario: "#000000", 
    teamId: 25, 
    titulos: 4, 
    mejorResultado: "Campeón (1954, 1974, 1990, 2014)",
    datoCurioso: "Es la selección con más finales (8) y más partidos jugados."
  },
  EN: { 
    nombre: "Inglaterra", 
    bandera: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", 
    colorPrimario: "#CF081F", 
    teamId: 10, 
    titulos: 1, 
    mejorResultado: "Campeón (1966)",
    datoCurioso: "Inventores del fútbol, ganaron su único mundial en casa."
  },
  PT: { 
    nombre: "Portugal", 
    bandera: "🇵🇹", 
    colorPrimario: "#DA291C", 
    teamId: 27, 
    titulos: 0, 
    mejorResultado: "Tercer Puesto (1966)",
    datoCurioso: "Cristiano Ronaldo es el único en marcar en 5 mundiales distintos."
  },
  IT: { 
    nombre: "Italia", 
    bandera: "🇮🇹", 
    colorPrimario: "#008C45", 
    teamId: 10, 
    titulos: 4, 
    mejorResultado: "Campeón (1934, 1938, 1982, 2006)",
    datoCurioso: "Fueron los primeros en defender un título con éxito (1938)."
  },
  BE: { 
    nombre: "Bélgica", 
    bandera: "🇧🇪", 
    colorPrimario: "#000000", 
    teamId: 1, 
    titulos: 0, 
    mejorResultado: "Tercer Puesto (2018)",
    datoCurioso: "Su 'Generación de Oro' alcanzó el #1 del ranking FIFA por años."
  },
  HR: { 
    nombre: "Croacia", 
    bandera: "🇭🇷", 
    colorPrimario: "#FF0000", 
    teamId: 3, 
    titulos: 0, 
    mejorResultado: "Subcampeón (2018)",
    datoCurioso: "Con solo 4 millones de habitantes, han sido podio 3 veces."
  },
  
  // CAF
  MA: { 
    nombre: "Marruecos", 
    bandera: "🇲🇦", 
    colorPrimario: "#C1272D", 
    teamId: 31, 
    titulos: 0, 
    mejorResultado: "Cuarto Puesto (2022)",
    datoCurioso: "Primera selección africana y árabe en llegar a semifinales."
  },
  EG: { 
    nombre: "Egipto", 
    bandera: "🇪🇬", 
    colorPrimario: "#CE1126", 
    teamId: 32, 
    titulos: 0, 
    mejorResultado: "Fase de Grupos",
    datoCurioso: "Fue la primera selección africana en participar en un mundial (1934)."
  }
};

// Generar un color determinístico basado en el string
const stringToColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF;
    color += ('00' + value.toString(16)).substr(-2);
  }
  return color;
};

export const getPaisData = (codigo, nombre = "") => {
  const data = PAISES_DATA[codigo];
  const crestUrl = data?.teamId 
    ? `https://media.api-sports.io/football/teams/${data.teamId}.png`
    : `https://flagsapi.com/${codigo}/flat/64.png`; // Fallback a bandera si no hay teamId

  if (data) return {
    ...data,
    escudo: crestUrl,
    colores: [data.colorPrimario, "#FFFFFF"],
    titulosMundiales: data.titulos || 0,
    mejorResultado: data.mejorResultado || "Fase de Grupos",
    datoCurioso: data.datoCurioso || `Selección participante en el Mundial 2026`,
    estadio: "Sede Mundial 2026",
    iconoAlusivo: "⚽"
  };
  
  // Fallback con color generado
  const fallbackColor = stringToColor(codigo || nombre);
  return {
    nombre: nombre || codigo,
    bandera: "🏳️",
    escudo: crestUrl,
    colores: [fallbackColor, "#1a1a2e"],
    colorPrimario: fallbackColor,
    titulosMundiales: 0,
    mejorResultado: "Clasificado",
    datoCurioso: `Selección clasificada al Mundial 2026`,
    iconoAlusivo: "balon"
  };
};

export default PAISES_DATA;
