import { unref } from 'vue';
import { useMainStore } from '@/stores/main';
import { Worker } from '@/types/Store';

import useConfig from '@/use/useConfig';
import { hasEnoughSpaceInDisk, hasOldPlotsInDir } from '@/helpers/common';

const electron = require('electron');
const ipc = electron.ipcRenderer;

export default function usePlots() {
  const store = useMainStore();
  const { madmaxBinPath } = useConfig();

  function getWorkerJobs(worker: string) {
    return Object.values(store.plots).filter((plot) => plot.worker === worker);
  }

  async function canCreatePlot(worker: Worker): Promise<boolean> {
    const enoughSpace = await hasEnoughSpaceInDisk(worker.finalDir, 100);

    if (!enoughSpace && !worker.oldPlotsDir) {
      throw new Error(`Final directory hasn't enough free space in disk`);
    }

    if (worker.oldPlotsDir && !worker.poolPublicKey.startsWith('xch')) {
      throw new Error('Your worker is not pointing to an nft address');
    }

    if (
      !enoughSpace &&
      worker.oldPlotsDir &&
      !(await hasOldPlotsInDir(worker.oldPlotsDir))
    ) {
      throw new Error(
        `There aren't old plots in the selected directory, and hasn't enough free space in disk`
      );
    }

    return true;
  }

  async function createPlot(workerData: Worker): Promise<void> {
    try {
      if (
        (await canCreatePlot(workerData)) &&
        !store.stopAfterQueue &&
        (workerData.parallelJobs || 1) > getWorkerJobs(workerData.name).length
      ) {
        ipc.send(
          'create-plot',
          JSON.stringify(workerData),
          unref(madmaxBinPath)
        );
      }
    } catch (err) {
      window.alert(err.message);
    }
  }

  function stopPlot(pid: string): void {
    ipc.send('stop-plot', pid);
  }

  return { getWorkerJobs, createPlot, stopPlot };
}
