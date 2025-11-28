<script setup lang="ts">
import { ref, computed, inject, type Ref } from 'vue'

import type { FilasDistribucion } from '@/types/project'
//import type { Distribute } from '@/types/partialProps'
import { DistributeKey } from '@/util/keys'
import { useProjectStore } from '@/stores/project/project'
import InputNumeric from './InputNumeric.vue'
import { decimales } from '@/util'
import numeral from 'numeral'

const props = defineProps<{ distribucion: FilasDistribucion; numDecimales: number }>()

const project = useProjectStore()

const decCantidad = ref<number>(2)

const $activar = ref<boolean>(false)

//const { redistribuirMontos } = inject<Distribute>('redistribuir')
const service = inject(DistributeKey)

const gTotal = computed(() => numeral(props.distribucion.gTotal.total).format('$0,0.00'))

const gTotalFederal = ref(numeral(props.distribucion.gTotal.federal).format('$0,0.00'))

const gTotalEstatal = computed(() => numeral(props.distribucion.gTotal.estatal).format('$0,0.00'))

const millar = computed(() => numeral(props.distribucion.millar.federal).format('$0,0.00'))

const federal = computed(() => numeral(props.distribucion.total.federal).format('$0,0.00'))

const estatal = computed(() => numeral(props.distribucion.total.estatal).format('$0,0.00'))

const total = computed(() => numeral(props.distribucion.total.total).format('$0,0.00'))

const porcFederal = computed(() => {
  const $total =
    !props.distribucion?.total?.total || props.distribucion.total.total === 0
      ? 1
      : props.distribucion.total.total
  return numeral((props.distribucion.total.federal / $total) * 100).format(
    '0.' + decimales(props.numDecimales),
  )
})

const porcEstatal = computed(() => {
  const $total =
    !props.distribucion?.total?.total || props.distribucion.total.total === 0
      ? 1
      : props.distribucion.total.total
  return numeral((props.distribucion.total.estatal! / $total) * 100).format(
    '0.' + decimales(props.numDecimales),
  )
})

const mostrarInput = () => {
  if ($activar.value) {
    return
  }
  $activar.value = true
}
const actualizar = ($cantidad: number) => {
  $activar.value = false
  /*console.log("Llamada a actualizar cantidad: " + $cantidad);
        props.distribucion.gTotal.federal = $cantidad;*/
  project.asignarAporteFederal($cantidad)

  setTimeout(() => {
    if (service) {
      service.redistribuirMontos(project.obtenerRedistribuirMontos)
    }
  }, 600)
}
</script>
<template>
  <table class="table is-bordered is-striped is-narrow is-hoverable" id="tabla-aportaciones">
    <thead class="has-background-grey-dark">
      <tr>
        <th class="has-text-centered is-vcentered has-text-white-ter" colspan="4">
          DISTRIBUCIÓN DEL RECURSO PARA LA EJECUCIÓN DEL PROYECTO
        </th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td></td>
        <td colspan="2" class="has-text-weight-medium has-text-grey-dark has-text-centered">
          {{ gTotal }}
        </td>
        <td class="has-text-brown">Monto total</td>
      </tr>
      <tr class="has-text-weight-medium has-text-grey-dark">
        <td></td>
        <td class="has-background-warning has-text-centered" @dblclick="mostrarInput">
          <InputNumeric
            :key="'aporte-' + props.distribucion.gTotal.federal"
            :cantidad="props.distribucion.gTotal.federal"
            :numDecimal="decCantidad"
            @actualizar="actualizar"
            :activar="$activar"
            :formato="true"
            :prefijo="'$'"
            :sufijo="'*'"
          />
        </td>
        <td class="has-text-centered">{{ gTotalEstatal }}</td>
        <td>Aportaciones totales</td>
      </tr>
      <tr>
        <td class="has-background-warning has-text-weight-medium has-text-grey-dark has-text-right">
          uno al millar {{ millar }}
        </td>
        <td class="has-text-brown has-text-centered">
          {{ props.distribucion.porcentaje.federal }}%
        </td>
        <td class="has-text-brown has-text-centered">
          {{ props.distribucion.porcentaje.estatal }}%
        </td>
        <td class="has-text-brown">Porcentajes de aportación</td>
      </tr>
      <tr class="has-text-weight-medium has-text-grey-dark">
        <td></td>
        <td class="has-background-warning has-text-centered">{{ federal }}</td>
        <td class="has-text-centered">{{ estatal }}</td>
        <td>Aportaciones totales para la ejecución del Proyecto</td>
      </tr>
      <tr class="has-text-info-dark">
        <td></td>
        <td colspan="2" class="has-text-centered">{{ total }}</td>
        <td class="has-text-info-dark">Monto para la ejecución del Proyecto</td>
      </tr>
      <tr class="has-text-brown">
        <td></td>
        <td class="has-text-centered">{{ porcFederal }}%</td>
        <td class="has-text-centered">{{ porcEstatal }}%</td>
        <td>Porcentaje para el pago de facturas</td>
      </tr>
    </tbody>
    <tfoot>
      <tr class="has-text-weight-medium has-text-black">
        <td></td>
        <td class="has-text-centered">FEDERAL</td>
        <td class="has-text-centered">ESTATAL</td>
        <td></td>
      </tr>
    </tfoot>
  </table>
</template>
