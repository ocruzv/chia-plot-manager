import { defineStore } from 'pinia';
import { Plot } from '@/types/Plot';

export const useMainStore = defineStore({
  id: 'main',
  state: () => ({
    plots: [] as Plot[],
  }),
  actions: {
    resetPlots() {
      this.plots = [];
    },
    addPlot(plot: Plot) {
      this.plots.push(plot);
    },
    addHistoryToPlot(pid: string, consoleLine: string) {
      const index = this.plots.findIndex((plot) => plot.pid === pid);
      this.plots[index].consoleHistory.push(consoleLine);
    },
    removePlot(pid: string) {
      this.plots = this.plots.filter((plot) => plot.pid !== pid);
    },
  },
});
