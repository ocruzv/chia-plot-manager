import { computed } from 'vue';
import { useLocalStorage } from '@vueuse/core';

import { PlotSettingsStore } from '@/types/Store';
import { defaultState } from '@/helpers/state';

export default function useConfig() {
  const state = useLocalStorage<PlotSettingsStore>('state', defaultState);

  function getWorkerConfig(workerName: string) {
    if (!state.value.workers?.length) return null;

    return state.value.workers.find((worker) => worker.name === workerName);
  }

  const madmaxBinPath = computed(() => state.value.madmaxBinPath);

  return {
    getWorkerConfig,
    madmaxBinPath,
  };
}
