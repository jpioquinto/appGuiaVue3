<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import { useProjectStore } from '@/stores/project'

const props = defineProps(['antecedentes', 'anioDiagnostico'])

const project = useProjectStore()

const ComponentPersonal = defineAsyncComponent(() => {
  return new Promise((resolve, reject) => {
    if (project.anio > 2019) {
      resolve(import('./Personal4TV2.vue'))
      return
    }
    resolve(import('./Personal4TV1.vue'))
  })
})
</script>
<template>
  <div class="content">
    <section class="antecedente-catastral">
      <h5>Oficinas registrales</h5>
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
      <h5>Situación del acervo documental</h5>
      <table class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
        <thead class="has-background-grey-dark has-text-centered">
          <tr>
            <th class="has-text-white">Concepto</th>
            <th class="has-text-white">Cantidad</th>
          </tr>
        </thead>
        <tbody class="has-text-centered">
          <tr v-for="(acervo, key) in props.antecedentes.acervo" :key="key">
            <td>{{ acervo.concepto }}</td>
            <td>{{ acervo.cantidad }}</td>
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
      <h5>Presupuesto y promedio de ingresos anuales</h5>
      <table class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
        <tbody class="has-text-centered" v-html="antecedentes.ingreso"></tbody>
      </table>
      <p class="has-text-right is-size-7">
        <strong>Fuente: </strong>Sistema Integral para la Gestión de Información Registral y
        Catastral - Diagnóstico {{ anioDiagnostico }}
      </p>
    </section>
  </div>
</template>
