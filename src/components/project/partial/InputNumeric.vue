<script setup lang="ts">
import type { InputNumericProps } from '@/types/partialProps'
import { ref, computed } from 'vue'
import { decimales } from '@/util'
import numeral from 'numeral'

const props = defineProps<InputNumericProps>()

const emit = defineEmits(['actualizar'])

const $sufijo = props.sufijo || ''

const $prefijo = props.prefijo || ''

const $cantidad = ref<number>(props.cantidad)

const $formatoCantidad = computed(() => {
  if (props.formato) {
    return numeral($cantidad.value).format(`${$prefijo}0,0.${decimales(props.numDecimal)}`)
  }
  return $cantidad.value
})

const terminarCaptura = (event: KeyboardEvent) => {
  emit('actualizar', $cantidad.value)
}
</script>
<template>
  <div class="control" v-if="activar">
    <input
      class="input is-success input-flotante"
      type="number"
      v-model="$cantidad"
      @keyup.enter.prevent="terminarCaptura"
      required
      autofocus
    />
  </div>
  <span v-else>
    {{ $formatoCantidad + '' + $sufijo }}
  </span>
</template>
