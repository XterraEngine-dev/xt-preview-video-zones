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

// NUEVO: Función para posicionamiento del contenedor externo (como Angular)
function getLabelContainerStyle(label) {
  const x = label.position?.x ?? label.x;
  const y = label.position?.y ?? label.y;
  const CANVAS_WIDTH = 1920;
  const CANVAS_HEIGHT = 1080;

  const style = {
    position: 'absolute',
    pointerEvents: 'none',
    userSelect: 'none'
  };

  // Convertir porcentaje a píxeles
  if (x !== undefined) {
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
  }

  // Z-index
  style.zIndex = label.zIndex ?? 100;

  return style;
}

// NUEVO: Función para el contenedor interno con transformación y estilo (como Angular)
function getLabelInnerStyle(label) {
  const labelStyle = label.style || {};
  const style = {
    position: 'relative',
    display: 'inline-block' // Cambiado a inline-block para que el tamaño se ajuste al contenido
  };

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

  // Aplicar estilos de texto
  const fontSize = labelStyle.fontSize || label.fontSize || 16;
  if (typeof fontSize === 'string') {
    style.fontSize = fontSize;
  } else {
    style.fontSize = `${fontSize}px`;
  }

  style.color = labelStyle.color || label.color || '#ffffff';
  style.fontWeight = labelStyle.fontWeight || label.fontWeight || 'normal';
  style.fontStyle = labelStyle.fontStyle || label.fontStyle || 'normal';
  style.fontFamily = labelStyle.fontFamily || label.fontFamily || 'inherit';

  // Text shadow por defecto (como Angular)
  if (labelStyle.textShadow || label.textShadow) {
    style.textShadow = labelStyle.textShadow || label.textShadow;
  } else {
    style.textShadow = '2px 2px 4px rgba(0,0,0,0.8), -1px -1px 2px rgba(0,0,0,0.8)';
  }

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

  // Line height
  if (labelStyle.lineHeight || label.lineHeight) {
    style.lineHeight = labelStyle.lineHeight || label.lineHeight;
  }

  // Opacity
  if (label.opacity !== undefined) {
    style.opacity = label.opacity;
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
    <div v-if="!wrapperConfig.needsWrapper" :class="containerStyle">
      <MediaZone
        v-for="zone in zones"
        :key="zone.id"
        :zone-id="zone.id"
        :zone-config="zone"
        :assignment="getAssignmentForZone(zone.id)"
      />
    </div>

    <!-- Layout Container - Complex Layouts (with wrapper) -->
    <div v-else :class="wrapperConfig.mainContainer">
      <template v-if="layoutType === 'main-left'">
        <MediaZone :zone-id="zones[0].id" :zone-config="zones[0]" :assignment="getAssignmentForZone(zones[0].id)" />
        <div :class="wrapperConfig.secondaryContainer">
          <MediaZone :zone-id="zones[1].id" :zone-config="zones[1]" :assignment="getAssignmentForZone(zones[1].id)" />
          <MediaZone :zone-id="zones[2].id" :zone-config="zones[2]" :assignment="getAssignmentForZone(zones[2].id)" />
        </div>
      </template>

      <template v-else-if="layoutType === 'main-right'">
        <div :class="wrapperConfig.secondaryContainer">
          <MediaZone :zone-id="zones[0].id" :zone-config="zones[0]" :assignment="getAssignmentForZone(zones[0].id)" />
          <MediaZone :zone-id="zones[1].id" :zone-config="zones[1]" :assignment="getAssignmentForZone(zones[1].id)" />
        </div>
        <MediaZone :zone-id="zones[2].id" :zone-config="zones[2]" :assignment="getAssignmentForZone(zones[2].id)" />
      </template>

      <template v-else-if="layoutType === 'main-top'">
        <MediaZone :zone-id="zones[0].id" :zone-config="zones[0]" :assignment="getAssignmentForZone(zones[0].id)" />
        <div :class="wrapperConfig.secondaryContainer">
          <MediaZone :zone-id="zones[1].id" :zone-config="zones[1]" :assignment="getAssignmentForZone(zones[1].id)" />
          <MediaZone :zone-id="zones[2].id" :zone-config="zones[2]" :assignment="getAssignmentForZone(zones[2].id)" />
        </div>
      </template>

      <template v-else-if="layoutType === 'main-bottom'">
        <div :class="wrapperConfig.secondaryContainer">
          <MediaZone :zone-id="zones[0].id" :zone-config="zones[0]" :assignment="getAssignmentForZone(zones[0].id)" />
          <MediaZone :zone-id="zones[1].id" :zone-config="zones[1]" :assignment="getAssignmentForZone(zones[1].id)" />
        </div>
        <MediaZone :zone-id="zones[2].id" :zone-config="zones[2]" :assignment="getAssignmentForZone(zones[2].id)" />
      </template>

      <template v-else-if="layoutType === 'two-top-one-bottom'">
        <div :class="wrapperConfig.secondaryContainer">
          <MediaZone :zone-id="zones[0].id" :zone-config="zones[0]" :assignment="getAssignmentForZone(zones[0].id)" />
          <MediaZone :zone-id="zones[1].id" :zone-config="zones[1]" :assignment="getAssignmentForZone(zones[1].id)" />
        </div>
        <MediaZone :zone-id="zones[2].id" :zone-config="zones[2]" :assignment="getAssignmentForZone(zones[2].id)" />
      </template>

      <template v-else-if="layoutType === 'one-top-two-bottom'">
        <MediaZone :zone-id="zones[0].id" :zone-config="zones[0]" :assignment="getAssignmentForZone(zones[0].id)" />
        <div :class="wrapperConfig.secondaryContainer">
          <MediaZone :zone-id="zones[1].id" :zone-config="zones[1]" :assignment="getAssignmentForZone(zones[1].id)" />
          <MediaZone :zone-id="zones[2].id" :zone-config="zones[2]" :assignment="getAssignmentForZone(zones[2].id)" />
        </div>
      </template>

      <template v-else-if="layoutType === 'two-left-one-right'">
        <div :class="wrapperConfig.secondaryContainer">
          <MediaZone :zone-id="zones[0].id" :zone-config="zones[0]" :assignment="getAssignmentForZone(zones[0].id)" />
          <MediaZone :zone-id="zones[1].id" :zone-config="zones[1]" :assignment="getAssignmentForZone(zones[1].id)" />
        </div>
        <MediaZone :zone-id="zones[2].id" :zone-config="zones[2]" :assignment="getAssignmentForZone(zones[2].id)" />
      </template>

      <template v-else-if="layoutType === 'one-left-two-right'">
        <MediaZone :zone-id="zones[0].id" :zone-config="zones[0]" :assignment="getAssignmentForZone(zones[0].id)" />
        <div :class="wrapperConfig.secondaryContainer">
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
        <span
          class="label-text"
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
}

.layout-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.background-shape {
  pointer-events: none;
}

/* NUEVO: Estilos para la estructura de dos contenedores (como Angular) */
.label-container {
  position: absolute;
  pointer-events: none;
  user-select: none;
}

.label-inner {
  position: relative;
}

.label-text {
  display: inline-block;
  white-space: nowrap; /* No permitir saltos de línea automáticos */
  overflow: visible; /* Permitir que el texto sea visible completo */
  line-height: 1;
  vertical-align: top;
}
</style>