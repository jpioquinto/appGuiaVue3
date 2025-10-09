<script setup lang="ts">
import type { Distribucion } from '@/types/project'
import { ref, computed } from 'vue'
import numeral from 'numeral'

const props = defineProps<{ distribucion: Distribucion }>()

const monedaFederal = computed(() => numeral(props.distribucion.federal).format('$0,0.00'))
const monedaEstatal = computed(() => numeral(props.distribucion.estatal).format('$0,0.00'))
const monedaTotal = computed(() => numeral(props.distribucion.total).format('$0,0.00'))
</script>
<template>
  <tr class="has-background-white-ter-xx has-background-success-light has-text-weight-medium">
    <td class="has-text-right">{{ distribucion.leyenda }}</td>
    <td class="has-text-right">{{ monedaFederal }}</td>
    <td class="has-text-right">{{ monedaEstatal }}</td>
    <td class="has-text-right">{{ monedaTotal }}</td>
  </tr>
</template>
