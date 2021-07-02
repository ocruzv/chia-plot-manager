export interface Worker {
  name: string;
  poolPublicKey: string;
  farmerPublicKey: string;
  cpuThreads: number;
  buckets: number;
  tempDir: string;
  tempDir2?: string;
  finalDir: string;
  parallelJobs?: number;
}
export interface PlotSettingsStore {
  madmaxBinPath: string;
  workers: Worker[];
}
