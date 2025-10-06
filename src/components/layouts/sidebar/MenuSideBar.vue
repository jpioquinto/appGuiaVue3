<script setup lang="ts">
import type { Step, Steps } from '@/types/config'
import MenuItem from './MenuItem.vue'
import { useProjectStore } from '@/stores/project'

const props = defineProps<{ elementos: Steps }>()

const project = useProjectStore()

const seleccionarElemento = ($elemento: Step) => {
  props.elementos.map((elemento) => {
    elemento.seleccionado = elemento.id_punto === $elemento.id_punto
    return elemento
  })

  project.seleccionarElemento(props.elementos || [])
}
</script>
<template>
  <div class="column is-2">
    <aside class="menu">
      <p class="menu-label">
        <slot name="titulo"></slot>
      </p>
      <ul class="menu-list block-list is-small">
        <MenuItem
          v-for="elemento in elementos"
          :key="elemento.id_punto"
          :elemento="elemento"
          @seleccionar="seleccionarElemento"
        />
      </ul>
    </aside>
  </div>
</template>
