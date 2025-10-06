<script setup lang="ts">
import { computed, ref, reactive, onBeforeMount } from 'vue'

import EliminarActividad from './actions/EliminarActividad.vue'
import AgregarActividad from './actions/AgregarActividad.vue'
import EditarActividad from './actions/EditarActividad.vue'
import AdjuntarAnexo from './actions/AdjuntarAnexo.vue'

import ModalActividad from './modal/ModalActividad.vue'
import ModalAnexo from './modal/ModalAnexo.vue'

import { useConfigStore } from '@/stores/config'
import { useProjectStore } from '@/stores/project'

const props = defineProps(['actividades', 'componente', 'estatus', 'anio'])

const config = useConfigStore()

const project = useProjectStore()

const actividadActual = ref(undefined)

const modalActiva = ref(false)

const modalAnexo = ref(false) //here

const numActividad = ref(0)

const agregar = ref(true)

const gTotal = computed(() => {
  let total = 0
  props.actividades.forEach((actividad, index) => {
    total += isNumeric(actividad.total) ? actividad.total : 0
  })
  return total
})

const formatoCantidad = (value) => {
  if (!isNumeric(value)) {
    return value
  }

  return isInteger(value) ? numeral(value).format('0,0') : numeral(value).format('0,0.00')
}

const moneda = (value, signo) => {
  if (!signo) {
    signo = ''
  }

  if (!isNumeric(value)) {
    return value
  }
  return numeral(value).format(signo + '0,0.00')
}

const limpiarCadenaHTML = (cadena, truncar) => {
  cadena = cadena.replace(/^[<p>]*|[</p>]*$/g, '')

  if (isInteger(truncar) && truncar > 0) {
    cadena = cadena.length > truncar ? cadena.substr(0, truncar) + '...' : cadena
  }

  return cadena
}

const cerrarModal = ($actividad) => {
  if ($actividad) {
    mostrarOcultarText($actividad)
  }
  modalActiva.value = false
}

const mostrarModal = ($actividad) => {
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

const abrirModalAnexo = ($actividad, numAct) => {
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

const agregarAnexo = ($anexos) => {
  actividadActual.value.anexos = $anexos
  project.agregarAnexo({
    idActividad: actividadActual.value.id,
    idComponente: props.componente.id,
    vertiente: props.componente.vertiente,
    anexos: $anexos,
  })
  cerrarModalAnexo()
}

const toggleText = (actividadId) => {
  const actividad = props.actividades.find(($actividad) => $actividad.id == actividadId)

  if (!actividad) {
    return
  }
  mostrarOcultarText(actividad)
}

const mostrarOcultarText = ($actividad) => {
  if ($actividad.toggleText) {
    $actividad.placeHolderDescAct = limpiarCadenaHTML($actividad.descAct, 42)
    $actividad.placeHolderDesc = limpiarCadenaHTML($actividad.desc, 42)
    $actividad.placeHolderEnt = limpiarCadenaHTML($actividad.descEntregable, 42)
    $actividad.toggleText = false
  } else {
    $actividad.placeHolderDescAct = $actividad.descAct
    $actividad.placeHolderDesc = $actividad.desc
    $actividad.placeHolderEnt = $actividad.descEntregable
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
          <tr v-for="(actividad, index) in actividades" :key="index">
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
          :currentActivity="actividadActual"
          :vertiente="componente.vertiente"
          :agregar="agregar"
          :activa="modalActiva"
          @cerrar="cerrarModal"
        />
      </div>
      <div class="container" v-if="modalAnexo == true">
        <ModalAnexo
          :activa="modalAnexo"
          :anexos="actividadActual.anexos"
          :actividad_id="actividadActual.id"
          :componente_id="componente.id"
          :vertiente="componente.vertiente"
          :numActividad="numActividad"
          :nombre="componente.nombre"
          :estatus="estatus"
          :anio="anio"
          @cerrarModalAnexo="cerrarModalAnexo"
          @agregarAnexo="agregarAnexo"
        />
      </div>
    </div>
  </div>
</template>
