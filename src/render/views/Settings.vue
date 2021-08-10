<template>
  <div class="settings-page">
    <a-page-header
      title="Settings"
      sub-title="Configure your plotter"
      @back="$router.push('/')"
    />
    <a-divider />
    <a-row type="flex" justify="center" class="content">
      <a-col span="22">
        <a-form layout="vertical">
          <a-form-item label="Madmax Plotter Path">
            <template #help>
              <div>
                Please choose the path to your chia_plot executable

                <a-divider type="vertical" />

                <a-button
                  type="link"
                  @click="
                    openLinkInBrowser(
                      'https://github.com/madMAx43v3r/chia-plotter#install'
                    )
                  "
                  >How to install Madmax Plotter?
                </a-button>
              </div>
            </template>
            <a-input
              :value="state.madmaxBinPath"
              placeholder="C:\madmax_path\build\chia_plot.exe"
              readonly
              @click="chooseMadmaxPath"
            >
              <template #suffix>
                <a-button
                  v-if="!state.madmaxBinPath"
                  type="primary"
                  size="small"
                  @click="chooseMadmaxPath"
                >
                  Browse
                </a-button>
                <a-button
                  v-else
                  type="primary"
                  size="small"
                  danger
                  @click="state.madmaxBinPath = ''"
                >
                  Remove
                </a-button>
              </template>
            </a-input>
          </a-form-item>

          <template v-if="state.madmaxBinPath">
            <a-divider orientation="left"> Workers </a-divider>

            <a-space direction="vertical" class="worker-card">
              <a-card
                v-for="(worker, index) in state.workers"
                :key="index"
                class="worker-card"
              >
                <template #title>
                  <div>
                    <a-typography-title
                      v-model:content="worker.name"
                      :level="4"
                      class="worker-title"
                      editable
                    />
                  </div>
                </template>
                <template #extra>
                  <a-space>
                    <a-switch
                      :checked="!worker.isDisabled"
                      checked-children="Enabled"
                      un-checked-children="Disabled"
                      @change="worker.isDisabled = !worker.isDisabled"
                    />
                    <a-popconfirm
                      title="Sure to delete?"
                      @confirm="removeWorker(index)"
                    >
                      <a-button size="small" danger>Delete Worker</a-button>
                    </a-popconfirm>
                  </a-space>
                </template>

                <a-form-item
                  label="Pool Public Key or Pool Contract Address"
                  extra="Pool Key if you want to solo-farm or your NFT Contract Address (starting with xch)"
                >
                  <a-input
                    v-model:value="worker.poolPublicKey"
                    placeholder="xch185x8f7x8erd7xd4yhyfts4w28xazr96rv7arm2f4028klvdknsmss0ez7q"
                    @blur="handlePoolPublicKeyBlur($event, index)"
                  />
                </a-form-item>

                <a-form-item label="Farmer Public Key">
                  <a-input
                    v-model:value="worker.farmerPublicKey"
                    placeholder="8d3f03cee98d3748b333a7320fa0b4af0e14eaa09f45b4f622ad73d7b3a41eeba93f3c1f2c331df3bb1a9c552d157c57"
                  />
                </a-form-item>

                <a-form-item
                  label="Temporary directory"
                  extra="Needs ~220 GiB. Your temporary plot files will be written here. A fast NVMe is recommended"
                >
                  <a-input
                    :value="worker.tempDir"
                    placeholder="D:\temp_plots"
                    readonly
                    @click="chooseDir('tempDir', index)"
                  >
                    <template #suffix>
                      <a-button
                        v-if="!worker.tempDir"
                        type="primary"
                        size="small"
                        @click="chooseDir('tempDir', index)"
                      >
                        Browse
                      </a-button>
                      <a-button
                        v-else
                        type="primary"
                        size="small"
                        danger
                        @click="worker.tempDir = ''"
                      >
                        Remove
                      </a-button>
                    </template>
                  </a-input>
                </a-form-item>

                <a-form-item
                  label="Final directories"
                  extra="Needs ~100 GiB. It can be a traditional HDD. You can define multiple final directories if you want to fill all of them"
                >
                  <a-space
                    direction="vertical"
                    :style="{
                      width: '100%',
                    }"
                  >
                    <a-input
                      v-for="(finalDir, dirIndex) in worker.finalDir"
                      :key="dirIndex"
                      :value="finalDir"
                      placeholder="E:\portable_plots"
                      readonly
                      @click="chooseDir('finalDir', index, dirIndex)"
                    >
                      <template #suffix>
                        <a-button
                          v-if="
                            !worker.finalDir?.length ||
                            worker.finalDir[dirIndex] === ''
                          "
                          type="primary"
                          size="small"
                          @click="chooseDir('finalDir', index, dirIndex)"
                        >
                          Browse
                        </a-button>
                        <template v-else>
                          <a-space>
                            <a-button
                              type="primary"
                              size="small"
                              danger
                              @click="
                                dirIndex === 0
                                  ? (worker.finalDir[0] = '')
                                  : worker.finalDir.splice(dirIndex, 1)
                              "
                            >
                              Remove
                            </a-button>

                            <a-button
                              v-if="dirIndex === worker.finalDir.length - 1"
                              type="primary"
                              size="small"
                              @click="worker.finalDir.push('')"
                            >
                              Add one more
                            </a-button>
                          </a-space>
                        </template>
                      </template>
                    </a-input>
                  </a-space>
                </a-form-item>

                <a-divider dashed>
                  <a-button
                    type="link"
                    @click="showAdvancedSettings = !showAdvancedSettings"
                  >
                    <template v-if="showAdvancedSettings === false">
                      <PlusSquareOutlined /> Show advanced settings
                    </template>
                    <template v-else>
                      <MinusSquareOutlined /> Hide advanced settings
                    </template>
                  </a-button>
                </a-divider>

                <template v-if="showAdvancedSettings">
                  <a-form-item label="CPU Threads per plot" extra="Default: 4">
                    <a-input-number
                      v-model:value="worker.cpuThreads"
                      :min="1"
                      placeholder="4"
                    />
                  </a-form-item>
                  <a-form-item label="Thread multiplier for Phase 2">
                    <template #extra>
                      <b>(Optional)</b> If you set CPU Threads to 16 and
                      multiplier to 2, then during Phase 2 32 threads will be
                      running, default: 1
                    </template>
                    <a-input-number
                      v-model:value="worker.rmulti2"
                      :min="1"
                      placeholder="1"
                    />
                  </a-form-item>
                  <a-form-item label="Buckets per plot" extra="Default: 256">
                    <a-input-number
                      v-model:value="worker.buckets"
                      :min="1"
                      placeholder="256"
                    />
                  </a-form-item>
                  <a-form-item label="Number of buckets for phase 3+4">
                    <template #extra>
                      <b>(Optional)</b> Default: same as buckets per plot
                    </template>
                    <a-input-number
                      v-model:value="worker.buckets3"
                      :min="1"
                      placeholder="256"
                    />
                  </a-form-item>
                  <a-form-item
                    label="Parallel jobs"
                    extra="Plots to create in parallel by this worker, default: 1"
                  >
                    <a-input-number
                      v-model:value="worker.parallelJobs"
                      :min="1"
                      placeholder="1"
                    />
                  </a-form-item>

                  <a-form-item label="Temporary directory 2">
                    <template #extra>
                      <b>(Optional)</b> Default: Same path as Temporary
                      Directory
                    </template>
                    <a-input
                      :value="worker.tempDir2"
                      placeholder="D:\temp_plots"
                      readonly
                      @click="chooseDir('tempDir2', index)"
                    >
                      <template #suffix>
                        <a-button
                          v-if="!worker.tempDir2"
                          type="primary"
                          size="small"
                          @click="chooseDir('tempDir2', index)"
                        >
                          Browse
                        </a-button>
                        <a-button
                          v-else
                          type="primary"
                          size="small"
                          danger
                          @click="worker.tempDir2 = ''"
                        >
                          Remove
                        </a-button>
                      </template>
                    </a-input>
                  </a-form-item>

                  <a-form-item label="Old Plots Directory">
                    <template #extra>
                      <div>
                        <b>(Optional)</b> If you want to replace your old
                        (static) plots with new (portable) plots gradually,
                        please choose your old plots path (It should be
                        different than the final directory)

                        <a-divider type="vertical" />

                        <a-button
                          type="link"
                          @click="
                            openLinkInBrowser(
                              'https://github.com/ocruzv/chia-plot-manager#how-replot-works'
                            )
                          "
                        >
                          Read More
                        </a-button>
                      </div>
                    </template>
                    <a-input
                      :value="worker.oldPlotsDir"
                      placeholder="E:\plots"
                      readonly
                      @click="chooseDir('oldPlotsDir', index)"
                    >
                      <template #suffix>
                        <a-button
                          v-if="!worker.oldPlotsDir"
                          type="primary"
                          size="small"
                          @click="chooseDir('oldPlotsDir', index)"
                        >
                          Browse
                        </a-button>
                        <a-button
                          v-else
                          type="primary"
                          size="small"
                          danger
                          @click="worker.oldPlotsDir = ''"
                        >
                          Remove
                        </a-button>
                      </template>
                    </a-input>
                  </a-form-item>
                </template>
              </a-card>
            </a-space>
          </template>

          <a-form-item :style="{ 'margin-top': '24px' }">
            <a-button type="primary" block @click="addWorker"
              ><template #icon><PlusOutlined /></template> Add a new
              Worker</a-button
            >
          </a-form-item>
        </a-form>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { useLocalStorage } from '@vueuse/core';
  const electron = require('electron');
  const ipc = electron.ipcRenderer;

  import {
    PlusSquareOutlined,
    MinusSquareOutlined,
    PlusOutlined,
  } from '@ant-design/icons-vue';

  import { PlotSettingsStore } from '@/types/Store';

  import { openLinkInBrowser } from '@/helpers/common';
  import { defaultState, newWorker } from '@/helpers/state';

  export default defineComponent({
    name: 'Settings',
    components: {
      PlusSquareOutlined,
      MinusSquareOutlined,
      PlusOutlined,
    },
    setup() {
      const state = useLocalStorage<PlotSettingsStore>('state', defaultState);
      const showAdvancedSettings = ref<boolean>(false);

      function addWorker() {
        state.value.workers.push(newWorker());
      }

      function removeWorker(index: number) {
        state.value.workers.splice(index, 1);
      }

      async function chooseDir(
        type: 'tempDir' | 'finalDir' | 'tempDir2' | 'oldPlotsDir',
        workerIndex = 0,
        finalDirIndex = 0
      ) {
        const dirs = await ipc.invoke('select-dirs');

        if (dirs.length) {
          if (
            type === 'oldPlotsDir' &&
            state.value.workers[workerIndex].finalDir.includes(dirs[0])
          )
            return;

          if (type === 'finalDir') {
            if (state.value.workers[workerIndex].finalDir.includes(dirs[0])) {
              alert('That path is already added, please choose one different');
            } else {
              state.value.workers[workerIndex].finalDir[finalDirIndex] =
                dirs[0];
            }
            return;
          }

          state.value.workers[workerIndex][type] = dirs[0];
        }
      }

      async function chooseMadmaxPath() {
        const dirs = await ipc.invoke('select-file');

        if (dirs.length) {
          state.value.madmaxBinPath = dirs[0];
        }
      }

      function handlePoolPublicKeyBlur(_: FocusEvent, index: number) {
        if (!state.value.workers[index].poolPublicKey.startsWith('xch')) {
          state.value.workers[index].oldPlotsDir = '';
        }
      }

      return {
        state,
        addWorker,
        removeWorker,
        chooseDir,
        chooseMadmaxPath,
        openLinkInBrowser,
        handlePoolPublicKeyBlur,
        showAdvancedSettings,
      };
    },
  });
</script>

<style scoped>
  .settings-page {
    width: 100%;
  }

  .content {
    margin: 24px 0;
  }

  .worker-title {
    margin: 0;
  }

  .worker-card {
    width: 100%;
  }
</style>
