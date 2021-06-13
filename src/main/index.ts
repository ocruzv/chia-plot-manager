/**
 * electron 主文件
 */
import { join } from 'path';
import { app, BrowserWindow, ipcMain } from 'electron';
import is_dev from 'electron-is-dev';
import dotenv from 'dotenv';
import Store from 'electron-store';

const store = new Store();
ipcMain.on('store:set', async (e, args) => {
  store.set(args.key, args.value);
});
ipcMain.handle('store:get', async (e, args) => {
  const value = await store.get(args);
  return value;
});
ipcMain.on('store:delete', async (e, args) => {
  store.delete(args);
});

dotenv.config({ path: join(__dirname, '../../.env') });

let win = null;

class createWin {
  constructor() {
    win = new BrowserWindow({
      width: 330,
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
