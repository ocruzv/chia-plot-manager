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
        console.log('mounted');
        ipc.on('new-plot', (_, args) => {
          console.log(args);
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
