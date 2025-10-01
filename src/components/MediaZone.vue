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

// Doble buffer: dos elementos video que alternamos
const video1Ref = ref(null);
const video2Ref = ref(null);
const activeVideoIndex = ref(1); // 1 = video1, 2 = video2
const currentIndex = ref(0);
let imageTimeout = null;

const currentMedia = computed(() => {
  if (!props.assignment?.media?.length) {
    return null;
  }
  return props.assignment.media[currentIndex.value];
});

const nextMedia = computed(() => {
  if (!props.assignment?.media?.length || props.assignment.media.length <= 1) {
    return null;
  }
  const nextIndex = (currentIndex.value + 1) % props.assignment.media.length;
  return props.assignment.media[nextIndex];
});

const mediaUrl = computed(() => {
  return currentMedia.value?.url || null;
});

const mediaType = computed(() => {
  return currentMedia.value?.type || 'video';
});

// Determinar si el video actual debe hacer loop
const shouldLoop = computed(() => {
  return props.assignment?.media?.length === 1;
});

// Referencias a los videos activo y oculto
const activeVideo = computed(() => {
  return activeVideoIndex.value === 1 ? video1Ref.value : video2Ref.value;
});

const hiddenVideo = computed(() => {
  return activeVideoIndex.value === 1 ? video2Ref.value : video1Ref.value;
});

function playNext() {
  if (!props.assignment?.media?.length) return;

  if (props.assignment.media.length > 1) {
    currentIndex.value = (currentIndex.value + 1) % props.assignment.media.length;
  }
}

async function handleVideoEnd() {
  if (props.assignment?.media?.length > 1) {
    // Precargar el siguiente video en el buffer oculto
    const nextMediaItem = props.assignment.media[(currentIndex.value + 1) % props.assignment.media.length];

    if (nextMediaItem && nextMediaItem.type === 'video' && hiddenVideo.value) {
      // Configurar el video oculto con el siguiente video
      hiddenVideo.value.src = nextMediaItem.url;
      hiddenVideo.value.load();

      // Esperar a que esté listo
      await new Promise((resolve) => {
        const onCanPlay = () => {
          hiddenVideo.value.removeEventListener('canplay', onCanPlay);
          resolve();
        };
        hiddenVideo.value.addEventListener('canplay', onCanPlay);

        // Timeout de seguridad
        setTimeout(resolve, 100);
      });

      // Reproducir el video oculto
      hiddenVideo.value.play().catch(err => {
        console.error(`Zone ${props.zoneId}: Play error on hidden video`, err);
      });

      // Cambiar el índice activo (swap de buffers)
      activeVideoIndex.value = activeVideoIndex.value === 1 ? 2 : 1;
    }

    // Avanzar el índice
    playNext();
  }
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

// Precargar el siguiente video en el buffer oculto
function handleVideoTimeUpdate(event) {
  if (!nextMedia.value || nextMedia.value.type !== 'video') return;
  if (props.assignment?.media?.length <= 1) return; // No precargar si solo hay un video (loop)

  const video = event.target;
  const currentTime = video.currentTime;
  const duration = video.duration;

  // Precargar cuando falten 1.5 segundos
  if (duration - currentTime <= 1.5 && duration - currentTime > 1.4) {
    if (hiddenVideo.value && (!hiddenVideo.value.src || !hiddenVideo.value.src.includes(nextMedia.value.url))) {
      hiddenVideo.value.src = nextMedia.value.url;
      hiddenVideo.value.load();
    }
  }
}

// Watch para inicializar el primer video
watch(currentMedia, async (newMedia, oldMedia) => {
  if (!newMedia) return;

  clearImageTimeout();

  if (newMedia.type === 'video') {
    // Si es el primer video o cambió de imagen a video, configurar el video activo
    if (!oldMedia || oldMedia.type !== 'video' || !oldMedia.url) {
      await nextTick();
      if (activeVideo.value) {
        activeVideo.value.src = newMedia.url;
        activeVideo.value.load();
        activeVideo.value.play().catch(err => {
          console.error(`Zone ${props.zoneId}: Play error`, err);
        });
      }
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
    <!-- Video Buffer 1 -->
    <video
      v-if="mediaType === 'video'"
      ref="video1Ref"
      class="video-buffer"
      :class="{ active: activeVideoIndex === 1 }"
      @ended="handleVideoEnd"
      @error="handleVideoError"
      @timeupdate="handleVideoTimeUpdate"
      muted
      playsinline
      :loop="shouldLoop"
      preload="auto"
      disablePictureInPicture
      controlsList="nodownload nofullscreen noremoteplayback"
      x-webkit-airplay="deny"
    ></video>

    <!-- Video Buffer 2 -->
    <video
      v-if="mediaType === 'video'"
      ref="video2Ref"
      class="video-buffer"
      :class="{ active: activeVideoIndex === 2 }"
      @ended="handleVideoEnd"
      @error="handleVideoError"
      @timeupdate="handleVideoTimeUpdate"
      muted
      playsinline
      :loop="shouldLoop"
      preload="auto"
      disablePictureInPicture
      controlsList="nodownload nofullscreen noremoteplayback"
      x-webkit-airplay="deny"
    ></video>

    <!-- Image -->
    <img
      v-else-if="mediaType === 'image' && mediaUrl"
      :src="mediaUrl"
      :key="mediaUrl"
      style="width: 100%; height: 100%; object-fit: fill;"
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

/* Estilo para los buffers de video */
.video-buffer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: fill;
  background: #000;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.05s linear;
}

.video-buffer.active {
  opacity: 1;
  z-index: 1;
}

/* Ocultar todos los controles nativos del video */
video::-webkit-media-controls {
  display: none !important;
}

video::-webkit-media-controls-enclosure {
  display: none !important;
}

video::-webkit-media-controls-panel {
  display: none !important;
}

video::-webkit-media-controls-play-button {
  display: none !important;
}

video::-webkit-media-controls-start-playback-button {
  display: none !important;
}

video::-webkit-media-controls-overlay-play-button {
  display: none !important;
}

/* Asegurar fondo negro durante carga */
video {
  background-color: #000 !important;
}
</style>