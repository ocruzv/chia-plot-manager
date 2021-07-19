<template>
  <div class="console">
    <p
      v-for="(log, index) in logHistory"
      :key="index"
      class="m-0 text-white font-mono text-sm block"
    >
      {{ log }}
    </p>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  export default defineComponent({
    props: {
      logHistory: {
        type: Array,
        default: () => [],
      },
    },
  });
</script>

<style scoped>
  .console {
    background-color: black;
    color: #fff;
    display: flex;
    flex-direction: column;
    max-width: 100vw;
    border-radius: 4px;
    overflow-y: auto;
    padding: 16px;
    height: 124px;
  }
</style>
