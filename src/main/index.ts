/**
 * electron 主文件
 */
import { join } from 'path';
import { app, BrowserWindow, ipcMain, dialog, shell } from 'electron';
import is_dev from 'electron-is-dev';
import dotenv from 'dotenv';

import { generatePlot } from './helpers/bash';

dotenv.config({ path: join(__dirname, '../../.env') });

let win: BrowserWindow | null = null;
class createWin {
  constructor() {
    win = new BrowserWindow({
      width: 700,
      height: 700,
      webPreferences: {
        nodeIntegration: true,
        enableRemoteModule: true,
      },
    });

    if (!app.isPackaged || is_dev) {
      win.loadURL(`http://localhost:${process.env.PORT}`);
      win.webContents.openDevTools({ mode: 'undocked' });
    } else {
      win.loadURL(`file://${join(__dirname, '../../dist/render/index.html')}`);
    }
  }
}

app.whenReady().then(() => new createWin());

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    new createWin();
  }
});

ipcMain.handle('select-dirs', async () => {
  if (win) {
    const result = await dialog.showOpenDialog(win, {
      properties: ['openDirectory', 'createDirectory'],
    });

    return result.filePaths;
  }
});

ipcMain.handle('select-file', async () => {
  if (win) {
    const result = await dialog.showOpenDialog(win, {
      properties: ['openFile', 'dontAddToRecent'],
    });

    return result.filePaths;
  }
});

ipcMain.on('open-link', async (_, link) => {
  shell.openExternal(link);
});

ipcMain.on('create-plot', async (_, args) => {
  if (win) {
    generatePlot(JSON.parse(args), win);
  }
});

ipcMain.on('stop-plot', async (_, pid) => {
  if (win) {
    process.kill(pid);
  }
});
