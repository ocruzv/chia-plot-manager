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
              <th>Worker</th>
              <th>PID</th>
              <th>Start</th>
              <th>Elapsed Time</th>
              <th>Phase</th>
              <th>Progress</th>
              <!-- <th>Temp Size</th> -->
              <th>Logs</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="plot in plots" :key="plot.pid">
              <td>
                {{ plot.worker }}
              </td>
              <td>
                {{ plot.pid }}
              </td>
              <td>{{ format(new Date(plot.startTime), 'Pp') }}</td>
              <td>{{ formatDistanceToNow(new Date(plot.startTime)) }}</td>
              <td class="flex flex-row">
                <template v-if="plot.phase < 5"> {{ plot.phase }}/4 </template>
                <template v-else-if="plot.phase === 5">
                  Copying to final path
                </template>
                <div
                  class="
                    animate-spin
                    rounded-full
                    h-4
                    w-4
                    border-b-2 border-white
                    ml-2
                  "
                ></div>
              </td>
              <td>{{ getPlotProgress(plot) }}%</td>
              <td width="16">
                <box-icon
                  name="message-square-detail"
                  color="white"
                  class="cursor-pointer"
                  @click="openConsole(plot.pid)"
                ></box-icon>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <Console
        v-if="selectedPlotHistory.length"
        class="mb-4"
        :log-history="selectedPlotHistory"
        @close="selectedPid = null"
      />

      <div class="flex flex-col space-x-4">
        <label v-if="plots.length" class="mb-4 flex items-center">
          <input
            :value="stopAfterQueue"
            type="checkbox"
            class="mr-2"
            @change="toggleStopAfterQueue"
          />
          Stop plotting after the current queue
        </label>
        <Button
          v-if="!plots.length && state.workers.length"
          @click="startPlotting"
        >
          Start plotting
        </Button>
        <Button v-if="!state.workers.length" @click="goToSettings">
          Configure your workers
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
  import {
    defineComponent,
    unref,
    computed,
    onMounted,
    ref,
    Ref,
    ComputedRef,
  } from 'vue';
  import { useRouter } from 'vue-router';
  import { useLocalStorage } from '@vueuse/core';
  import format from 'date-fns/format';
  import formatDistanceToNow from 'date-fns/formatDistanceToNow';

  import Button from '@/components/Button.vue';
  import Console from '@/components/Console.vue';

  import { defaultState } from '@/helpers/state';
  import { PlotSettingsStore } from '@/types/Store';
  import { Plot } from '@/types/Plot';

  import { useMainStore } from '@/stores/main';

  import usePlots from '@/use/usePlots';

  export default defineComponent({
    name: 'Index',
    components: {
      Button,
      Console,
    },
    setup() {
      const store = useMainStore();
      const router = useRouter();
      const { createPlot, stopPlot } = usePlots();

      const selectedPid: Ref<string | null> = ref(null);

      const state = useLocalStorage<PlotSettingsStore>('state', defaultState);

      function startPlotting() {
        selectedPid.value = null;
        unref(state).workers.forEach((worker) => {
          for (let i = 0; i < (worker.parallelJobs || 1); i += 1) {
            createPlot(worker);
          }
        });
      }

      function stopPlotting() {
        Object.keys(store.plots).forEach((plotPid) => {
          stopPlot(plotPid);
        });

        selectedPid.value = null;
      }

      function goToSettings() {
        router.push('/settings');
      }

      function openConsole(pid: string) {
        selectedPid.value = pid;
      }

      function getPlotProgress(plot: Plot) {
        if (!plot) return 0;

        const completedPlotLogsCount = 45;

        return ~~((plot.consoleHistory.length / completedPlotLogsCount) * 100);
      }

      const selectedPlotHistory: ComputedRef<string[]> = computed(() => {
        if (!selectedPid.value || !store.plots[selectedPid.value]) return [];

        return store.plots[selectedPid.value].consoleHistory;
      });

      onMounted(() => {
        if (!state.value.madmaxBinPath) {
          window.alert('Please configure first your workers');

          goToSettings();
        }
      });

      return {
        startPlotting,
        stopPlotting,
        plots: computed(() => Object.values(store.plots)),
        stopAfterQueue: computed(() => store.stopAfterQueue),
        format,
        formatDistanceToNow,
        state,
        goToSettings,
        openConsole,
        selectedPlotHistory,
        selectedPid,
        toggleStopAfterQueue: store.toggleStopAfterQueue,
        getPlotProgress,
      };
    },
  });
</script>
