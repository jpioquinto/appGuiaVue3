<script setup lang="ts">
import { computed, ref } from 'vue'
import Anexo from './Anexo.vue'
import ModalVerDoc from './ModalVerDoc.vue'

//import { useConfigStore } from '@/stores/config';
import { useProjectStore } from '@/stores/project'

//const config = useConfigStore();

const project = useProjectStore()

const props = defineProps(['listado', 'icono'])

const mostrarAnexo = ref(false)

const url = ref('')

const estatus = computed(() => project.obtenerEstatus)

const verAnexo = ($url) => {
  url.value = $url
  mostrarAnexo.value = true
}

const cerrarModalAnexo = () => {
  mostrarAnexo.value = false
}

const removerAnexo = (data) => {
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
