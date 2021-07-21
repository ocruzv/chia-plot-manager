import { defineStore } from 'pinia';
import { Plot } from '@/types/Plot';

export const useMainStore = defineStore({
  id: 'main',
  state: () => ({
    plots: {} as { [key: string]: Plot },
    stopAfterQueue: false,
  }),
  actions: {
    addPlot(pid: string, plot: Plot) {
      this.plots[pid] = plot;
    },
    updatePlot(pid: string, plot: Partial<Plot>) {
      this.plots[pid] = { ...this.plots[pid], ...plot };
    },
    addHistoryToPlot(pid: string, consoleLine: string) {
      if (this.plots[pid]) {
        this.plots[pid].consoleHistory.push(consoleLine);
      }
    },
    removePlot(pid: string) {
      delete this.plots[pid];
    },
    toggleStopAfterQueue() {
      this.stopAfterQueue = !this.stopAfterQueue;
    },
  },
});
