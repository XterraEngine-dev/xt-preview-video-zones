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

  // Log each assignment detail
  assignments.value.forEach(assignment => {
    console.log(`Assignment for ${assignment.zoneId}:`, {
      mediaCount: assignment.media?.length || 0,
      media: assignment.media
    });
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
  return {
    position: 'absolute',
    left: `${label.x}%`,
    top: `${label.y}%`,
    fontSize: label.fontSize,
    fontWeight: label.fontWeight,
    color: label.color,
    transform: `rotate(${label.rotation}deg) scale(${label.scale})`,
    zIndex: label.zIndex,
    whiteSpace: 'nowrap'
  };
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
    >
      {{ label.text }}
    </div>
  </div>
</template>

<style scoped>
.layout-renderer {
  background-color: #000;
}

.layout-container {
  position: relative;
}

.background-shape {
  pointer-events: none;
}

.label-overlay {
  pointer-events: none;
}
</style>