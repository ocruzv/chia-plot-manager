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
  import { useIpcRendererOn } from '@vueuse/electron';
  import { useRouter } from 'vue-router';

  import { useMainStore } from '@/stores/main';
  import useConfig from '@/use/useConfig';
  import usePlots from '@/use/usePlots';

  export default defineComponent({
    name: 'App',
    setup() {
      const router = useRouter();
      const store = useMainStore();
      const { getWorkerConfig, onOpenApp } = useConfig();
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
        onOpenApp();

        useIpcRendererOn('new-plot', (_, pid, plotData) => {
          store.addPlot(pid, plotData);
        });
        useIpcRendererOn('set-phase', (_, pid, phase) => {
          store.updatePlot(pid, { phase });
        });
        useIpcRendererOn('console-message', (_, pid, data) => {
          store.addHistoryToPlot(pid, data);
        });
        useIpcRendererOn('plot-finished', (_, pid: string) => {
          const plotData = { ...store.plots[pid] };
          store.removePlot(pid);

          const workerConfig = getWorkerConfig(plotData.worker);

          if (workerConfig) {
            createPlot(workerConfig);
          }

          if (!Object.keys(store.plots).length) {
            store.stopAfterQueue = false;
          }
        });
        useIpcRendererOn('plot-exit', (_, pid) => {
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
  #app {
    min-height: 100vh;
  }

  #main {
    background-color: #f6fbfb;
    min-height: 100vh;
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
    max-width: 100vw;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .main-menu {
    line-height: 64px;
    margin-left: auto !important;
    float: right;
    background-color: #68c60e;
  }
</style>
