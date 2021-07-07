const electron = require('electron');

const ipc = electron.ipcRenderer;

export function openLinkInBrowser(link: string): void {
  ipc.send('open-link', link);
}

export function hasEnoughSpaceInDisk(
  drive: string,
  spaceNeeded: number
): Promise<boolean> {
  return ipc.invoke('has-enough-space', drive, spaceNeeded);
}

export function hasOldPlotsInDir(directory: string): Promise<boolean> {
  return ipc.invoke('has-old-plots-in-dir', directory);
}
