<script setup lang="ts">
import { ref, computed } from 'vue'
const props = defineProps(['cantidad', 'numDecimal', 'activar', 'prefijo', 'sufijo', 'formato'])

const emit = defineEmits(['actualizar'])

const $sufijo = props.sufijo || ''

const $prefijo = props.prefijo || ''

const $cantidad = ref(props.cantidad)

const $formatoCantidad = computed(() => {
  if (props.formato) {
    return numeral($cantidad.value).format(`${$prefijo}0,0.${decimales(props.numDecimal)}`)
  }
  return $cantidad.value
})

const terminarCaptura = (event) => {
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
