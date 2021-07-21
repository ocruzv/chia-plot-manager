import { computed } from 'vue';
import { useLocalStorage } from '@vueuse/core';

import { PlotSettingsStore } from '@/types/Store';
import { defaultState } from '@/helpers/state';

export default function useConfig() {
  const state = useLocalStorage<PlotSettingsStore>('state', defaultState);

  function onOpenApp() {
    state.value.stopAfterQueue = false;
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
