<script setup lang="ts">
import { useProjectStore } from '@/stores/project/project'

const props = defineProps(['actividad_id', 'componente_id', 'vertiente'])

const project = useProjectStore()

const eliminarActividad = () => {
  project.eliminarActividadComponente({
    actividad_id: props.actividad_id,
    componente_id: props.componente_id,
    vertiente: props.vertiente,
  })
  project.actualizarEstatusCaptura()
}
</script>

<template>
  <button
    class="button is-small is-danger is-rounded is-size-7"
    data-tooltip="Eliminar actividad"
    @click.prevent="eliminarActividad()"
  >
    <span class="icon is-small">
      <i class="fas fa-trash"></i>
    </span>
  </button>
</template>
