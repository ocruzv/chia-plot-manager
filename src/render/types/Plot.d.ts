export interface Plot {
  pid: string;
  startTime: Date;
  elapsedTime: Date;
  tempSize: Date;
  name: string;
  tempDir: string;
  finalDir: string;
  phase: number;
  consoleHistory: string[];
}
