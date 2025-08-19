<script setup lang="ts">
const props = defineProps(['idAnexo'])

const emit = defineEmits(['remover'])

const removerAnexo = () => {
  emit('remover', props.idAnexo)
}
</script>
<template>
  <button
    class="button is-small is-outline is-rounded is-danger"
    @click.preventDefault="removerAnexo"
  >
    <span class="icon">
      <i class="fa fa-trash-can"></i>
    </span>
  </button>
</template>
