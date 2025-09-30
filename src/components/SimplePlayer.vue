<script setup>
import { ref, onMounted } from 'vue';
import { authenticatePocketBase, getCampaignById, getLayoutsByIds, getFilesByIds, getMediaUrl } from '../services/pocketbase.js';

const videoUrls = ref([]);
const error = ref(null);

onMounted(async () => {
  try {
    await authenticatePocketBase();

    const campaign = await getCampaignById('bzihhcwb7vo1omm');
    console.log('Campaign:', campaign);

    const layouts = await getLayoutsByIds(campaign.layouts);
    console.log('Layouts:', layouts);

    const firstLayout = layouts[0];
    console.log('First Layout Full Object:', JSON.stringify(firstLayout, null, 2));
    console.log('First Layout Metadata:', firstLayout.metadata);

    if (typeof firstLayout.metadata === 'string') {
      console.log('Metadata is STRING, parsing...');
      firstLayout.metadata = JSON.parse(firstLayout.metadata);
      console.log('Parsed Metadata:', firstLayout.metadata);
    }

    if (firstLayout.metadata?.assignments) {
      console.log('Assignments found:', firstLayout.metadata.assignments);

      // Collect all file IDs
      const allFileIds = [];
      firstLayout.metadata.assignments.forEach(assignment => {
        console.log('Processing assignment:', assignment);
        if (assignment.media && Array.isArray(assignment.media)) {
          assignment.media.forEach(mediaItem => {
            console.log('Media item:', mediaItem);
            if (mediaItem.id) {
              allFileIds.push(mediaItem.id);
            }
          });
        }
      });

      console.log('File IDs to fetch:', allFileIds);

      if (allFileIds.length > 0) {
        const files = await getFilesByIds(allFileIds);
        console.log('Files fetched:', files);

        const urls = files.map(file => ({
          id: file.id,
          url: getMediaUrl(file),
          type: file.type,
          file: file
        }));

        console.log('Generated URLs:', urls);
        videoUrls.value = urls;
      }
    } else {
      console.error('No assignments found in metadata!');
      console.log('Metadata keys:', Object.keys(firstLayout.metadata || {}));
    }
  } catch (err) {
    console.error('Error:', err);
    error.value = err.message;
  }
});
</script>

<template>
  <div class="p-4 bg-gray-900 text-white min-h-screen">
    <h1 class="text-2xl mb-4">Simple Video Test</h1>

    <div v-if="error" class="bg-red-600 p-4 rounded mb-4">
      Error: {{ error }}
    </div>

    <div v-if="videoUrls.length > 0" class="space-y-4">
      <div v-for="(item, idx) in videoUrls" :key="item.id" class="border border-white p-4">
        <h3 class="text-lg mb-2">Video {{ idx + 1 }}</h3>
        <p class="text-sm mb-2 break-all">{{ item.url }}</p>

        <video
          :src="item.url"
          class="w-full max-w-2xl bg-black"
          muted
          autoplay
          playsinline
          loop
          @loadstart="() => console.log('Video loadstart:', item.id)"
          @loadeddata="() => console.log('Video loadeddata:', item.id)"
          @canplay="() => console.log('Video canplay:', item.id)"
          @playing="() => console.log('Video playing:', item.id)"
          @error="(e) => console.error('Video error:', item.id, e)"
        ></video>
      </div>
    </div>

    <div v-else class="text-yellow-400">
      No videos loaded. Check console for details.
    </div>
  </div>
</template>