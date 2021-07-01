export interface Plot {
  pid: string | number;
  startTime: Date;
  name?: string;
  tempDir?: string;
  finalDir?: string;
  phase: number;
  consoleHistory: string[];
}
