<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useConfigStore } from '@/stores/config'
import { useRoute } from 'vue-router'

import DefaultLayout from './components/layouts/DefaultLayout.vue'
import ProjectLayout from './components/layouts/ProjectLayout.vue'
import AdminLayout from './components/layouts/AdminLayout.vue'
import AuthLayout from './components/layouts/AuthLayout.vue'

const config = useConfigStore()

const route = useRoute()

const layoutMap = {
  default: DefaultLayout,
  project: ProjectLayout,
  admin: AdminLayout,
  auth: AuthLayout,
}

let classLoading = ref(config.loader.classLoading)

const classActive = computed(() => {
  if (!config.loader.isLoading) {
    return ''
  }
  return 'is-active'
})

const currentLayout = computed(() => {
  const layout = (route.meta?.layout as keyof typeof layoutMap) || 'default'
  return layoutMap[layout] || DefaultLayout
})

onMounted(() => {
  config.habilitaInterceptor()
})
</script>

<template>
  <div class="app">
    <component :is="currentLayout">
      <router-view />
    </component>
    <!--AboutView /-->
    <notifications group="auth" position="bottom right" />

    <div class="pageloader" :class="[classActive, classLoading]">
      <span class="title is-size-5 has-text-weight-bold">Cargando, espere un momento...</span>
    </div>
  </div>
</template>
