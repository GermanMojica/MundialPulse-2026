const PAISES_DATA = {
  // CONMEBOL
  AR: { nombre: "Argentina", bandera: "🇦🇷", colorPrimario: "#74ACDF" },
  BR: { nombre: "Brasil", bandera: "🇧🇷", colorPrimario: "#009C3B" },
  CO: { nombre: "Colombia", bandera: "🇨🇴", colorPrimario: "#FCD116" },
  UY: { nombre: "Uruguay", bandera: "🇺🇾", colorPrimario: "#0038A8" },
  EC: { nombre: "Ecuador", bandera: "🇪🇨", colorPrimario: "#FFD700" },
  PE: { nombre: "Perú", bandera: "🇵🇪", colorPrimario: "#D91023" },
  CL: { nombre: "Chile", bandera: "🇨🇱", colorPrimario: "#0039A6" },
  PY: { nombre: "Paraguay", bandera: "🇵🇾", colorPrimario: "#D52B1E" },
  VE: { nombre: "Venezuela", bandera: "🇻🇪", colorPrimario: "#F7D117" },
  BO: { nombre: "Bolivia", bandera: "🇧🇴", colorPrimario: "#007A33" },

  // CONCACAF
  MX: { nombre: "México", bandera: "🇲🇽", colorPrimario: "#006847" },
  US: { nombre: "Estados Unidos", bandera: "🇺🇸", colorPrimario: "#3C3B6E" },
  CA: { nombre: "Canadá", bandera: "🇨🇦", colorPrimario: "#FF0000" },
  CR: { nombre: "Costa Rica", bandera: "🇨🇷", colorPrimario: "#002B7F" },
  PA: { nombre: "Panamá", bandera: "🇵🇦", colorPrimario: "#005293" },
  JM: { nombre: "Jamaica", bandera: "🇯🇲", colorPrimario: "#009B3A" },
  HN: { nombre: "Honduras", bandera: "🇭🇳", colorPrimario: "#0073CF" },
  SV: { nombre: "El Salvador", bandera: "🇸🇻", colorPrimario: "#0047AB" },
  GT: { nombre: "Guatemala", bandera: "🇬🇹", colorPrimario: "#4997D0" },

  // UEFA
  FR: { nombre: "Francia", bandera: "🇫🇷", colorPrimario: "#002395" },
  ES: { nombre: "España", bandera: "🇪🇸", colorPrimario: "#AA151B" },
  DE: { nombre: "Alemania", bandera: "🇩🇪", colorPrimario: "#000000" },
  EN: { nombre: "Inglaterra", bandera: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", colorPrimario: "#CF081F" },
  PT: { nombre: "Portugal", bandera: "🇵🇹", colorPrimario: "#DA291C" },
  NL: { nombre: "Países Bajos", bandera: "🇳🇱", colorPrimario: "#F36C21" },
  IT: { nombre: "Italia", bandera: "🇮🇹", colorPrimario: "#008C45" },
  BE: { nombre: "Bélgica", bandera: "🇧🇪", colorPrimario: "#000000" },
  HR: { nombre: "Croacia", bandera: "🇭🇷", colorPrimario: "#FF0000" },
  CH: { nombre: "Suiza", bandera: "🇨🇭", colorPrimario: "#D52B1E" },
  DK: { nombre: "Dinamarca", bandera: "🇩🇰", colorPrimario: "#C60C30" },
  PL: { nombre: "Polonia", bandera: "🇵🇱", colorPrimario: "#DC143C" },

  // CAF
  MA: { nombre: "Marruecos", bandera: "🇲🇦", colorPrimario: "#C1272D" },
  SN: { nombre: "Senegal", bandera: "🇸🇳", colorPrimario: "#00853F" },
  EG: { nombre: "Egipto", bandera: "🇪🇬", colorPrimario: "#CE1126" },
  NG: { nombre: "Nigeria", bandera: "🇳🇬", colorPrimario: "#008751" },
  CM: { nombre: "Camerún", bandera: "🇨🇲", colorPrimario: "#432C23" },
  GH: { nombre: "Ghana", bandera: "🇬🇭", colorPrimario: "#EF3340" },
  DZ: { nombre: "Argelia", bandera: "🇩🇿", colorPrimario: "#006233" },
  TN: { nombre: "Túnez", bandera: "🇹🇳", colorPrimario: "#E70013" },

  // AFC
  JP: { nombre: "Japón", bandera: "🇯🇵", colorPrimario: "#00005B" },
  KR: { nombre: "Corea del Sur", bandera: "🇰🇷", colorPrimario: "#CD2E3A" },
  SA: { nombre: "Arabia Saudita", bandera: "🇸🇦", colorPrimario: "#006C35" },
  IR: { nombre: "Irán", bandera: "🇮🇷", colorPrimario: "#239B56" },
  AU: { nombre: "Australia", bandera: "🇦🇺", colorPrimario: "#00008B" },
  QA: { nombre: "Qatar", bandera: "🇶🇦", colorPrimario: "#8D1B3D" },

  // OFC
  NZ: { nombre: "Nueva Zelanda", bandera: "🇳🇿", colorPrimario: "#000000" },
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
  
  if (data) return {
    ...data,
    colores: [data.colorPrimario, "#FFFFFF"],
    titulosMundiales: 0,
    mejorResultado: "Fase de Grupos",
    datoCurioso: `Selección participante en el Mundial 2026`,
    estadio: "Sede Mundial 2026",
    iconoAlusivo: "⚽"
  };
  
  // Fallback con color generado
  const fallbackColor = stringToColor(codigo || nombre);
  return {
    nombre: nombre || codigo,
    bandera: "🏳️",
    colores: [fallbackColor, "#1a1a2e"],
    colorPrimario: fallbackColor,
    titulosMundiales: 0,
    mejorResultado: "Clasificado",
    datoCurioso: `Selección clasificada al Mundial 2026`,
    iconoAlusivo: "balon"
  };
};

export default PAISES_DATA;
