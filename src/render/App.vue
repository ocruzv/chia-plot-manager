<template>
  <div class="main">
    <router-view />
  </div>
</template>

<script lang="ts">
  import { defineComponent, onMounted } from 'vue';
  import { useRouter } from 'vue-router';

  const electron = require('electron');
  const ipc = electron.ipcRenderer;

  import { useMainStore } from '@/stores/main';

  export default defineComponent({
    name: 'App',
    setup() {
      const router = useRouter();
      const store = useMainStore();

      onMounted(() => {
        ipc.on('new-plot', (_, pid, plotData) => {
          store.addPlot(pid, plotData);
        });
        ipc.on('set-phase', (_, pid, phase) => {
          store.updatePlot(pid, { phase });
        });
        ipc.on('console-message', (_, pid, data) => {
          store.addHistoryToPlot(pid, data);
        });
        ipc.on('plot-finished', (_, pid) => {
          store.removePlot(pid);
        });
      });

      router.push('/');
    },
  });
</script>

<style scoped>
  .main {
    @apply h-full w-full bg-gray-800 text-white;

    min-height: 100vh;
  }
</style>
