<template>
  <div class="flex flex-col">
    <header class="bg-gray-600 py-4 text-center">
      <h1>Ocruzv's Plot Manager</h1>
    </header>
    <main class="flex flex-col px-8 py-12 justify-center items-center">
      <div class="w-full bg-gray-500 rounded my-8">
        <table class="w-full text-center">
          <thead>
            <tr>
              <th>PID</th>
              <th>Start</th>
              <th>Elapsed Time</th>
              <th>Phase</th>
              <!-- <th>Progress</th> -->
              <th>Temp Size</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>123</td>
              <td>10/10/2021 10:21:45</td>
              <td>01:02:03</td>
              <td>1</td>
              <td>200 GiB</td>
            </tr>
            <tr>
              <td>123</td>
              <td>10/10/2021 10:21:45</td>
              <td>01:02:03</td>
              <td>1</td>
              <td>200 GiB</td>
            </tr>
            <tr>
              <td>123</td>
              <td>10/10/2021 10:21:45</td>
              <td>01:02:03</td>
              <td>1</td>
              <td>200 GiB</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="flex flex-row space-x-4">
        <Button @click="addPlot">Create another plot in parallel</Button>
        <Button color="red">Cancel plotting</Button>
      </div>
    </main>
    <footer class="flex space-x-4 bg-gray-600 items-center justify-center py-4">
      <router-link to="/settings">Settings</router-link>
      <span> | </span>
      <router-link to="/about">About</router-link>
    </footer>
  </div>
</template>

<script lang="ts">
  import { defineComponent, unref } from 'vue';
  import { useLocalStorage } from '@vueuse/core';

  import Button from '@/components/Button.vue';
  import { createPlot } from '@/helpers/common';
  import { PlotSettingsStore } from '@/types/Store';

  export default defineComponent({
    name: 'Index',
    components: {
      Button,
    },
    setup() {
      const state = useLocalStorage<PlotSettingsStore>('state', {
        poolPublicKey: '',
        farmerPublicKey: '',
        cpuThreads: 4,
        tempDir: '',
        finalDir: '',
        madmaxBinPath: '',
      });

      function addPlot() {
        createPlot(unref(state));
      }

      return {
        addPlot,
      };
    },
  });
</script>
