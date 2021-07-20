<template>
  <a-layout id="main">
    <a-layout-header class="header">
      <div class="logo">
        <router-link to="/">
          <img src="@/assets/logo.svg" alt="Chia Plot Manager" />
        </router-link>
      </div>
      <a-menu
        :selected-keys="[$route.name]"
        mode="horizontal"
        class="main-menu"
        @click="navigate"
      >
        <a-menu-item key="index">Plotter</a-menu-item>
        <a-menu-item key="settings">Settings</a-menu-item>
      </a-menu>
    </a-layout-header>

    <a-layout-content class="main-body">
      <router-view />
    </a-layout-content>
  </a-layout>
</template>

<script lang="ts">
  import { defineComponent, onMounted, ref } from 'vue';
  import { useRouter } from 'vue-router';

  const electron = require('electron');
  const ipc = electron.ipcRenderer;

  import { useMainStore } from '@/stores/main';
  import useConfig from '@/use/useConfig';
  import usePlots from '@/use/usePlots';

  export default defineComponent({
    name: 'App',
    setup() {
      const router = useRouter();
      const store = useMainStore();
      const { getWorkerConfig } = useConfig();
      const { createPlot } = usePlots();

      const selectedMenuItem = ref([]);

      function navigate(data) {
        if (data.key === 'index') {
          router.push('/');
        } else {
          router.push(data.key);
        }
      }

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
        ipc.on('plot-finished', (_, pid: string) => {
          const plotData = { ...store.plots[pid] };
          store.removePlot(pid);

          const workerConfig = getWorkerConfig(plotData.worker);

          console.log('plotData', plotData);
          console.log('workerConfig', workerConfig);

          if (workerConfig) {
            createPlot(workerConfig);
          }

          if (!Object.keys(store.plots).length) {
            store.stopAfterQueue = false;
          }
        });
        ipc.on('plot-exit', (_, pid) => {
          store.removePlot(pid);

          if (!Object.keys(store.plots).length) {
            store.stopAfterQueue = false;
          }
        });
      });

      router.push('/');

      return {
        selectedMenuItem,
        navigate,
      };
    },
  });
</script>

<style>
  #main {
    background-color: #f6fbfb;
  }

  #main .ant-layout-header {
    display: flex;
    align-items: center;
    background: #68c60e;
  }

  .logo img {
    width: 200px;
    height: auto;
    margin: 0 20px;
    float: left;
  }

  .main-body {
    min-height: calc(100vh - 64px);
  }

  .main-menu {
    line-height: 64px;
    margin-left: auto !important;
    float: right;
    background-color: #68c60e;
  }
</style>
