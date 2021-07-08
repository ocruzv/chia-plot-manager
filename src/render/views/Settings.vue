<template>
  <div class="flex flex-col">
    <header class="bg-gray-600 py-4 text-center">
      <h1>Plotting Settings</h1>
    </header>
    <main class="flex flex-col px-8 py-12 space-y-4">
      <div
        v-if="state.madmaxBinPath"
        class="flex space-x-4 items-center justify-start pb-4"
      >
        <router-link to="/">Go back</router-link>
      </div>
      <Input
        :model-value="state.madmaxBinPath"
        label="Madmax Plotter Path (chia_plot file)"
        readonly
        @click="chooseMadmaxPath"
      />

      <template v-if="state.madmaxBinPath">
        <h2>Workers</h2>
        <div
          v-for="(worker, index) in state.workers"
          :key="worker.name"
          class="ml-10 flex flex-col space-y-2"
        >
          <Input v-model="worker.name" label="Worker Name" />
          <Input
            v-model="worker.poolPublicKey"
            label="Pool Public Key or Pool Contract Address"
            @blur="handlePoolPublicKeyBlur($event, index)"
          />
          <Input v-model="worker.farmerPublicKey" label="Farmer Public Key" />
          <Input
            v-model.number="worker.cpuThreads"
            type="number"
            min="1"
            label="CPU Threads to use (per plot)"
          />
          <Input
            v-model.number="worker.buckets"
            type="number"
            min="1"
            label="Number of buckets (default = 256)"
          />
          <Input
            v-model.number="worker.parallelJobs"
            type="number"
            min="1"
            label="Plots to create in parallel by this worker"
          />
          <Input
            :model-value="worker.tempDir"
            label="Temporary directory, needs ~220 GiB (per plot)"
            readonly
            @click="chooseDir('tempDir', index)"
          />
          <Input
            :model-value="worker.tempDir2"
            label="Temporary directory 2 (Optional)"
            readonly
            @click="chooseDir('tempDir2', index)"
          />
          <Input
            :model-value="worker.finalDir"
            label="Final directory, needs ~100 GiB (per plot)"
            readonly
            @click="chooseDir('finalDir', index)"
          />

          <div v-if="worker.poolPublicKey.startsWith('xch')">
            <Input
              :model-value="worker.oldPlotsDir"
              label="If you want to replace your old (static) plots with new (portable) plots gradually, please choose your old plots path (It should be different than the final directory)"
              readonly
              @click="chooseDir('oldPlotsDir', index)"
            />
            <a
              href="#"
              @click="
                openLinkInBrowser(
                  'https://github.com/ocruzv/chia-plot-manager#how-replot-works'
                )
              "
              >Read more</a
            >
          </div>

          <Button color="red" class="mt-4" @click="removeWorker(index)"
            >Remove Worker</Button
          >

          <hr class="mt-4" />
        </div>

        <Button @click="addWorker"> Add Worker </Button>

        <a
          href="#"
          @click="
            openLinkInBrowser(
              'https://github.com/madMAx43v3r/chia-plotter#install'
            )
          "
          >How to install Madmax Plotter?</a
        >
      </template>
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
  import { defaultState, newWorker } from '@/helpers/state';

  import Input from '@/components/Input.vue';
  import Button from '@/components/Button.vue';

  export default defineComponent({
    name: 'Settings',
    components: {
      Input,
      Button,
    },
    setup() {
      const state = useLocalStorage<PlotSettingsStore>('state', defaultState);

      function addWorker() {
        state.value.workers.push(newWorker());
      }

      function removeWorker(index: number) {
        state.value.workers.splice(index, 1);
      }

      async function chooseDir(
        type: 'tempDir' | 'finalDir' | 'tempDir2' | 'oldPlotsDir',
        workerIndex = 0
      ) {
        const dirs = await ipc.invoke('select-dirs');

        if (dirs.length) {
          if (
            type === 'oldPlotsDir' &&
            dirs[0] === state.value.workers[workerIndex].finalDir
          )
            return;
          state.value.workers[workerIndex][type] = dirs[0];
        }
      }

      async function chooseMadmaxPath() {
        const dirs = await ipc.invoke('select-file');

        if (dirs.length) {
          state.value.madmaxBinPath = dirs[0];
        }
      }

      function handlePoolPublicKeyBlur(_: FocusEvent, index: number) {
        if (!state.value.workers[index].poolPublicKey.startsWith('xch')) {
          state.value.workers[index].oldPlotsDir = '';
        }
      }

      return {
        state,
        addWorker,
        removeWorker,
        chooseDir,
        chooseMadmaxPath,
        openLinkInBrowser,
        handlePoolPublicKeyBlur,
      };
    },
  });
</script>
