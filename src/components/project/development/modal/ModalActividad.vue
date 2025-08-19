<script setup lang="ts">
import { computed, ref, reactive, onBeforeMount, onMounted } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, requiredIf, minValue, minLength } from '@vuelidate/validators'
import { notify } from '@kyvg/vue3-notification'
import shortid from 'shortid'

import { useConfigStore } from '@/stores/config'
import { useProjectStore } from '@/stores/project'

const props = defineProps(['componente_id', 'vertiente', '_actividad', 'agregar', 'activa'])

const config = useConfigStore()

const project = useProjectStore()

const emit = defineEmits(['cerrar'])

const subComponentes = ref([])
const actividades = ref([])
const subActividades = ref([])
const catalogoSubActividades = ref({})
const entregables = ref([])
const unidades = ref([])
const municipios = ref([])

const checkboxTodos = ref(false)
const submit = ref(false)
const error = reactive({ cantidad: null, costo: null })

const actividad = reactive(
  props.agregar
    ? {
        anexos: [],
        id: shortid.generate(),
        descSubcomp: null,
        descAct: null,
        descSubAct: null,
        descEntregable: null,
        descUnidad: null,
        subcomp: 0,
        act: 0,
        subact: null,
        desc: '',
        entregable: 0,
        unidad: 0,
        munpios: [],
        cantidad: 1,
        costo: 0,
        iva: 0,
        total: 0,
        conIVA: true,
        tipoRecurso: 1,
        toggleText: true,
        placeHolderDescAct: '',
        placeHolderDesc: '',
        placeHolderEnt: '',
      }
    : clone(props._actividad),
)

const $iva = 1 + project.obtenerIVA / 100

const mascara = reactive({
  cantidad: 1,
  costo: 0,
  iva: 0,
})

const rules = computed(() => ({
  subcomp: {
    required,
    minValue: minValue(1),
  },
  act: {
    required,
    minValue: minValue(1),
  },
  subact: {
    required: requiredIf(function (subactModel) {
      return subActividades.value.length > 0 && subactModel.subact == null
    }),
  },
  entregable: {
    required,
    minValue: minValue(1),
  },
  unidad: {
    required,
    minValue: minValue(1),
  },
  munpios: {
    required,
  },
  desc: {
    required,
    minLength: minLength(20),
  },
}))

const v$ = useVuelidate(rules, actividad)

const errorCantidad = computed(() => (error.cantidad ? 'is-danger' : undefined))

const errorCosto = computed(() => (error.costo ? 'is-danger' : undefined))

const recursoProyecto = ref(actividad.tipoRecurso == 1)

const recursoPropio = ref(actividad.tipoRecurso == 2)

const seleccionSubcomponente = () => {
  const subcomponente = subComponentes.value.filter(
    (subcomponente) => subcomponente.id_subcomponente === actividad.subcomp,
  )
  if (subcomponente.length > 0) {
    actividades.value = subcomponente[0].hasOwnProperty('actividades')
      ? subcomponente[0].actividades
      : []
    actividades.value.length > 0 ? seleccionActividad() : undefined
  }
}

const seleccionActividad = () => {
  if (!isInteger(actividad.act)) {
    return
  }
  if (!catalogoSubActividades.value.hasOwnProperty(actividad.act)) {
    project.obtenerSubActividades(actividad.act).then((response) => {
      subActividades.value = catalogoSubActividades.value[actividad.act] = response.data
    })
  } else {
    subActividades.value = catalogoSubActividades.value[actividad.act]
  }
}

const toggleTodosMunpios = () => {
  checkboxTodos.value = !checkboxTodos.value
  if (checkboxTodos.value) {
    municipios.value.forEach((value, index) => {
      actividad.munpios.push(value.municipio_id)
    })
  } else {
    actividad.munpios = []
  }
}

const selectMunicipio = () => {
  if (municipios.value.length == 0) {
    return (checkboxTodos.value = false)
  }
  if (municipios.value.length == actividad.munpios.length) {
    checkboxTodos.value = true
  } else {
    checkboxTodos.value = false
  }
}

const switchIVA = (event) => {
  calcularIVA()
}

const tipoRecurso = (value) => {
  actividad.tipoRecurso = parseInt(value)
  recursoProyecto.value = parseInt(value) == 1
  recursoPropio.value = parseInt(value) == 2
}

const entradaNumerica = (event) => {
  const keynum = window.event ? window.event.keyCode : event.which

  if (
    (keynum == 8 || keynum == 46) &&
    isNumericPositive(quitarFormatoNumerico(mascara[event.target.name]))
  ) {
    return true
  }
  return isNumericPositive(String.fromCharCode(keynum)) ? true : event.preventDefault()
}

