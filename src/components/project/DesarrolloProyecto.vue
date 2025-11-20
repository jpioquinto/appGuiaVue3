<script setup lang="ts">
import { computed, ref, reactive, onBeforeMount } from 'vue'

import AgregarComponente from './development/actions/AgregarComponente.vue'
import Componente from './development/Componente.vue'

import { useConfigStore } from '@/stores/config'
import { useProjectStore } from '@/stores/project/project'

const config = useConfigStore()

const project = useProjectStore()

const tabCat = ref<boolean>(true)

const tabRpp = ref<boolean>(false)

const vertiente = ref(project.vertiente || 1)

const componentes = reactive(project.estructura.desarrollo.componentes)

const componente = computed(() => config.findElementMenu('desarrollo'))

const estatus = computed(() => project.obtenerEstatus)

const anio = computed(() => project.anio)

const vertienteActual = computed(() => {
  if (vertiente.value === '1,2') {
    return tabCat.value ? 1 : 2
  }
  return +vertiente.value
})

const componentesVertiente = () => {
  if (vertiente.value === '1,2') {
    return componentes.pec
  }
  return vertiente.value === '1' ? componentes.pec : componentes.pem
}

const selectTab = (value: boolean) => {
  if (value) {
    return
  }
  tabCat.value = !tabCat.value
  tabRpp.value = !tabRpp.value
}

onBeforeMount(() => {
  if (!project.estructura.desarrollo.inicializado && project.id) {
    project.obtenerDesarrollo()
  }
})
</script>

<template>
  <div class="container">
    <div class="box">
      <h4 class="title is-size-4-desktop">{{ componente?.orden }}.- DESARROLLO DEL PROYECTO</h4>
      <template v-if="vertiente === '1,2'">
        <div class="tabs is-centered is-boxed is-medium">
          <ul>
            <li @click.prevent="selectTab(tabCat)" :class="{ 'is-active': tabCat }">
              <a>
                <span class="icon is-small"
                  ><i class="fa-brands fa-buffer" aria-hidden="true"></i
                ></span>
                <span>Vertiente Catastral</span>
              </a>
            </li>
            <li @click.prevent="selectTab(tabRpp)" :class="{ 'is-active': tabRpp }">
              <a>
                <span class="icon is-small"
                  ><i class="fa-solid fa-book-bookmark" aria-hidden="true"></i
                ></span>
                <span>Vertiente Registral</span>
              </a>
            </li>
          </ul>
        </div>
        <div class="container" id="tabs-content">
          <div :class="{ 'is-hidden': !tabCat }">
            <Componente
              v-for="(component, _index) in componentes.pec"
              :key="component.id"
              :componente="component"
              :indice="componente?.orden!"
              :anio="anio!"
            >
            </Componente>
          </div>
          <div :class="{ 'is-hidden': !tabRpp }">
            <Componente
              v-for="(component, _index) in componentes.pem"
              :key="component.id"
              :componente="component"
              :indice="componente?.orden!"
              :anio="anio!"
            >
            </Componente>
          </div>
        </div>
      </template>
      <template v-else>
        <Componente
          v-for="component in componentesVertiente()"
          :key="component.id"
          :componente="component"
          :indice="componente?.orden!"
          :anio="anio!"
        >
        </Componente>
      </template>
      <div v-if="estatus == 1" class="is-pulled-right-quitado">
        <AgregarComponente :vertiente="vertienteActual" />
      </div>
    </div>
  </div>
</template>
