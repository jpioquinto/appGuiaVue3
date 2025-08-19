<script setup lang="ts">
import { computed, reactive, onBeforeMount, defineAsyncComponent } from 'vue'
import { useConfigStore } from '@/stores/config'
import { useProjectStore } from '@/stores/project'

//import AntecedenteCat from './antecedent/Catastro4T.vue';
import AntecedenteRpp from './antecedent/Registro4T.vue'

const config = useConfigStore()

const project = useProjectStore()

const antecedentes = reactive(project.antecedentes)

const componente = computed(() => config.findElementMenu('antecedentes'))

const estatus = computed(() => project.obtenerEstatus)

const anioDiagnostico = computed(() => project.diagnostico.anio)

const antecedente = computed(() => {
  if (project.vertiente === '1,2') {
    return 'AntecedenteCat'
  }
  return project.vertiente === '2' ? 'AntecedenteRpp' : 'AntecedenteCat'
})

const datosAntecedentes = computed(() => {
  if (project.vertiente === '1,2') {
    return antecedentes.pec
  }
  return project.vertiente === '2' ? antecedentes.pem : antecedentes.pec
})

const capturarSituacion = (delta, oldDelta, source) => {
  project.actualizarSituacion(antecedentes.situacion)
}

const capturarLogros = (delta, oldDelta, source) => {
  project.actualizarLogros(antecedentes.logros)
}

const ComponentAntecedente = defineAsyncComponent(() => {
  return new Promise((resolve, reject) => {
    if (project.vertiente === '1,2') {
      resolve(import('./antecedent/Catastro4T.vue'))
      return
    }
    project.vertiente === '2'
      ? resolve(import('./antecedent/Registro4T.vue'))
      : resolve(import('./antecedent/Catastro4T.vue'))
  })
})

onBeforeMount(() => {
  if (!project.antecedentes.inicializado) {
    project.obtenerAntecedentes()
  }
})
</script>

<template>
  <div class="content">
    <div class="box">
      <h4>{{ componente.orden }}.- ANTECEDENTES</h4>
      <div class="pl-3">
        <h5>{{ componente.orden }}.1- Situación General</h5>
        <div class="container">
          <div class="is-12 mb-6" v-if="estatus == 1">
            <QuillEditor
              v-model:content="antecedentes.situacion"
              content-type="html"
              key="text-situacion"
              @textChange="capturarSituacion"
            />
          </div>

          <article class="message is-dark is-12 mb-6" v-else>
            <div class="message-body">
              <div v-html="antecedentes.situacion"></div>
            </div>
          </article>

          <h6 class="is-italic" v-if="project.vertiente === '1,2'">
            {{ componente.orden }}.1.1 Catastro
          </h6>
          <h6 class="is-italic" v-else-if="project.vertiente === '1'">
            {{ componente.orden }}.1.1 Catastro
          </h6>
          <h6 class="is-italic" v-else>
            {{ componente.orden }}.1.1 Registro Público de la Propiedad
          </h6>

          <ComponentAntecedente
            :antecedentes="datosAntecedentes"
            :anioDiagnostico="anioDiagnostico"
            class="p-5"
          />

          <template v-if="project.vertiente === '1,2'">
            <h6 class="is-italic">{{ componente.orden }}.1.2 Registro Público de la Propiedad</h6>
            <AntecedenteRpp
              :antecedentes="antecedentes.pem"
              :anioDiagnostico="anioDiagnostico"
              class="p-5"
            ></AntecedenteRpp>
          </template>
        </div>

        <h5 class="mt-6">
          {{ componente.orden }}.2- Logros de la aplicación del Programa de Modernización
        </h5>

        <div class="container is-12" v-if="estatus == 1">
          <QuillEditor
            v-model:content="antecedentes.logros"
            content-type="html"
            key="text-logros"
            @textChange="capturarLogros"
          />
        </div>

        <article class="message is-dark is-12" v-else>
          <div class="message-body">
            <div v-html="antecedentes.logros"></div>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>
