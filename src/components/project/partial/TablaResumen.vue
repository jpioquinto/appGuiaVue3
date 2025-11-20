<script lang="ts">
import { ref, reactive, defineComponent, type PropType } from 'vue'
import { useConfigStore } from '@/stores/config'
import { useProjectStore } from '@/stores/project/project'

import TablaAportaciones from './TablaAportaciones.vue'
import FilasComponentes from './FilasComponentes.vue'
import FilasTotalesV1 from './FilasTotalesV1.vue'
import FilasTotalesV2 from './FilasTotalesV2.vue'
import FilaTotal from './FilaTotal.vue'
import { decimales } from '@/util'
import numeral from 'numeral'

import type { Distribucion, FilasDistribucion, Resumen, StateProject } from '@/types/project'
import type { CatComponents } from '@/types/component'
import { keyof } from 'zod'

export default defineComponent({
  props: {
    estatus: {
      type: Number as PropType<StateProject['estatus']>,
      required: true,
    },
    anio: {
      type: Number as PropType<StateProject['anio']>,
      required: true,
    },
    componentes: {
      type: Array as PropType<CatComponents>,
      required: true,
    },
  },
  components: {
    TablaAportaciones: TablaAportaciones,
    FilasComponentes: FilasComponentes,
    FilasTotalesV1: FilasTotalesV1,
    FilasTotalesV2: FilasTotalesV2,
    FilaTotal: FilaTotal,
  },
  setup(props) {
    const config = useConfigStore()

    const project = useProjectStore()

    return {
      aportaciones: reactive<FilasDistribucion>(project.obtenerDistribucion),
      calculado: ref<boolean>(project.estructura.resumen.calculado),
      porcDecimales: ref<number>(project.anio === 2020 ? 2 : 8),
      resetAportacion: ref<boolean>(false),
      project,
      config,
    }
  },
  computed: {
    tFootTotales(): string {
      if (this.anio! < 2018) {
        return 'FilasTotalesV1'
      }
      return this.anio! >= 2021 ? 'FilaTotal' : 'FilasTotalesV2'
    },
    leyenda(): string {
      return this.anio! < 2018 ? 'porcentaje' : 'monto'
    },
  },
  methods: {
    distribuirPorcentaje(porcentajes: any) {
      this.$emit('actualizar', porcentajes)
    },
    calcularAportaciones(componentes: CatComponents): FilasDistribucion {
      const recurso = this.project.obtenerDistribucion
      componentes.forEach((componente) => {
        if (!recurso.total.estatal) {
          recurso.total.estatal = 0
        }

        recurso.total.federal += numeral(componente?.aporteFederal).value() || 0

        recurso.total.estatal += numeral(componente?.aporteEstatal).value() || 0

        recurso.total.total += numeral(componente?.total).value() || 0
      })
      recurso.millar.federal = recurso.millar.total =
        !this.project.estructura.resumen.millar || this.project.estructura.resumen.millar === 0
          ? numeral(
              numeral(
                this.calcularFiscalizacion(recurso.total.federal, recurso.total.federal / 1000),
              ).format('0.00'),
            ).value()!
          : this.project.estructura.resumen.millar

      recurso.total.federal = numeral(numeral(recurso.total.federal).format('0.00')).value()!
      recurso.total.estatal = numeral(numeral(recurso.total.estatal).format('0.00')).value()
      recurso.total.total = numeral(numeral(recurso.total.total).format('0.00')).value()!

      recurso.gTotal.federal = recurso.total.federal + recurso.millar.federal
      recurso.gTotal.estatal = recurso.total.estatal
      recurso.gTotal.total = recurso.total.federal + recurso.millar.federal + recurso.total.estatal!

      recurso.gTotal.federal = numeral(numeral(recurso.gTotal.federal).format('0.00')).value()!
      recurso.gTotal.total = numeral(numeral(recurso.gTotal.total).format('0.00')).value()!

      recurso.porcentaje = this.distribuirPorcentajes(recurso)

      this.project.distribucionCalculada((this.calculado = true))

      return recurso
    },
    calcularFiscalizacion(subTotalFederal: number, fiscalizacion: number): number {
      const nuevaFiscalizacion: number = (subTotalFederal + fiscalizacion) / 1000
      const diferencia: number = nuevaFiscalizacion - fiscalizacion
      return diferencia < 0.001
        ? nuevaFiscalizacion
        : this.calcularFiscalizacion(subTotalFederal, nuevaFiscalizacion)
    },
    totalComponentes() {
      let total = 0
      this.componentes.map((componente) => {
        total += +componente?.total! > 0 ? 1 : 0
      })
      return total
    },
    distribuirPorcentajes(filas: FilasDistribucion): Distribucion {
      const federal = this.procesarPorcentaje(
        this.calcularPorcentajes(
          this.seTomaGranTotal() ? filas.gTotal.total : numeral(filas.total.total).value()!,
          this.seTomaGranTotal() ? filas.gTotal.federal : numeral(filas.total.federal).value()!,
        ),
      )
      const estatal = this.procesarPorcentaje(
        this.calcularPorcentajes(
          this.seTomaGranTotal() ? filas.gTotal.total : numeral(filas.total.total).value()!,
          this.seTomaGranTotal() ? filas.gTotal.estatal! : numeral(filas.total.estatal).value()!,
        ),
      )
      const total = filas.porcentaje.federal + filas.porcentaje.estatal!
      return { leyenda: filas.porcentaje.leyenda, federal, estatal, total }
    },
    procesarPorcentaje(cocientePorcentaje: number): number {
      return numeral(
        numeral(cocientePorcentaje * 100).format('0.' + decimales(this.porcDecimales)),
      ).value()!
    },
    calcularPorcentajes(total: number, aporte: number): number {
      total = total || 1
      aporte = aporte || 0

      return aporte / total
    },
    seTomaGranTotal(): boolean {
      if (!this.anio || this.anio < 2018 || this.anio > 2019) {
        return true
      }
      return false
    },
  },
  beforeMount() {
    if (!this.calculado && this.componentes.length > 0) {
      console.log('Calcular aportaciones...')
      this.aportaciones = this.calcularAportaciones(this.componentes)
    }
  },
})
</script>
<template>
  <div class="table-container contenido-resumen">
    <table
      class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth"
      id="tabla-componentes"
    >
      <thead class="has-background-grey-dark">
        <tr>
          <th class="has-text-centered is-vcentered has-text-white-ter" rowspan="2">Componentes</th>
          <th class="has-text-centered has-text-white-ter" colspan="2">Distribución del recurso</th>
          <th class="has-text-centered is-vcentered has-text-white-ter" rowspan="2">Total</th>
        </tr>
        <tr>
          <th class="has-text-centered has-text-white-ter">Federal</th>
          <th class="has-text-centered has-text-white-ter">Estatal</th>
        </tr>
      </thead>
      <tbody>
        <FilasComponentes
          v-for="(componente, index) in componentes"
          :key="componente.componentes_id"
          :componente="componente"
        />
      </tbody>
      <tfoot>
        <component
          :is="tFootTotales"
          v-for="(value, index) in aportaciones"
          v-if="anio! < 2021"
          :key="'totales-' + index"
          :distribucion="value"
          :numDecimales="porcDecimales"
          :estatus="estatus"
          :fila="index"
          @distribuirPorcentaje="distribuirPorcentaje"
        ></component>
        <component
          :is="tFootTotales"
          v-else
          :distribucion="aportaciones.total"
          :numDecimales="porcDecimales"
          :estatus="estatus"
          :fila="0"
          @distribuirPorcentaje="distribuirPorcentaje"
        >
        </component>
      </tfoot>
    </table>
    <div class="columns mt-5 pt-2" v-if="anio! >= 2021">
      <div class="column is-2"></div>
      <div class="column is-8">
        <TablaAportaciones :distribucion="aportaciones" :numDecimales="porcDecimales" />
        <p class="is-size-7 is-italic has-text-weight-semibold pb-5">
          (*) Este {{ leyenda }} incluye el pago de la vigilancia, inspección, control y evaluación
          de la ejecución de Programa, conforme a la Ley Federal de Presupuesto y Responsabilidad
          Hacendaria y su reglamento.
        </p>
      </div>
      <div class="column is-2"></div>
    </div>
  </div>
</template>
