<script setup lang="ts">
import { computed, ref, reactive, onBeforeMount } from 'vue'

import ModalObjetivo from './modal/ModalObjetivo.vue'

import type { ObjectiveComponentProps } from '@/types/componentProps'
import { useProjectStore } from '@/stores/project/project'
import { useConfigStore } from '@/stores/config'

const config = useConfigStore()

const project = useProjectStore()

const props = defineProps<ObjectiveComponentProps>()

const isObjetiveModalActive = ref<boolean>(false)

const eliminarObjetivo = (): void => {
  project.eliminarObjetivoComponente({
    componente: props.componenteId,
    vertiente: props.vertiente,
    index: props.orden - 1,
  })
  project.actualizarEstatusCaptura()
}

const editarObjetivo = (): void => {
  if (isObjetiveModalActive.value) {
    return
  }
  isObjetiveModalActive.value = true
}

const cerrarModalObjetivo = (): void => {
  isObjetiveModalActive.value = false
}
</script>

<template>
  <div class="content">
    <div class="is-flex">
      <h6>
        {{ props.indice }}.{{ props.ordencomponente }}.{{ props.punto }}.{{ props.orden }}
        {{ props.objetivo.objetivo }}
      </h6>
      <template v-if="estatus == 1">
        <a @click="editarObjetivo"><span class="tag is-link is-light">Editar</span></a> /
        <a @click="eliminarObjetivo"><span class="tag is-danger is-light">Eliminar</span></a>
      </template>
    </div>
    <p v-html="objetivo.alcance"></p>
    <ModalObjetivo
      v-if="estatus == 1"
      :componente="props.componenteId"
      :vertiente="props.vertiente"
      :objetivoActual="props.objetivo"
      :activa="isObjetiveModalActive"
      @cerrar="cerrarModalObjetivo"
    ></ModalObjetivo>
  </div>
</template>
