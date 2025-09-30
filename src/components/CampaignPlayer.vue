<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { getCampaignById, getLayoutsByIds, getFilesByIds, authenticatePocketBase, getMediaUrl } from '../services/pocketbase.js';
import LayoutRenderer from './LayoutRenderer.vue';
import DebugPanel from './DebugPanel.vue';

const props = defineProps({
  campaignId: {
    type: String,
    required: true
  },
  autoplay: {
    type: Boolean,
    default: true
  }
});

const campaign = ref(null);
const layouts = ref([]);
const currentLayoutIndex = ref(0);
const isLoading = ref(true);
const error = ref(null);

const currentLayout = computed(() => {
  if (!layouts.value || layouts.value.length === 0) return null;
  return layouts.value[currentLayoutIndex.value];
});

async function loadCampaign() {
  try {
    isLoading.value = true;
    error.value = null;

    // Authenticate first
    await authenticatePocketBase();

    // Load campaign
    const campaignData = await getCampaignById(props.campaignId);
    campaign.value = campaignData;

    console.log('Campaign loaded:', campaignData);

    // Load all layouts for this campaign
    if (campaignData.layouts && campaignData.layouts.length > 0) {
      const layoutsData = await getLayoutsByIds(campaignData.layouts);

      console.log('Layouts loaded:', layoutsData);

      // Sort layouts by the order in campaign.layouts array
      const sortedLayouts = campaignData.layouts
        .map(layoutId => layoutsData.find(l => l.id === layoutId))
        .filter(Boolean);

      // Process each layout to load media files from files_library
      for (const layout of sortedLayouts) {
        // Parse metadata if it's a string
        if (typeof layout.metadata === 'string') {
          console.log('Metadata is string, parsing for layout:', layout.name);
          layout.metadata = JSON.parse(layout.metadata);
        }

        console.log('Processing layout:', layout.name);
        console.log('Metadata:', layout.metadata);

        if (layout.metadata && layout.metadata.assignments) {
          // Collect all file IDs from assignments
          const fileIds = [];
          layout.metadata.assignments.forEach(assignment => {
            console.log('Processing assignment:', assignment);
            if (assignment.media && Array.isArray(assignment.media)) {
              assignment.media.forEach(mediaItem => {
                if (mediaItem.id) {
                  fileIds.push(mediaItem.id);
                }
              });
            }
          });

          console.log('File IDs to fetch:', fileIds);

          // Fetch all files from files_library
          if (fileIds.length > 0) {
            const filesData = await getFilesByIds(fileIds);
            console.log('Files loaded for layout:', layout.name, filesData);

            // Map files to assignments and add URLs
            layout.metadata.assignments.forEach(assignment => {
              if (assignment.media && Array.isArray(assignment.media)) {
                assignment.media = assignment.media.map(mediaItem => {
                  const fileRecord = filesData.find(f => f.id === mediaItem.id);
                  if (fileRecord) {
                    const url = getMediaUrl(fileRecord);
                    console.log('✓ Generated URL for media:', mediaItem.id, '→', url);
                    return {
                      id: mediaItem.id,
                      url: url,
                      type: mediaItem.type || 'video',
                      duration: mediaItem.duration || 10, // Default 10 seconds if not specified
                      order: mediaItem.order || 0,
                      fileRecord
                    };
                  }
                  console.warn('✗ No file record found for media ID:', mediaItem.id);
                  return {
                    ...mediaItem,
                    duration: mediaItem.duration || 10
                  };
                });

                console.log(`Assignment ${assignment.zoneId} final media:`, assignment.media);
              }
            });
          } else {
            console.warn('No file IDs found in assignments for layout:', layout.name);
          }
        } else {
          console.warn('No assignments found in metadata for layout:', layout.name);
        }
      }

      layouts.value = sortedLayouts;
      console.log('All layouts processed with media:', layouts.value);
    }

    isLoading.value = false;
  } catch (err) {
    console.error('Error loading campaign:', err);
    error.value = err.message;
    isLoading.value = false;
  }
}

function nextLayout() {
  if (!layouts.value || layouts.value.length === 0) return;
  currentLayoutIndex.value = (currentLayoutIndex.value + 1) % layouts.value.length;
}

function previousLayout() {
  if (!layouts.value || layouts.value.length === 0) return;
  currentLayoutIndex.value = (currentLayoutIndex.value - 1 + layouts.value.length) % layouts.value.length;
}

// Calculate layout duration based on media items
function getLayoutDuration(layout) {
  if (!layout || !layout.metadata || !layout.metadata.assignments) {
    return 10000; // Default 10 seconds
  }

  // Find the longest media sequence in any zone
  let maxDuration = 0;

  layout.metadata.assignments.forEach(assignment => {
    if (assignment.media && assignment.media.length > 0) {
      const zoneDuration = assignment.media.reduce((sum, media) => sum + media.duration, 0);
      if (zoneDuration > maxDuration) {
        maxDuration = zoneDuration;
      }
    }
  });

  return maxDuration > 0 ? maxDuration * 1000 : 10000; // Convert to milliseconds
}

// Auto-advance to next layout based on duration
let layoutTimer = null;

function startLayoutTimer() {
  if (!props.autoplay || !currentLayout.value) return;

  clearLayoutTimer();

  const duration = getLayoutDuration(currentLayout.value);
  layoutTimer = setTimeout(() => {
    nextLayout();
  }, duration);
}

function clearLayoutTimer() {
  if (layoutTimer) {
    clearTimeout(layoutTimer);
    layoutTimer = null;
  }
}

watch(currentLayout, () => {
  if (props.autoplay) {
    startLayoutTimer();
  }
});

onMounted(() => {
  loadCampaign();
});

onUnmounted(() => {
  clearLayoutTimer();
});

// Expose methods for external control
defineExpose({
  nextLayout,
  previousLayout,
  reload: loadCampaign
});
</script>

<template>
  <div class="campaign-player w-full h-full relative">
    <!-- Loading State -->
    <div v-if="isLoading" class="w-full h-full flex items-center justify-center bg-black text-white">
      <div class="text-center">
        <div class="text-2xl mb-4">Loading Campaign...</div>
        <div class="animate-pulse">⏳</div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="w-full h-full flex items-center justify-center bg-black text-red-500">
      <div class="text-center">
        <div class="text-2xl mb-4">Error Loading Campaign</div>
        <div class="text-sm">{{ error }}</div>
        <button
          @click="loadCampaign"
          class="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    </div>

    <!-- Campaign Content -->
    <div v-else-if="currentLayout" class="w-full h-full">
      <LayoutRenderer :layout="currentLayout" />
    </div>

    <!-- No Layouts -->
    <div v-else class="w-full h-full flex items-center justify-center bg-black text-white">
      <div class="text-center">
        <div class="text-2xl">No Layouts in Campaign</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.campaign-player {
  background-color: #000;
}
</style>