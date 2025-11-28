<script lang="ts">
import { ref, reactive, defineComponent, provide } from 'vue'
import { useProjectStore } from '@/stores/project/project'
import type { Distribute } from '@/types/partialProps'
import { useConfigStore } from '@/stores/config'
import { DistributeKey } from '@/util/keys'
import { makeHash } from '@/util'
import numeral from 'numeral'

import TablaResumen from './partial/TablaResumen.vue'
import {
  type ComponentHomologo,
  type StateProject,
  type ComponentsDev,
  type Resumen,
  type FilasDistribucion,
} from '@/types/project'
import type { CatComponent, CatComponents, Component, Components } from '@/types/component'

export default defineComponent({
  components: {
    TablaResumen: TablaResumen,
  },
  setup(props) {
    const config = useConfigStore()

    const project = useProjectStore()

    const redistribuir = ref<Resumen['capturado']>(project.obtenerRedistribuirMontos)

    /*provide('redistribuir', {
      redistribuir,
      redistribuirMontos: (newValue: boolean) => {
        redistribuir.value = newValue
      },
    })*/

    const service: Distribute = {
      redistribuir: redistribuir.value,
      redistribuirMontos: (newValue: boolean) => {
        redistribuir.value = newValue
      },
    }

    provide(DistributeKey, service)

    return {
      componentes: reactive<{ pec: CatComponents; pem: CatComponents }>({ pec: [], pem: [] }),
      desarrollo: reactive<ComponentsDev>(project.estructura.desarrollo.componentes),
      capturado: ref<Resumen['capturado']>(project.estructura.resumen.capturado),
      listado: ref<Resumen['listado']>(project.estructura.resumen.listado),
      vertiente: ref<StateProject['vertiente']>(project.vertiente),
      porcDecimales: ref<number>(project.anio === 2020 ? 2 : 8),
      homologos: reactive<ComponentHomologo>(project.homologos),
      anio: ref<number>(project.anio! || 0),
      keyTabla: ref<string>(makeHash(6)),
      observaciones: ref<string>(''),
      redistribuir,
      project,
      config,
    }
  },
  watch: {
    redistribuir(current, prev) {
      //&& this.listado.length == 0
      if (current) {
        this.project.actualizarComponentesResumen(
          (this.listado = this.aportacionComponentes(this.asignarMontoComponentes())),
        )
        this.keyTabla = makeHash(6)
      }
    },
    capturado(current, prev) {
      //&& this.listado.length == 0
      if (current) {
        console.log('resumen...componentes obtenidos :)')
        this.project.actualizarComponentesResumen(
          (this.listado = this.aportacionComponentes(this.asignarMontoComponentes())),
        )
        this.keyTabla = makeHash(6)
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
    actualizarDistribucion() {},
    distribuirRecursoComponentes(componentes: CatComponents): CatComponents {
      let porcentajeFederal = this.project.estructura.resumen.porcentaje.federal / 100
      let porcentajeEstatal = this.project.estructura.resumen.porcentaje.estatal! / 100

      return componentes.map((componente) => {
        let total = numeral(componente.total).value()! > 0 ? numeral(componente.total).value() : 0
        componente.aporteFederal = numeral(total! * porcentajeFederal).format('$0,0.00')
        componente.aporteEstatal = numeral(total! * porcentajeEstatal).format('$0,0.00')
        return componente
      })
    },
    estaDistribuidoComponente(componente: CatComponent): boolean {
      let montos: number = numeral(componente.aporteFederal).value()!
      montos += numeral(componente?.aporteEstatal).value()!

      /*console.log(
        `id: ${componente.nombre} :: ${numeral(montos).value()} == ${numeral(numeral(componente.total).format('0.00')).value()}`,
      )*/
      return (
        numeral(numeral(montos).format('0.00')).value() ==
        numeral(numeral(componente.total).format('0.00')).value()
      )
    },
    recursoComponentesDistribuido(listado: CatComponents): boolean {
      let estaDistribuido = true,
        comprobado = false
      listado.forEach((componente) => {
        if (!this.estaDistribuidoComponente(componente)) {
          estaDistribuido = false
        }
        comprobado = true
      })
      return comprobado ? estaDistribuido : false
    },
    aportacionComponentes(listado: CatComponents): CatComponents {
      if (this.recursoComponentesDistribuido(listado)) {
        return listado
      }
      return this.distribuirRecursoComponentes(listado)
    },
    asignarMontoComponentes(): CatComponents {
      let $listadoComponentes

      if (this.vertiente !== '1,2') {
        $listadoComponentes = this.obtenerMontosComponente(
          +this.vertiente! == 1 ? [...this.componentes.pec] : [...this.componentes.pem],
          +this.vertiente! == 1 ? [...this.desarrollo.pec] : [...this.desarrollo.pem],
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
    estaHomologado(idComponente: Component['id']): boolean {
      let homologado = false
      for (const idComp in this.homologos) {
        if (this.homologos[idComp].id === idComponente) {
          homologado = true
          break
        }
      }
      return homologado
    },
    obtenerIdHomologo(idComponente: Component['id']): Component['id'] {
      return this.homologos[idComponente as keyof typeof this.homologos]
        ? this.homologos[idComponente].id
        : idComponente
    },
    setComponentes(vertiente: StateProject['vertiente']) {
      if (vertiente === '1,2') {
        const componentesPEC = this.project.listadoComponentes(1)
        this.componentes.pec = componentesPEC?.datos || []

        const componentesPEM = this.project.listadoComponentes(2)
        this.componentes.pem = componentesPEM?.datos || []
      }

      const componentes = this.project.listadoComponentes(+vertiente!)

      this.componentes[Number(vertiente) === 1 ? 'pec' : 'pem'] = componentes?.datos || []
    },
    inicializarComponentes(vertiente: StateProject['vertiente']) {
      if (this.project.listadoComponentes(+vertiente!) == null) {
        return this.project.obtenerComponentes({ vertiente }).then((response) => {
          this.setComponentes(vertiente)
          this.project.actualizarCapturaResumen((this.capturado = true))
        })
      }
      this.setComponentes(vertiente)
      this.project.actualizarCapturaResumen((this.capturado = true))
    },
    homologarNombreComponente(componentes: CatComponents): CatComponents {
      return componentes.map((componente) => {
        if (!this.homologos[componente.componentes_id as keyof typeof this.homologos]) {
          return componente
        }
        componente.nombre = this.homologos[componente.componentes_id].nombre
        return componente
      })
    },
    obtenerComponentesRestantes(componentes: CatComponents): CatComponents {
      return componentes.filter((componente) => !this.estaHomologado(componente.componentes_id))
    },
    obtenerMontos(componente: CatComponent, desarrollo: Components): CatComponent {
      if (!this.estaHomologado(componente.componentes_id) && this.anio <= 2020) {
        componente.total =
          componente?.total && numeral(componente.total).value()
            ? numeral(componente.total).value()! +
              numeral(
                this.obtenerTotalComponente(
                  desarrollo,
                  this.obtenerIdHomologo(componente.componentes_id),
                ),
              ).value()!
            : numeral(
                this.obtenerTotalComponente(
                  desarrollo,
                  this.obtenerIdHomologo(componente.componentes_id),
                ),
              ).value()!

        componente.total = numeral(componente.total).format('$0,0.00')
        return componente
      }

      if (!this.homologos[componente.componentes_id as keyof typeof this.homologos]) {
        componente.aporteFederal = this.obtenerAportacionFederal(
          desarrollo,
          componente.componentes_id,
        )
        componente.aporteEstatal = this.obtenerAportacionEstatal(
          desarrollo,
          componente.componentes_id,
        )
      }

      componente.total = componente?.total
        ? numeral(componente.total).value()! +
          numeral(
            this.obtenerTotalComponente(
              desarrollo,
              this.obtenerIdHomologo(componente.componentes_id),
            ),
          ).value()!
        : numeral(
            this.obtenerTotalComponente(
              desarrollo,
              this.obtenerIdHomologo(componente.componentes_id),
            ),
          ).value()!

      componente.aporteFederal = numeral(componente.aporteFederal).format('$0,0.00')
      componente.aporteEstatal = numeral(componente.aporteEstatal).format('$0,0.00')
      componente.total = numeral(componente.total).format('$0,0.00')
      return componente
    },
    obtenerAportacionFederal(desarrollo: Components, idComponente: Component['id']): number {
      const componente = desarrollo.find((componente) => componente.id === idComponente)
      return componente ? numeral(componente.aporteFederal).value()! : 0
    },
    obtenerAportacionEstatal(desarrollo: Components, idComponente: Component['id']): number {
      const componente = desarrollo.find((componente) => componente.id === idComponente)
      return componente ? numeral(componente.aporteEstatal).value()! : 0
    },
    obtenerTotalComponente(desarrollo: Components, idComponente: Component['id']): number {
      const componente = desarrollo.find((componente) => componente.id === idComponente)
      return componente ? numeral(componente.total).value()! : 0
    },
    obtenerMontosComponente(
      componentes: CatComponents,
      desarrollo: Components,
      integral: boolean = false,
    ): CatComponents {
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
  },
  beforeMount() {
    if (!this.project.estructura.resumen.millar && this.project.anio! < 2019) {
      this.project.obtenerFiscalizacion()
    }

    if (!this.project.estructura.desarrollo.inicializado && this.project.id) {
      this.project.obtenerDesarrollo()
    }

    this.inicializarComponentes(this.vertiente)

    this.project.inicializarResumen()
  },
  mounted() {
    console.log('mounted resumen')
    this.project.asignarNumDecPorcentaje(this.porcDecimales)
  },
})
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
