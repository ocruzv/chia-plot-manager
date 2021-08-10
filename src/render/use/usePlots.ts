import { unref } from 'vue';
import { useIpcRenderer } from '@vueuse/electron';
import { useMainStore } from '@/stores/main';
import { Worker } from '@/types/Store';

import useConfig from '@/use/useConfig';
import { hasEnoughSpaceInDisk, hasOldPlotsInDir } from '@/helpers/common';

export default function usePlots() {
  const ipcRenderer = useIpcRenderer();
  const store = useMainStore();
  const { madmaxBinPath } = useConfig();

  function getWorkerJobs(worker: string) {
    return Object.values(store.plots).filter((plot) => plot.worker === worker);
  }

  async function canCreatePlot(worker: Worker): Promise<boolean> {
    const enoughSpace = worker.finalDir.some(
      async (finalDir) => await hasEnoughSpaceInDisk(finalDir, 100)
    );

    if (!enoughSpace && !worker.oldPlotsDir) {
      throw new Error(
        'None of the final directories has enough free space in disk'
      );
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
    if (store.stopAfterQueue || workerData.isDisabled) return;

    try {
      if (
        (await canCreatePlot(workerData)) &&
        (workerData.parallelJobs || 1) > getWorkerJobs(workerData.name).length
      ) {
        ipcRenderer.send(
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
    ipcRenderer.send('stop-plot', pid);
  }

  return { getWorkerJobs, createPlot, stopPlot };
}
