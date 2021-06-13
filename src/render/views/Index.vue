<template>
  Hello World <router-link to="/settings">Settings</router-link>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  export default defineComponent({
    name: 'Index',
    setup() {
      return {};
    },
  });
</script>
