<script setup lang="ts">
import { computed, ref, onBeforeMount, onMounted } from 'vue'

import ModalObjetivo from './modal/ModalObjetivo.vue'
import ObjetivoComponente from './ObjetivoComponente.vue'
import OficinasRegistrales from './OficinasRegistrales.vue'
import ActividadesComponente from './ActividadesComponente.vue'

import { useConfigStore } from '@/stores/config'
import { useProjectStore } from '@/stores/project'

const config = useConfigStore()

const project = useProjectStore()

const props = defineProps(['indice', 'anio', 'componente'])

const isObjetiveModalActive = ref(false)

const estatus = computed(() => project.obtenerEstatus)

const ini = ref(0)

const setActualizado = (estatus) => {
  props.componente.actualizado = estatus
}

const eliminarComponente = () => {
  project.eliminarComponente(props.componente)
}

const mostrarModalObjetivo = () => {
  if (isObjetiveModalActive.value) {
    return
  }
  isObjetiveModalActive.value = true
}

const cerrarModalObjetivo = () => {
  isObjetiveModalActive.value = false
}

const verificarCaptura = (delta, oldDelta, source) => {
  ++ini.value
  if (ini.value > 2) {
    setActualizado(true)
  }

  project.actualizarEstatusCaptura()
}

onBeforeMount(() => {
  if (props.componente.id == 14) {
    project.obtenerListaOficinas.length > 0
      ? project.inicializarListadoOficinas({ data: project.obtenerListaOficinas, id: 14 })
      : project.obtenerOficinas()
  }
})

onMounted(() => {
  project.actualizarEstatusCaptura()
})
</script>

<template>
  <div class="box">
    <div class="is-flex is-justify-content-space-between">
      <h5 class="title is-size-5-desktop">
        {{ props.indice }}.{{ props.componente.orden }} COMPONENTE:
        {{ props.componente.nombre.toUpperCase() }} &nbsp;
      </h5>

      <button
        class="button is-small is-outlined is-rounded is-danger"
        v-if="estatus == 1"
        @click="eliminarComponente"
      >
        <span class="icon is-small">
          <i class="fa-regular fa-trash-can"></i>
        </span>
        <span>Eliminar</span>
      </button>
    </div>

    <div class="contenido-componente pl-5">
      <h5 class="title is-size-6-desktop" :class="estatus != 1 ? 'mt-4' : ''">
        {{ props.indice }}.{{ props.componente.orden }}.1 SITUACIÓN ACTUAL
      </h5>
      <template v-if="estatus == 1">
        <QuillEditor
          v-model:content="props.componente.situacion"
          content-type="html"
          @textChange="verificarCaptura"
        />
      </template>
      <template v-else>
        <article class="message is-dark">
          <div class="message-body">
            <div v-html="props.componente.situacion"></div>
          </div>
        </article>
      </template>
      <div class="is-flex is-align-items-baseline mt-5">
        <h5 class="title is-size-6-desktop" :class="estatus != 1 ? 'mb-4' : ''">
          {{ props.indice }}.{{ props.componente.orden }}.2 OBJETIVOS Y ALCANCES
        </h5>
        <template v-if="estatus == 1">
          <button
            class="button is-small is-link is-rounded is-size-7 ml-3"
            data-tooltip="Agregar nuevo objetivo y alcance"
            @click.prevent="mostrarModalObjetivo()"
          >
            <span class="icon is-small">
              <i class="fas fa-plus-circle"></i>
            </span>
            <span>Agregar</span>
          </button>
          <ModalObjetivo
            :componente="props.componente.id"
            :vertiente="props.componente.vertiente"
            :activa="isObjetiveModalActive"
            @cerrar="cerrarModalObjetivo"
          ></ModalObjetivo>
        </template>
      </div>
      <ObjetivoComponente
        v-for="(objetivo, index) in props.componente.objetivos"
        :key="props.indice + '.' + props.componente.orden + '.2.' + (index + 1)"
        :objetivo="objetivo"
        :indice="props.indice"
        :ordencomponente="props.componente.orden"
        :punto="2"
        :orden="index + 1"
        :componente="props.componente.id"
        :vertiente="props.componente.vertiente"
        :estatus="estatus"
        class="pl-5"
      >
      </ObjetivoComponente>
      <h5 class="title is-size-6-desktop">
        {{ props.indice }}.{{ props.componente.orden }}.3 ACTIVIDADES A REALIZAR EN {{ anio }}
      </h5>

      <ActividadesComponente
        :actividades="props.componente.actividades"
        :componente="props.componente"
        :estatus="estatus"
        :anio="props.anio"
      >
      </ActividadesComponente>

      <OficinasRegistrales
        v-if="props.componente.id == 14"
        :listado="props.componente.acervo.listado"
        :oficinas="props.componente.acervo.oficinas"
        :estatus="estatus"
      />

      <h5 class="title is-size-6-desktop">
        {{ props.indice }}.{{ props.componente.orden }}.4 ESTRATEGIA DE DESARROLLO
      </h5>
      <template v-if="estatus == 1">
        <QuillEditor
          v-model:content="props.componente.estrategia"
          content-type="html"
          @textChange="verificarCaptura"
        />
      </template>
      <template v-else>
        <article class="message is-dark">
          <div class="message-body">
            <div v-html="props.componente.estrategia"></div>
          </div>
        </article>
      </template>
    </div>
  </div>
</template>
