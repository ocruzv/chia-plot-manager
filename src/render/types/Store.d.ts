export interface Worker {
  name: string;
  poolPublicKey: string;
  farmerPublicKey: string;
  cpuThreads: number;
  buckets: number;
  buckets3?: number;
  tempDir: string;
  tempDir2?: string;
  finalDir: string[];
  parallelJobs?: number;
  oldPlotsDir?: string;
  rmulti2?: number;
  isDisabled: boolean;
}
export interface PlotSettingsStore {
  madmaxBinPath: string;
  stopAfterQueue: boolean;
  workers: Worker[];
}
