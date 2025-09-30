<script setup>
import { ref, onMounted } from 'vue';
import { authenticatePocketBase, getCampaignById, getLayoutsByIds, getFilesByIds, pb } from '../services/pocketbase.js';

const debug = ref({});

onMounted(async () => {
  try {
    await authenticatePocketBase();

    const campaign = await getCampaignById('3hqlyzsbul0fqmq');
    debug.value.campaign = campaign;
    console.log('1. Campaign:', campaign);

    const layouts = await getLayoutsByIds(campaign.layouts);
    debug.value.layouts = layouts;
    console.log('2. Layouts:', layouts);

    const firstLayout = layouts[0];

    // Parse metadata if string
    let metadata = firstLayout.metadata;
    if (typeof metadata === 'string') {
      metadata = JSON.parse(metadata);
      console.log('3. Metadata was string, parsed:', metadata);
    } else {
      console.log('3. Metadata is object:', metadata);
    }

    debug.value.metadata = metadata;

    if (metadata?.assignments && metadata.assignments.length > 0) {
      const firstAssignment = metadata.assignments[0];
      console.log('4. First assignment:', firstAssignment);
      debug.value.firstAssignment = firstAssignment;

      if (firstAssignment.media && firstAssignment.media.length > 0) {
        const firstMedia = firstAssignment.media[0];
        console.log('5. First media item:', firstMedia);
        debug.value.firstMedia = firstMedia;

        // Fetch the file
        const fileId = firstMedia.id;
        console.log('6. Fetching file with ID:', fileId);

        const files = await getFilesByIds([fileId]);
        console.log('7. Files fetched:', files);
        debug.value.files = files;

        if (files && files.length > 0) {
          const file = files[0];
          console.log('8. File record:', file);
          console.log('   - File object keys:', Object.keys(file));
          console.log('   - File.file:', file.file);
          console.log('   - File.type:', file.type);

          // Try different ways to get URL
          const url1 = pb.files.getUrl(file, file.file);
          console.log('9a. URL using pb.files.getUrl(file, file.file):', url1);

          // Try getting first file field
          const fileFields = Object.keys(file).filter(k =>
            typeof file[k] === 'string' &&
            (file[k].includes('.mp4') || file[k].includes('.jpg') || file[k].includes('.png') || file[k].includes('.webm'))
          );
          console.log('9b. File fields found:', fileFields);

          if (fileFields.length > 0) {
            const url2 = pb.files.getUrl(file, file[fileFields[0]]);
            console.log('9c. URL using first file field:', url2);
            debug.value.testUrl = url2;
          } else {
            debug.value.testUrl = url1;
          }
        }
      }
    }
  } catch (err) {
    console.error('Debug error:', err);
    debug.value.error = err.message;
  }
});
</script>

<template>
  <div class="p-8 bg-gray-900 text-white min-h-screen">
    <h1 class="text-3xl mb-6">Quick Debug</h1>

    <div class="space-y-4">
      <div v-if="debug.error" class="bg-red-600 p-4 rounded">
        Error: {{ debug.error }}
      </div>

      <div class="bg-gray-800 p-4 rounded">
        <h2 class="text-xl mb-2">Campaign ID:</h2>
        <p>{{ debug.campaign?.id }}</p>
      </div>

      <div class="bg-gray-800 p-4 rounded">
        <h2 class="text-xl mb-2">Metadata Type:</h2>
        <p>{{ typeof debug.metadata }}</p>
      </div>

      <div class="bg-gray-800 p-4 rounded">
        <h2 class="text-xl mb-2">First Assignment:</h2>
        <pre class="text-xs overflow-auto">{{ JSON.stringify(debug.firstAssignment, null, 2) }}</pre>
      </div>

      <div class="bg-gray-800 p-4 rounded">
        <h2 class="text-xl mb-2">First Media:</h2>
        <pre class="text-xs overflow-auto">{{ JSON.stringify(debug.firstMedia, null, 2) }}</pre>
      </div>

      <div class="bg-gray-800 p-4 rounded">
        <h2 class="text-xl mb-2">File Record:</h2>
        <pre class="text-xs overflow-auto">{{ JSON.stringify(debug.files?.[0], null, 2) }}</pre>
      </div>

      <div v-if="debug.testUrl" class="bg-green-800 p-4 rounded">
        <h2 class="text-xl mb-2">Generated URL:</h2>
        <p class="text-sm mb-4 break-all">{{ debug.testUrl }}</p>

        <h3 class="text-lg mb-2">Test Video:</h3>
        <video
          :src="debug.testUrl"
          class="w-full max-w-4xl bg-black border-4 border-green-500"
          controls
          autoplay
          muted
        ></video>
      </div>
    </div>
  </div>
</template>