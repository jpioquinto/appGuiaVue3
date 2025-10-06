<script lang="ts">
import { ref, reactive } from 'vue'
import TablaResumen from './partial/TablaResumen.vue'
import { useConfigStore } from '@/stores/config'
import { useProjectStore } from '@/stores/project'

export default {
  components: {
    TablaResumen: TablaResumen,
  },
  setup(props) {
    const config = useConfigStore()

    const project = useProjectStore()

    return {
      desarrollo: reactive(project.estructura.desarrollo.componentes),
      porcDecimales: ref(project.anio === 2020 ? 2 : 8),
      capturado: ref(project.estructura.resumen.capturado),
      homologos: reactive(project.homologos),
      componentes: reactive({ pec: [], pem: [] }),
      listado: ref(project.estructura.resumen.listado),
      vertiente: ref(project.vertiente),
      keyTabla: ref(makeHash()),
      anio: ref(project.anio),
      observaciones: ref(''),
      project,
      config,
    }
  },
  watch: {
    capturado(nuevoEstatus, viejoEstatus) {
      if (nuevoEstatus) {
        console.log('resumen...componentes obtenidos :)')
        this.listado = this.asignarMontoComponentes()
      }
    },
  },
  computed: {
    componente() {
      return this.config.findElementMenu('resumen')
    },
    estatus() {
      return this.project.obtenerEstatus
    },
  },
  methods: {
    asignarMontoComponentes() {
      let $listadoComponentes

      if (this.vertiente !== '1,2') {
        $listadoComponentes = this.obtenerMontosComponente(
          this.vertiente == '1' ? [...this.componentes.pec] : [...this.componentes.pem],
          this.vertiente == '1' ? [...this.desarrollo.pec] : [...this.desarrollo.pem],
        )
        return $listadoComponentes
      }

      let $componentesPEC = this.homologarNombreComponente(
        this.componentes.pec ? [...this.componentes.pec] : [],
      )

      const $componentesPEM = this.obtenerComponentesRestantes(
        this.componentes.pem ? [...this.componentes.pem] : [],
      )

      if ($componentesPEM.length > 0) {
        $componentesPEC = [...$componentesPEC, ...$componentesPEM]
      }

      $listadoComponentes = this.obtenerMontosComponente(
        [...$componentesPEC],
        [...this.desarrollo.pec],
      )
      return this.obtenerMontosComponente([...$listadoComponentes], [...this.desarrollo.pem], true)
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
      return this.homologos.hasOwnProperty(idComponente)
        ? this.homologos[idComponente].id
        : idComponente
    },
    setComponentes(vertiente) {
      if (vertiente === '1,2') {
        this.componentes.pec = this.project.listadoComponentes(1).datos
        this.componentes.pem = this.project.listadoComponentes(2).datos
        return this.componentes
      }

      return (this.componentes[Number(vertiente) === 1 ? 'pec' : 'pem'] =
        this.project.listadoComponentes(vertiente).datos)
    },
    inicializarComponentes(vertiente) {
      if (this.project.listadoComponentes(vertiente) == null) {
        return this.project.obtenerComponentes({ vertiente: vertiente }).then((response) => {
          this.setComponentes(vertiente)
          this.capturado = true
        })
      }
      this.setComponentes(vertiente)
      this.capturado = true
    },
    homologarNombreComponente(componentes) {
      return componentes.map((componente) => {
        if (!this.homologos.hasOwnProperty(componente.componentes_id)) {
          return componente
        }
        componente.nombre = this.homologos[componente.componentes_id].nombre
        return componente
      })
    },
    obtenerComponentesRestantes(componentes) {
      return componentes.filter((componente) => !this.estaHomologado(componente.componentes_id))
    },
    obtenerMontos(componente, desarrollo) {
      if (!this.estaHomologado(componente.componentes_id) && this.anio <= 2020) {
        componente.total =
          componente.hasOwnProperty('total') && numeral(componente.total).value()
            ? numeral(componente.total).value() +
              numeral(
                this.obtenerTotalComponente(
                  desarrollo,
                  this.obtenerIdHomologo(componente.componentes_id),
                ),
              ).value()
            : numeral(
                this.obtenerTotalComponente(
                  desarrollo,
                  this.obtenerIdHomologo(componente.componentes_id),
                ),
              ).value()

        componente.total = numeral(componente.total).format('$0,0.00')
        return componente
      }

      if (!this.homologos.hasOwnProperty(componente.componentes_id)) {
        componente.aporteFederal = this.obtenerAportacionFederal(
          desarrollo,
          componente.componentes_id,
        )
        componente.aporteEstatal = this.obtenerAportacionEstatal(
          desarrollo,
          componente.componentes_id,
        )
      }

      componente.total = componente.hasOwnProperty('total')
        ? numeral(componente.total).value() +
          numeral(
            this.obtenerTotalComponente(
              desarrollo,
              this.obtenerIdHomologo(componente.componentes_id),
            ),
          ).value()
        : numeral(
            this.obtenerTotalComponente(
              desarrollo,
              this.obtenerIdHomologo(componente.componentes_id),
            ),
          ).value()

      componente.aporteFederal = numeral(componente.aporteFederal).format('$0,0.00')
      componente.aporteEstatal = numeral(componente.aporteEstatal).format('$0,0.00')
      componente.total = numeral(componente.total).format('$0,0.00')
      return componente
    },
    obtenerAportacionFederal(desarrollo, idComponente) {
      const componente = desarrollo.find((componente) => componente.id === idComponente)
      return componente ? numeral(componente.aporteFederal).value() : 0
    },
    obtenerAportacionEstatal(desarrollo, idComponente) {
      const componente = desarrollo.find((componente) => componente.id === idComponente)
      return componente ? numeral(componente.aporteEstatal).value() : 0
    },
    obtenerTotalComponente(desarrollo, idComponente) {
      const componente = desarrollo.find((componente) => componente.id === idComponente)
      return componente ? numeral(componente.total).value() : 0
    },
    obtenerMontosComponente(componentes, desarrollo, integral) {
      componentes.map((componente) => {
        if (integral) {
          return this.obtenerMontos(componente, desarrollo)
        }

        componente.aporteFederal = numeral(
          this.obtenerAportacionFederal(desarrollo, componente.componentes_id),
        ).format('$0,0.00')
        componente.aporteEstatal = numeral(
          this.obtenerAportacionEstatal(desarrollo, componente.componentes_id),
        ).format('$0,0.00')
        componente.total = numeral(
          this.obtenerTotalComponente(desarrollo, componente.componentes_id),
        ).format('$0,0.00')
        /*if (componente.componentes_id===3) {
                        console.table(componente);
                    }*/
        return componente
      })

      return componentes
    },
    actualizarDistribucion(_porcentajes) {
      /*console.log(porcentajes);
                this.distribuciones.filas.porcentaje.federal = porcentajes.federal;
                this.distribuciones.filas.porcentaje.estatal = porcentajes.estatal;
                this.distribuciones.filas.porcentaje.total = porcentajes.total;


                this.distribuciones.filas.gTotal.federal = this.distribuciones.filas.gTotal.total * (porcentajes.federal/100);
                this.distribuciones.filas.gTotal.estatal = this.distribuciones.filas.gTotal.total - this.distribuciones.filas.gTotal.federal;
                this.distribuciones.filas.millar.federal =  this.distribuciones.filas.millar.total = this.distribuciones.filas.gTotal.federal*this.project.obtenerAlMillar;

                this.distribuciones.filas.total.federal = this.distribuciones.filas.gTotal.federal - this.distribuciones.filas.millar.federal;

                if (this.distribuciones.filas.total.federal>this.distribuciones.filas.total.total) {
                    this.distribuciones.filas.total.federal = 0;
                }
                this.distribuciones.filas.total.estatal = this.distribuciones.filas.total.total - this.distribuciones.filas.total.federal;
                if (this.distribuciones.filas.total.estatal<0) {
                    this.distribuciones.filas.total.estatal = 0;
                }
                if (!this.distribuciones.calculado) {
                    this.project.distribucionCalculada(this.distribuciones.calculado = true);
                }*/
    },
    inicializarDependencias() {
      const me = this

      return new Promise((resolve, reject) => {
        if (!me.project.estructura.desarrollo.inicializado && me.project.id) {
          me.project.obtenerDesarrollo()
        }

        me.inicializarComponentes(me.vertiente)

        resolve()
      })
    },
    async inicia() {
      const me = this
      await this.inicializarDependencias().then(() => {
        me.project.inicializarResumen()
        me.project.actualizarCapturaResumen()

        me.listado = me.asignarMontoComponentes()
      })
    },
  },
  beforeMount() {
    this.inicia()
  },
  mounted() {
    this.project.asignarNumDecPorcentaje(this.porcDecimales)
  },
}
</script>
<template>
  <div class="content">
    <div class="box">
      <h4>{{ componente?.orden }}.- RESUMEN FINANCIERO</h4>

      <TablaResumen
        :vertiente="vertiente"
        :componentes="listado"
        :estatus="estatus"
        :key="keyTabla"
        :anio="anio"
        @actualizar="actualizarDistribucion"
      />

      <template v-if="estatus == 1">
        <h6 class="title is-6 mt-4">Observaciones del resumen financiero</h6>
        <QuillEditor
          v-model:content="project.estructura.resumen.observaciones"
          content-type="html"
        />
      </template>
      <template v-else>
        <div
          class="container"
          v-if="
            project.estructura.resumen.observaciones &&
            project.estructura.resumen.observaciones != ''
          "
        >
          <h6 class="title is-6 mt-4">Observaciones del resumen financiero</h6>
          <article class="message is-dark">
            <div class="message-body">
              <div v-html="project.estructura.resumen.observaciones"></div>
            </div>
          </article>
        </div>
      </template>
    </div>
  </div>
</template>
