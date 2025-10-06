<script setup lang="ts">
import { computed, reactive, onBeforeMount, onMounted } from 'vue'
import { useConfigStore } from '@/stores/config'
import { useProjectStore } from '@/stores/project'

//import { QuillEditor } from '@vueup/vue-quill';
//import '@vueup/vue-quill/dist/vue-quill.snow.css';

const config = useConfigStore()

const project = useProjectStore()

const introduccion = reactive(project.estructura.introduccion)

const componente = computed(() => config.findElementMenu('introduccion'))

const estatus = computed(() => project.obtenerEstatus)

const entradaNumerica = (event) => {
  const keynum = window.event ? window.event.keyCode : event.which

  if (keynum == 8 || keynum == 46 || isNumeric(String.fromCharCode(keynum))) {
    return isNumeric(quitarFormatoNumerico(introduccion.presupuesto)) ||
      introduccion.presupuesto.trim() == ''
      ? true
      : event.preventDefault()
  }
  return event.preventDefault()
}

const verificarCapturaNumerica = (event) => {
  if (!isNumeric(quitarFormatoNumerico(introduccion.presupuesto))) {
    return true
  }
}

const formatearPresupuesto = (event) => {
  if (isNumeric(quitarFormatoNumerico(introduccion.presupuesto))) {
    project.actualizarPresupuesto(numeral(quitarFormatoNumerico(introduccion.presupuesto)).value())
    introduccion.presupuesto = numeral(quitarFormatoNumerico(introduccion.presupuesto)).format(
      '$0,0.00',
    )
  }
}

const capturarIntroduccion = () => {
  project.actualizarIntroduccion(project.estructura.introduccion?.captura?.toString()!)
}

onBeforeMount(() => {
  if (!project.estructura.introduccion.inicializado) {
    project.obtenerProyecto().then((response) => {})
  }
})

onMounted(() => {
  project.actualizarPresupuesto(numeral(quitarFormatoNumerico(introduccion.presupuesto)).value())
  project.actualizarIntroduccion(introduccion.captura)
  introduccion.presupuesto = numeral(quitarFormatoNumerico(introduccion.presupuesto)).format(
    '$0,0.00',
  )
})
</script>

<template>
  <div class="content">
    <div class="box">
      <template v-if="estatus == 1">
        <div class="tile is-ancestor pb-5">
          <div class="tile is-4">
            <div class="field">
              <label class="label">SUFICIENCIA PRESUPUESTAL ESTATAL</label>
              <div class="control has-icons-left">
                <input
                  class="input"
                  type="text"
                  v-model.trim="introduccion.presupuesto"
                  @keypress.native="entradaNumerica"
                  @keyup.native="verificarCapturaNumerica"
                  @change.native="formatearPresupuesto"
                />
                <span class="icon is-small is-left">
                  <i class="fas fa-credit-card"></i>
                </span>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="is-size-6 has-text-weight-bold title">Suficiencia Presupuestal Estatal</div>
        <div class="subtitle is-size-5">{{ introduccion.presupuesto }}</div>
      </template>
      <h4>{{ componente.orden }}.- INTRODUCCIÓN</h4>

      <QuillEditor
        v-if="estatus == 1"
        v-model:content="introduccion.captura"
        content-type="html"
        key="text-introduccion"
        @textChange="capturarIntroduccion"
      />
      <article v-else class="message is-dark">
        <div class="message-body">
          <div v-html="introduccion.captura"></div>
        </div>
      </article>
    </div>
  </div>
</template>
