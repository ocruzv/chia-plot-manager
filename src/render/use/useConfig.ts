import { computed, unref } from 'vue';
import { useLocalStorage } from '@vueuse/core';

import { PlotSettingsStore } from '@/types/Store';
import { defaultState } from '@/helpers/state';

export default function useConfig() {
  const state = useLocalStorage<PlotSettingsStore>('state', defaultState);

  function onOpenApp() {
    state.value.stopAfterQueue = false;

    upgradeState();
  }

  function upgradeState() {
    // Change finalDir from string to string[]
    state.value.workers = unref(state).workers.map((worker) => {
      const finalWorker = { ...worker };

      if (finalWorker.finalDir && typeof finalWorker.finalDir === 'string') {
        finalWorker.finalDir = [finalWorker.finalDir];
      }

      if (!finalWorker.finalDir?.length) finalWorker.finalDir = [''];

      return finalWorker;
    });
  }

  function getWorkerConfig(workerName: string) {
    const state = useLocalStorage<PlotSettingsStore>('state', defaultState);

    if (!state.value.workers?.length) return null;

    return state.value.workers.find((worker) => worker.name === workerName);
  }

  const madmaxBinPath = computed(() => state.value.madmaxBinPath);

  return {
    getWorkerConfig,
    madmaxBinPath,
    onOpenApp,
    state,
  };
}
