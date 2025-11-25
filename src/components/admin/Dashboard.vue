<script setup lang="ts">
import { onMounted, ref, reactive, computed } from 'vue'

import { useDashboardStore } from '@/stores/dashboard'
import type { PeriodProject } from '@/types/config'

const dashboard = useDashboardStore()

const disabledVertientes = ref<boolean>(true)
const disabledEntities = ref<boolean>(true)
const btnDisabled = ref<boolean>(true)
const entitySelected = ref<number>(0)
const anioSelected = ref<number>(0)

const showDataPeriod = computed(() => anioSelected.value > 0)

const handleChangeYear = (payload: Event) => {
  const perioSelected = dashboard.years.find((period) => period.anio === anioSelected.value)

  if (perioSelected) {
    dashboard.currentPeriod = perioSelected
    dashboard.obtenerListadoEntidades(anioSelected.value)
  } else {
    dashboard.currentPeriod = { anio: 0, total: 0, pemc: 0, pemr: 0, pemi: 0 }
    dashboard.currentEntities = []
  }
}

const handleChangeEntity = (payload: Event) => {
  if (+entitySelected.value > 0) {
    dashboard.obtenerListadoProyectos(+anioSelected.value, +entitySelected.value)
  }
}

onMounted(() => dashboard.obtenerListadoAnios())
</script>
<template>
  <div class="mb-6 py-0 is-hidden1">
    <h3 class="title is-4 is-text-red-1 has-text-centered has-text-weight-semibold">
      Guía para la Integración de Proyectos de Modernización<br />
      Registral y Catastral
    </h3>
  </div>
  <div class="card">
    <div class="card-content">
      <div class="content py-6">
        <div class="columns is-desktop is-mobile">
          <div class="column is-two-fifths">
            <div class="field">
              <label class="label">Año</label>
              <div class="select is-fullwidth">
                <select v-model="anioSelected" @change="handleChangeYear">
                  <option value="0">Seleccione el año</option>
                  <option
                    v-for="(period, index) in dashboard.years"
                    :key="index"
                    :value="period.anio"
                  >
                    {{ period.anio }}
                  </option>
                </select>
              </div>
            </div>
            <div class="field">
              <label class="label">Entidad</label>
              <div class="select is-fullwidth">
                <select v-model="entitySelected" @change="handleChangeEntity">
                  <option value="0">Seleccione la entidad</option>
                  <option
                    v-for="entity in dashboard.currentEntities"
                    :key="entity.id"
                    :value="entity.id"
                  >
                    {{ entity.entidad }}
                  </option>
                </select>
              </div>
            </div>
            <div class="field">
              <label class="label">Vertiente</label>
              <div class="select is-fullwidth">
                <select>
                  <option>Seleccione la vertiente</option>
                  <option>With options</option>
                </select>
              </div>
            </div>
            <nav class="level is-mobile pt-5" :class="{ 'is-invisible': !showDataPeriod }">
              <div class="level-item has-text-centered">
                <div>
                  <p class="heading">Total</p>
                  <p class="title">{{ dashboard.currentPeriod.total }}</p>
                </div>
              </div>
              <div class="level-item has-text-centered">
                <div>
                  <p class="heading">PEMC</p>
                  <p class="title">{{ dashboard.currentPeriod.pemc }}</p>
                </div>
              </div>
              <div class="level-item has-text-centered">
                <div>
                  <p class="heading">PEMR</p>
                  <p class="title">{{ dashboard.currentPeriod.pemr }}</p>
                </div>
              </div>
              <div class="level-item has-text-centered">
                <div>
                  <p class="heading">PEMI</p>
                  <p class="title">{{ dashboard.currentPeriod.pemi }}</p>
                </div>
              </div>
            </nav>
          </div>
          <div class="column">
            <div class="fixed-grid">
              <div class="grid">
                <div class="cell">
                  <p class="buttons">
                    <button
                      class="button is-sedatu-1 is-uppercase is-fullwidth is-justify-content-space-between"
                      :disabled="btnDisabled"
                    >
                      <span></span>
                      <span>Consultar Proyecto</span>
                      <span class="icon">
                        <i class="fa-solid fa-magnifying-glass"></i>
                      </span>
                    </button>
                  </p>
                </div>
                <div class="cell">
                  <p class="buttons">
                    <button
                      class="button is-red-1 is-uppercase is-fullwidth is-justify-content-space-between"
                      :disabled="btnDisabled"
                    >
                      <span></span>
                      <span>Info del Proyecto</span>
                      <span class="icon has-text-right">
                        <i class="fa-solid fa-circle-info"></i>
                      </span>
                    </button>
                  </p>
                </div>
                <div class="cell">
                  <p class="buttons">
                    <button
                      class="button is-sedatu-1 is-uppercase is-fullwidth is-justify-content-space-between"
                      :disabled="btnDisabled"
                    >
                      <span></span>
                      <span>Ver Ficha Ténica</span>
                      <span class="icon">
                        <i class="fa-solid fa-chart-column"></i>
                      </span>
                    </button>
                  </p>
                </div>
                <div class="cell">
                  <p class="buttons">
                    <button
                      class="button is-red-1 is-uppercase is-fullwidth is-justify-content-space-between"
                      :disabled="btnDisabled"
                    >
                      <span></span>
                      <span>PDF (Con Montos)</span>
                      <span class="icon">
                        <i class="fa-solid fa-file-pdf"></i>
                      </span>
                    </button>
                  </p>
                </div>
                <div class="cell">
                  <p class="buttons">
                    <button
                      class="button is-sedatu-1 is-uppercase is-fullwidth is-justify-content-space-between"
                      :disabled="btnDisabled"
                    >
                      <span></span>
                      <span>Generar Dictamen</span>
                      <span class="icon">
                        <i class="fa-solid fa-list-check"></i>
                      </span>
                    </button>
                  </p>
                </div>
                <div class="cell">
                  <p class="buttons">
                    <button
                      class="button is-red-1 is-uppercase is-fullwidth is-justify-content-space-between"
                      :disabled="btnDisabled"
                    >
                      <span></span>
                      <span>PDF (Sin Montos)</span>
                      <span class="icon">
                        <i class="fa-regular fa-file-pdf"></i>
                      </span>
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
