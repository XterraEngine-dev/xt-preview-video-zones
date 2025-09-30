/**
 * FontManager - Gestión de fuentes para el preview de layouts
 * Migrado desde Angular font-manager.service.ts
 */

// Fuentes disponibles en Android TV con Google Fonts
const androidFonts = [
  // Fuentes principales de Android (Google Fonts)
  { label: 'Roboto', value: 'Roboto', category: 'android', description: 'Fuente predeterminada de Android' },
  { label: 'Roboto Condensed', value: 'Roboto Condensed', category: 'android', description: 'Versión condensada de Roboto' },
  { label: 'Roboto Mono', value: 'Roboto Mono', category: 'android', description: 'Roboto monospace' },
  { label: 'Roboto Slab', value: 'Roboto Slab', category: 'android', description: 'Roboto con serifas' },

  // Fuentes genéricas de Android (100% compatibles)
  { label: 'Sans-serif', value: 'sans-serif', category: 'android', description: 'Sans-serif genérica de Android' },
  { label: 'Serif', value: 'serif', category: 'android', description: 'Serif genérica de Android' },
  { label: 'Monospace', value: 'monospace', category: 'android', description: 'Monospace genérica de Android' },

  // Variantes de peso disponibles en Android
  { label: 'Sans-serif Light', value: 'sans-serif-light', category: 'android', description: 'Sans-serif ligera de Android' },
  { label: 'Sans-serif Thin', value: 'sans-serif-thin', category: 'android', description: 'Sans-serif delgada de Android' },
  { label: 'Sans-serif Condensed', value: 'sans-serif-condensed', category: 'android', description: 'Sans-serif condensada de Android' },
  { label: 'Sans-serif Medium', value: 'sans-serif-medium', category: 'android', description: 'Sans-serif media de Android' },

  // Fuentes adicionales populares de Google Fonts compatibles con Android
  { label: 'Open Sans', value: 'Open Sans', category: 'android', description: 'Sans-serif humanista muy legible' },
  { label: 'Lato', value: 'Lato', category: 'android', description: 'Sans-serif moderna y elegante' },
  { label: 'Source Sans Pro', value: 'Source Sans Pro', category: 'android', description: 'Sans-serif de Adobe para UI' },
  { label: 'Nunito', value: 'Nunito', category: 'android', description: 'Sans-serif redondeada amigable' }
];

// Fuentes del sistema estándar
const systemFonts = [
  { label: 'Arial', value: 'Arial', category: 'system', description: 'Sans-serif estándar' },
  { label: 'Helvetica', value: 'Helvetica', category: 'system', description: 'Sans-serif clásica' },
  { label: 'Times New Roman', value: 'Times New Roman', category: 'system', description: 'Serif tradicional' },
  { label: 'Georgia', value: 'Georgia', category: 'system', description: 'Serif optimizada para pantalla' },
  { label: 'Verdana', value: 'Verdana', category: 'system', description: 'Sans-serif legible' },
  { label: 'Courier New', value: 'Courier New', category: 'system', description: 'Monospace estándar' },
  { label: 'Impact', value: 'Impact', category: 'system', description: 'Sans-serif condensada' },
  { label: 'Comic Sans MS', value: 'Comic Sans MS', category: 'system', description: 'Informal y casual' }
];

// Fuentes web seguras
const webFonts = [
  { label: 'Inherit (Heredar)', value: 'inherit', category: 'web', description: 'Hereda de elemento padre' },
  { label: 'Default (Por defecto)', value: 'initial', category: 'web', description: 'Valor inicial del navegador' }
];

/**
 * Obtiene todas las fuentes disponibles (solo Android para TV)
 */
export function getAllFonts() {
  return [...androidFonts];
}

/**
 * Obtiene fuentes por categoría
 */
export function getFontsByCategory(category) {
  switch (category) {
    case 'system':
      return systemFonts;
    case 'android':
      return androidFonts;
    case 'web':
      return webFonts;
    default:
      return [];
  }
}

/**
 * Obtiene fuentes agrupadas por categoría para dropdowns (solo Android para TV)
 */
