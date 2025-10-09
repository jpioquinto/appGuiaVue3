<script setup lang="ts">
import { computed, ref, reactive, onBeforeMount, onMounted } from 'vue'

import { isNumeric, removeFormatNumeric, isKeySpecial, isKeyCtrl, isNumericPositive } from '@/util'
import { useProjectStore } from '@/stores/project'
import type { StateProject } from '@/types/project'
import { useConfigStore } from '@/stores/config'
import numeral from 'numeral'

const config = useConfigStore()

const project = useProjectStore()

const introduccion = reactive<StateProject['estructura']['introduccion']>(
  project.estructura.introduccion,
)

let inputPresupuesto = ref<string>('')

const componente = computed(() => config.findElementMenu('introduccion'))

const estatus = computed(() => project.obtenerEstatus)

const entradaNumerica = (event: KeyboardEvent) => {
  if (event.target instanceof HTMLInputElement) {
    if (
      event.key !== 'Enter' &&
      event.key !== '.' &&
      !isKeySpecial(event.key) &&
      !isKeyCtrl(event) &&
      !isNumericPositive(removeFormatNumeric(inputPresupuesto.value))
    ) {
      event.preventDefault()
    }
  }
}

const verificarCapturaNumerica = (event: KeyboardEvent) => {
  if (event.target instanceof HTMLInputElement) {
    if (!isNumeric(removeFormatNumeric(inputPresupuesto.value))) {
      event.preventDefault()
    }
  }
}

const formatearPresupuesto = (event: Event) => {
  if (event.target instanceof HTMLInputElement) {
    if (isNumeric(removeFormatNumeric(inputPresupuesto.value))) {
      project.actualizarPresupuesto(numeral(removeFormatNumeric(inputPresupuesto.value)).value()!)
      inputPresupuesto.value = numeral(removeFormatNumeric(inputPresupuesto.value)).format(
        '$0,0.00',
      )
    }
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
  project.actualizarPresupuesto(
    numeral(removeFormatNumeric(introduccion.presupuesto.toString())).value()!,
  )
  project.actualizarIntroduccion(introduccion.captura?.toString()!)
  inputPresupuesto.value = numeral(removeFormatNumeric(introduccion.presupuesto.toString())).format(
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
                  v-model.trim="inputPresupuesto"
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
      <h4>{{ componente?.orden }}.- INTRODUCCIÓN</h4>

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
