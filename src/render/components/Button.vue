<template>
  <button
    :class="{
      'hover:bg-gray-700 text-gray-200 bg-gray-800': color === 'gray',
      'hover:bg-red-700 text-red-200 bg-red-800': color === 'red',
      'hover:bg-yellow-700 text-yellow-200 bg-yellow-800': color === 'yellow',
      'hover:bg-green-700 text-green-200 bg-green-800': color === 'green',
      'hover:bg-blue-700 text-blue-200 bg-blue-800': color === 'blue',
      'hover:bg-indigo-700 text-indigo-200 bg-indigo-800': color === 'indigo',
      'hover:bg-purple-700 text-purple-200 bg-purple-800': color === 'purple',
      'hover:bg-pink-700 text-pink-200 bg-pink-800': color === 'pink',
    }"
    v-bind="$attrs"
  >
    <slot />
  </button>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  export default defineComponent({
    props: {
      color: {
        type: String,
        default: 'transparent',
      },
    },
  });
</script>