export function getFontsGrouped() {
  return [
    {
      label: 'Fuentes Android TV',
      items: androidFonts
    }
  ];
}

/**
 * Obtiene las fuentes más utilizadas (recomendadas para Android TV)
 */
export function getRecommendedFonts() {
  return [
    { label: 'Roboto', value: 'Roboto', category: 'android', description: 'Fuente predeterminada de Android' },
    { label: 'Sans-serif', value: 'sans-serif', category: 'android', description: 'Sans-serif genérica de Android' },
    { label: 'Roboto Condensed', value: 'Roboto Condensed', category: 'android', description: 'Versión condensada de Roboto' },
    { label: 'Roboto Mono', value: 'Roboto Mono', category: 'android', description: 'Roboto monospace' },
    { label: 'Sans-serif Medium', value: 'sans-serif-medium', category: 'android', description: 'Sans-serif media de Android' }
  ];
}

/**
 * Busca una fuente por su valor
 */
export function findFontByValue(value) {
  return getAllFonts().find(font => font.value === value);
}

/**
 * Convierte una fuente en su valor con fallback apropiado para CSS
 */
export function getFontFamilyWithFallback(fontValue) {
  const font = findFontByValue(fontValue);

  if (!font) {
    return fontValue;
  }

  // Agregar fallbacks apropiados según la categoría
  switch (font.category) {
    case 'android':
      if (fontValue.includes('Roboto')) {
        return `"${fontValue}", 'Helvetica Neue', Arial, sans-serif`;
      } else if (fontValue === 'Open Sans') {
        return `"Open Sans", "Roboto", Arial, sans-serif`;
      } else if (fontValue === 'Source Sans Pro') {
        return `"Source Sans Pro", "Roboto", Arial, sans-serif`;
      } else if (fontValue === 'Nunito') {
        return `"Nunito", "Roboto", Arial, sans-serif`;
      } else if (fontValue === 'Lato') {
        return `"Lato", "Roboto", Arial, sans-serif`;
      } else if (fontValue.includes('mono') || fontValue.includes('Mono')) {
        return `"${fontValue}", 'Courier New', monospace`;
      } else if (fontValue === 'serif') {
        return `${fontValue}, 'Times New Roman', Times, serif`;
      } else if (fontValue.includes('serif')) {
        return `${fontValue}, serif`;
      } else if (fontValue.includes('sans-serif')) {
        return `${fontValue}, Arial, sans-serif`;
      } else {
        return `"${fontValue}", "Roboto", Arial, sans-serif`;
      }
    case 'system':
      if (fontValue.includes('Times') || fontValue === 'Georgia') {
        return `${fontValue}, serif`;
      } else if (fontValue.includes('Courier')) {
        return `${fontValue}, monospace`;
      } else {
        return `${fontValue}, sans-serif`;
      }
    case 'web':
    default:
      return fontValue;
  }
}

/**
 * Verifica si una fuente es compatible con Android
 */
export function isAndroidCompatible(fontValue) {
  return androidFonts.some(font => font.value === fontValue) ||
         webFonts.some(font => font.value === fontValue);
}

/**
 * Carga Google Fonts necesarias
 * Esta función debe ser llamada al inicializar la app
 */
export function loadGoogleFonts() {
  // Lista de fuentes de Google Fonts a cargar
  const googleFontsToLoad = [
    'Roboto:300,400,500,700',
    'Roboto+Condensed:300,400,700',
    'Roboto+Mono:400,700',
    'Roboto+Slab:400,700',
    'Open+Sans:300,400,600,700',
    'Lato:300,400,700',
    'Source+Sans+Pro:300,400,600,700',
    'Nunito:300,400,600,700'
  ];

  // Crear link element para cargar las fuentes
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?${googleFontsToLoad.map(f => `family=${f}`).join('&')}&display=swap`;

  // Agregar al head
  document.head.appendChild(link);

  console.log('✅ Google Fonts loaded:', googleFontsToLoad.length, 'families');
}

export default {
  getAllFonts,
  getFontsByCategory,
  getFontsGrouped,
  getRecommendedFonts,
  findFontByValue,
  getFontFamilyWithFallback,
  isAndroidCompatible,
  loadGoogleFonts
};