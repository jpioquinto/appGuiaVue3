<script lang="ts">
import { computed, ref } from 'vue'

import HeaderGuia from './components/layouts/HeaderApp.vue'
import { useConfigStore } from '@/stores/config'

import ContentProject from './components/layouts/ContentProject.vue'
import ContentLogin from './components/layouts/ContentLogin.vue'
import AboutView from './views/AboutView.vue'

export default {
  components: {
    AboutView,
    HeaderGuia,
    ContentLogin,
    ContentProject,
  },

  setup() {
    const config = useConfigStore()

    let classLoading = ref(config.loader.classLoading)

    const logoHeader = computed(() => {
      return ''
    })

    const classActive = computed(() => {
      if (!config.loader.isLoading) {
        return ''
      }
      return 'is-active'
    })

    return {
      logoHeader,
      config,
      classActive,
      classLoading,
    }
  },

  mounted() {
    this.config.habilitaInterceptor()
  },
}
</script>

<template>
  <div class="app">
    <HeaderGuia
      :logo="logoHeader"
      :nickname="config.nickname"
      v-if="config.layout != 'ContentLogin'"
    />
    <div :class="config.layout != 'ContentLogin' ? 'section' : ''">
      Componente dinámico aquí:
      <component :is="config.layout"></component>
    </div>
    <!--AboutView /-->
    <notifications group="auth" position="bottom right" />

    <div class="pageloader" :class="[classActive, classLoading]">
      <span class="title is-size-5 has-text-weight-bold">Cargando, espere un momento...</span>
    </div>
  </div>
</template>
