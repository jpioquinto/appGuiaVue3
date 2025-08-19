<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import { useProjectStore } from '@/stores/project'

const props = defineProps([
  'mes',
  'programados',
  'idComponente',
  'idSubcomp',
  'vertiente',
  'estatus',
  'index',
])

const project = useProjectStore()

const programar = ref([])

const programarActividad = (value) => {
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
  const existe = props.programados.split(',').find(($mes) => $mes === props.mes)
  if (existe) {
    programar.value.push(existe)
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
      :checked="programar.find(($mes) => $mes === props.mes)"
      @input="programarActividad"
    />
    <label :for="'mes-' + props.mes + '-' + props.index" class="pl-0"></label>
  </div>
</template>
