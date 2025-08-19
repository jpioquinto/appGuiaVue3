<script lang="ts">
import { ref, reactive } from 'vue'
import { useConfigStore } from '@/stores/config'
import { useProjectStore } from '@/stores/project'

import TablaAportaciones from './TablaAportaciones.vue'
import FilasComponentes from './FilasComponentes.vue'
import FilasTotalesV1 from './FilasTotalesV1.vue'
import FilasTotalesV2 from './FilasTotalesV2.vue'
import FilaTotal from './FilaTotal.vue'

export default {
  props: ['estatus', 'vertiente', 'componentes', 'anio'],
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
      aportaciones: reactive(project.obtenerDistribucion),
      porcDecimales: ref(project.anio === 2020 ? 2 : 8),
      calculado: ref(project.resumen.calculado),
      resetAportacion: ref(false),
      project,
      config,
    }
  },
  computed: {
    tFootTotales() {
      if (this.anio < 2018) {
        return 'FilasTotalesV1'
      }
      return this.anio >= 2021 ? 'FilaTotal' : 'FilasTotalesV2'
    },
    leyenda() {
      return this.anio < 2018 ? 'porcentaje' : 'monto'
    },
  },
  methods: {
    distribuirPorcentaje(porcentajes) {
      this.$emit('actualizar', porcentajes)
    },
    distribuirEnFilas(filas, componentes) {
      componentes.forEach((componente) => {
        filas.total.federal +=
          numeral(componente.aporteFederal).value() > 0
            ? numeral(componente.aporteFederal).value()
            : 0
        filas.total.estatal +=
          numeral(componente.aporteEstatal).value() > 0
            ? numeral(componente.aporteEstatal).value()
            : 0
        filas.total.total +=
          numeral(componente.total).value() > 0 ? numeral(componente.total).value() : 0
      })
      filas.millar.federal = filas.millar.total =
        !isNumeric(this.project.resumen.millar) || this.project.resumen.millar === 0
          ? numeral(
              numeral(
                this.calcularFiscalizacion(filas.total.federal, filas.total.federal / 1000),
              ).format('0.00'),
            ).value()
          : this.project.resumen.millar
      filas.total.federal = numeral(numeral(filas.total.federal).format('0.00')).value()
      filas.total.estatal = numeral(numeral(filas.total.estatal).format('0.00')).value()
      filas.total.total = numeral(numeral(filas.total.total).format('0.00')).value()

      filas.gTotal.federal =
        numeral(filas.total.federal).value() + numeral(filas.millar.federal).value()
      filas.gTotal.estatal = numeral(filas.total.estatal).value()
      filas.gTotal.total =
        numeral(filas.total.federal).value() +
        numeral(filas.millar.federal).value() +
        numeral(filas.total.estatal).value()

      filas.gTotal.federal = numeral(numeral(filas.gTotal.federal).format('0.00')).value()
      filas.gTotal.total = numeral(numeral(filas.gTotal.total).format('0.00')).value()

      filas.porcentaje = this.distribuirPorcentajes(filas)

      this.project.distribucionCalculada((this.calculado = true))

      return filas
    },
    /*comprobarDistribucionesComponente(listado) {
                let estaDistribuido = true, comprobado = false;
                listado.forEach(componente => {
                    if (!this.estaDistribuidoComponente(componente)) {
                        estaDistribuido = false;
                    }
                    comprobado = true;
                });
                return comprobado ? estaDistribuido : false;
            },
            estaDistribuidoComponente(componente) {
                let montos  = numeral(componente.aporteFederal).value();
                    montos += numeral(componente.aporteEstatal).value();

                    montos = numeral(montos).format('0.00');
                    console.log(`id: ${componente.nombre} :: ${numeral(montos).value()} == ${numeral(numeral(componente.total).format('0.00')).value()}`);
                return numeral(montos).value() == numeral(numeral(componente.total).format('0.00')).value();
            },
            distribuirAportaciones(iteracion, totalComponentes) {
                let porcentajeFederal = (this.distribuciones.porcentaje.federal/100) - (iteracion/(totalComponentes>0?totalComponentes:1));
                let porcentajeEstatal = (this.distribuciones.porcentaje.estatal/100) + (iteracion/(totalComponentes>0?totalComponentes:1));
                let suficienciaFederal = 0, suficienciaEstatal = 0;
                this.componentes.map(componente => {
                    let total = numeral(componente.total).value()>0 ? numeral(componente.total).value() : 0;
                    componente.aporteFederal = numeral(total * porcentajeFederal).format('$0,0.00');
                    componente.aporteEstatal = numeral(total * porcentajeEstatal).format('$0,0.00');
                    componente.total         = numeral(total).format('$0,0.00');

                    suficienciaFederal += numeral(componente.aporteFederal).value();
                    suficienciaEstatal += numeral(componente.aporteEstatal).value();
                });
                suficienciaFederal = suficienciaFederal + this.calcularFiscalizacion(suficienciaFederal, suficienciaFederal/1000);
                let diferencia = ( suficienciaFederal/(suficienciaFederal+suficienciaEstatal) )-0.6;
                return (diferencia>0) ? this.distribuirAportaciones(diferencia+iteracion+0.00001, totalComponentes) : (diferencia + 0.6);
            },*/
    calcularFiscalizacion(subTotalFederal, fiscalizacion) {
      const nuevaFiscalizacion = (subTotalFederal + fiscalizacion) / 1000,
        diferencia = nuevaFiscalizacion - fiscalizacion
      return diferencia < 0.001
        ? nuevaFiscalizacion
        : this.calcularFiscalizacion(subTotalFederal, nuevaFiscalizacion)
    },
    totalComponentes() {
      let total = 0
      this.componentes.map((componente) => {
        total += numeral(componente.total).value() > 0 ? 1 : 0
      })
      return total
    },
    distribuirPorcentajes(filas) {
      const federal = this.procesarPorcentaje(
        this.calcularPorcentajes(
          this.seTomaGranTotal() ? filas.gTotal.total : numeral(filas.total.total).value(),
          this.seTomaGranTotal() ? filas.gTotal.federal : numeral(filas.total.federal).value(),
        ),
      )
      const estatal = this.procesarPorcentaje(
        this.calcularPorcentajes(
          this.seTomaGranTotal() ? filas.gTotal.total : numeral(filas.total.total).value(),
          this.seTomaGranTotal() ? filas.gTotal.estatal : numeral(filas.total.estatal).value(),
        ),
      )
      const total = filas.porcentaje.federal + filas.porcentaje.estatal
      return { leyenda: filas.porcentaje.leyenda, federal, estatal, total }
    },
    procesarPorcentaje(cocientePorcentaje) {
      return numeral(
        numeral(cocientePorcentaje * 100).format('0.' + decimales(this.porcDecimales)),
      ).value()
    },
    calcularPorcentajes(total, aporte) {
      total = !total || !isNumeric(total) ? 1 : total
      aporte = !aporte || !isNumeric(aporte) ? 0 : aporte

      return aporte / total
    },
    seTomaGranTotal() {
      if (!this.anio || this.anio < 2018 || this.anio > 2019) {
        return true
      }
      return false
    },
    resetAportaciones() {
      const me = this
      ;['estatal', 'federal', 'total'].forEach((campo) => {
        me.aportaciones.total[campo] = 0
        me.aportaciones.gTotal[campo] = 0
        campo !== 'total' ? (me.aportaciones.porcentaje[campo] = 0) : undefined
        campo !== 'estatal' ? (me.aportaciones.millar[campo] = 0) : undefined
      })
      this.project.distribucionCalculada((this.calculado = false))
      this.resetAportacion = true
    },
    inicializarDependencias() {
      const me = this

      return new Promise((resolve, reject) => {
        me.distribuirEnFilas(me.aportaciones, [...me.componentes])
        resolve()
      })
    },
    async inicia() {
      const me = this
      await this.inicializarDependencias().then(() => {})
    },
  },
  beforeMount() {
    if (!this.project.millar && this.project.anio < 2019) {
      this.project.obtenerFiscalizacion()
    }
    this.resetAportaciones()
  },
  beforeUpdate() {
    this.resetAportacion ? this.inicia() : undefined
  },
}
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
          v-if="anio < 2021"
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
    <div class="columns mt-5 pt-2" v-if="anio >= 2021">
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
