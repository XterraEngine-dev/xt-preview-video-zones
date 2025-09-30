<script setup>
import { ref, onMounted } from 'vue';
import CampaignPlayer from './components/CampaignPlayer.vue';
import QuickDebug from './components/QuickDebug.vue';
import { loadGoogleFonts } from './services/fontManager.js';

// Función para obtener parámetros de la URL
function getUrlParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

// Leer campaignId desde la URL (?campaignId=xxx) o usar el valor por defecto
const campaignId = ref(getUrlParameter('campaignId') || 'bzihhcwb7vo1omm');
const autoplay = ref(true);
const debugMode = ref(false); // Set to false for production

// Cargar fuentes de Google al iniciar la app
onMounted(() => {
  loadGoogleFonts();
  console.log('Campaign ID:', campaignId.value);
});
</script>

<template>
  <div class="app-container">
    <!-- Debug Mode -->
    <QuickDebug v-if="debugMode" />

    <!-- Campaign Player - Full Screen -->
    <CampaignPlayer
      v-else-if="campaignId"
      :campaign-id="campaignId"
      :autoplay="autoplay"
    />

    <!-- Fallback when no campaign ID -->
    <div v-else class="flex items-center justify-center h-screen bg-black text-white">
      <div class="text-center">
        <h1 class="text-3xl mb-4">XT Video Preview</h1>
        <p class="text-gray-400">Please set a campaign ID in App.vue</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.app-container {
  width: 1920px;
  height: 1080px;
  overflow: hidden;
  margin: 0 auto;
  padding: 0;
  background: #000;
  position: relative;
  /* Asegurar que no haya transform scale aplicado */
  transform: none;
  zoom: 1;
}

@media (max-width: 1920px) {
  .app-container {
    /* Usar transform scale en lugar de cambiar width/height para mantener precisión */
    width: 1920px;
    height: 1080px;
    transform: scale(calc(100vw / 1920));
    transform-origin: top left;
  }
}
</style>
