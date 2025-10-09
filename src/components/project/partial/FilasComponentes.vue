<script setup lang="ts">
import type { CatComponent } from '@/types/component'

defineProps<{ componente: CatComponent }>()
</script>
<template>
  <tr>
    <td>{{ componente.nombre }}</td>
    <td class="has-text-right">{{ componente.aporteFederal }}</td>
    <td class="has-text-right">{{ componente.aporteEstatal }}</td>
    <td class="has-text-right">{{ componente.total }}</td>
  </tr>
</template>
