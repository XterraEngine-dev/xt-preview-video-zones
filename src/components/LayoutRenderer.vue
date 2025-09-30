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

function getLabelStyle(label) {
  console.log('Processing label style:', label);

  const style = {
    position: 'absolute',
    pointerEvents: 'none',
    userSelect: 'none',
    whiteSpace: 'nowrap',
    display: 'inline-block'
  };

  // Position - puede estar en label.position.x/y o label.x/y
  const x = label.position?.x ?? label.x;
  const y = label.position?.y ?? label.y;

  if (x !== undefined) {
    if (typeof x === 'string' && x.includes('px')) {
      style.left = x;
    } else if (typeof x === 'string' && x.includes('%')) {
      style.left = x;
    } else {
      // Es un número, lo convertimos a porcentaje
      style.left = `${x}%`;
    }
  }

  if (y !== undefined) {
    if (typeof y === 'string' && y.includes('px')) {
      style.top = y;
    } else if (typeof y === 'string' && y.includes('%')) {
      style.top = y;
    } else {
      // Es un número, lo convertimos a porcentaje
      style.top = `${y}%`;
    }
  }

  // Style object - puede estar en label.style o directamente en label
  const labelStyle = label.style || {};

  // Font size
  const fontSize = labelStyle.fontSize || label.fontSize;
  if (fontSize) {
    if (typeof fontSize === 'string') {
      style.fontSize = fontSize;
    } else {
      style.fontSize = `${fontSize}px`;
    }
  }

  // Font weight
  const fontWeight = labelStyle.fontWeight || label.fontWeight;
  if (fontWeight) {
    style.fontWeight = fontWeight;
  }

  // Font style
  const fontStyle = labelStyle.fontStyle || label.fontStyle;
  if (fontStyle) {
    style.fontStyle = fontStyle;
  }

  // Color
  const color = labelStyle.color || label.color;
  if (color) {
    style.color = color;
  }

  // Z-index
  if (label.zIndex !== undefined) {
    style.zIndex = label.zIndex;
  } else {
    style.zIndex = 100;
  }

  // Width y Height - removemos width para permitir texto horizontal completo
  // El width en labels es opcional, si no está, el texto se expande horizontalmente
  if (label.width !== undefined && label.width !== null) {
    // Solo aplicar width si está explícitamente definido y queremos limitarlo
    // En la mayoría de casos, omitiremos esto para permitir texto horizontal
    if (typeof label.width === 'string') {
      style.maxWidth = label.width;
    } else if (label.width > 0) {
      style.maxWidth = `${label.width}px`;
    }
  }

  if (label.height !== undefined) {
    if (typeof label.height === 'string') {
      style.height = label.height;
    } else {
      style.height = `${label.height}px`;
    }
  }

  // Transform
  const transforms = [];
  if (label.rotation !== undefined && label.rotation !== 0) {
    transforms.push(`rotate(${label.rotation}deg)`);
  }
  if (label.scale !== undefined && label.scale !== 1) {
    transforms.push(`scale(${label.scale})`);
  }
  if (transforms.length > 0) {
    style.transform = transforms.join(' ');
    style.transformOrigin = 'top left';
  }

  // Font family
  const fontFamily = labelStyle.fontFamily || label.fontFamily;
  if (fontFamily) {
    style.fontFamily = fontFamily;
  }

  // Text align
  const textAlign = labelStyle.textAlign || label.textAlign;
  if (textAlign) {
    style.textAlign = textAlign;
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

  // Text shadow
  const textShadow = labelStyle.textShadow || label.textShadow;
  if (textShadow) {
    style.textShadow = textShadow;
  }

  // Line height
  const lineHeight = labelStyle.lineHeight || label.lineHeight;
  if (lineHeight) {
    style.lineHeight = lineHeight;
  }

  // Opacity
  if (label.opacity !== undefined) {
    style.opacity = label.opacity;
  }

  console.log('Generated style:', style);
  return style;
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
      :style="getLabelStyle(label)"
      class="label-overlay"
      v-html="label.text"
    ></div>
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

.label-overlay {
  pointer-events: none;
  user-select: none;
}
</style>