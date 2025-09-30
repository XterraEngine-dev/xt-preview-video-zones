<script setup>
import { computed, onMounted, watch } from 'vue';
import { getLayoutZones, getLayoutContainerStyle, getLayoutWrapperStyles } from '../services/layoutConfigs.js';
import MediaZone from './MediaZone.vue';

const props = defineProps({
  layout: {
    type: Object,
    required: true
  }
});

const metadata = computed(() => {
  if (!props.layout.metadata) {
    console.warn('No metadata in layout');
    return {};
  }
  // Parse if string (shouldn't happen if CampaignPlayer already parsed it)
  if (typeof props.layout.metadata === 'string') {
    console.log('Metadata is string in LayoutRenderer, parsing...');
    return JSON.parse(props.layout.metadata);
  }
  return props.layout.metadata;
});

const layoutType = computed(() => metadata.value.layout || 'full-screen');
const zones = computed(() => getLayoutZones(layoutType.value));
const containerStyle = computed(() => getLayoutContainerStyle(layoutType.value));
const wrapperConfig = computed(() => getLayoutWrapperStyles(layoutType.value));

const assignments = computed(() => metadata.value.assignments || []);
const labels = computed(() => metadata.value.labels || []);
const backgroundShapes = computed(() => metadata.value.backgroundShapes || []);

function getAssignmentForZone(zoneId) {
  const assignment = assignments.value.find(a => a.zoneId === zoneId);
  console.log(`LayoutRenderer: Assignment for ${zoneId}:`, assignment);
  return assignment;
}

onMounted(() => {
  console.log('=== LayoutRenderer Mounted ===');
  console.log('Layout:', props.layout.name, props.layout.id);
  console.log('Layout type:', layoutType.value);
  console.log('Zones:', zones.value.length);
  console.log('Assignments:', assignments.value);
  console.log('Labels:', labels.value);
  console.log('Background Shapes:', backgroundShapes.value);

  // Log each assignment detail
  assignments.value.forEach(assignment => {
    console.log(`Assignment for ${assignment.zoneId}:`, {
      mediaCount: assignment.media?.length || 0,
      media: assignment.media
    });
  });

  // Log each label
  labels.value.forEach(label => {
    console.log(`Label "${label.text}":`, label);
  });

  console.log('===========================');
});

watch(() => props.layout, (newLayout) => {
  console.log('LayoutRenderer: Layout changed to:', newLayout.name);
}, { deep: true });

function getShapeStyle(shape) {
  const baseStyle = {
    position: 'absolute',
    left: `${shape.x}%`,
    top: `${shape.y}%`,
    width: `${shape.width}%`,
    height: `${shape.height}%`,
    backgroundColor: shape.color,
    borderColor: shape.borderColor,
    borderWidth: `${shape.borderWidth}px`,
    opacity: shape.opacity,
    zIndex: shape.zIndex
  };

  if (shape.type === 'circle') {
    baseStyle.borderRadius = '50%';
  } else if (shape.type === 'triangle') {
    // CSS triangle using borders
    baseStyle.width = '0';
    baseStyle.height = '0';
    baseStyle.backgroundColor = 'transparent';
    baseStyle.borderLeft = `${shape.width}px solid transparent`;
    baseStyle.borderRight = `${shape.width}px solid transparent`;
    baseStyle.borderBottom = `${shape.height}px solid ${shape.color}`;
  }

  return baseStyle;
}

// Función para posicionamiento del label con coordenadas absolutas en píxeles
function getLabelContainerStyle(label) {
  const x = label.position?.x ?? label.x;
  const y = label.position?.y ?? label.y;

  // Canvas fijo de 1920x1080 (como Angular/Konva)
  const CANVAS_WIDTH = 1920;
  const CANVAS_HEIGHT = 1080;

  const style = {
    position: 'absolute',
    pointerEvents: 'none',
    userSelect: 'none'
  };

  // Convertir porcentaje (0-100) a píxeles absolutos
  if (x !== undefined) {
    style.left = `${(x / 100) * CANVAS_WIDTH}px`;
  }

  if (y !== undefined) {
    style.top = `${(y / 100) * CANVAS_HEIGHT}px`;
  }

  // Convertir porcentaje a píxeles
/* if (x !== undefined) {
    if (typeof x === 'string' && x.includes('px')) {
      style.left = x;
    } else if (typeof x === 'string' && x.includes('%')) {
      const percentValue = parseFloat(x);
      style.left = `${(percentValue / 100) * CANVAS_WIDTH}px`;
    } else {
      style.left = `${(x / 100) * CANVAS_WIDTH}px`;
    }
  }

  if (y !== undefined) {
    if (typeof y === 'string' && y.includes('px')) {
      style.top = y;
    } else if (typeof y === 'string' && y.includes('%')) {
      const percentValue = parseFloat(y);
      style.top = `${(percentValue / 100) * CANVAS_HEIGHT}px`;
    } else {
      style.top = `${(y / 100) * CANVAS_HEIGHT}px`;
    }
  }*/

  // Z-index
  style.zIndex = label.zIndex ?? 100;

  return style;
}

