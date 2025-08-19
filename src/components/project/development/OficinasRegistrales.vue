<script setup lang="ts">
import { ref } from 'vue'
import TablaOficina from '../partial/TablaOficina.vue'

import { useProjectStore } from '@/stores/project'

defineProps(['listado', 'oficinas', 'estatus'])

const project = useProjectStore()

const idOficina = ref(null)

const selectOficina = () => {
  if (idOficina.value == null) {
    return
  }

  project.agregarOficina({ id: idOficina.value, componente_id: 14 })
}
</script>

<template>
  <section class="m-6">
    <h5 class="has-text-weight-bold is-uppercase mb-3">Oficinas Registrales</h5>

    <div class="columns">
      <div class="column is-two-fifths">
        <div
          class="is-flex is-flex-direction-row is-flex-wrap-wrap is-justify-content-flex-start is-align-content-flex-start"
        >
          <div class="field">
            <div class="control is-expanded has-icons-left">
              <div class="select is-fullwidth">
                <select
                  placeholder="Seleccione la oficina"
                  @change="selectOficina"
                  v-model="idOficina"
                >
                  <option
                    v-for="oficina in listado"
                    :value="oficina.detalle_oficinas_id"
                    :key="oficina.detalle_oficinas_id"
                    :disabled="oficina.agregada"
                    v-html="oficina.oficina"
                  ></option>
                </select>
              </div>
              <div class="icon is-small is-left">
                <i class="fa-solid fa-book"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <TablaOficina
      v-for="(oficina, index) in oficinas"
      :key="oficina.id"
      :actualizar="oficina.actualizar"
      :oficina="oficina.acervo"
      :nombre="oficina.nombre"
      :total="oficina.total"
      :estatus="estatus"
      :id="oficina.id"
    />
  </section>
</template>
