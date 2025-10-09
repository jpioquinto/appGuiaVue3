<script lang="ts">
import { ref, reactive } from 'vue'

import type { ComponentesDesarrollo } from '@/types/project'
import VRuntimeTemplate from 'vue3-runtime-template'
import { useProjectStore } from '@/stores/project'
import { useConfigStore } from '@/stores/config'
import Checkbox from './partial/Checkbox.vue'
import { clone } from '@/util'

export default {
  components: {
    'v-runtime-template': VRuntimeTemplate,
    checkbox: Checkbox,
  },

  setup(props) {
    const config = useConfigStore()

    const project = useProjectStore()

    const componentes = reactive<ComponentesDesarrollo>(
      clone(project.estructura.desarrollo.componentes) as ComponentesDesarrollo,
    )

    const meses = ref<number[]>([...project.estructura.programa.meses])

    const homologos = reactive(project.homologos)

    const programa = ref([])

    const indexRow = ref<number>(0)

    return {
      componentes,
      homologos,
      programa,
      indexRow,
      meses,
      project,
      config,
    }
  },

  computed: {
    componente() {
      return this.config.findElementMenu('programa')
    },

    estatus() {
      return this.project.obtenerEstatus
    },

    filas() {
      let trs = '<tbody>'
      this.indexRow = 0
      for (const id in this.programa.value) {
        trs +=
          `<tr><td ` +
          this.generaAtributoRowspan(this.programa.value[id].actividades) +
          ` class='is-vcentered has-background-white-ter'>
                                <p class='has-text-left'>${this.programa.value[id].nombre}</p>
                                </td>`
        trs += this.generaFilas(
          this.programa.value[id].actividades,
          this.programa.value[id].programa,
          id,
          this.programa.value[id].vertiente,
        )
      }
      return trs + '</tbody>'
    },
  },

  methods: {
    agregarColumna() {
      this.meses.push(this.meses.length + 1)
    },

    quitarColumna() {
      this.project.desProgramarTodos(this.meses.pop())
      this.project.actualizarCapturaPrograma()
    },

    agruparActividades(actividades) {
      const listado = {}
      actividades.forEach((value, index) => {
        if (!listado.hasOwnProperty('subcomp_' + value.subcomp)) {
          listado['subcomp_' + value.subcomp] = []
        }
        listado['subcomp_' + value.subcomp].push(value)
      })
      return listado
    },

    agruparActividadesComponente(componentes) {
      const listado = {}
      componentes.forEach((value, index) => {
        listado[value.id] = {
          vertiente: value.vertiente,
          nombre: value.nombre,
          actividades: this.agruparActividades(value.actividades),
          programa: value.programa,
        }
      })
      return listado
    },

    homologarComponentes(componentes) {
      const listado = []
      const integral = []

      componentes.forEach((componente) => {
        listado[componente.id] = componente
      })

      listado.forEach((componente) => {
        if (integral[componente.id]) {
          return true
        }

        const idHomologo = this.obtenerIdHomologo(componente.id)
        if (this.estaHomologado(componente.id) && idHomologo > 0 && integral[idHomologo]) {
          integral[idHomologo].nombre = this.homologos[idHomologo].nombre
          return true
        }

        integral[componente.id] = componente

        if (this.homologos[componente.id] && listado[this.homologos[componente.id].id]) {
          integral[componente.id].actividades = Object.assign(
            integral[componente.id].actividades,
            listado[componente.id].actividades,
          )
        }

        integral[componente.id].actividades = this.agruparActividades(
          integral[componente.id].actividades,
        )
      })

      return integral
    },

    estaHomologado(idComponente) {
      let homologado = false
      for (const idComp in this.homologos) {
        if (this.homologos[idComp].id === idComponente) {
          homologado = true
          break
        }
      }
      return homologado
    },

    obtenerIdHomologo(idComponente) {
      let id = 0
      for (const idComp in this.homologos) {
        if (this.homologos[idComp].id === idComponente) {
          id = idComp
          break
        }
      }
      return id
    },

    generaAtributoRowspan(actividades) {
      if (Object.keys(actividades).length <= 1) {
        return ''
      }
      return "rowspan='" + Object.keys(actividades).length + "'"
    },

    generarColumnasMeses(idComponente, idSubcomp, programados, vertiente) {
      let columnas = ''
      this.meses.forEach((mes, index) => {
        columnas += `<td class="is-vcentered has-text-centered">
                                    <checkbox
                                        mes="${mes < 10 ? '0' + mes.toString() : mes.toString()}"
                                        programados="${programados}"
                                        :idComponente="${idComponente}"
                                        :idSubcomp="${idSubcomp}"
                                        :vertiente="${vertiente}"
                                        :estatus="${this.project.obtenerEstatus}"
                                        :index="${this.indexRow}"
                                    ></checkbox>
                                </td>`
      })
      return columnas
    },

    generaFilas(actividades, programa, idComponente, vertiente) {
      let inicial = true
      let trs = ''
      for (const idSubcomp in actividades) {
        if (!programa.hasOwnProperty(idSubcomp.replace('subcomp_', ''))) {
          programa[idSubcomp.replace('subcomp_', '')] = []
        }
        trs +=
          (inicial ? '' : '<tr>') +
          `<td class='has-background-white-bis'>${actividades[idSubcomp][0].descSubcomp}</td>` +
          this.generarColumnasMeses(
            idComponente,
            idSubcomp.replace('subcomp_', ''),
            programa[idSubcomp.replace('subcomp_', '')],
            vertiente,
          ) +
          `</tr>`
        inicial = false
        this.indexRow++
      }
      return trs
    },
  },

  beforeMount() {
    if (!this.project.desarrollo.inicializado && this.project.id) {
      this.project.obtenerDesarrollo()
    }
  },

  mounted() {
    this.programa.value = this.agruparActividadesComponente(
      this.project.vertiente == 1 ? [...this.componentes.pec] : [...this.componentes.pem],
    ) //console.log(this.programa.value);

    if (this.project.vertiente === '1,2') {
      this.programa.value = this.homologarComponentes([
        ...this.componentes.pec,
        ...this.componentes.pem,
      ])
    }

    this.project.inicializarPrograma()
    this.project.actualizarCapturaPrograma()
  },
}
</script>
<template>
  <div class="content">
    <div class="box">
      <h4>{{ componente?.orden }}.- PROGRAMA DE EJECUCIÓN</h4>
      <div class="table-container contenido-programa">
        <table
          class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth"
          id="tabla_cronograma"
        >
          <thead class="has-background-grey-dark">
            <tr>
              <th class="has-text-centered is-vcentered has-text-white-ter" rowspan="2">
                Componentes
              </th>
              <th class="has-text-centered is-vcentered has-text-white-ter" rowspan="2">
                Actividades a realizar
              </th>
              <th :colspan="meses.length" class="has-text-white-ter">
                <div class="columns is-gapless">
                  <div class="column is-10">
                    <p class="has-text-centered">Meses</p>
                  </div>
                  <div class="column">
                    <div class="buttons is-pulled-right" v-if="estatus == 1">
                      <button
                        class="button is-success is-small is-rounded is-responsive"
                        @click="agregarColumna"
                        :disabled="meses.length >= 18"
                      >
                        <span class="icon is-small">
                          <i class="fa fa-plus"></i>
                        </span>
                      </button>
                      <button
                        class="button is-danger is-small is-rounded is-responsive"
                        @click="quitarColumna"
                        :disabled="meses.length <= 12"
                      >
                        <span class="icon is-small">
                          <i class="fa fa-minus"></i>
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </th>
            </tr>
            <tr>
              <th
                class="has-text-centered has-text-white-ter"
                v-for="(mes, index) in meses"
                :key="index"
              >
                {{ mes }}
              </th>
            </tr>
          </thead>
          <!--tbody v-html="filas"></tbody-->
          <!--VRuntimeTemplate :template="filas" /-->
          <v-runtime-template :template="filas"></v-runtime-template>
        </table>
      </div>
    </div>
  </div>
</template>
