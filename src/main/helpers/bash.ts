import { spawn } from 'child_process';
import { BrowserWindow, ipcMain } from 'electron';

import { PlotSettingsStore } from '@/types/Store';

export function generatePlot(
  plotArgs: PlotSettingsStore,
  win: BrowserWindow
): void {
  const plot = spawn('./create-plot.sh', {
    env: {
      FARMER_KEY: plotArgs.farmerPublicKey,
      POOL_KEY: plotArgs.poolPublicKey,
      CPU_THREADS: String(plotArgs.cpuThreads),
      OUTPUT_DIR: plotArgs.finalDir,
      TEMP_DIR: plotArgs.tempDir,
      MADMAX_PATH: plotArgs.madmaxBinPath,
    },
  });

  plot.on('error', (error) => {
    console.error(error);
  });

  plot.stdout.on('data', (data) => {
    console.log(data.toString());
    win.webContents.send('new-plot', data.toString());
  });

  plot.on('exit', (code) => {
    console.log('exited with code', code);
  });
}
