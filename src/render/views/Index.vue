<template>
  <div class="flex flex-col">
    <header class="bg-gray-600 py-4 text-center">
      <h1>Ocruzv's Plot Manager</h1>
    </header>
    <main class="flex flex-col px-8 py-12 justify-center items-center">
      <div class="w-full bg-gray-500 rounded my-8">
        <table v-if="plots.length" class="w-full text-center">
          <thead>
            <tr>
              <th>PID</th>
              <th>Start</th>
              <th>Elapsed Time</th>
              <th>Phase</th>
              <!-- <th>Progress</th> -->
              <!-- <th>Temp Size</th> -->
            </tr>
          </thead>
          <tbody>
            <tr v-for="plot in plots" :key="plot.pid">
              <td>{{ plot.pid }}</td>
              <td>{{ format(new Date(plot.startTime), 'Pp') }}</td>
              <td>{{ formatDistanceToNow(new Date(plot.startTime)) }}</td>
              <td>{{ plot.phase }}/4</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="flex flex-row space-x-4">
        <Button @click="addPlot">
          <template v-if="plots.length">
            Create another plot in parallel
          </template>
          <template v-else> Start plotting </template>
        </Button>
        <Button v-if="plots.length" color="red" @click="stopPlotting"
          >Stop plotting</Button
        >
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
  import { defineComponent, unref, computed } from 'vue';
  import { useLocalStorage } from '@vueuse/core';
  import format from 'date-fns/format';
  import formatDistanceToNow from 'date-fns/formatDistanceToNow';

  import Button from '@/components/Button.vue';
  import { createPlot, stopPlot } from '@/helpers/common';
  import { PlotSettingsStore } from '@/types/Store';

  import { useMainStore } from '@/stores/main';

  export default defineComponent({
    name: 'Index',
    components: {
      Button,
    },
    setup() {
      const store = useMainStore();

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

      function stopPlotting() {
        Object.keys(store.plots).forEach((plotPid) => {
          stopPlot(plotPid);
        });
      }

      return {
        addPlot,
        stopPlotting,
        plots: computed(() => Object.values(store.plots)),
        format,
        formatDistanceToNow,
      };
    },
  });
</script>
