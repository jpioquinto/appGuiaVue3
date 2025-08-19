<script setup lang="ts">
import { computed, ref, reactive } from 'vue'
import RemoverAnexo from '../actions/RemoverAnexo.vue'
import shortid from 'shortid'

const props = defineProps([
  'anio',
  'anexos',
  'componente_id',
  'vertiente',
  'actividad_id',
  'estatus',
  'nombre',
  'numActividad',
  'activa',
])

const emit = defineEmits(['agregarAnexo'])

const copiaAnexos = reactive([...props.anexos]) //clone(props.anexos);

const archivo = ref(null)

const cargando = ref(false)

const porcentaje = ref(0)

const cargados = ref(0)

const total = ref(0)

const aceptar = () => {
  emit('agregarAnexo', copiaAnexos)
}

const removerAnexo = ($idAnexo) => {
  const index = copiaAnexos.findIndex((anexo) => anexo.id_anexo == $idAnexo)
  index != -1 ? copiaAnexos.splice(index, 1) : undefined
}

const preCargarAnexo = ($event) => {
  //let archivos = $event.target.files;
  total.value = $event.target.files.length
  porcentaje.value = 0

  for (cargados.value = 0; cargados.value < total.value; cargados.value++) {
    archivo.value = $event.target.files[cargados.value]

    const reader = new FileReader()
    reader.onerror = errorHandler
    reader.onprogress = updateProgress
    reader.onabort = onAbort
    reader.onloadstart = onLoadStart
    reader.onload = ((archivo) => {
      return (e) => {
        onLoad(archivo)
      }
    })(archivo.value)
    reader.readAsBinaryString(archivo.value)
  }
}

const onLoadStart = (evt) => {
  if (!cargando.value) {
    cargando.value = true
  }
}

const onLoad = (archivo) => {
  copiaAnexos.push({
    ext: obtenerExtension(archivo.name),
    nombre_anterior: archivo.name,
    id_actividad: props.actividad_id,
    id_anexo: shortid.generate(),
    nombre: archivo.name,
    archivo: archivo,
    descripcion: generarDescripcion() + ' - ' + archivo.name,
    url: '',
  })
  if (total.value == 0 || cargados.value != total.value) {
    return
  }
  porcentaje.value = 100
  setTimeout(() => {
    cargando.value = false
  }, 2000)
}

const onAbort = (evt) => {
  alert('File read cancelled')
  cargando.value = false
  porcentaje.value = 0
}

const errorHandler = (evt) => {
  switch (evt.target.error.code) {
    case evt.target.error.NOT_FOUND_ERR:
      alert('File Not Found!')
      break
    case evt.target.error.NOT_READABLE_ERR:
      alert('File is not readable')
      break
    case evt.target.error.ABORT_ERR:
      break // noop
    default:
      alert('An error occurred reading this file.')
  }
}

const updateProgress = (evt) => {
  if (!evt.lengthComputable) {
    return
  }
  porcentaje.value =
    total.value > 1
      ? calcularPorcentaje(evt.loaded, evt.total)
      : obtenerPorcentaje(evt.loaded, evt.total)
}

const obtenerPorcentaje = (cargado, total) => {
  const $porcentaje = Math.round((cargado / total) * 100)
  return $porcentaje <= 100 ? $porcentaje : porcentaje.value
}

const calcularPorcentaje = (cargado, total) => {
  const proporcion = obtenerProporcionPorcentaje()
  const $porcentaje = Math.round((cargado / total) * 100)
  if (!isNumeric(proporcion) || proporcion == 0) {
    return 0
  }
  if ($porcentaje < 100) {
    return (porcentaje.value += Math.round(($porcentaje / proporcion) * 100))
  }
  return (porcentaje.value += proporcion)
}

const obtenerProporcionPorcentaje = () => {
  return isNumeric(total.value) && total.value > 0 ? Math.round(100 / total.value) : 0
}

const obtenerExtension = (nombre) => {
  const cadenas = nombre.toString().split('.')
  return cadenas[cadenas.length - 1].replace(/^\s+/g, '').replace(/\s+$/g, '')
}

const generarDescripcion = () => {
  return props.nombre + ' ' + props.anio + ' Actividad #' + props.numActividad
}
</script>

<template>
  <div class="modal" :class="{ 'is-active': props.activa }">
    <div class="modal-background"></div>
    <div class="modal-content">
      <div class="box">
        <div class="file is-centered is-boxed is-info">
          <label class="file-label">
            <input
              class="file-input"
              type="file"
              name="anexo"
              multiple
              @change.preventDefault="preCargarAnexo"
            />
            <span class="file-cta">
              <span class="file-icon">
                <i class="fas fa-upload"></i>
              </span>
              <span class="file-label"> Buscar archivo... </span>
            </span>
          </label>
        </div>
        <progress v-if="cargando" class="progress is-success" :value="porcentaje" max="100">
          {{ porcentaje }}%
        </progress>
        <hr />
        <h6 class="title is-6" v-if="copiaAnexos.length > 0">Listado de anexos</h6>
        <div class="columns" v-for="(anexo, index) in copiaAnexos" :key="anexo.id_anexo">
          <div class="column is-full">
            <div class="field">
              <div class="is-flex is-justify-content-space-between">
                <label class="is-underlined"> {{ index + 1 + '. ' + anexo.nombre }}</label>
                <template v-if="estatus == 1">
                  <RemoverAnexo :idAnexo="anexo.id_anexo" @remover="removerAnexo" />
                </template>
              </div>
              <div class="control">
                <input
                  class="input is-info"
                  type="text"
                  v-model="anexo.descripcion"
                  placeholder="Descripción..."
                />
              </div>
            </div>
          </div>
        </div>
        <footer class="container mt-5">
          <div class="is-flex is-flex-wrap-wrap is-justify-content-center">
            <button class="button is-success" @click.preventDefault="aceptar">Aceptar</button>
            <button class="button ml-3" @click.preventDefault="$emit('cerrarModalAnexo')">
              Cancelar
            </button>
          </div>
        </footer>
      </div>
    </div>
  </div>
</template>
