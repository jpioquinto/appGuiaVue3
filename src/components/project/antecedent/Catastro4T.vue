<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import { useProjectStore } from '@/stores/project/project'

const props = defineProps(['antecedentes', 'anioDiagnostico'])

const project = useProjectStore()

const ComponentPersonal = defineAsyncComponent(() => {
  return new Promise((resolve, reject) => {
    if (project.anio && project.anio > 2019) {
      resolve(import('./Personal4TV2.vue') as never)
      return
    }
    resolve(import('./Personal4TV1.vue') as never)
  })
})
</script>

<template>
  <div class="content">
    <section class="antecedente-catastral">
      <h5>Oficinas catastrales</h5>
      <table class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
        <thead class="has-background-grey-dark has-text-centered">
          <tr>
            <th class="has-text-white center">Concepto</th>
            <th class="has-text-white center">Cantidad</th>
          </tr>
        </thead>
        <tbody class="has-text-centered">
          <tr v-for="(oficina, key) in props.antecedentes.oficinas" :key="key">
            <td>{{ oficina.concepto }}</td>
            <td>{{ oficina.cantidad }}</td>
          </tr>
        </tbody>
      </table>
      <p class="has-text-right is-size-7">
        <strong>Fuente: </strong>Sistema Integral para la Gestión de Información Registral y
        Catastral - Diagnóstico {{ anioDiagnostico }}
      </p>
      <h5>Predios y cuentas catastrales</h5>
      <table class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
        <thead class="has-background-grey-dark has-text-centered">
          <tr>
            <th class="has-text-white">Concepto</th>
            <th class="has-text-white">Cantidad</th>
          </tr>
        </thead>
        <tbody class="has-text-centered">
          <tr v-for="(predio, key) in props.antecedentes.predios" :key="key">
            <td>{{ predio.concepto }}</td>
            <td>{{ predio.cantidad }}</td>
          </tr>
        </tbody>
      </table>

      <p class="has-text-right is-size-7">
        <strong>Fuente: </strong>Sistema Integral para la Gestión de Información Registral y
        Catastral - Diagnóstico {{ anioDiagnostico }}
      </p>
      <h5>Cobertura de la cartografía en Km<sup>2</sup></h5>
      <table class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
        <thead class="has-background-grey-dark has-text-centered">
          <tr>
            <th class="has-text-white">Concepto</th>
            <th class="has-text-white">Cantidad</th>
          </tr>
        </thead>
        <tbody class="has-text-centered">
          <tr v-for="(carto, key) in props.antecedentes.cartografia" :key="key">
            <td>{{ carto.concepto }}</td>
            <td>{{ carto.cantidad }}</td>
          </tr>
        </tbody>
      </table>

      <p class="has-text-right is-size-7">
        <strong>Fuente: </strong>Sistema Integral para la Gestión de Información Registral y
        Catastral - Diagnóstico {{ anioDiagnostico }}
      </p>
      <ComponentPersonal :datos="antecedentes.personal" />
      <p class="has-text-right is-size-7">
        <strong>Fuente: </strong>Sistema Integral para la Gestión de Información Registral y
        Catastral - Diagnóstico {{ anioDiagnostico }}
      </p>
    </section>
  </div>
</template>
