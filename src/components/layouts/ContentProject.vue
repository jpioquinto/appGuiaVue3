<script setup lang="ts">
import Menu from './sidebar/MenuSideBar.vue'
import { computed, onMounted } from 'vue'
import { useConfigStore } from '@/stores/config'

const config = useConfigStore()

const menu = computed(() => config.getPasos)

const pasos = computed(() => {
  if (!config.getPasos) {
    return 0
  }
  const pasos = config.getPasos.filter((elemento) => elemento.capturado && elemento.cargado)
  return pasos.length
})

const tope = computed(() => {
  if (!config.getPasos) {
    return 0
  }
  return config.getPasos.length
})

onMounted(() => {
  if (config.sidebar.length === 0) {
    console.log('cargamos...')
    config.obtenerMenuLateral()
  }
})
</script>
<template>
  <div class="columns is-mobile is-desktop">
    <Menu :elementos="menu">
      <template v-slot:titulo>
        Paso <span class="tag is-primary" :rounded="true">{{ pasos }}</span> de
        <span class="tag is-primary" :rounded="true">{{ tope }}</span>
      </template>
    </Menu>
    <main class="column is-10">
      <!--Aquí el contenido del Proyecto Ejecutivo de Modernización-->
      <router-view></router-view>
      <!--RouterView /-->
    </main>
  </div>
</template>
