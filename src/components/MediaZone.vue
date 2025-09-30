<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';

const props = defineProps({
  zoneId: {
    type: String,
    required: true
  },
  assignment: {
    type: Object,
    default: null
  },
  zoneConfig: {
    type: Object,
    required: true
  }
});

const videoRef = ref(null);
const currentIndex = ref(0);
const isPlaying = ref(false);
let imageTimeout = null;

const currentMedia = computed(() => {
  if (!props.assignment?.media?.length) {
    return null;
  }
  const media = props.assignment.media[currentIndex.value];
  return media;
});

const mediaUrl = computed(() => {
  return currentMedia.value?.url || null;
});

const mediaType = computed(() => {
  return currentMedia.value?.type || 'video';
});

function playNext() {
  if (!props.assignment?.media?.length) return;
  currentIndex.value = (currentIndex.value + 1) % props.assignment.media.length;
}

function handleVideoEnd() {
  playNext();
}

function handleVideoError(event) {
  console.error(`Zone ${props.zoneId}: Video error`, event.target?.error);
}

function clearImageTimeout() {
  if (imageTimeout) {
    clearTimeout(imageTimeout);
    imageTimeout = null;
  }
}

watch(currentMedia, async (newMedia) => {
  if (!newMedia) return;

  clearImageTimeout();

  if (newMedia.type === 'video') {
    await nextTick();
    if (videoRef.value) {
      videoRef.value.play().catch(err => {
        console.error(`Zone ${props.zoneId}: Play error`, err);
      });
    }
  } else if (newMedia.type === 'image') {
    const duration = newMedia.duration || 5;
    imageTimeout = setTimeout(playNext, duration * 1000);
  }
}, { immediate: true });

onMounted(() => {
  console.log(`[${props.zoneId}] Mounted. Has media:`, !!props.assignment?.media?.length);
  if (props.assignment?.media?.length) {
    console.log(`[${props.zoneId}] First media URL:`, props.assignment.media[0]?.url);
  }
});

onUnmounted(() => {
  clearImageTimeout();
});
</script>

<template>
  <div
    class="media-zone"
    :style="zoneConfig.style"
    :data-zone-id="zoneId"
  >
    <!-- Video -->
    <video
      v-if="mediaType === 'video' && mediaUrl"
      ref="videoRef"
      :src="mediaUrl"
      :key="mediaUrl"
      style="width: 100%; height: 100%; object-fit: cover;"
      @ended="handleVideoEnd"
      @error="handleVideoError"
      muted
      autoplay
      playsinline
    ></video>

    <!-- Image -->
    <img
      v-else-if="mediaType === 'image' && mediaUrl"
      :src="mediaUrl"
      :key="mediaUrl"
      style="width: 100%; height: 100%; object-fit: cover;"
      :alt="zoneId"
    />

    <!-- Placeholder -->
    <div v-else style="width: 100%; height: 100%; background: #222;"></div>
  </div>
</template>

<style scoped>
.media-zone {
  position: relative;
  overflow: hidden;
  background: #000;
  flex-shrink: 0;
}
</style>