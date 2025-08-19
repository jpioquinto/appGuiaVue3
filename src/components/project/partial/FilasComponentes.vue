<script setup lang="ts">
const props = defineProps(['componente'])
</script>
<template>
  <tr>
    <td>{{ componente.nombre }}</td>
    <td class="has-text-right">{{ componente.aporteFederal }}</td>
    <td class="has-text-right">{{ componente.aporteEstatal }}</td>
    <td class="has-text-right">{{ componente.total }}</td>
  </tr>
</template>
