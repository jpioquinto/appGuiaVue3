<script setup lang="ts">
import type { CheckboxProps } from '@/types/partialProps'
import { useProjectStore } from '@/stores/project/project'
import { ref, onBeforeMount } from 'vue'

const props = defineProps<CheckboxProps>()

const project = useProjectStore()

const programar = ref<string[]>([])

const programarActividad = (event: Event) => {
  const value = (event.target as HTMLInputElement).value
  if (value.length > 0) {
    project.programar({
      id: props.idComponente,
      idSubcomp: props.idSubcomp,
      vertiente: props.vertiente,
      mes: props.mes,
    })
    project.actualizarCapturaPrograma()
    return
  }
  project.desProgramar({
    id: props.idComponente,
    idSubcomp: props.idSubcomp,
    vertiente: props.vertiente,
    mes: props.mes,
  })
  project.actualizarCapturaPrograma()
}

onBeforeMount(() => {
  const mes = props.programados.split(',').find(($mes) => $mes === props.mes)
  if (mes) {
    programar.value.push(mes)
  }
})
</script>
<template>
  <div class="field">
    <input
      type="checkbox"
      class="is-checkradio is-success is-mediumxx"
      :id="'mes-' + props.mes + '-' + props.index"
      :value="props.mes"
      :checked="programar.find(($mes) => $mes === props.mes) ? true : false"
      @input="programarActividad"
    />
    <label :for="'mes-' + props.mes + '-' + props.index" class="pl-0"></label>
  </div>
</template>
