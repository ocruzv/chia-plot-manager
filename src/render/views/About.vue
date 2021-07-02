<template>
  <div class="flex flex-col">
    <header class="bg-gray-600 py-4 text-center">
      <h1>About</h1>
    </header>
    <main class="flex flex-col px-8 py-12 space-y-4">
      <router-link to="/">Go back</router-link>

      <p>Version 0.1</p>
      <p>Developed by Omar Cruz (ocruzv)</p>

      <p>
        <a
          href="#"
          @click="
            openLinkInBrowser('https://github.com/ocruzv/chia-plot-manager')
          "
          >Github</a
        >
        |
        <a
          href="#"
          @click="
            openLinkInBrowser(
              'https://github.com/ocruzv/chia-plot-manager#donations'
            )
          "
          >Donations</a
        >
      </p>
    </main>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  import { openLinkInBrowser } from '@/helpers/common';

  export default defineComponent({
    name: 'About',
    setup() {
      openLinkInBrowser;
    },
  });
</script>
