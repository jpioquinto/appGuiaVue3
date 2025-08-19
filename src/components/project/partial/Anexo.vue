<script setup lang="ts">
/*import { computed, ref } from 'vue';

    import { useConfigStore } from '@/stores/config';
    import { useProjectStore } from '@/stores/project';

    const config = useConfigStore();

    const project = useProjectStore();*/

const props = defineProps(['anexo', 'icono', 'estatus'])

const emit = defineEmits(['verAnexo', 'remover'])

const truncate = (value, $length = 14) => {
  return value.length > $length ? value.substr(0, $length) + '...' : value
}

const verAnexo = () => {
  emit('verAnexo', props.anexo.url)
}

const eliminarAnexo = () => {
  emit('remover', {
    vertiente: props.anexo.vertiente,
    idAnexo: props.anexo.id_anexo,
    idActividad: props.anexo.id_actividad,
    idComponente: props.anexo.idComponente,
  })
}
</script>
<template>
  <div class="card">
    <div class="card-content">
      <figure class="image is-32x32">
        <img :src="icono" @click="verAnexo" />
      </figure>
    </div>
    <footer class="card-footer">
      <div class="card-footer-item">
        <a @click="verAnexo" class="is-size-7 has-text-centered">
          {{ truncate(anexo.nombre) }}
        </a>
      </div>
    </footer>
    <div class="buttons is-centered" v-if="estatus == 1">
      <button
        class="button is-small is-danger is-rounded is-size-7"
        data-tooltip="Eliminar anexo"
        @click.prevent="eliminarAnexo"
      >
        <span class="icon is-small">
          <i class="fas fa-trash"></i> </span
        >&nbsp; Eliminar
      </button>
    </div>
  </div>
</template>
