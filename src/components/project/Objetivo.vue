<script setup lang="ts">
import { computed, reactive } from 'vue'

import { useConfigStore } from '@/stores/config'
import { useProjectStore } from '@/stores/project/project'
import type { Delta } from '@vueup/vue-quill'

const config = useConfigStore()

const project = useProjectStore()

const objetivo = reactive(project.estructura.objetivo)

const componente = computed(() => config.findElementMenu('objetivo'))

const estatus = computed(() => project.obtenerEstatus)

const capturarObjetivo = (delta: Delta, oldDelta: Delta, source: string) => {
  project.actualizarObjetivo(objetivo.captura!)
}
</script>

<template>
  <div class="content">
    <div class="box">
      <h4>{{ componente?.orden }}.- OBJETIVO GENERAL</h4>
      <QuillEditor
        v-if="estatus == 1"
        v-model:content="objetivo.captura"
        content-type="html"
        @textChange="capturarObjetivo"
      />
      <article class="message is-dark" v-else>
        <div class="message-body">
          <div v-html="objetivo.captura"></div>
        </div>
      </article>
    </div>
  </div>
</template>
