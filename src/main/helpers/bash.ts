import { spawn } from 'child_process';
import { BrowserWindow } from 'electron';

import { PlotSettingsStore } from '@/types/Store';
import { Plot } from '@/types/Plot';

export function generatePlot(
  plotArgs: PlotSettingsStore,
  win: BrowserWindow
): void {
  const plot = spawn(plotArgs.madmaxBinPath, [
    '-r',
    String(plotArgs.cpuThreads),
    '-t',
    `${plotArgs.tempDir}/`,
    '-d',
    `${plotArgs.finalDir}/`,
    '-p',
    plotArgs.poolPublicKey,
    '-f',
    plotArgs.farmerPublicKey,
  ]);

  // {
  //   env: {
  //     FARMER_KEY: plotArgs.farmerPublicKey,
  //     POOL_KEY: plotArgs.poolPublicKey,
  //     CPU_THREADS: String(plotArgs.cpuThreads),
  //     OUTPUT_DIR: plotArgs.finalDir,
  //     TEMP_DIR: plotArgs.tempDir,
  //     MADMAX_PATH: plotArgs.madmaxBinPath,
  //   },
  // }

  // win.webContents.send('new-plot', plot.pid);

  plot.on('error', (error) => {
    console.error(error);
  });

  plot.stdout.on('data', (data) => {
    console.log('data', data.toString());
    const dataString = data.toString();
    if (dataString.includes('Multi-threaded pipelined Chia k32 plotter')) {
      const plotData: Plot = {
        pid: plot.pid || -1,
        startTime: new Date(),
        tempDir: plotArgs.tempDir,
        finalDir: plotArgs.finalDir,
        phase: 0,
        consoleHistory: [],
      };
      win.webContents.send('new-plot', plot.pid, plotData);
    }

    if (dataString.includes('[P1]')) {
      win.webContents.send('set-phase', plot.pid, 1);
    }
    if (dataString.includes('[P2]')) {
      win.webContents.send('set-phase', plot.pid, 2);
    }
    if (dataString.includes('[P3')) {
      win.webContents.send('set-phase', plot.pid, 3);
    }

    win.webContents.send('console-message', plot.pid, dataString);
  });

  plot.on('exit', (code) => {
    console.log('exited with code', code);
    win.webContents.send('plot-finished', plot.pid);
  });
}
