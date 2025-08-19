<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps(['fila', 'estatus', 'distribucion', 'numDecimales'])

const emit = defineEmits(['distribuirPorcentaje'])

const monedaFederal = ref(numeral(props.distribucion.federal).format('$0,0.00'))
const monedaEstatal = ref(numeral(props.distribucion.estatal).format('$0,0.00'))
const monedaTotal = ref(numeral(props.distribucion.total).format('$0,0.00'))

const porcFederal = ref(
  numeral(props.distribucion.federal).format('0.' + decimales(props.numDecimales)),
)
const porcEstatal = ref(
  numeral(props.distribucion.estatal).format('0.' + decimales(props.numDecimales)),
)
const porcTotal = ref(numeral(props.distribucion.total).format('0.00'))

const procesarPorcentaje = () => {
  props.distribucion.federal =
    100 - (isNumeric(props.distribucion.estatal) ? props.distribucion.estatal : 0)
  emit('distribuirPorcentaje', {
    estatal: props.distribucion.estatal,
    federal: props.distribucion.federal,
    total: props.distribucion.federal + props.distribucion.estatal,
  })
}

const clases = computed(() => {
  if (props.fila == 'total' || props.fila == 'gTotal') {
    return 'has-background-white-ter has-text-weight-medium'
  }
  return props.fila == 'porcentaje'
    ? 'has-background-white-bis has-text-weight-normal'
    : 'has-text-weight-light'
})

const calculoTotal = computed(() => {
  if (props.fila != 'porcentaje') {
    return 0
  }
  return 100
})
</script>
<template>
  <tr v-if="fila != 'porcentaje'" :class="clases">
    <td class="has-text-right">{{ distribucion.leyenda }}</td>
    <td class="has-text-right">{{ monedaFederal }}</td>
    <td class="has-text-right">{{ monedaEstatal }}</td>
    <td class="has-text-right">{{ monedaTotal }}</td>
  </tr>
  <tr v-else :class="clases">
    <td class="has-text-right is-vcentered">{{ distribucion.leyenda }}</td>
    <td class="has-text-right">{{ porcFederal }}%</td>
    <td class="has-text-right">
      <template v-if="estatus == 1">
        <div class="container is-inline-flex">
          <b-field class="is-vcentered">
            <b-numberinput
              min="39.10"
              max="100.00"
              size="is-small"
              controls-position="compact"
              controls-rounded
              v-model="distribucion.estatal"
              step="0.1"
              @input="procesarPorcentaje"
            >
            </b-numberinput>
          </b-field>
          {{ porcEstatal }}%
        </div>
      </template>
      <template v-else> {{ porcEstatal }}% </template>
    </td>
    <td class="has-text-right">
      <template v-if="estatus == 1"> {{ calculoTotal }}% </template>
      <template v-else> {{ porcTotal }}% </template>
    </td>
  </tr>
</template>
