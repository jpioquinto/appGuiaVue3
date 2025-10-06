<script setup lang="ts">
import { computed, reactive, onMounted } from 'vue'
import { useConfigStore } from '@/stores/config'
import { useProjectStore } from '@/stores/project'
import type { Delta } from '@vueup/vue-quill'

const config = useConfigStore()

const project = useProjectStore()

const resultados = reactive(project.estructura.resultados)

const componente = computed(() => config.findElementMenu('resultados'))

const estatus = computed(() => project.obtenerEstatus)

const capturarResultado = (delta: Delta, oldDelta: Delta, source: string) => {
  project.actualizarResultado(resultados.captura?.toString() || '')
}

onMounted(() => {
  project.actualizarResultado(resultados.captura?.toString() || '')
})
</script>
<template>
  <div class="content">
    <div class="box">
      <h4>{{ componente?.orden }}.- RESULTADOS ESPERADOS</h4>
      <QuillEditor
        v-if="estatus == 1"
        v-model:content="resultados.captura"
        content-type="html"
        @textChange="capturarResultado"
      />
      <article class="message is-dark" v-else>
        <div class="message-body">
          <div v-html="resultados.captura"></div>
        </div>
      </article>
    </div>
  </div>
</template>
