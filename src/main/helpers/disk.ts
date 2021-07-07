import { readdir, rm } from 'fs';
const diskspace = require('diskspace');

export function diskStats(
  drive: string
): Promise<{ total: number; used: number; free: number; status: string }> {
  return new Promise((resolve, reject) => {
    diskspace.check(drive, function (err, result) {
      if (err) {
        reject(err);
      }

      resolve(result);
    });
  });
}

export function hasEnoughSpaceMain(
  drive: string,
  GiBNeeded: number
): Promise<boolean> {
  const spaceNeeded = GiBNeeded * 10000000;
  return new Promise((resolve, reject) => {
    diskspace.check(drive, function (err, result) {
      if (err) {
        reject(err);
      }

      if (result.free > spaceNeeded) {
        resolve(true);
      }

      resolve(false);
    });
  });
}

export function findPlotFileInDirMain(
  directory: string
): Promise<string | undefined> {
  return new Promise((resolve, reject) => {
    readdir(directory, { withFileTypes: true }, (err, files) => {
      if (err) reject(err);

      return resolve(files.find((file) => file.name.includes('.plot'))?.name);
    });
  });
}

export async function hasOldPlotsInDirMain(
  directory: string
): Promise<boolean> {
  const file = await findPlotFileInDirMain(directory);

  return Boolean(file);
}

export function removePlotInDirMain(directory: string): Promise<void> {
  return new Promise((resolve, reject) => {
    findPlotFileInDirMain(directory).then((file) => {
      rm(`${directory}/${file}`, { force: true }, (err) => {
        if (err) reject(err);

        resolve();
      });
    });
  });
}