// NUEVO: Función para el contenedor interno con transformación y estilo (como Angular)
function getLabelInnerStyle(label) {
  console.log('getLabelInnerStyle - Label completo:', JSON.stringify(label, null, 2));

  const labelStyle = label.style || {};
  console.log('getLabelInnerStyle - labelStyle extraído:', labelStyle);

  const style = {
    position: 'relative',
    display: 'inline-block' // Cambiado a inline-block para que el tamaño se ajuste al contenido
  };

  // ============================================
  // PASO 1: Aplicar estilos de TEXTO primero
  // ============================================

  // Font size - aplicar factor de escala Android TV (240 DPI / 160 baseline = 1.5)
  const ANDROID_TV_SCALE = 240 / 160; // 1.5x scale factor for 240dpi
  const fontSize = labelStyle.fontSize || label.fontSize;

  if (fontSize) {
    if (typeof fontSize === 'string') {
      // Si ya viene con unidades (ej: "72px"), parsear y escalar
      const numericSize = parseFloat(fontSize);
      if (!isNaN(numericSize)) {
        const scaledSize = numericSize * ANDROID_TV_SCALE;
        style.fontSize = `${scaledSize}px`;
      } else {
        style.fontSize = fontSize;
      }
    } else {
      // Si es número, escalar y convertir a píxeles
      const scaledSize = fontSize * ANDROID_TV_SCALE;
      style.fontSize = `${scaledSize}px`;
    }
  } else {
    // Valor por defecto
    style.fontSize = `${16 * ANDROID_TV_SCALE}px`; // 24px
  }

  // Font Family
  const fontFamily = labelStyle.fontFamily || label.fontFamily;
  console.log('Font Family - labelStyle.fontFamily:', labelStyle.fontFamily, 'label.fontFamily:', label.fontFamily, 'Final:', fontFamily);
  if (fontFamily) {
    // Limpiar comillas escapadas: "\"Roboto Slab\"" -> "Roboto Slab"
    // Vue necesita el valor limpio para aplicarlo correctamente
    let cleanedFontFamily = fontFamily;

    // Si tiene comillas escapadas (\"), removerlas y dejar solo el nombre
    if (typeof cleanedFontFamily === 'string') {
      // Eliminar las comillas invertidas \" y dejar el string limpio
      cleanedFontFamily = cleanedFontFamily.replace(/\\"/g, '"');
    }

    style.fontFamily = cleanedFontFamily;
    console.log('Font Family limpiado:', cleanedFontFamily);
  } else {
    // Si es null o undefined, usar string vacío
    style.fontFamily = '';
    console.log('Font Family es null/undefined, usando string vacío');
  }

  // Font Weight (bold, normal, 100-900)
  const fontWeight = labelStyle.fontWeight || label.fontWeight;
  if (fontWeight) {
    style.fontWeight = fontWeight;
  }

  // Font Style (italic, normal)
  const fontStyle = labelStyle.fontStyle || label.fontStyle;
  if (fontStyle) {
    style.fontStyle = fontStyle;
  }

  // Color
  style.color = labelStyle.color || label.color || '#ffffff';

  // Line height
  if (labelStyle.lineHeight || label.lineHeight) {
    style.lineHeight = labelStyle.lineHeight || label.lineHeight;
  }

  // Text shadow (solo aplicar si está definido explícitamente)
  const textShadow = labelStyle.textShadow || label.textShadow;
  if (textShadow !== undefined && textShadow !== null && textShadow !== '') {
    style.textShadow = textShadow;
  }

  console.log('Label style applied:', {
    text: label.text,
    fontSize: style.fontSize,
    fontWeight: style.fontWeight,
    fontStyle: style.fontStyle,
    fontFamily: style.fontFamily,
    color: style.color
  });

  // ============================================
  // PASO 2: Aplicar dimensiones DESPUÉS del texto
  // ============================================

  // Width y Height - SOLO aplicar si están definidos explícitamente
  // Si no hay width, el contenedor se ajustará al contenido (sin wrap)
  if (label.width !== undefined && label.width !== null && label.width > 0) {
    style.width = typeof label.width === 'string' ? label.width : `${label.width}px`;
    style.minWidth = style.width; // Asegurar que no se reduzca más
  }

  if (label.height !== undefined && label.height !== null && label.height > 0) {
    style.height = typeof label.height === 'string' ? label.height : `${label.height}px`;
    style.minHeight = style.height; // Asegurar que no se reduzca más
  }

  // Text align
  if (labelStyle.textAlign || label.textAlign) {
    style.textAlign = labelStyle.textAlign || label.textAlign;
  }

  // Background
  const backgroundColor = labelStyle.backgroundColor || label.backgroundColor;
  if (backgroundColor) {
    style.backgroundColor = backgroundColor;
    if (label.padding) {
      style.padding = label.padding;
    }
    if (label.borderRadius) {
      style.borderRadius = label.borderRadius;
    }
  }

  // Opacity
  if (label.opacity !== undefined) {
    style.opacity = label.opacity;
  }

  // ============================================
  // PASO 3: Aplicar transformaciones AL FINAL
  // ============================================

  // Transforms (sin translate porque las coordenadas ya están correctas)
  const transforms = [];

  if (label.scale !== undefined && label.scale !== 1) {
    transforms.push(`scale(${label.scale})`);
  }

  if (label.rotation !== undefined && label.rotation !== 0) {
    transforms.push(`rotate(${label.rotation}deg)`);
  }

  if (transforms.length > 0) {
    style.transform = transforms.join(' ');
    style.transformOrigin = 'top left'; // Importante: rotación desde top-left
  }

  return style;
}

function renderLabelText(label) {
  if (!label.text) {
    return '<span style="color: #999; font-style: italic;">Empty label</span>';
  }

  // Process line breaks - convert \n to <br>
  let processedText = label.text.replace(/\n/g, '<br>');

  // Normalizar espacios múltiples pero mantener los saltos de línea <br>
  // No colapsar espacios dentro de las líneas para respetar el formato original
  processedText = processedText
    .split('<br>')
    .map(line => line.trim())
    .join('<br>');

  // TODO: Agregar soporte para variables {{variable}} si es necesario en el futuro

  return processedText;
}
</script>

<template>
  <div class="layout-renderer relative w-full h-full overflow-hidden">
    <!-- Background Shapes -->
    <div
      v-for="shape in backgroundShapes"
      :key="shape.id"
      :style="getShapeStyle(shape)"
      class="background-shape"
    ></div>

    <!-- Layout Container - Simple Layouts (no wrapper needed) -->
    <div v-if="!wrapperConfig.needsWrapper" :style="containerStyle">
      <MediaZone
        v-for="zone in zones"
        :key="zone.id"
        :zone-id="zone.id"
        :zone-config="zone"
        :assignment="getAssignmentForZone(zone.id)"
      />
    </div>

    <!-- Layout Container - Complex Layouts (with wrapper) -->
    <div v-else :style="wrapperConfig.mainContainer">
      <template v-if="layoutType === 'main-left'">
        <MediaZone :zone-id="zones[0].id" :zone-config="zones[0]" :assignment="getAssignmentForZone(zones[0].id)" />
        <div :style="wrapperConfig.secondaryContainer">
          <MediaZone :zone-id="zones[1].id" :zone-config="zones[1]" :assignment="getAssignmentForZone(zones[1].id)" />
          <MediaZone :zone-id="zones[2].id" :zone-config="zones[2]" :assignment="getAssignmentForZone(zones[2].id)" />
        </div>
      </template>

      <template v-else-if="layoutType === 'main-right'">
        <div :style="wrapperConfig.secondaryContainer">
          <MediaZone :zone-id="zones[0].id" :zone-config="zones[0]" :assignment="getAssignmentForZone(zones[0].id)" />
          <MediaZone :zone-id="zones[1].id" :zone-config="zones[1]" :assignment="getAssignmentForZone(zones[1].id)" />
        </div>
        <MediaZone :zone-id="zones[2].id" :zone-config="zones[2]" :assignment="getAssignmentForZone(zones[2].id)" />
      </template>

      <template v-else-if="layoutType === 'main-top'">
        <MediaZone :zone-id="zones[0].id" :zone-config="zones[0]" :assignment="getAssignmentForZone(zones[0].id)" />
        <div :style="wrapperConfig.secondaryContainer">
          <MediaZone :zone-id="zones[1].id" :zone-config="zones[1]" :assignment="getAssignmentForZone(zones[1].id)" />
          <MediaZone :zone-id="zones[2].id" :zone-config="zones[2]" :assignment="getAssignmentForZone(zones[2].id)" />
        </div>
      </template>

      <template v-else-if="layoutType === 'main-bottom'">
        <div :style="wrapperConfig.secondaryContainer">
          <MediaZone :zone-id="zones[0].id" :zone-config="zones[0]" :assignment="getAssignmentForZone(zones[0].id)" />
          <MediaZone :zone-id="zones[1].id" :zone-config="zones[1]" :assignment="getAssignmentForZone(zones[1].id)" />
        </div>
        <MediaZone :zone-id="zones[2].id" :zone-config="zones[2]" :assignment="getAssignmentForZone(zones[2].id)" />
      </template>

      <template v-else-if="layoutType === 'two-top-one-bottom'">
        <div :style="wrapperConfig.secondaryContainer">
          <MediaZone :zone-id="zones[0].id" :zone-config="zones[0]" :assignment="getAssignmentForZone(zones[0].id)" />
          <MediaZone :zone-id="zones[1].id" :zone-config="zones[1]" :assignment="getAssignmentForZone(zones[1].id)" />
        </div>
        <MediaZone :zone-id="zones[2].id" :zone-config="zones[2]" :assignment="getAssignmentForZone(zones[2].id)" />
      </template>

      <template v-else-if="layoutType === 'one-top-two-bottom'">
        <MediaZone :zone-id="zones[0].id" :zone-config="zones[0]" :assignment="getAssignmentForZone(zones[0].id)" />
        <div :style="wrapperConfig.secondaryContainer">
          <MediaZone :zone-id="zones[1].id" :zone-config="zones[1]" :assignment="getAssignmentForZone(zones[1].id)" />
          <MediaZone :zone-id="zones[2].id" :zone-config="zones[2]" :assignment="getAssignmentForZone(zones[2].id)" />
        </div>
      </template>

      <template v-else-if="layoutType === 'two-left-one-right'">
        <div :style="wrapperConfig.secondaryContainer">
          <MediaZone :zone-id="zones[0].id" :zone-config="zones[0]" :assignment="getAssignmentForZone(zones[0].id)" />
          <MediaZone :zone-id="zones[1].id" :zone-config="zones[1]" :assignment="getAssignmentForZone(zones[1].id)" />
        </div>
        <MediaZone :zone-id="zones[2].id" :zone-config="zones[2]" :assignment="getAssignmentForZone(zones[2].id)" />
      </template>

      <template v-else-if="layoutType === 'one-left-two-right'">
        <MediaZone :zone-id="zones[0].id" :zone-config="zones[0]" :assignment="getAssignmentForZone(zones[0].id)" />
        <div :style="wrapperConfig.secondaryContainer">
          <MediaZone :zone-id="zones[1].id" :zone-config="zones[1]" :assignment="getAssignmentForZone(zones[1].id)" />
          <MediaZone :zone-id="zones[2].id" :zone-config="zones[2]" :assignment="getAssignmentForZone(zones[2].id)" />
        </div>
      </template>
    </div>

    <!-- Labels -->
    <div
      v-for="label in labels"
      :key="label.id"
      class="label-container"
      :style="getLabelContainerStyle(label)"
    >
      <div
        class="label-inner"
        :style="getLabelInnerStyle(label)"
      >
        <!-- Aplicar estilos de texto directamente al span -->
        <span
          class="label-text"
          :style="getLabelInnerStyle(label)"
          v-html="renderLabelText(label)"
        ></span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.layout-renderer {
  background-color: #000;
  position: relative;
  /* Dimensiones fijas como canvas de 1920x1080 (igual que Angular/Konva) */
  width: 1920px;
  height: 1080px;
}

.background-shape {
  pointer-events: none;
}

/* Estilos para labels con coordenadas absolutas en píxeles */
.label-container {
  position: absolute;
  pointer-events: none;
  user-select: none;
  /* Asegurar que no herede estilos no deseados */
  margin: 0;
  padding: 0;
  border: none;
  box-sizing: content-box;
}

.label-inner {
  position: relative;
  /* Asegurar que no herede estilos no deseados */
  margin: 0;
  padding: 0;
  border: none;
  box-sizing: content-box;
}

.label-text {
  display: inline-block;
  white-space: nowrap; /* No permitir saltos de línea automáticos */
  overflow: visible; /* Permitir que el texto sea visible completo */
  line-height: 1;
  vertical-align: top;
  /* Resetear estilos heredados del CSS global */
  margin: 0;
  padding: 0;
  border: none;
  /* Permitir que font-weight se aplique desde inline styles */
  font-weight: inherit;
  /* Asegurar que text-rendering sea consistente */
  text-rendering: geometricPrecision;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>