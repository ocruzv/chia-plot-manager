<template>
  <div>
    <a-page-header
      style="border: 1px solid rgb(235, 237, 240)"
      title="Settings"
      sub-title="Configure your plotter"
      @back="$router.push('/')"
    />
    <a-row type="flex" justify="center" class="content">
      <a-col span="22">
        <a-form layout="vertical">
          <a-form-item label="Madmax Plotter Path">
            <template #help>
              <div>
                Please choose the path to your chia_plot file

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

            <a-card
              v-for="(worker, index) in state.workers"
              :key="worker.name"
              class="ml-10 flex flex-col space-y-2"
            >
              <template #title>
                <a-typography-title
                  v-model:content="worker.name"
                  :level="4"
                  editable
                />
              </template>
              <template #extra>
                <a-space>
                  <a-switch
                    checked-children="Enabled"
                    un-checked-children="Disabled"
                  />
                  <a-popconfirm title="Sure to delete?">
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
                label="Final directory"
                extra="Needs ~100 GiB. It can be a traditional HDD"
              >
                <a-input
                  :value="worker.finalDir"
                  placeholder="E:\portable_plots"
                  readonly
                  @click="chooseDir('finalDir', index)"
                >
                  <template #suffix>
                    <a-button
                      v-if="!worker.finalDir"
                      type="primary"
                      size="small"
                      @click="chooseDir('finalDir', index)"
                    >
                      Browse
                    </a-button>
                    <a-button
                      v-else
                      type="primary"
                      size="small"
                      danger
                      @click="worker.finalDir = ''"
                    >
                      Remove
                    </a-button>
                  </template>
                </a-input>
              </a-form-item>

              <a-divider dashed>
                <a-button type="link">
                  <PlusSquareOutlined /> Show advanced settings
                </a-button>
              </a-divider>
            </a-card>
          </template>

          <a-form-item>
            <a-button type="primary">Save</a-button>
          </a-form-item>
        </a-form>
      </a-col>
      <template v-if="state.madmaxBinPath">
        <div
          v-for="(worker, index) in state.workers"
          :key="worker.name"
          class="ml-10 flex flex-col space-y-2"
        >
          <Input
            v-model.number="worker.cpuThreads"
            type="number"
            min="1"
            label="CPU Threads to use (per plot)"
          />
          <Input
            v-model.number="worker.buckets"
            type="number"
            min="1"
            label="Number of buckets (default = 256)"
          />
          <Input
            v-model.number="worker.parallelJobs"
            type="number"
            min="1"
            label="Plots to create in parallel by this worker"
          />
          <Input
            :model-value="worker.tempDir2"
            label="Temporary directory 2 (Optional)"
            readonly
            @click="chooseDir('tempDir2', index)"
          />

          <div v-if="worker.poolPublicKey.startsWith('xch')">
            <Input
              :model-value="worker.oldPlotsDir"
              label="If you want to replace your old (static) plots with new (portable) plots gradually, please choose your old plots path (It should be different than the final directory)"
              readonly
              @click="chooseDir('oldPlotsDir', index)"
            />
            <a
              href="#"
              @click="
                openLinkInBrowser(
                  'https://github.com/ocruzv/chia-plot-manager#how-replot-works'
                )
              "
              >Read more</a
            >
          </div>

          <Button color="red" class="mt-4" @click="removeWorker(index)"
            >Remove Worker</Button
          >

          <hr class="mt-4" />
        </div>

        <Button @click="addWorker"> Add Worker </Button>
      </template>
    </a-row>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { useLocalStorage } from '@vueuse/core';
  const electron = require('electron');
  const ipc = electron.ipcRenderer;

  import { PlusSquareOutlined } from '@ant-design/icons-vue';

  import { PlotSettingsStore } from '@/types/Store';

  import { openLinkInBrowser } from '@/helpers/common';
  import { defaultState, newWorker } from '@/helpers/state';

  import Input from '@/components/Input.vue';
  import Button from '@/components/Button.vue';

  export default defineComponent({
    name: 'Settings',
    components: {
      Input,
      Button,
      PlusSquareOutlined,
    },
    setup() {
      const state = useLocalStorage<PlotSettingsStore>('state', defaultState);

      function addWorker() {
        state.value.workers.push(newWorker());
      }

      function removeWorker(index: number) {
        state.value.workers.splice(index, 1);
      }

      async function chooseDir(
        type: 'tempDir' | 'finalDir' | 'tempDir2' | 'oldPlotsDir',
        workerIndex = 0
      ) {
        const dirs = await ipc.invoke('select-dirs');

        if (dirs.length) {
          if (
            type === 'oldPlotsDir' &&
            dirs[0] === state.value.workers[workerIndex].finalDir
          )
            return;
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
      };
    },
  });
</script>

<style scoped>
  .content {
    margin: 24px 0;
  }
</style>
