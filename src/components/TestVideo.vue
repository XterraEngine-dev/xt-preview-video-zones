<script setup>
import { ref, onMounted } from 'vue';
import { authenticatePocketBase, getCampaignById, getLayoutsByIds, getFilesByIds, getMediaUrl } from '../services/pocketbase.js';

const testData = ref(null);
const error = ref(null);
const videoUrl = ref(null);

onMounted(async () => {
  try {
    await authenticatePocketBase();

    const campaign = await getCampaignById('bzihhcwb7vo1omm');
    console.log('Campaign:', campaign);

    const layouts = await getLayoutsByIds(campaign.layouts);
    console.log('Layouts:', layouts);

    const firstLayout = layouts[0];
    console.log('First layout:', firstLayout);
    console.log('Metadata:', firstLayout.metadata);

    if (firstLayout.metadata?.assignments) {
      const firstAssignment = firstLayout.metadata.assignments[0];
      console.log('First assignment:', firstAssignment);

      if (firstAssignment?.media && firstAssignment.media.length > 0) {
        const firstMedia = firstAssignment.media[0];
        console.log('First media:', firstMedia);

        const file = await getFilesByIds([firstMedia.id]);
        console.log('File from library:', file);

        if (file && file.length > 0) {
          const url = getMediaUrl(file[0]);
          console.log('Generated URL:', url);
          videoUrl.value = url;
        }
      }
    }

    testData.value = {
      campaign,
      layouts,
      firstLayout
    };
  } catch (err) {
    console.error('Test error:', err);
    error.value = err.message;
  }
});
</script>

<template>
  <div class="p-4 bg-gray-900 text-white min-h-screen">
    <h1 class="text-2xl mb-4">Video Test</h1>

    <div v-if="error" class="bg-red-600 p-4 rounded mb-4">
      Error: {{ error }}
    </div>

    <div v-if="testData" class="mb-4">
      <h2 class="text-xl mb-2">Data Loaded:</h2>
      <pre class="bg-black p-4 rounded text-xs overflow-auto max-h-96">{{ JSON.stringify(testData, null, 2) }}</pre>
    </div>

    <div v-if="videoUrl" class="mb-4">
      <h2 class="text-xl mb-2">Video URL:</h2>
      <p class="bg-black p-2 rounded text-sm mb-4">{{ videoUrl }}</p>

      <h2 class="text-xl mb-2">Video Player:</h2>
      <video
        :src="videoUrl"
        controls
        autoplay
        muted
        class="w-full max-w-2xl border-4 border-green-500"
        @loadstart="console.log('Video: loadstart')"
        @loadedmetadata="console.log('Video: loadedmetadata')"
        @canplay="console.log('Video: canplay')"
        @play="console.log('Video: play')"
        @error="(e) => console.error('Video error:', e)"
      ></video>
    </div>

    <div v-else class="text-yellow-400">
      Loading or no video URL...
    </div>
  </div>
</template>