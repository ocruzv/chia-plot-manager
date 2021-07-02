export interface Plot {
  pid: string | number;
  worker: string;
  startTime: Date;
  name?: string;
  tempDir?: string;
  finalDir?: string;
  phase: number;
  consoleHistory: string[];
}
