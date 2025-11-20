<script setup lang="ts">
import { computed, watch, ref } from 'vue'

import type { SituacionVertiente } from '@/types/project'
import { useProjectStore } from '@/stores/project/project'
import GraficaAvance from './GraficaAvance.vue'
import { makeHash } from '@/util'

const props = defineProps<{ situacion: SituacionVertiente; cargado: boolean }>()

const project = useProjectStore()

const keyChart = ref<string>(makeHash(12))

const anio = computed(() => project.diagnostico.anio)

const anioProyecto = computed(() => project.anio)

watch(props.situacion, (newValue, oldValue) => {
  if (newValue.series) {
    keyChart.value = makeHash(12)
  }
})
</script>

<template>
  <div class="container">
    <div class="table-container">
      <table class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
        <thead class="has-background-grey-dark">
          <tr>
            <th colspan="4" class="has-text-centered has-text-white-ter">
              Tabla comparativa de avance y estimación
            </th>
          </tr>
          <tr>
            <th class="has-text-white-ter">Componente</th>
            <th class="has-text-centered has-text-white-ter">
              Modelo Integral de Registro Público de la Propiedad SEDATU
            </th>
            <th class="has-text-centered has-text-white-ter">Diagnóstico {{ anio }}</th>
            <th class="has-text-centered has-text-white-ter">
              Estimación de avance {{ anioProyecto }}
            </th>
          </tr>
        </thead>
        <slot name="filas"></slot>
      </table>
    </div>
    <GraficaAvance :series="situacion.series" :key="keyChart" :anio="anio" />
  </div>
</template>
