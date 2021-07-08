# Chia Plot Manager (GUI)
This is a Multiplatform (Windows, Linux, MacOS) [Chia](https://www.chia.net/) Plot Manager with GUI, compatible with the [Madmax Chia Plotter](https://github.com/madMAx43v3r/chia-plotter) and the Chia Pool Protocol. Inspired in [Swar's Chia Plot Manager](https://github.com/swar/Swar-Chia-Plot-Manager)

🚀 Why not use this?

![Chia Plot Manager Screenshot 1](https://user-images.githubusercontent.com/3529184/124416370-78c60c00-dd1c-11eb-9308-2e1c850a4e3e.png)

![Chia Plot Manager Screenshot 2](https://user-images.githubusercontent.com/3529184/124389208-c5bdca00-dcab-11eb-8982-bfff8c0d60e3.png)

## Downloads

- Windows [EXE](https://github.com/ocruzv/chia-plot-manager/releases/latest/download/Ocruzv-Chia-Plot-Manager.exe)
- Linux [DEB](https://github.com/ocruzv/chia-plot-manager/releases/latest/download/Ocruzv-Chia-Plot-Manager.deb) | [AppImage](https://github.com/ocruzv/chia-plot-manager/releases/latest/download/Ocruzv-Chia-Plot-Manager.AppImage)
- MacOS [DMG](https://github.com/ocruzv/chia-plot-manager/releases/latest/download/Ocruzv-Chia-Plot-Manager.dmg)

## Features

- Support for parallel plotting
- Support for multiple workers with independent configuration, so you can plot with different drives and different configuration on each of them
- It works with Madmax Plotter! Much faster than the official plotter
- It will start a new plot immediatelly after a plot is finished, so it's unattended plotting
- It does support the new pool protocol (Portable Plots)! (If you're using the latest madMax version!!!)
- Replot old (static) plots. The plot manager will remove old plots gradually and automagically when you create portable (plot protocol) plots, this way you'll not worry on deleting them manually and maximize possible gains.

## How to use

- Install [Madmax Chia Plotter](https://github.com/madMAx43v3r/chia-plotter)
- Download and install my Chia Plot Manager
- Run it, configure the path to the Madmax Chia Plotter and your workers
- Start plotting!

## How Replot works

If your pool key starts with xch, that means you're pointing to a NFT address, so, you are creating portable plots with that worker.

If that's the case, you'll be able to (optionally) choose a directory that should contain old (static) plots, and the plotter will handle that case to remove gradually your old plots to replace them with the new plot format.

The remotion will occur in phase 4, so you'll maximize your chances to win with that plot until the last minutes.

** You need to choose a _different_ directory for your new portable plots **

![Replot Diagram](https://user-images.githubusercontent.com/3529184/124793064-3e728f80-df13-11eb-87c2-4c1a6d9739a2.png)

## Donations

Chia, of course: `xch187wm2nt4y7upp2jtr9zcprevcrw7cnnh5wllug8rfh9ge8h3mx2qshc9xx`

BTC: `15VJPYrZWPQXZvdWzpc8vKYV42QmzS6x6G`

ETH: `0xEb223E52E91BCA097E3D62834F487131858A5c93`

DOGE: `DCaAXbnnvSCeu2uTTTq2vdXtwcBwtiT5Q4`
## Roadmap

- Support for official plotter
- Configurable delay to start parallel plotting
- Space Left/Space used indicator
- Suggest more! Open an issue here in Github :)

## Development

- npm i

- npm run dev