<script setup lang="ts">
import ModalVerDoc from './ModalVerDoc.vue'
import { computed, ref } from 'vue'
import Anexo from './Anexo.vue'

//import { useConfigStore } from '@/stores/config';
import type { RemoveAnexo } from '@/types/component'
import { useProjectStore } from '@/stores/project/project'
import type { Anexos } from '@/types/activity'

//const config = useConfigStore();

const project = useProjectStore()

const props = defineProps<{ listado: Anexos; icono: string }>()

const mostrarAnexo = ref<boolean>(false)

const url = ref<string>('')

const estatus = computed(() => project.obtenerEstatus)

const verAnexo = ($url: string) => {
  url.value = $url
  mostrarAnexo.value = true
}

const cerrarModalAnexo = () => {
  mostrarAnexo.value = false
}

const removerAnexo = (data: RemoveAnexo) => {
  project.eliminarAnexo(data)
}
</script>
<template>
  <div class="columns is-multiline is-mobile">
    <div class="column is-narrow" v-for="(anexo, index) in listado" :key="index">
      <Anexo
        :key="anexo.id_anexo"
        :anexo="anexo"
        :icono="icono"
        :estatus="estatus"
        @verAnexo="verAnexo"
        @remover="removerAnexo"
      />
    </div>
  </div>
  <div class="container" v-if="mostrarAnexo === true">
    <ModalVerDoc :activa="mostrarAnexo" :url="url" @cerrar="cerrarModalAnexo" />
  </div>
</template>
