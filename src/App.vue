<script setup lang="ts">
import { computed, ref, onMounted, defineAsyncComponent } from 'vue'

import HeaderGuia from './components/layouts/HeaderApp.vue'
import { useConfigStore } from '@/stores/config'

//import ContentLogin from './layouts/ContentLogin.vue';
//import ContentProject from './layouts/ContentProject.vue';

const config = useConfigStore()

const classLoading = ref(config.loader.classLoading)

const logoHeader = computed(() => {
  return document.getElementById('logos')!.getAttribute('logo-header')
})

const classActive = computed(() => {
  if (!config.loader.isLoading) {
    return ''
  }
  return 'is-active'
})

const ComponentApp = defineAsyncComponent(() => {
  return new Promise((resolve) => {
    if (config.layout !== 'ContentLogin') {
      resolve(import('./components/layouts/ContentProject.vue') as never)
      return
    }
    resolve(import('./components/layouts/ContentLogin.vue') as never)
  })
})

onMounted(() => config.habilitaInterceptor())
</script>

<template>
  <HeaderGuia
    :logo="logoHeader"
    :nickname="config.nickname"
    v-if="config.layout != 'ContentLogin'"
  ></HeaderGuia>
  <div :class="config.layout != 'ContentLogin' ? 'section' : ''">
    <component :is="config.layout"></component>
    <ComponentApp />
  </div>
  ssssssssssssss
  <notifications group="auth" position="bottom right" />

  <div class="pageloader" :class="[classActive, classLoading]">
    <span class="title is-size-5 has-text-weight-bold">Cargando, espere un momento...</span>
  </div>

  <RouterView />
</template>