const verificarCapturaNumerica = (event) => {
  let cantidad = 0
  if (!isNumericPositive((cantidad = quitarFormatoNumerico(mascara[event.target.name])))) {
    mascara.iva = 0
    error[event.target.name] = event.target.name
    return true
  }
  if (
    (event.target.name == 'cantidad' && parseFloat(cantidad) <= 0) ||
    (event.target.name == 'costo' && parseFloat(cantidad) < 0)
  ) {
    mascara.iva = 0
    error[event.target.name] = event.target.name
    return true
  }
  error[event.target.name] = null
  calcularIVA()
}

const formatearCantidades = (event) => {
  if (
    event.target.name == 'cantidad' &&
    isNumeric(quitarFormatoNumerico(mascara[event.target.name]))
  ) {
    mascara[event.target.name] = numeral(quitarFormatoNumerico(mascara[event.target.name])).format(
      '0,0.00',
    )
  }
  if (
    event.target.name == 'costo' &&
    isNumeric(quitarFormatoNumerico(mascara[event.target.name]))
  ) {
    mascara[event.target.name] = numeral(quitarFormatoNumerico(mascara[event.target.name])).format(
      '$0,0.00',
    )
  }
}

const calcularIVA = () => {
  actividad.cantidad = convertirAdecimal(quitarFormatoNumerico(mascara.cantidad))
  actividad.costo = convertirAdecimal(quitarFormatoNumerico(mascara.costo))

  !actividad.conIVA
    ? conIVA(actividad.cantidad, actividad.costo)
    : sinIVA(actividad.cantidad, actividad.costo)
}

const sinIVA = (cantidad, costoUnitario) => {
  mascara.iva = numeral(cantidad * costoUnitario * 0.16).format('$0,0.00')
  actividad.iva = parseFloat(quitarFormatoNumerico(mascara.iva))
  actividad.total = convertirAdecimal(cantidad * costoUnitario + actividad.iva)
}

const conIVA = (cantidad, costoUnitario) => {
  actividad.total = cantidad * costoUnitario
  actividad.iva = actividad.total - actividad.total / $iva
  mascara.iva = numeral(actividad.iva).format('$0,0.00')
}

const convertirAdecimal = (cantidad) => {
  if (isNumeric(cantidad)) {
    return parseFloat(numeral(cantidad).format('0.00'))
  }
  return 0
}

const guardarActividad = () => {
  submit.value = true
  v$.value.$touch()
  if (v$.value.$invalid) {
    return
  }
  const subcomp = subComponentes.value.find(
    (subcomp) => subcomp.id_subcomponente == actividad.subcomp,
  )
  actividad.descSubcomp = Object.keys(subcomp).length > 0 ? subcomp.subcomponente : null

  const $actividad = actividades.value.find(
    ($actividad) => $actividad.id_actividad == actividad.act,
  )
  actividad.descAct = Object.keys($actividad).length > 0 ? $actividad.actividad : null

  const subactividad = subActividades.value.find(
    (subactividad) => subactividad.id_subactividad == actividad.subact,
  )
  actividad.descSubAct =
    subactividad && Object.keys(subactividad).length > 0 ? subactividad.subactividad : null

  const entregable = entregables.value.find(
    ($entregable) => $entregable.id_entregable == actividad.entregable,
  )
  actividad.descEntregable = Object.keys(entregable).length > 0 ? entregable.entregable : null

  const unidad = unidades.value.find((unidad) => unidad.id_unidad == actividad.unidad)
  actividad.descUnidad = Object.keys(unidad).length > 0 ? unidad.unidad : null

  props.agregar
    ? project.agregarActividadComponente({
        vertiente: props.vertiente,
        actividad: actividad,
        id: props.componente_id,
      })
    : project.editarActividadComponente({
        vertiente: props.vertiente,
        actividad: actividad,
        id: props.componente_id,
      })

  props.agregar ? project.actualizarEstatusCaptura() : undefined

  emit('cerrar', actividad)
}

