<script setup lang="ts">
const props = defineProps(['clase', 'id'])
</script>
<template>
  <a
    class="navbar-item is-tag has-tooltip-bottom has-tooltip-success has-text-black"
    data-tooltip="Descargar Proyecto PDF"
    @click="() => $emit('descarga')"
  >
    <span class="icon is-medium" :class="props.clase">
      <Icon :img="'download'" />
    </span>
  </a>
</template>
