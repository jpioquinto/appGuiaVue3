<script setup lang="ts">
import { computed, ref, reactive, onBeforeMount } from 'vue'

import EliminarActividad from './actions/EliminarActividad.vue'
import AgregarActividad from './actions/AgregarActividad.vue'
import EditarActividad from './actions/EditarActividad.vue'
import AdjuntarAnexo from './actions/AdjuntarAnexo.vue'

import ModalActividad from './modal/ModalActividad.vue'
import ModalAnexo from './modal/ModalAnexo.vue'

import type { ActivitiesComponentProps } from '@/types/componentProps'
import type { Activity, Anexos } from '@/types/activity'
import { useProjectStore } from '@/stores/project'
import { useConfigStore } from '@/stores/config'
import { isInteger } from '@/util'
import numeral from 'numeral'

//const props = defineProps(['actividades', 'componente', 'estatus', 'anio'])
const props = defineProps<ActivitiesComponentProps>()

const config = useConfigStore()

const project = useProjectStore()

const actividadActual = ref<Activity | undefined>(undefined)

const modalActiva = ref<boolean>(false)

const modalAnexo = ref<boolean>(false)

const numActividad = ref<number>(0)

const agregar = ref<boolean>(true)

const gTotal = computed(() => {
  let total = 0
  props.componente.actividades.forEach((actividad, index) => {
    total += actividad.total
  })
  return total
})

const formatoCantidad = (value: number) => {
  if (!value) {
    return value
  }

  return isInteger(value.toString())
    ? numeral(value).format('0,0')
    : numeral(value).format('0,0.00')
}

const moneda = (value: number, signo: string = '') => {
  if (!value) {
    return value
  }
  return numeral(value).format(signo + '0,0.00')
}

const limpiarCadenaHTML = ($string: string, stringLength: number = 30) => {
  $string = $string.replace(/^[<p>]*|[</p>]*$/g, '')

  if (stringLength > 0) {
    $string = $string.length > stringLength ? $string.substring(0, stringLength) + '...' : $string
  }

  return $string
}

const cerrarModal = ($actividad: Activity) => {
  if ($actividad) {
    mostrarOcultarText($actividad)
  }
  modalActiva.value = false
}

const mostrarModal = ($actividad: Activity) => {
  if ($actividad) {
    actividadActual.value = $actividad
    agregar.value = false
  } else {
    agregar.value = true
  }

  if (modalActiva.value) {
    return
  }
  modalActiva.value = true
}

const abrirModalAnexo = ($actividad: Activity, numAct: number) => {
  if (modalAnexo.value) {
    return
  }
  actividadActual.value = $actividad
  numActividad.value = numAct
  modalAnexo.value = true
}

const cerrarModalAnexo = () => {
  modalAnexo.value = false
}

const agregarAnexo = ($anexos: Anexos) => {
  if (actividadActual?.value) {
    actividadActual.value.anexos = $anexos
  }

  project.agregarAnexo({
    idActividad: actividadActual.value?.id!,
    idComponente: props.componente.id,
    vertiente: props.componente.vertiente,
    anexos: $anexos,
  })
  cerrarModalAnexo()
}

const toggleText = (actividadId: Activity['id']) => {
  const actividad = props.componente.actividades.find(($actividad) => $actividad.id == actividadId)

  if (!actividad) {
    return
  }
  mostrarOcultarText(actividad)
}

const mostrarOcultarText = ($actividad: Activity) => {
  if ($actividad.toggleText) {
    $actividad.placeHolderDescAct = limpiarCadenaHTML($actividad.descAct! || '', 42)
    $actividad.placeHolderDesc = limpiarCadenaHTML($actividad.desc || '', 42)
    $actividad.placeHolderEnt = limpiarCadenaHTML($actividad.descEntregable! || '', 42)
    $actividad.toggleText = false
  } else {
    $actividad.placeHolderDescAct = $actividad.descAct || ''
    $actividad.placeHolderDesc = $actividad.desc || ''
    $actividad.placeHolderEnt = $actividad.descEntregable || ''
    $actividad.toggleText = true
  }
}
</script>

<template>
  <div class="content">
    <div class="table-container actividades-componente">
      <table class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
        <thead class="has-background-grey-dark has-text-centered">
          <tr>
            <th class="has-text-white center">Subcomponentes</th>
            <th class="has-text-white center">Actividades por realizar</th>
            <th class="has-text-white center">Descripción</th>
            <th class="has-text-white center">Entregables</th>
            <th class="has-text-white center">Unidad de Medida</th>
            <th class="has-text-white center">Cantidad</th>
            <th class="has-text-white center">Costo Unitario</th>
            <th class="has-text-white center">IVA</th>
            <th class="has-text-white center">Total</th>
            <th v-if="estatus == 1"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(actividad, index) in props.componente.actividades" :key="index">
            <td>{{ actividad.descSubcomp }}</td>
            <td class="toggle-text" @click.prevent="toggleText(actividad.id)">
              {{ actividad.placeHolderDescAct }}
            </td>
            <td class="toggle-text" @click.prevent="toggleText(actividad.id)">
              {{ actividad.placeHolderDesc }}
            </td>
            <td class="toggle-text" @click.prevent="toggleText(actividad.id)">
              {{ actividad.placeHolderEnt }}
            </td>
            <td>{{ actividad.descUnidad }}</td>
            <td class="has-text-centered">{{ formatoCantidad(actividad.cantidad) }}</td>
            <td class="has-text-right">{{ moneda(actividad.costo, '$') }}</td>
            <td class="has-text-right">{{ moneda(actividad.iva, '$') }}</td>
            <td class="has-text-right">{{ moneda(actividad.total, '$') }}</td>
            <td v-if="estatus == 1">
              <div class="is-flex">
                <EditarActividad
                  :componente_id="componente.id"
                  :vertiente="componente.vertiente"
                  :actividad="actividad"
                  @activar="mostrarModal"
                />
                &nbsp;
                <AdjuntarAnexo
                  @cargarAnexo="abrirModalAnexo(actividad, index + 1)"
                  @cerrarModalAnexo="cerrarModalAnexo"
                />
                &nbsp;
                <EliminarActividad
                  :actividad_id="actividad.id"
                  :componente_id="componente.id"
                  :vertiente="componente.vertiente"
                />
              </div>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="8" class="has-text-right has-text-weight-bold">Total:</td>
            <td class="has-text-right has-text-weight-bold">{{ moneda(gTotal, '$') }}</td>
            <td v-if="estatus == 1"></td>
          </tr>
        </tfoot>
      </table>
    </div>
    <div v-if="estatus == 1" class="is-pulled-right11">
      <AgregarActividad @activar="mostrarModal" />
      <div class="container" v-if="modalActiva == true">
        <ModalActividad
          :componente_id="componente.id"
          :currentActivity="actividadActual!"
          :vertiente="componente.vertiente"
          :agregar="agregar"
          :activa="modalActiva"
          @cerrar="cerrarModal"
        />
      </div>
      <div class="container" v-if="modalAnexo == true">
        <ModalAnexo
          :activa="modalAnexo"
          :anexos="actividadActual?.anexos!"
          :actividad_id="actividadActual?.id!"
          :componente_id="componente.id"
          :vertiente="componente.vertiente"
          :numActividad="numActividad"
          :nombre="componente.nombre"
          :estatus="estatus"
          :anio="anio!"
          @cerrarModalAnexo="cerrarModalAnexo"
          @agregarAnexo="agregarAnexo"
        />
      </div>
    </div>
  </div>
</template>
