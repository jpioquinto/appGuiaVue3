<script setup lang="ts">
const props = defineProps(['actividad'])

const emit = defineEmits(['activar'])

const mostrarModal = () => {
  emit('activar', props.actividad || {})
}
</script>

<template>
  <button
    class="button is-small is-success is-rounded is-size-7"
    data-tooltip="Modificar actividad"
    @click.prevent="mostrarModal()"
  >
    <span class="icon is-small">
      <i class="fas fa-pencil"></i>
    </span>
  </button>
</template>
