<script setup lang="ts">
import { computed, ref, reactive, onBeforeMount, onMounted } from 'vue'

import type { CatComponents, Component, Components } from '@/types/component'
import type { ComponentModalProps } from '@/types/componentProps'
import type { CatalogComponents } from '@/types/project'
import { useProjectStore } from '@/stores/project'

const props = defineProps<ComponentModalProps>()

const emit = defineEmits(['cerrar'])

const project = useProjectStore()

const listadoComponentes = ref([]) //<CatComponents>

const componentes = ref<CatalogComponents['datos']>([])

const tags = ref<CatComponents>([])

const estaCargado = (idComponente: Component['id']) => {
  const $componentes =
    props.vertiente === 1
      ? project.estructura.desarrollo.componentes.pec
      : project.estructura.desarrollo.componentes.pem
  const componente = $componentes.find((componente) => componente.id == idComponente)
  return componente
}

const seleccionComponente = (): void => {
  listadoComponentes.value.forEach((value, index) => {
    componentes.value.forEach((val, key) => {
      if (val.componentes_id != value) {
        return true
      }
      componentes.value[key].deshabilitado = true
    })
  })
  tags.value = componentes.value.filter(
    (componente) => componente.deshabilitado === true && !estaCargado(componente.componentes_id),
  )
}
const agregarComponentes = (): void => {
  if (tags.value == null || tags.value.length == 0) {
    return
  }
  let indice =
    project.obtenerVertienteProyecto === '1,2'
      ? project.obtenerTotalComponentesPEC
      : +project.obtenerVertienteProyecto! == 1
        ? project.obtenerTotalComponentesPEC
        : project.obtenerTotalComponentesPEM
  const listaComponentes: Components = []
  tags.value.forEach(($value, key) => {
    const componente: Component = {
      id: $value.componentes_id,
      vertiente: $value.modelos_id,
      nombre: $value.nombre,
      orden: indice + 1,
      situacion: null,
      objetivos: [],
      actividades: [],
      programa: {},
      estrategia: null,
      aporteFederal: 0,
      aporteEstatal: 0,
      posicion: $value.orden,
      total: 0,
      actualizado: false,
    }
    if (componente.id == 14) {
      componente.acervo = { listado: [], oficinas: [] }
    }
    listaComponentes.push(componente)
    indice++
  })
  //console.log('listaComponentes:', listaComponentes);
  project.agregarComponentes({ vertiente: props.vertiente, componentes: listaComponentes })
  emit('cerrar') //
}
onBeforeMount(() => {
  if (project.listadoComponentes(props.vertiente) == null) {
    project
      .obtenerComponentes({ vertiente: props.vertiente })
      .then((data: CatalogComponents['datos'] | unknown) => {
        componentes.value = data ? (data as CatalogComponents['datos']) : componentes.value
      })
    return
  }
  const listComponents = project.listadoComponentes(props.vertiente)
  if (listComponents?.datos) {
    componentes.value = listComponents.datos
  }
})
</script>
<template>
  <div class="modal" :class="{ 'is-active': props.activa }">
    <div class="modal-background"></div>
    <div class="modal-content">
      <div class="box">
        <p class="has-text-dark has-text-weight-medium">Componentes:</p>
        <div class="container mt-3">
          <div class="field">
            <div class="control is-expanded">
              <div class="select is-multiple is-fullwidth is-primary">
                <select
                  multiple
                  size="9"
                  v-model="listadoComponentes"
                  @change="seleccionComponente"
                >
                  <option
                    v-for="componente in componentes"
                    :key="componente.componentes_id"
                    :value="componente.componentes_id"
                    :disabled="componente.deshabilitado"
                  >
                    {{ componente.nombre }}
                  </option>
                </select>
              </div>
            </div>
          </div>
          <div class="box">
            <div class="tags">
              <template v-for="(tag, index) in tags">
                <span class="tag is-dark is-rounded" v-if="tag.deshabilitado">
                  {{ tag.nombre }}
                  <button class="delete is-small" @click="tag.deshabilitado = false"></button>
                </span>
              </template>
            </div>
          </div>
        </div>
        <footer class="container mt-5">
          <div class="is-flex is-flex-wrap-wrap is-justify-content-center">
            <button class="button is-success" @click="agregarComponentes">Aceptar</button>
            <button class="button ml-3" @click.preventDefault="$emit('cerrar')">Cancelar</button>
          </div>
        </footer>
      </div>
    </div>
  </div>
</template>
