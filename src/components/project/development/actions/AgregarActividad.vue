<script setup lang="ts">
const emit = defineEmits(['activar'])
</script>

<template>
  <section>
    <p class="buttons">
      <button class="button is-small is-info is-rounded" @click.prevent="$emit('activar')">
        <span class="icon is-small">
          <i class="fas fa-plus"></i>
        </span>
        <span>Agregar Actividad</span>
      </button>
    </p>
  </section>
</template>
