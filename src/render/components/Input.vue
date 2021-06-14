<template>
  <label class="flex flex-col">
    <span v-if="label" class="mb-2 font-bold cursor-pointer">{{ label }}</span>
    <input
      type="text"
      v-bind="$attrs"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </label>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  export default defineComponent({
    inheritAttrs: false,
    props: {
      label: {
        type: String,
        default: '',
      },
      modelValue: {
        type: [String, Number],
        default: '',
      },
    },
    emits: ['update:modelValue'],
  });
</script>
