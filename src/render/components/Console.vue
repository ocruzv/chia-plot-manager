<template>
  <div
    class="
      bg-black
      text-white
      flex flex-col
      w-full
      rounded
      overflow-y-auto
      p-4
      relative
      h-28
    "
  >
    <box-icon
      name="x"
      color="white"
      class="cursor-pointer absolute top-4 right-4"
      @click="$emit('close')"
    ></box-icon>
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
    emits: ['close'],
  });
</script>
