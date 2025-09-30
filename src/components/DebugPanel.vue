<script setup>
import { computed } from 'vue';

const props = defineProps({
  campaign: {
    type: Object,
    default: null
  },
  layouts: {
    type: Array,
    default: () => []
  },
  currentLayout: {
    type: Object,
    default: null
  },
  currentIndex: {
    type: Number,
    default: 0
  }
});

const hasData = computed(() => !!props.campaign);
const layoutsCount = computed(() => props.layouts?.length || 0);
const currentMetadata = computed(() => props.currentLayout?.metadata || null);
const assignmentsCount = computed(() => currentMetadata.value?.assignments?.length || 0);
</script>

<template>
  <div class="debug-panel fixed top-0 left-0 w-full bg-blue-900 bg-opacity-90 text-white text-xs p-4 z-50">
    <div class="max-w-7xl mx-auto">
      <h3 class="font-bold mb-2 text-sm">Debug Panel</h3>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <p><strong>Campaign:</strong> {{ hasData ? campaign.name || campaign.id : 'Not loaded' }}</p>
          <p><strong>Layouts:</strong> {{ layoutsCount }}</p>
          <p><strong>Current Layout:</strong> {{ currentIndex + 1 }} / {{ layoutsCount }}</p>
        </div>

        <div v-if="currentLayout">
          <p><strong>Layout Name:</strong> {{ currentLayout.name }}</p>
          <p><strong>Layout Type:</strong> {{ currentMetadata?.layout || 'N/A' }}</p>
          <p><strong>Assignments:</strong> {{ assignmentsCount }}</p>
        </div>
      </div>

      <div v-if="currentMetadata?.assignments" class="mt-2">
        <strong>Zone Assignments:</strong>
        <div class="grid grid-cols-3 gap-2 mt-1">
          <div v-for="assignment in currentMetadata.assignments" :key="assignment.zoneId" class="bg-black bg-opacity-50 p-2 rounded">
            <p><strong>{{ assignment.zoneId }}</strong></p>
            <p>Media items: {{ assignment.media?.length || 0 }}</p>
            <div v-if="assignment.media && assignment.media.length > 0" class="text-xs mt-1">
              <p v-for="(media, idx) in assignment.media" :key="idx">
                {{ idx + 1 }}. {{ media.type }} ({{ media.duration }}s)
                <br>
                <span class="text-green-400" v-if="media.url">✓ Has URL</span>
                <span class="text-red-400" v-else>✗ No URL</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div v-if="!hasData" class="mt-2 text-yellow-300">
        ⚠️ No campaign data loaded
      </div>
    </div>
  </div>
</template>

<style scoped>
.debug-panel {
  font-family: monospace;
}
</style>