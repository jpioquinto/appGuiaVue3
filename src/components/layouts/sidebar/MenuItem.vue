<script setup lang="ts">
import { computed } from 'vue'
//import { useConfigStore } from '@/stores/config'
import { useProjectStore } from '@/stores/project/project'
import type { Step } from '@/types/config'

const props = defineProps<{ elemento: Step }>()

//const config = useConfigStore()

const project = useProjectStore()

const icon = computed(() => {
  return inicializarIcono()
})

/*const seleccionarElemento = () => {
  let itera = 0
  const tempo = setInterval(() => {
    if (itera > 14400) {
      clearInterval(tempo)
    }
    if (!project.estaCargado(props.elemento.componente)) {
      itera++
      return true
    }
    project.seleccionarElemento(config.sidebar || [], props.elemento.id_punto)
    clearInterval(tempo)
  }, 250)
}*/

const inicializarIcono = () => {
  if (project.obtenerEstatus != 1) {
    return !props.elemento.seleccionado ? iconoConsulta() : 'eye'
  }
  return !props.elemento.seleccionado ? iconoConsulta() : iconoEdicion()
}

const iconoEdicion = () => {
  return /*props.elemento.editable ? 'pencil' :*/ 'eye'
}

const iconoConsulta = () => {
  if (props.elemento.cargado && props.elemento.capturado) {
    return 'check'
  }
  return ''
}
</script>
<template>
  <li
    :class="
      elemento.seleccionado
        ? 'is-active is-highlighted is-flex is-justify-content-space-between is-align-items-center'
        : 'is-flex is-justify-content-space-between is-align-items-center'
    "
  >
    <router-link
      tag="li"
      :to="{ name: elemento.componente }"
      class="has-text-black-bis has-text-weight-medium"
      active-class="is-active"
      @click="$emit('seleccionar', elemento)"
    >
      {{ elemento.punto }}
    </router-link>
    <IconFas :img="icon" size="is-small" type="is-success" />
  </li>
</template>
