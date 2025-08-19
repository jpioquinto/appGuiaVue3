<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps(['fila', 'distribucion', 'numDecimales'])

const clases = computed(() => {
  if (props.fila == 'total' || props.fila == 'porcentaje') {
    return 'has-background-white-ter has-text-weight-medium'
  }
  return props.fila == 'millar'
    ? 'has-background-white-bis has-text-weight-normal'
    : 'has-text-weight-light'
})

const monedaFederal = ref(numeral(props.distribucion.federal).format('$0,0.00'))
const monedaEstatal = ref(numeral(props.distribucion.estatal).format('$0,0.00'))
const monedaTotal = ref(numeral(props.distribucion.total).format('$0,0.00'))

const porcFederal = ref(
  numeral(props.distribucion.federal).format('0.' + decimales(props.numDecimales) + '%'),
)
const porcEstatal = ref(
  numeral(props.distribucion.estatal).format('0.' + decimales(props.numDecimales) + '%'),
)
const porcTotal = ref(numeral(props.distribucion.total).format('0.00%'))
</script>
<template>
  <tr v-if="fila != 'porcentaje'" :class="clases">
    <td class="has-text-right">{{ distribucion.leyenda }}</td>
    <td class="has-text-right">{{ monedaFederal }}</td>
    <td class="has-text-right">{{ monedaEstatal }}</td>
    <td class="has-text-right">{{ monedaTotal }}</td>
  </tr>
  <tr v-else :class="clases">
    <td class="has-text-right">{{ distribucion.leyenda }}</td>
    <td class="has-text-right">{{ porcFederal }} (*)</td>
    <td class="has-text-right">{{ porcEstatal }}</td>
    <td class="has-text-right">{{ porcTotal }}</td>
  </tr>
</template>
