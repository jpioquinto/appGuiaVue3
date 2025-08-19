<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ img: string }>()

const cssIcon = computed(() => {
  return 'fas fa-' + props.img
})
</script>
<template>
  <i :class="cssIcon"></i>
</template>
