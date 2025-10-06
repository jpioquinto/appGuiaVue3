<script setup lang="ts">
import ModalComponente from '../modal/ModalComponentes.vue'
import { ref } from 'vue'

const props = defineProps(['vertiente'])

const modalActiva = ref<boolean>(false)

const abrirModal = () => {
  if (modalActiva.value) {
    return
  }
  modalActiva.value = true
}

const cerrarModal = () => {
  modalActiva.value = false
}
</script>
<template>
  <button class="button is-primary is-rounded" @click.preventDefault="abrirModal">
    <span class="icon is-small">
      <i class="fa fa-plus-circle"></i>
    </span>
    <span>Agregar componente</span>
  </button>
  <div class="container" v-if="modalActiva == true">
    <ModalComponente :activa="modalActiva" :vertiente="props.vertiente" @cerrar="cerrarModal" />
  </div>
</template>
