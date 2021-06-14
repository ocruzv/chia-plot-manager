import { PlotSettingsStore } from '@/types/Store';

const electron = require('electron');
const ipc = electron.ipcRenderer;

export function openLinkInBrowser(link: string): void {
  ipc.send('open-link', link);
}

export function createPlot(args: PlotSettingsStore): void {
  console.log(args);
  ipc.send('create-plot', JSON.stringify(args));
}
