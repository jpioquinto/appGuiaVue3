<script setup lang="ts">
import { useProjectStore } from '@/stores/project'

const props = defineProps(['nombre', 'oficina', 'total', 'id', 'actualizar', 'estatus'])

const project = useProjectStore()

const cantidad = ($cantidad) => {
  if (!isNumeric($cantidad)) {
    return
  }
  return numeral($cantidad).format('0,0')
}

const quitarTabla = () => {
  project.removerOficina({ id: props.id, componente_id: 14 })
}
</script>
<template>
  <div class="table-container">
    <table class="table is-bordered table is-striped table is-hoverable is-fullwidth11">
      <thead
        :class="
          actualizar && estatus == 1 ? 'has-background-danger-dark' : 'has-background-grey-dark'
        "
      >
        <tr>
          <th colspan="6" class="has-text-centered is-vcentered has-text-white-ter">
            <div class="is-inline-flex">
              <p v-html="nombre"></p>
            </div>
            <div class="buttons is-pulled-right" v-if="estatus == 1">
              <!--b-tooltip label="Quitar oficina registral" position="is-left"-->
              <button
                class="button is-danger is-small is-rounded is-responsive"
                @click="quitarTabla"
              >
                <span class="icon is-small">
                  <i class="fa fa-xmark"></i>
                </span>
              </button>
              <!--/b-tooltip-->
            </div>
          </th>
        </tr>
        <tr>
          <th rowspan="2" class="has-text-centered is-vcentered has-text-white-ter">
            Oficina registral
          </th>
          <th rowspan="2" class="has-text-centered is-vcentered has-text-white-ter">
            Acervo existente
          </th>
          <th rowspan="2" class="has-text-centered is-vcentered has-text-white-ter">
            Acervo digitalizado
          </th>
          <th rowspan="2" class="has-text-centered is-vcentered has-text-white-ter">
            Porcentaje de digitalización
          </th>
          <th colspan="2" class="has-text-centered is-vcentered has-text-white-ter">
            Pendiente de digitalizar
          </th>
        </tr>
        <tr>
          <th class="has-text-centered is-vcentered has-text-white-ter">Libros / Legajos</th>
          <th class="has-text-centered is-vcentered has-text-white-ter">Número de imágenes</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="acervo in oficina" :key="acervo.id_oficina_reg">
          <td v-text="acervo.concepto"></td>
          <td class="has-text-centered is-vcentered">{{ cantidad(acervo.acervo_existe) }}</td>
          <td class="has-text-centered is-vcentered">{{ cantidad(acervo.acervo_digitalizado) }}</td>
          <td class="has-text-centered is-vcentered">{{ acervo.porc_digitalizado }}%</td>
          <td class="has-text-centered is-vcentered">{{ cantidad(acervo.libros_legajos) }}</td>
          <td class="has-text-centered is-vcentered">{{ cantidad(acervo.num_imagenes) }}</td>
        </tr>
      </tbody>
      <tfoot>
        <tr class="has-background-white-ter has-text-weight-medium">
          <td class="is-vcentered" v-text="total.concepto"></td>
          <td class="has-text-centered is-vcentered">{{ cantidad(total.existente) }}</td>
          <td class="has-text-centered is-vcentered">{{ cantidad(total.digitalizado) }}</td>
          <td class="has-text-centered is-vcentered"></td>
          <td class="has-text-centered is-vcentered">{{ cantidad(total.librosLegajos) }}</td>
          <td class="has-text-centered is-vcentered">{{ cantidad(total.numImagenes) }}</td>
        </tr>
      </tfoot>
    </table>
    <p class="has-text-right has-text-danger-dark is-size-7" v-if="estatus == 1 && actualizar">
      <strong class="has-text-danger-dark">¡Advertencia! </strong>El diagnóstico fue actualizado, si
      la información para esta oficina no coincide, elimínela.
    </p>
  </div>
</template>
