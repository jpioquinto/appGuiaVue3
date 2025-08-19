<script setup lang="ts">
//const emit    = defineEmits(['cargarAnexo']);
</script>

<template>
  <button
    class="button is-small is-info is-rounded is-size-7"
    data-tooltip="Adjuntar anexo"
    @click.prevent="$emit('cargarAnexo')"
  >
    <span class="icon is-small">
      <i class="fas fa-paperclip"></i>
    </span>
  </button>
</template>
