import { PlotSettingsStore, Worker } from '@/types/Store';
import { generateName } from './names';

export function newWorker(): Worker {
  return {
    poolPublicKey: '',
    farmerPublicKey: '',
    cpuThreads: 4,
    tempDir: '',
    tempDir2: '',
    finalDir: '',
    name: generateName(),
    buckets: 256,
    parallelJobs: 1,
    oldPlotsDir: '',
    isDisabled: false,
  };
}

export const defaultState: PlotSettingsStore = {
  madmaxBinPath: '',
  stopAfterQueue: false,
  workers: [newWorker()],
};
