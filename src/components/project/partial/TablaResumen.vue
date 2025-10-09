<script lang="ts">
import { ref, reactive, defineComponent, type PropType } from 'vue'
import { useConfigStore } from '@/stores/config'
import { useProjectStore } from '@/stores/project'

import TablaAportaciones from './TablaAportaciones.vue'
import FilasComponentes from './FilasComponentes.vue'
import FilasTotalesV1 from './FilasTotalesV1.vue'
import FilasTotalesV2 from './FilasTotalesV2.vue'
import FilaTotal from './FilaTotal.vue'
import { decimales } from '@/util'
import numeral from 'numeral'

import type { Distribucion, FilasDistribucion, StateProject } from '@/types/project'
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
      porcDecimales: ref<number>(project.anio === 2020 ? 2 : 8),
      calculado: ref<boolean>(project.estructura.resumen.calculado),
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
    distribuirEnFilas(filas: FilasDistribucion, componentes: CatComponents): FilasDistribucion {
      componentes.forEach((componente) => {
        if (!filas.total.estatal) {
          filas.total.estatal = 0
        }

        filas.total.federal += componente?.aporteFederal || 0

        filas.total.estatal += componente?.aporteEstatal || 0

        filas.total.total += componente?.total! > 0 ? componente?.total! : 0
      })
      filas.millar.federal = filas.millar.total =
        !this.project.estructura.resumen.millar || this.project.estructura.resumen.millar === 0
          ? numeral(
              numeral(
                this.calcularFiscalizacion(filas.total.federal, filas.total.federal / 1000),
              ).format('0.00'),
            ).value()!
          : this.project.estructura.resumen.millar

      filas.total.federal = numeral(numeral(filas.total.federal).format('0.00')).value()!
      filas.total.estatal = numeral(numeral(filas.total.estatal).format('0.00')).value()
      filas.total.total = numeral(numeral(filas.total.total).format('0.00')).value()!

      filas.gTotal.federal = filas.total.federal + filas.millar.federal
      filas.gTotal.estatal = filas.total.estatal
      filas.gTotal.total = filas.total.federal + filas.millar.federal + filas.total.estatal!

      filas.gTotal.federal = numeral(numeral(filas.gTotal.federal).format('0.00')).value()!
      filas.gTotal.total = numeral(numeral(filas.gTotal.total).format('0.00')).value()!

      filas.porcentaje = this.distribuirPorcentajes(filas)

      this.project.distribucionCalculada((this.calculado = true))

      return filas
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
        total += componente?.total! > 0 ? 1 : 0
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
    resetAportaciones(): void {
      this.aportaciones.total.estatal = 0
      this.aportaciones.total.federal = 0
      this.aportaciones.total.total = 0

      this.aportaciones.gTotal.estatal = 0
      this.aportaciones.gTotal.federal = 0
      this.aportaciones.gTotal.total = 0

      this.aportaciones.millar.federal = 0
      this.aportaciones.millar.total = 0

      this.aportaciones.porcentaje.estatal = 0
      this.aportaciones.porcentaje.federal = 0

      this.project.distribucionCalculada((this.calculado = false))
      this.resetAportacion = true
    },
    inicializarDependencias(): Promise<number> {
      const me = this

      return new Promise((resolve, reject) => {
        me.distribuirEnFilas(me.aportaciones, [...me.componentes])
        resolve(0)
      })
    },
    async inicia(): Promise<void> {
      const me = this
      await this.inicializarDependencias().then(() => {})
    },
  },
  beforeMount() {
    if (!this.project.estructura.resumen.millar && this.project.anio! < 2019) {
      this.project.obtenerFiscalizacion()
    }
    this.resetAportaciones()
  },
  beforeUpdate() {
    this.resetAportacion ? this.inicia() : undefined
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