onBeforeMount(() => {
  unidades.value = project.obtenerUnidades
  if (unidades.value.length == 0) {
    project.obtenUnidades().then((response) => {
      unidades.value = response
    })
  }
  municipios.value = project.obtenerMunicipios
  if (municipios.value.length == 0) {
    project.obtenMunicipios().then((response) => {
      municipios.value = response
    })
  }
  if ((subComponentes.value = project.obtenerSubcomponente(props.componente_id)) == null) {
    project.obtenSubcomponente(props.componente_id).then((response) => {
      subComponentes.value = response.hasOwnProperty(props.componente_id)
        ? response[props.componente_id]
        : subComponentes.value
      !props.agregar ? seleccionSubcomponente() : undefined
    })
  }

  if ((entregables.value = project.obtenerEntregables(props.componente_id)) == null) {
    project.obtenEntregables(props.componente_id).then((response) => {
      entregables.value = response.hasOwnProperty(props.componente_id)
        ? response[props.componente_id]
        : entregables.value
    })
    return
  }
})

onMounted(() => {
  if (!props.agregar) {
    mascara.cantidad = numeral(actividad.cantidad).format('0,0.00')
    mascara.costo = numeral(actividad.costo).format('$0,0.00')
    mascara.iva = numeral(actividad.iva).format('$0,0.00')
    subComponentes.value != null ? seleccionSubcomponente() : undefined
    actividades.value.length > 0 ? seleccionActividad() : undefined

    selectMunicipio()
  }
})
</script>

