import { Worker } from '@/types/Store';

const electron = require('electron');
const ipc = electron.ipcRenderer;

export function openLinkInBrowser(link: string): void {
  ipc.send('open-link', link);
}
