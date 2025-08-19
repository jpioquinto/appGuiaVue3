<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import { notify } from '@kyvg/vue3-notification'

//import { useConfigStore } from '@/stores/config'
import { useProjectStore } from '@/stores/project'
import type { Objective } from '@/types/component'

const props = defineProps(['componente', 'vertiente', 'objetivoActual', 'activa'])

const emit = defineEmits(['cerrar'])

//const config = useConfigStore()

const project = useProjectStore()

const objetivo = ref('')

const alcance = ref('')

const accionObjetivo = () => {
  if (!props.objetivoActual) {
    agregarObjetivo()
    return
  }
  editarObjetivo()
}
const editarObjetivo = () => {
  if (!validarCaptura()) {
    return false
  }

  const data = datosObjetivo()
  data['index'] = props.objetivoActual.orden - 1
  project.editarObjetivoComponente(data)

  emit('cerrar')
}
const agregarObjetivo = () => {
  if (!validarCaptura()) {
    return false
  }

  project.agregarObjetivoComponente(datosObjetivo())
  project.actualizarEstatusCaptura()

  emit('cerrar')
}
const validarCaptura = () => {
  if (objetivo.value.trim().length == 0) {
    notify({
      group: 'auth',
      type: 'warn',
      title: '¡Advertencia!',
      text: 'Por favor capture el objetivo específico.',
    })
    return false
  }
  if (alcance.value.trim().length == 0) {
    notify({
      group: 'auth',
      type: 'warn',
      title: '¡Advertencia!',
      text: 'Por favor capture el alcance.',
    })
    return false
  }
  return true
}
const datosObjetivo = (): Objective => {
  return {
    objetivo: objetivo.value.trim(),
    alcance: alcance.value.trim(),
    componente: props.componente,
    vertiente: props.vertiente,
  }
}

onBeforeMount(() => {
  if (props.objetivoActual != null && props.objetivoActual.hasOwnProperty('objetivo')) {
    objetivo.value = props.objetivoActual.objetivo
    alcance.value = props.objetivoActual.alcance
  }
})
</script>

<template>
  <div class="modal" :class="{ 'is-active': props.activa }">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">
          {{ objetivoActual ? 'Editar objetivo' : 'Capturar objetivo' }}
        </p>
      </header>
      <section class="modal-card-body">
        <div class="field">
          <label class="label has-text-weight-bold">Objetivo Específico</label>
          <div class="control">
            <textarea v-model="objetivo" class="textarea is-small"></textarea>
          </div>
        </div>
        <p class="has-text-weight-bold">Alcance</p>
        <QuillEditor v-model:content="alcance" content-type="html" />
      </section>
      <footer class="modal-card-foot">
        <button class="button is-success" @click.prevent="accionObjetivo">Aceptar</button>
        <button class="button" @click="$emit('cerrar')">Cancelar</button>
      </footer>
    </div>
  </div>
</template>