<template>
  <div class="modal" :class="{ 'is-active': props.activa }">
    <div class="modal-background"></div>
    <div class="modal-content">
      <div class="box">
        <div class="field">
          <label class="label has-text-weight-bold">Subcomponente:</label>
          <div class="control is-expanded">
            <div class="select is-fullwidth" :class="{ 'is-danger': v$.subcomp.$error }">
              <select
                v-model="actividad.subcomp"
                placeholder="Seleccione el subcomponente"
                @change="seleccionSubcomponente"
              >
                <option
                  v-for="subcomponente in subComponentes"
                  :value="subcomponente.id_subcomponente"
                  :key="subcomponente.id_subcomponente"
                >
                  {{ subcomponente.subcomponente }}
                </option>
              </select>
            </div>
          </div>
          <p class="help is-danger" :class="{ 'is-hidden': !v$.subcomp.$error }">
            Debe elegir el subcomponente.
          </p>
        </div>
        <div class="field">
          <label class="label has-text-weight-bold">Actividad:</label>
          <div class="control is-expanded">
            <div class="select is-fullwidth" :class="{ 'is-danger': v$.act.$error }">
              <select
                v-model="actividad.act"
                placeholder="Seleccione la actividad"
                @change="seleccionActividad"
                :disabled="actividades && actividades.length == 0 ? true : false"
              >
                <option
                  v-for="actividad in actividades"
                  :value="actividad.id_actividad"
                  :key="actividad.id_actividad"
                >
                  {{ actividad.actividad }}
                </option>
              </select>
            </div>
          </div>
          <p class="help is-danger" :class="{ 'is-hidden': !v$.act.$error }">
            Debe elegir la actividad.
          </p>
        </div>
        <div class="field">
          <label class="label has-text-weight-bold">Sub-Actividad:</label>
          <div class="control is-expanded">
            <div class="select is-fullwidth" :class="{ 'is-danger': v$.subact.$error }">
              <select
                v-model="actividad.subact"
                :disabled="subActividades && subActividades.length == 0 ? true : false"
              >
                <option
                  v-for="subActividad in subActividades"
                  :value="subActividad.id_subactividad"
                  :key="subActividad.id_subactividad"
                >
                  {{ subActividad.subactividad }}
                </option>
              </select>
            </div>
          </div>
          <p class="help is-danger" :class="{ 'is-hidden': !v$.subact.$error }">
            Debe elegir la subactividad.
          </p>
        </div>
        <div class="field">
          <label class="label has-text-weight-bold">Descripción:</label>
          <div class="control">
            <textarea class="textarea" v-model="actividad.desc"></textarea>
          </div>
          <p class="help is-danger" :class="{ 'is-hidden': !v$.desc.$error }">
            Ingrese una descripción válida.
          </p>
        </div>
        <div class="field">
          <label class="label has-text-weight-bold">Entregable:</label>
          <div class="control is-expanded">
            <div class="select is-fullwidth" :class="{ 'is-danger': v$.entregable.$error }">
              <select
                v-model="actividad.entregable"
                placeholder="Seleccione el entregable"
                :disabled="entregables && entregables.length == 0 ? true : false"
              >
                <option
                  v-for="entregable in entregables"
                  :value="entregable.id_entregable"
                  :key="entregable.id_entregable"
                >
                  {{ entregable.entregable }}
                </option>
              </select>
            </div>
          </div>
          <p class="help is-danger" :class="{ 'is-hidden': !v$.entregable.$error }">
            Debe elegir el entregable.
          </p>
        </div>
        <div class="columns">
          <div class="column">
            <div class="columns is-mobile is-desktop">
              <div class="column is-three-fifths">
                <p>Municipios a aplicar:</p>
              </div>
              <div class="column">
                <div class="field">
                  <input
                    id="checkboxTodos"
                    class="is-checkradio"
                    type="checkbox"
                    v-model="checkboxTodos"
                    @click="toggleTodosMunpios"
                  />
                  <label for="checkboxTodos">Todos</label>
                </div>
              </div>
            </div>
            <div class="field">
              <div class="control is-expanded">
                <div
                  class="select is-multiple is-fullwidth"
                  :class="{ 'is-danger': v$.munpios.$error }"
                >
                  <select v-model="actividad.munpios" @change="selectMunicipio" size="9" multiple>
                    <option
                      v-for="municipio in municipios"
                      :value="municipio.municipio_id"
                      :key="municipio.municipio_id"
                    >
                      {{ municipio.municipio }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div class="column">
            <div class="field">
              <label class="label has-text-weight-bold">Unidad de Medida:</label>
              <div class="control is-expanded">
                <div class="select is-fullwidth" :class="{ 'is-danger': v$.unidad.$error }">
                  <select
                    v-model="actividad.unidad"
                    placeholder="Seleccione la unidad"
                    :disabled="unidades.length == 0 ? true : false"
                  >
                    <option
                      v-for="unidad in unidades"
                      :value="unidad.id_unidad"
                      :key="unidad.id_unidad"
                    >
                      {{ unidad.unidad }}
                    </option>
                  </select>
                </div>
              </div>
              <p class="help is-danger" :class="{ 'is-hidden': !v$.unidad.$error }">
                Debe elegir la unidad.
              </p>
            </div>
            <div class="field">
              <label class="label has-text-weight-bold">Cantidad:</label>
              <div class="control">
                <input
                  class="input"
                  :class="{ 'is-danger': errorCantidad }"
                  type="text"
                  v-model="mascara.cantidad"
                  name="cantidad"
                  @keypress="entradaNumerica"
                  @keyup="verificarCapturaNumerica"
                  @change="formatearCantidades"
                />
              </div>
              <p class="help is-danger" :class="{ 'is-hidden': !errorCantidad }">
                Ingrese una cantidad numérica válida.
              </p>
            </div>
            <div class="field">
              <label class="label has-text-weight-bold">Costo Unitario:</label>
              <div class="control">
                <input
                  class="input"
                  :class="{ 'is-danger': errorCosto }"
                  type="text"
                  v-model="mascara.costo"
                  name="costo"
                  @keypress="entradaNumerica"
                  @keyup="verificarCapturaNumerica"
                  @change="formatearCantidades"
                />
              </div>
              <p class="help is-danger" :class="{ 'is-hidden': !errorCosto }">
                Se requiere un monto numérico válido.
              </p>
            </div>
            <div class="field">
              <input
                id="conIVA"
                type="checkbox"
                name="conIVA"
                class="switch is-small is-rounded is-success"
                v-model="actividad.conIVA"
                @click.preventDefault="switchIVA"
              />
              <label for="conIVA" class="has-text-primary-dark">{{
                actividad.conIVA ? 'Costo Con IVA incluído' : 'Costo Sin IVA incluído'
              }}</label>
            </div>
            <div class="field" v-if="project.obtenerAnio <= 2023">
              <label class="label has-text-weight-bold">IVA:</label>
              <div class="control">
                <input class="input" type="text" v-model="mascara.iva" name="iva" readonly />
              </div>
            </div>
          </div>
        </div>
        <div class="container is-fullhd">
          <div class="field">
            <input
              class="is-checkradio"
              id="recursoProyecto"
              type="radio"
              v-model="recursoProyecto"
              @click.preventDefault="(e) => tipoRecurso(1)"
              name="tiporecurso"
              value="1"
              :checked="recursoProyecto"
            />
            <label for="recursoProyecto">Actividad con recurso del proyecto</label>
            <input
              class="is-checkradio"
              id="recursoPropio"
              type="radio"
              v-model="recursoPropio"
              @click.preventDefault="(e) => tipoRecurso(2)"
              name="tiporecurso"
              value="2"
              :checked="recursoPropio"
            />
            <label for="recursoPropio">Actividad con recurso propio</label>
          </div>
        </div>
        <footer class="container mt-5">
          <button class="button is-success" @click="guardarActividad">Aceptar</button>
          <button class="button ml-1" @click="$emit('cerrar')">Cancelar</button>
        </footer>
      </div>
    </div>
  </div>
</template>
