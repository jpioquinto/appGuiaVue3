<script setup lang="ts">
import type { InputNumericProps } from '@/types/partialProps'
import { ref, computed } from 'vue'
import {
  decimales,
  isNumeric,
  isNumericPositive,
  removeFormatNumeric,
  isKeySpecial,
  isKeyCtrl,
} from '@/util'
import numeral from 'numeral'

const props = defineProps<InputNumericProps>()

const emit = defineEmits(['actualizar'])

const $sufijo = props.sufijo || ''

const $prefijo = props.prefijo || ''

const error = ref<boolean>(false)

const $cantidad = ref<string>(props.cantidad.toString())

const $formatoCantidad = computed(() => {
  if (props.formato) {
    return numeral($cantidad.value).format(`${$prefijo}0,0.${decimales(props.numDecimal)}`)
  }
  return $cantidad.value
})

const terminarCaptura = (event: KeyboardEvent) => {
  emit('actualizar', numeral($cantidad.value).value())
}

const entradaNumerica = (event: KeyboardEvent) => {
  if (event.target instanceof HTMLInputElement) {
    if (event.key === 'Enter' || isKeySpecial(event.key) || isKeyCtrl(event)) {
      return
    }
    if (
      event.key !== '.' &&
      (!isNumericPositive(event.key) ||
        !isNumericPositive(removeFormatNumeric($cantidad.value + event.key)))
    ) {
      return event.preventDefault()
    }
    if (event.key === '.' && removeFormatNumeric($cantidad.value).split('').includes('.')) {
      return event.preventDefault()
    }
  }
}

const verificarCapturaNumerica = (event: KeyboardEvent) => {
  let cantidad: number | string = 0
  if (event.target instanceof HTMLInputElement) {
    if (!isNumericPositive((cantidad = removeFormatNumeric($cantidad.value)))) {
      error.value = true
      return true
    }
    if (parseFloat(cantidad) <= 0) {
      error.value = true
      return true
    }
  }
}

const formatearCantidades = (event: Event) => {
  if (event.target instanceof HTMLInputElement) {
    if (isNumeric(removeFormatNumeric($cantidad.value))) {
      $cantidad.value = numeral(removeFormatNumeric($cantidad.value)).format('$0,0.00')
    }
  }
}
</script>
<template>
  <div class="control" v-if="activar">
    <input
      :class="`input ${error ? 'is-danger' : 'is-success'} input-flotante`"
      type="text"
      v-model="$cantidad"
      @keyup.enter.prevent="terminarCaptura"
      @keydown="entradaNumerica"
      @keyup="verificarCapturaNumerica"
      @change="formatearCantidades"
      required
      autofocus
    />
  </div>
  <span v-else>
    {{ $formatoCantidad + '' + $sufijo }}
  </span>
</template>
