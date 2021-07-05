import { unref } from 'vue';
import { useMainStore } from '@/stores/main';
import { Worker } from '@/types/Store';

import useConfig from '@/use/useConfig';

const electron = require('electron');
const ipc = electron.ipcRenderer;

export default function usePlots() {
  const store = useMainStore();
  const { madmaxBinPath } = useConfig();

  function getWorkerJobs(worker: string) {
    return Object.values(store.plots).filter((plot) => plot.worker === worker);
  }

  function createPlot(workerData: Worker): void {
    if (
      !store.stopAfterQueue &&
      (workerData.parallelJobs || 1) > getWorkerJobs(workerData.name).length
    ) {
      ipc.send('create-plot', JSON.stringify(workerData), unref(madmaxBinPath));
    }
  }

  function stopPlot(pid: string): void {
    ipc.send('stop-plot', pid);
  }

  return { getWorkerJobs, createPlot, stopPlot };
}
