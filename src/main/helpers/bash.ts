import { spawn } from 'child_process';
import { BrowserWindow } from 'electron';

import { Worker } from '@/types/Store';
import { Plot } from '@/types/Plot';

import {
  hasEnoughSpaceMain,
  hasOldPlotsInDirMain,
  removePlotInDirMain,
} from './disk';

export function generatePlot(
  plotArgs: Worker,
  madmaxBinPath: string,
  win: BrowserWindow
): void {
  const plot = spawn(madmaxBinPath, [
    '-r',
    String(plotArgs.cpuThreads),
    '-t',
    `${plotArgs.tempDir}/`,
    '-2',
    `${plotArgs.tempDir2 ? plotArgs.tempDir2 : plotArgs.tempDir}/`,
    '-d',
    `${plotArgs.finalDir}/`,
    `${plotArgs.poolPublicKey.startsWith('xch') ? '-c' : '-p'}`,
    plotArgs.poolPublicKey,
    '-f',
    plotArgs.farmerPublicKey,
    '-u',
    String(plotArgs.buckets),
    '-v',
    `${
      plotArgs.buckets3 ? String(plotArgs.buckets3) : String(plotArgs.buckets)
    }`,
    '-K',
    `${plotArgs.rmulti2 ? String(plotArgs.rmulti2) : '1'}`,
  ]);

  plot.on('error', (error) => {
    console.error(error);
  });

  plot.stdout.on('data', async (data) => {
    const dataString = data.toString();
    if (dataString.includes('Multi-threaded pipelined Chia k32 plotter')) {
      const plotData: Plot = {
        pid: plot.pid || -1,
        worker: plotArgs.name,
        startTime: new Date(),
        tempDir: plotArgs.tempDir,
        finalDir: plotArgs.finalDir,
        phase: 0,
        consoleHistory: [],
      };
      win.webContents.send('new-plot', plot.pid, plotData);
    }

    win.webContents.send('console-message', plot.pid, dataString);

    if (dataString.includes('[P1]')) {
      win.webContents.send('set-phase', plot.pid, 1);
      win.webContents.send('plot-finished', plot.pid);
    }
    if (dataString.includes('[P2]')) {
      win.webContents.send('set-phase', plot.pid, 2);
    }
    if (dataString.includes('[P3')) {
      win.webContents.send('set-phase', plot.pid, 3);
    }
    if (dataString.includes('[P4]')) {
      win.webContents.send('set-phase', plot.pid, 4);
    }
    if (
      dataString.includes('[P4] Starting') &&
      plotArgs.poolPublicKey.startsWith('xch') &&
      plotArgs.oldPlotsDir
    ) {
      const hasEnoughSpace = await hasEnoughSpaceMain(plotArgs.finalDir, 100);
      const hasOldPlotsInDir = await hasOldPlotsInDirMain(plotArgs.oldPlotsDir);

      if (!hasEnoughSpace && plotArgs.oldPlotsDir && hasOldPlotsInDir) {
        await removePlotInDirMain(plotArgs.oldPlotsDir);
      }
    }
    if (dataString.includes('copy to')) {
      win.webContents.send('set-phase', plot.pid, 5);
    }

    if (dataString.includes('finished, took')) {
      win.webContents.send('plot-finished', plot.pid);
    }
  });

  plot.on('exit', (code) => {
    console.log('exited with code', code);
    win.webContents.send('plot-exit', plot.pid);
  });
}
