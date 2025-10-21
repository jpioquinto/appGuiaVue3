<script setup lang="ts">
const props = defineProps(['clase'])
</script>
<template>
  <a
    class="navbar-item is-tag has-tooltip-bottom has-tooltip-success has-text-link-dark"
    data-tooltip="Guardar Proyecto"
    @click="() => $emit('guardar')"
  >
    <span class="icon is-medium" :class="props.clase">
      <IconFas :img="'save'" />
    </span>
  </a>
</template>
