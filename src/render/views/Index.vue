<template>
  <main class="index-main">
    <div class="w-full bg-gray-500 rounded my-8">
      <a-row v-if="formattedPlots.length" type="flex" justify="center">
        <a-col :span="22">
          <a-table
            :data-source="formattedPlots"
            :columns="columns"
            :pagination="false"
            row-key="pid"
          >
            <template #progress="{ record }">
              <a-progress
                type="circle"
                :percent="getPlotProgress(record)"
                :width="40"
              />
            </template>
            <template #actions="{ record }">
              <a-popconfirm
                title="Are you sure?"
                @confirm="stopPlot(record.pid)"
              >
                <a-button size="small">Stop this task</a-button>
              </a-popconfirm>
            </template>
            <template #expandedRowRender="{ record }">
              <Console
                v-if="record.consoleHistory.length"
                class="console"
                :log-history="record.consoleHistory"
              />
            </template>
          </a-table>
        </a-col>
      </a-row>
    </div>

    <div class="buttons">
      <a-space direction="vertical">
        <a-checkbox
          v-if="plots.length"
          :checked="stopAfterQueue"
          @change="toggleStopAfterQueue"
        >
          Stop plotting after the current queue
        </a-checkbox>
        <a-button
          v-if="!plots.length && state.workers.length"
          type="primary"
          size="large"
          class="big-circle-button"
          @click="startPlotting"
        >
          <PlayCircleOutlined class="play-icon" />
          Start plotting
        </a-button>
        <a-button v-if="!state.workers.length" @click="goToSettings">
          Configure your workers
        </a-button>
        <a-button v-if="plots.length" danger block @click="stopPlotting">
          Stop plotting
        </a-button>
      </a-space>
    </div>
  </main>
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
    onActivated,
  } from 'vue';
  import { PlayCircleOutlined } from '@ant-design/icons-vue';
  import { useRouter } from 'vue-router';
  import { useLocalStorage } from '@vueuse/core';
  import format from 'date-fns/format';
  import formatDistanceToNow from 'date-fns/formatDistanceToNow';

  import Console from '@/components/Console.vue';

  import { defaultState } from '@/helpers/state';
  import { PlotSettingsStore } from '@/types/Store';
  import { Plot } from '@/types/Plot';

  import { useMainStore } from '@/stores/main';

  import usePlots from '@/use/usePlots';

  export default defineComponent({
    name: 'Index',
    components: {
      Console,
      PlayCircleOutlined,
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

        const progressCount = ~~(
          (plot.consoleHistory.length / completedPlotLogsCount) *
          100
        );

        return progressCount <= 100 ? progressCount : 100;
      }

      const selectedPlotHistory: ComputedRef<string[]> = computed(() => {
        if (!selectedPid.value || !store.plots[selectedPid.value]) return [];

        return store.plots[selectedPid.value].consoleHistory;
      });

      function validateConfig() {
        if (
          !state.value.madmaxBinPath ||
          !state.value.workers?.length ||
          !state.value.workers[0].poolPublicKey ||
          !state.value.workers[0].finalDir
        ) {
          window.alert('Please configure first your workers');

          goToSettings();
        }
      }

      onMounted(validateConfig);

      onActivated(validateConfig);

      const phaseDictionarie = {
        0: 'Starting...',
        1: '1/4',
        2: '2/4',
        3: '3/4',
        4: '4/4',
        5: 'Copying to final path...',
      };

      const plots = computed(() => Object.values(store.plots));

      const formattedPlots = computed(() => {
        return plots.value.map((plot) => ({
          ...plot,
          start: format(new Date(plot.startTime), 'Pp'),
          elapsedTime: formatDistanceToNow(new Date(plot.startTime)),
          currentPhase: phaseDictionarie[plot.phase],
        }));
      });

      return {
        startPlotting,
        stopPlotting,
        plots,
        formattedPlots,
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
        stopPlot,
        columns: [
          {
            title: 'Worker',
            dataIndex: 'worker',
            key: 'worker',
          },
          {
            title: 'PID',
            dataIndex: 'pid',
            key: 'pid',
          },
          {
            title: 'Start',
            dataIndex: 'start',
            key: 'start',
          },
          {
            title: 'Elapsed Time',
            dataIndex: 'elapsedTime',
            key: 'elapsedTime',
          },
          {
            title: 'Current Phase',
            dataIndex: 'currentPhase',
            key: 'currentPhase',
          },
          {
            title: 'Progress',
            key: 'progress',
            slots: { customRender: 'progress' },
          },
          {
            title: 'Actions',
            key: 'actions',
            slots: { customRender: 'actions' },
          },
        ],
      };
    },
  });
</script>

<style scoped>
  .index-main {
    min-height: 100%;
  }

  .big-circle-button {
    height: 132px;
    width: 132px;
    border-radius: 999px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-weight: lighter;
    text-transform: uppercase;
    font-size: 0.8rem;
  }

  .play-icon {
    font-size: 3rem;
  }

  .buttons {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
    margin: 36px 0;
  }

  .console {
    max-width: 90%;
  }
</style>
