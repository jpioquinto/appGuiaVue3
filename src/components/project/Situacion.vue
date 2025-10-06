<script setup lang="ts">
import { computed, reactive, onBeforeMount, defineAsyncComponent } from 'vue'
import SituacionRpp from './situation/Registro.vue'

import { useConfigStore } from '@/stores/config'
import { useProjectStore } from '@/stores/project'

const config = useConfigStore()

const project = useProjectStore()

const componente = computed(() => config.findElementMenu('situacion'))

const situacion = reactive(project.estructura.situacion)

const datosSituacion = computed(() => {
  if (project.vertiente === '1,2') {
    return situacion.pec
  }
  return project.vertiente === 2 ? situacion.pem : situacion.pec
})

const ComponentSituacion = defineAsyncComponent(() => {
  return new Promise((resolve, reject) => {
    if (project.vertiente === '1,2') {
      resolve(import('./situation/Catastro.vue') as never)
      return
    }
    project.vertiente === 2
      ? resolve(import('./situation/Registro.vue') as never)
      : resolve(import('./situation/Catastro.vue') as never)
  })
})

onBeforeMount(() => {
  if (!project.estructura.situacion.inicializado) {
    project.obtenerSituacion()
  }
})
</script>

<template>
  <div class="content">
    <div class="box">
      <h4>{{ componente?.orden }}.- SITUACIÓN ACTUAL Y ESTIMACIÓN DE AVANCE</h4>
      <ComponentSituacion :situacion="datosSituacion" :cargado="situacion.inicializado">
        <template v-slot:filas>
          <tbody v-html="datosSituacion.tabla"></tbody>
          <tfoot v-html="datosSituacion.totales"></tfoot>
        </template>
      </ComponentSituacion>

      <template v-if="project.vertiente === '1,2'"
        ><br />
        <SituacionRpp :situacion="situacion.pem" :cargado="situacion.inicializado">
          <template v-slot:filas>
            <tbody v-html="situacion.pem.tabla"></tbody>
            <tfoot v-html="situacion.pem.totales"></tfoot>
          </template>
        </SituacionRpp>
      </template>
    </div>
  </div>
</template>
