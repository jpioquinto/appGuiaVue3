<script setup lang="ts">
import { computed, ref, reactive, onMounted } from 'vue'
import ListadoAnexo from './partial/ListadoAnexo.vue'

import { useConfigStore } from '@/stores/config'
import { useProjectStore } from '@/stores/project'

const config = useConfigStore()

const project = useProjectStore()

const componentes = reactive([
  ...project.desarrollo.componentes.pec,
  ...project.desarrollo.componentes.pem,
])

const icono = ref(project.iconos.pdf)

const listarAnexos = (anexos, vertiente, idComponente) => {
  const listado = []
  anexos.forEach((anexo, index) => {
    anexo['vertiente'] = vertiente
    anexo['idComponente'] = idComponente
    listado.push(anexo)
  })
  return listado
}

const anexos = computed(() => {
  let listado = []
  componentes.forEach((componente) => {
    componente.actividades.forEach((actividad) => {
      listado = [...listado, ...listarAnexos(actividad.anexos, componente.vertiente, componente.id)]
    })
  })
  return listado
})

const componente = computed(() => config.findElementMenu('anexos'))

onMounted(() => project.actualizarEstatusAnexos(true))
</script>
<template>
  <div class="content">
    <div class="box">
      <h4>{{ componente.orden }}.- ANEXOS</h4>
      <div class="card">
        <div class="card-content contenido-anexos">
          <ListadoAnexo :listado="anexos" :icono="icono" />
        </div>
        <footer class="card-footer p-2">
          <p class="has-text-left is-size-7">
            De considerarlo pertinente, podrán incorporarse anexos que considere puedan apoyar la
            revisión y aprobación del Proyecto Ejecutivo de Modernización.
          </p>
        </footer>
      </div>
    </div>
  </div>
</template>
