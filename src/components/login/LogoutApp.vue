<script setup lang="ts">
import { useConfigStore } from '@/stores/config'
import { onMounted } from 'vue'

const config = useConfigStore()

onMounted(() => config.destruirToken())
</script>
<template>
  <div></div>
</template>
