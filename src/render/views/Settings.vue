<template>
  <div class="flex flex-col">
    <header class="bg-gray-600 py-4 text-center">
      <h1>Plotting Settings</h1>
    </header>
    <main class="flex flex-col px-8 py-12 space-y-4">
      <div class="flex space-x-4 items-center justify-start pb-4">
        <router-link to="/">Go back</router-link>
      </div>
      <Input v-model="state.poolPublicKey" label="Pool Public Key" />
      <Input v-model="state.farmerPublicKey" label="Farmer Public Key" />
      <Input
        v-model.number="state.cpuThreads"
        type="number"
        min="1"
        label="CPU Threads to use (per plot)"
      />
      <Input
        :model-value="state.tempDir"
        label="Temporary directory, needs ~220 GiB (per plot)"
        readonly
        @click="chooseDir('tempDir')"
      />
      <Input
        :model-value="state.finalDir"
        label="Final directory, needs ~100 GiB (per plot)"
        readonly
        @click="chooseDir('finalDir')"
      />
      <Input
        :model-value="state.madmaxBinPath"
        label="Madmax Plotter Path (chia_plot file)"
        readonly
        @click="chooseFile('finalDir')"
      />
      <a
        a="#"
        @click="
          openLinkInBrowser(
            'https://github.com/madMAx43v3r/chia-plotter#install'
          )
        "
        >How to install Madmax Plotter?</a
      >
    </main>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { useLocalStorage } from '@vueuse/core';
  const electron = require('electron');
  const ipc = electron.ipcRenderer;

  import { PlotSettingsStore } from '@/types/Store';

  import { openLinkInBrowser } from '@/helpers/common';

  import Input from '@/components/Input.vue';

  export default defineComponent({
    name: 'Settings',
    components: {
      Input,
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

      async function chooseDir(type: 'tempDir' | 'finalDir') {
        const dirs = await ipc.invoke('select-dirs');

        if (dirs.length) {
          state.value[type] = dirs[0];
        }
      }

      async function chooseFile() {
        const dirs = await ipc.invoke('select-file');

        if (dirs.length) {
          state.value.madmaxBinPath = dirs[0];
        }
      }

      return {
        state,
        chooseDir,
        chooseFile,
        openLinkInBrowser,
      };
    },
  });
</script>
