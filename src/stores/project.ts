import { defineStore } from 'pinia'
import getters from './gettersProject'
import $axios from '@/util/axios'

//import '../util_helper'
import type { StateProject, VertProject } from '@/types/project'
import type { Steps } from '@/types/config'
import stateProject from './stateProject'
import type {
  CatComponent,
  CatComponents,
  Component,
  Components,
  ComponentVert,
  InitOffices,
  Objective,
  ParamActivity,
  ParamAnexo,
  ParamOffice,
  ParamProgramar,
  RemoveActivity,
  RemoveAnexo,
  RemoveObjective,
} from '@/types/component'
import type { Activity, SubComponentes } from '@/types/activity'

export const useProjectStore = defineStore('project', {
  state: (): StateProject => {
    return stateProject
  },
  getters,
  actions: {
    seleccionarElemento(elementos: Steps) {
      elementos.map((elemento) => {
        if (this.estructura.hasOwnProperty(elemento.componente)) {
          elemento.cargado = this.estructura[
            elemento.componente as keyof typeof this.estructura
          ].hasOwnProperty('inicializado')
            ? this.estructura[elemento.componente as keyof typeof this.estructura].inicializado
            : elemento.cargado
          elemento.capturado = this.estructura[
            elemento.componente as keyof typeof this.estructura
          ].hasOwnProperty('capturado')
            ? this.estructura[elemento.componente as keyof typeof this.estructura].capturado
            : elemento.capturado
        }

        return elemento
      })
    },
    obtenerProyecto() {
      return new Promise((resolve, reject) => {
        $axios
          .get('api/introduccion/' + (this.id !== null ? this.id : 0))
          .then((response) => {
            this.iconos = response.data.iconos
            this.diagnostico.anio = response.data.anioDiagnostico
            this.diagnostico.id = response.data.idDiagnostico

            this.id = response.data.id
            this.iva = response.data.iva
            this.anio = response.data.anio
            this.estatus = response.data.estatus
            this.version = response.data.version
            this.inicializado = true
            this.estructura.resumen.millar = response.data.millar
            this.estructura.resumen.alMillar = response.data.alMillar
            this.vertiente = response.data.vertiente
            this.estructura.introduccion.inicializado = true
            this.estructura.introduccion.presupuesto = response.data.suficiencia
            this.estructura.introduccion.captura = response.data.introduccion
            this.estructura.antecedentes.situacion = response.data.situacion
            this.estructura.antecedentes.logros = response.data.logros
            this.estructura.objetivo.inicializado = true
            this.estructura.objetivo.captura = response.data.objetivo
            this.estructura.resultados.inicializado = true
            this.estructura.resultados.captura = response.data.metas
            this.estructura.resumen.observaciones = response.data.observaciones_resumen
            resolve(response.data)
          })
          .catch((error) => {
            console.log('Error...')
            reject(error)
          })
      })
    },
    actualizarPresupuesto(presupuesto: number) {
      this.estructura.introduccion.presupuesto = presupuesto
    },
    actualizarIntroduccion(captura: string) {
      this.estructura.introduccion.captura = captura
      this.estructura.introduccion.capturado = captura != '<p class="fr-tag"><br></p>'
    },
    obtenerAntecedentes() {
      $axios
        .get(
          'api/antecedente/' +
            (this.id !== null ? this.id : 0) +
            '/' +
            (this.diagnostico.id !== null ? this.diagnostico.id : 0),
        )
        .then((response) => {
          this.estructura.antecedentes.inicializado = true

          if (response.data.hasOwnProperty('pec')) {
            this.estructura.antecedentes.pec.cartografia = response.data.pec.cartografia
            this.estructura.antecedentes.pec.oficinas = response.data.pec.oficinas
            this.estructura.antecedentes.pec.predios = response.data.pec.predios
            this.estructura.antecedentes.pec.personal = response.data.pec.personal
          }
          if (response.data.hasOwnProperty('pem')) {
            this.estructura.antecedentes.pem.oficinas = response.data.pem.oficinas
            this.estructura.antecedentes.pem.personal = response.data.pem.personal
            this.estructura.antecedentes.pem.ingreso = response.data.pem.ingreso
            this.estructura.antecedentes.pem.acervo = response.data.pem.acervo
          }
        })
        .catch((error) => {
          console.log('Error...', error)
        })
    },
    actualizarSituacion(situacion: string) {
      this.estructura.antecedentes.situacion = situacion
      if (this.estructura.antecedentes.situacion && this.estructura.antecedentes.logros) {
        this.estructura.antecedentes.capturado =
          this.estructura.antecedentes.situacion != '<p class="fr-tag"><br></p>' &&
          this.estructura.antecedentes.logros != '"<p class="fr-tag"><br></p>'
            ? true
            : false
      }
    },
    actualizarLogros(logros: string) {
      this.estructura.antecedentes.logros = logros
      if (this.estructura.antecedentes.situacion && this.estructura.antecedentes.logros) {
        this.estructura.antecedentes.capturado =
          this.estructura.antecedentes.situacion != '<p class="fr-tag"><br></p>' &&
          this.estructura.antecedentes.logros != '<p class="fr-tag"><br></p>'
            ? true
            : false
      }
    },
    obtenerSituacion() {
      $axios
        .get(
          'api/situacion/' +
            (this.diagnostico.id !== null ? this.diagnostico.id : 0) +
            '/' +
            (this.id !== null ? this.id : 0),
        )
        .then((response) => {
          this.estructura.situacion.inicializado = true
          if (response.data.hasOwnProperty('pec')) {
            this.estructura.situacion.pec.tabla = response.data.pec.tabla
            this.estructura.situacion.pec.totales = response.data.pec.totales
            this.estructura.situacion.pec.series = response.data.pec.series
          }
          if (response.data.hasOwnProperty('pem')) {
            this.estructura.situacion.pem.tabla = response.data.pem.tabla
            this.estructura.situacion.pem.totales = response.data.pem.totales
            this.estructura.situacion.pem.series = response.data.pem.series
          }
          this.estructura.situacion.capturado =
            response.data.hasOwnProperty('pec') || response.data.hasOwnProperty('pem')
        })
        .catch(() => {
          console.log('Error...')
        })
    },
    actualizarObjetivo(objetivo: string) {
      this.estructura.objetivo.captura = objetivo
      this.estructura.objetivo.capturado = (objetivo &&
        objetivo !== '<p class="fr-tag"><br></p>') as boolean
    },
    obtenerDesarrollo() {
      $axios
        .get('api/desarrollo/' + this.id)
        .then((response) => {
          this.estructura.desarrollo.inicializado = true
          if (response.data.hasOwnProperty('pec')) {
            this.estructura.desarrollo.componentes.pec = response.data.pec
          }
          if (response.data.hasOwnProperty('pem')) {
            this.estructura.desarrollo.componentes.pem = response.data.pem
          }
        })
        .catch((error) => {
          console.log('Error al obtener el desarrollo del proyecto.', error.message)
        })
    },
    obtenerComponentes({ vertiente }: VertProject) {
      return new Promise((resolve, reject) => {
        $axios
          .get('api/componentes/' + vertiente + '/' + (this.id !== null ? this.id : 0))
          .then((response) => {
            if (vertiente === '1,2') {
              this.estructura.desarrollo.listadoComponentes.pec = { datos: [] }
              this.estructura.desarrollo.listadoComponentes.pem = { datos: [] }
            } else {
              vertiente && +vertiente == 1
                ? (this.estructura.desarrollo.listadoComponentes.pec = { datos: [] })
                : (this.estructura.desarrollo.listadoComponentes.pem = { datos: [] })
            }

            response.data.datos.forEach((componente: CatComponent) => {
              componente.modelos_id === 1
                ? this.estructura.desarrollo.listadoComponentes.pec!['datos'].push(componente)
                : this.estructura.desarrollo.listadoComponentes.pem!['datos'].push(componente)
            })

            if (
              this.estructura.desarrollo.listadoComponentes.pec &&
              this.estructura.desarrollo.listadoComponentes.pec.hasOwnProperty('datos')
            ) {
              this.estructura.desarrollo.listadoComponentes.pec.datos.map((componente) => {
                componente.deshabilitado = this.estructura.desarrollo.componentes.pec.find(
                  (componentePEC) => componentePEC.id === componente.componentes_id,
                )
                  ? true
                  : false
              })
            }

            if (
              this.estructura.desarrollo.listadoComponentes.pem &&
              this.estructura.desarrollo.listadoComponentes.pem.hasOwnProperty('datos')
            ) {
              this.estructura.desarrollo.listadoComponentes.pem.datos.map((componente) => {
                componente.deshabilitado = this.estructura.desarrollo.componentes.pem.find(
                  (componentePEM) => componentePEM.id === componente.componentes_id,
                )
                  ? true
                  : false
              })
            }

            /*let respuesta = {};

                if (vertiente==='1,2') {
                    respuesta = {pec: this.desarrollo.listadoComponentes.pec.datos, pem: this.desarrollo.listadoComponentes.pem.datos}
                } else {
                    parseInt(vertiente)==1
                    ? respuesta['pec'] = this.desarrollo.listadoComponentes.pec.datos
                    : respuesta['pem'] = this.desarrollo.listadoComponentes.pem.datos;
                }*/

            resolve(response.data?.datos)
          })
          .catch((error) => {
            reject(error)
            console.log(`Error al obtener el listado de componentes por vertiente [${vertiente}]`)
          })
      })
    },
    agregarComponentes({ vertiente, componentes }: ComponentVert) {
      //console.log(componentes);

      componentes.forEach((componente) => {
        this.estructura.desarrollo.remover = this.estructura.desarrollo.remover.filter(
          (id) => id !== componente.id,
        )
      })

      if (vertiente === 1) {
        this.agregarComponentesPEC(componentes)
        return
      }
      this.agregarComponentesPEM(componentes)
    },
    agregarComponentesPEC(data: Components) {
      let $orden = 1
      this.estructura.desarrollo.componentes.pec = [
        ...this.estructura.desarrollo.componentes.pec,
        ...data,
      ]
      this.estructura.desarrollo.componentes.pec.sort((componenteA, componenteB) => {
        if (componenteA.posicion > componenteB.posicion) {
          return 1
        }
        if (componenteA.posicion < componenteB.posicion) {
          return -1
        }
        return 0
      })
      this.estructura.desarrollo.componentes.pem.sort((componenteA, componenteB) => {
        if (componenteA.posicion > componenteB.posicion) {
          return 1
        }
        if (componenteA.posicion < componenteB.posicion) {
          return -1
        }
        return 0
      })
      this.estructura.desarrollo.componentes.pec.map((componente) => {
        componente.orden = $orden
        $orden++
        return componente
      })
      this.estructura.desarrollo.componentes.pem.map((componente) => {
        componente.orden = $orden
        $orden++
        return componente
      })
    },
    agregarComponentesPEM(data: Components) {
      this.estructura.desarrollo.componentes.pem = [
        ...this.estructura.desarrollo.componentes.pem,
        ...data,
      ]
      let $orden = this.estructura.desarrollo.componentes.pec.length
      this.estructura.desarrollo.componentes.pem.sort((componenteA, componenteB) => {
        if (componenteA.posicion > componenteB.posicion) {
          return 1
        }
        if (componenteA.posicion < componenteB.posicion) {
          return -1
        }
        return 0
      })
      this.estructura.desarrollo.componentes.pem.map((componente) => {
        componente.orden = $orden + 1
        $orden++
        return componente
      })
    },
    eliminarComponente(componente: Component) {
      if (!this.estructura.desarrollo.remover.includes(componente.id)) {
        this.estructura.desarrollo.remover.push(componente.id)
      }

      if (componente.vertiente === 1) {
        this.eliminarComponentePEC(componente.id)
        return
      }
      this.eliminarComponentePEM(componente.id)
    },
    eliminarComponentePEC(id: Component['id']) {
      const listadoComponentes = this.estructura.desarrollo.componentes.pec.filter(
        (componente) => componente.id !== id,
      )
      this.estructura.desarrollo.componentes.pec = this.actualizarOrden(
        listadoComponentes,
        undefined,
      )

      this.estructura.desarrollo.componentes.pem = this.actualizarOrden(
        this.estructura.desarrollo.componentes.pem,
        this.estructura.desarrollo.componentes.pec.length,
      )

      if (!this.estructura.desarrollo.listadoComponentes.pec) {
        return
      }

      this.habilitarComponente(this.estructura.desarrollo.listadoComponentes.pec.datos, id)
    },
    eliminarComponentePEM(id: Component['id']) {
      const listadoComponentes = this.estructura.desarrollo.componentes.pem.filter(
        (componente) => componente.id !== id,
      )
      this.estructura.desarrollo.componentes.pem = this.actualizarOrden(
        listadoComponentes,
        this.estructura.desarrollo.componentes.pec.length,
      )

      if (!this.estructura.desarrollo.listadoComponentes.pem) {
        return
      }

      this.habilitarComponente(this.estructura.desarrollo.listadoComponentes.pem.datos, id)
    },
    actualizarOrden(listadoComponentes: Components, indice: number | undefined) {
      return listadoComponentes.map((value, key) => {
        value.orden = !indice ? key + 1 : indice + 1
        if (indice) {
          indice++
        }
        return value
      })
    },
    habilitarComponente(componentes: CatComponents, id: CatComponent['componentes_id']) {
      componentes.map((componente) => {
        if (componente.componentes_id === id) {
          componente.deshabilitado = false
        }
        return componente
      })
    },
    editarObjetivoComponente(data: Objective) {
      const componente = (
        data.vertiente === 1
          ? this.estructura.desarrollo.componentes.pec.find(
              (componente) => componente.id === data.componente,
            )
          : this.estructura.desarrollo.componentes.pem.find(
              (componente) => componente.id === data.componente,
            )
      ) as Component
      if (componente.hasOwnProperty('objetivos')) {
        componente.objetivos[data.index!]['objetivo'] = data.objetivo
        componente.objetivos[data.index!]['alcance'] = data.alcance

        componente.actualizado = true
      }
    },
    agregarObjetivoComponente(data: Objective) {
      const componente = (
        data.vertiente === 1
          ? this.estructura.desarrollo.componentes.pec.find(
              (componente) => componente.id === data.componente,
            )
          : this.estructura.desarrollo.componentes.pem.find(
              (componente) => componente.id === data.componente,
            )
      ) as Component
      if (componente.hasOwnProperty('objetivos')) {
        componente.objetivos.push({
          objetivo: data.objetivo,
          alcance: data.alcance,
          componente: componente.id,
          vertiente: data.vertiente,
          orden: componente.objetivos.length + 1,
        })

        componente.actualizado = true
      }
    },
    actualizarEstatusCaptura() {
      this.refresEstatusDesarrollo(this.estructura.desarrollo.componentes.pec)
      if (this.estructura.desarrollo.capturado) {
        return true
      }
      this.refresEstatusDesarrollo(this.estructura.desarrollo.componentes.pem)
    },
    refresEstatusDesarrollo(componentes: Components) {
      componentes.forEach((componente) => {
        if (componente.situacion !== '' || componente.estrategia !== '') {
          this.estructura.desarrollo.capturado =
            componente.situacion != '<p class="fr-tag"><br></p>' &&
            componente.estrategia != '<p class="fr-tag"><br></p>'
              ? true
              : this.estructura.desarrollo.capturado
          return false
        }
        if (componente.objetivos.length > 0 || componente.actividades.length > 0) {
          this.estructura.desarrollo.capturado = true
          return false
        }
      })
      return componentes
    },
    obtenerOficinas() {
      return new Promise((resolve, reject) => {
        $axios
          .get('api/oficinas/' + (this.id !== null ? this.id : 0))
          .then((response) => {
            if (response.data.hasOwnProperty('listado')) {
              this.estructura.desarrollo.listadoOficinas = response.data.listado
            }

            if (response.data.hasOwnProperty('listado')) {
              this.inicializarListadoOficinas({ data: response.data.listado, id: 14 })
            }

            resolve(response.data)
          })
          .catch((error) => {
            console.log('Error...')
            reject(error)
          })
      })
    },
    inicializarListadoOficinas({ data, id }: InitOffices) {
      const componente = this.estructura.desarrollo.componentes.pem.find(
        (componente) => componente.id === id,
      )
      if (!componente || !componente.hasOwnProperty('acervo')) {
        return
      }
      componente.acervo!['listado'] = data
    },
    agregarOficina(data: ParamOffice) {
      return new Promise((resolve, reject) => {
        $axios
          .get(
            'api/oficina/' +
              data.id +
              '/' +
              (this.diagnostico.id !== null ? this.diagnostico.id : 0),
          )
          .then((response) => {
            if (!response.data.hasOwnProperty('acervo')) {
              return
            }
            const componente = this.estructura.desarrollo.componentes.pem.find(
              ($componente) => $componente.id === data.componente_id,
            )
            if (
              !componente!.hasOwnProperty('acervo') ||
              !componente?.acervo!.hasOwnProperty('oficinas')
            ) {
              return
            }

            componente?.acervo!.oficinas.push(response.data)
            componente?.acervo!.listado.map(function (oficina) {
              if (oficina.detalle_oficinas_id === response.data.id) {
                oficina.agregada = true
              }
              return oficina
            })

            componente.actualizado = true
            resolve(response.data)
          })
          .catch((error) => {
            console.log('Error...')
            reject(error)
          })
      })
    },
    removerOficina(data: ParamOffice) {
      const componente = this.estructura.desarrollo.componentes.pem.find(
        (componente) => componente.id === data.componente_id,
      )

      if (componente?.acervo?.oficinas) {
        componente.acervo.oficinas = componente?.acervo!.oficinas.filter(
          (oficina) => oficina.id !== data.id,
        )
      }

      componente?.acervo!.listado.map(function (oficina) {
        if (oficina.detalle_oficinas_id === data.id) {
          oficina.agregada = false
        }
        return oficina
      })

      if (componente) {
        componente.actualizado = true
      }
    },
    obtenSubcomponente(componenteId: Component['id']) {
      return new Promise((resolve, reject) => {
        $axios
          .get('api/subcomponente/' + componenteId + '/' + (this.id !== null ? this.id : 0))
          .then((response) => {
            if (response.data.hasOwnProperty(componenteId)) {
              this.estructura.desarrollo.catalogos.subComponentes[componenteId] =
                response.data[componenteId]
            }
            resolve(response.data)
          })
          .catch((error) => {
            console.log('Error...')
            reject(error)
          })
      })
    },
    obtenerSubActividades(actividadId: Activity['act']) {
      return new Promise((resolve, reject) => {
        $axios
          .get('api/subactividades/' + actividadId)
          .then((response) => {
            resolve(response.data)
          })
          .catch((error) => {
            console.log('Error...')
            reject(error)
          })
      })
    },
    obtenEntregables(componenteId: Component['id']) {
      return new Promise((resolve, reject) => {
        $axios
          .get('api/entregables/' + componenteId)
          .then((response) => {
            if (response.data.hasOwnProperty(componenteId)) {
              this.estructura.desarrollo.catalogos.entregables[componenteId] =
                response.data[componenteId]
            }
            resolve(response.data)
          })
          .catch((error) => {
            console.log('Error...')
            reject(error)
          })
      })
    },
    eliminarObjetivoComponente(data: RemoveObjective) {
      const componente =
        data.vertiente === 1
          ? this.estructura.desarrollo.componentes.pec.find(
              (componente) => componente.id === data.componente,
            )
          : this.estructura.desarrollo.componentes.pem.find(
              (componente) => componente.id === data.componente,
            )
      if (componente?.objetivos) {
        componente.objetivos.splice(data.index, 1)

        componente.actualizado = true
      }
    },
    agregarActividadComponente(data: ParamActivity) {
      const componente =
        data.vertiente === 1
          ? this.estructura.desarrollo.componentes.pec.find(
              (componente) => componente.id === data.id,
            )
          : this.estructura.desarrollo.componentes.pem.find(
              (componente) => componente.id === data.id,
            )

      if (componente && !componente.hasOwnProperty('actividades')) {
        componente['actividades'] = []
      }

      if (componente) {
        componente.actividades.push(data.actividad)
        componente.total += data.actividad.total
        componente.actualizado = true
      }
    },
    editarActividadComponente(data: ParamActivity) {
      const componente =
        data.vertiente === 1
          ? this.estructura.desarrollo.componentes.pec.find(
              (componente) => componente.id === data.id,
            )
          : this.estructura.desarrollo.componentes.pem.find(
              (componente) => componente.id === data.id,
            )

      if (!componente || !componente?.actividades) {
        return
      }
      const index = componente.actividades.findIndex(
        (actividad) => actividad.id === data.actividad.id,
      )
      componente.actividades.splice(index, 1, data.actividad)

      componente.total = 0
      componente.actividades.forEach((actividad) => {
        componente.total += actividad.total
      })

      componente.actualizado = true
    },
    eliminarActividadComponente(data: RemoveActivity) {
      const componente =
        data.vertiente === 1
          ? this.estructura.desarrollo.componentes.pec.find(
              (componente) => componente.id === data.componente_id,
            )
          : this.estructura.desarrollo.componentes.pem.find(
              (componente) => componente.id === data.componente_id,
            )
      if (!componente || !componente.actividades || componente.actividades.length == 0) {
        return
      }
      const index = componente.actividades.findIndex(
        (actividad) => actividad.id === data.actividad_id,
      )
      componente.actividades.splice(index, 1)
      componente.total = 0
      componente.actividades.forEach((actividad) => {
        componente.total += actividad.total
      })

      componente.actualizado = true
    },
    obtenUnidades() {
      return new Promise((resolve, reject) => {
        $axios
          .get('api/unidades')
          .then((response) => {
            this.estructura.desarrollo.catalogos.unidades = response.data
            resolve(response.data)
          })
          .catch((error) => {
            console.log('Error...')
            reject(error)
          })
      })
    },
    obtenMunicipios() {
      return new Promise((resolve, reject) => {
        $axios
          .get('api/municipios' + '/' + (this.id != null ? this.id : 0))
          .then((response) => {
            this.estructura.desarrollo.catalogos.municipios = response.data
            resolve(response.data)
          })
          .catch((error) => {
            console.log('Error...')
            reject(error)
          })
      })
    },
    inicializarPrograma() {
      this.estructura.programa.inicializado = true
    },
    actualizarCapturaPrograma() {
      this.estructura.programa.capturado = false
      this.estructura.desarrollo.componentes.pec.forEach((componente) => {
        if (Object.keys(componente.programa).length > 0) {
          this.estructura.programa.capturado = true
        }
      })
      if (this.estructura.programa.capturado) {
        return false
      }
      this.estructura.desarrollo.componentes.pem.forEach((componente) => {
        if (Object.keys(componente.programa).length > 0) {
          this.estructura.programa.capturado = true
        }
      })
    },
    programar(data: ParamProgramar) {
      const componente =
        data.vertiente === 1
          ? this.estructura.desarrollo.componentes.pec.find(
              (componente) => componente.id === data.id,
            )
          : this.estructura.desarrollo.componentes.pem.find(
              (componente) => componente.id === data.id,
            )
      if (!componente) {
        return
      }

      if (!componente.programa) {
        componente['programa'] = {}
        componente.programa[data.idSubcomp] = []
      }

      componente.programa[data.idSubcomp].push(data.mes)
    },
    desProgramar(data: ParamProgramar) {
      const componente =
        data.vertiente === 1
          ? this.estructura.desarrollo.componentes.pec.find(
              (componente) => componente.id === data.id,
            )
          : this.estructura.desarrollo.componentes.pem.find(
              (componente) => componente.id === data.id,
            )
      if (!componente || !componente?.programa[data.idSubcomp]) {
        return
      }

      const index = componente.programa[data.idSubcomp].findIndex((mes) => mes === data.mes)

      if (index !== -1) {
        componente.programa[data.idSubcomp].splice(index, 1)
      }
    },
    desProgramarTodos($mes: number) {
      this.estructura.desarrollo.componentes.pec.map((componente) => {
        for (const idSupComp in componente.programa) {
          const index = componente.programa[idSupComp].findIndex((mes) => +mes === $mes)
          if (index !== -1) {
            componente.programa[idSupComp].splice(index, 1)
          }
        }
      })
      this.estructura.desarrollo.componentes.pem.map((componente) => {
        for (const idSupComp in componente.programa) {
          const index = componente.programa[idSupComp].findIndex((mes) => +mes === $mes)
          if (index !== -1) {
            componente.programa[idSupComp].splice(index, 1)
          }
        }
      })
    },
    inicializarResumen(estatus: boolean = true) {
      this.estructura.resumen.inicializado = estatus
    },
    actualizarCapturaResumen(estatus: boolean = true) {
      this.estructura.resumen.capturado = estatus
    },
    distribucionCalculada(estatus: boolean = true) {
      this.estructura.resumen.calculado = estatus
    },
    asignarNumDecPorcentaje(numDec: number) {
      this.estructura.resumen.porcDecimales = numDec
    },
    actualizarDistribucion(distribucion: never, $listado: never) {
      this.anio && this.anio < 2018
        ? (this.estructura.resumen.distribucionV1 = distribucion)
        : (this.estructura.resumen.distribucionV2 = distribucion)

      this.estructura.resumen.listado = $listado
    },
    //actualizarAporteFederal
    asignarAporteFederal(monto: number) {
      this.anio && this.anio < 2018
        ? (this.estructura.resumen.distribucionV1.gTotal.federal = monto)
        : (this.estructura.resumen.distribucionV2.gTotal.federal = monto)

      this.estructura.resumen.millar = numberFormat(
        (monto * this.estructura.resumen.alMillar) / 1000,
      )

      this.anio && this.anio < 2018
        ? (this.estructura.resumen.distribucionV1.millar.federal =
            this.estructura.resumen.distribucionV1.millar.total =
              this.estructura.resumen.millar!)
        : (this.estructura.resumen.distribucionV2.millar.federal =
            this.estructura.resumen.distribucionV2.millar.total =
              this.estructura.resumen.millar!)

      this.anio && this.anio < 2018
        ? (this.estructura.resumen.distribucionV1.total.federal =
            monto - this.estructura.resumen.millar!)
        : (this.estructura.resumen.distribucionV2.total.federal =
            monto - this.estructura.resumen.millar!)

      this.anio && this.anio < 2018
        ? (this.estructura.resumen.distribucionV1.total.estatal =
            this.estructura.resumen.distribucionV1.total.total -
            (monto - this.estructura.resumen.millar!))
        : (this.estructura.resumen.distribucionV2.total.estatal =
            this.estructura.resumen.distribucionV2.total.total -
            (monto - this.estructura.resumen.millar!))

      this.anio && this.anio < 2018
        ? (this.estructura.resumen.distribucionV1.gTotal.estatal =
            this.estructura.resumen.distribucionV1.total.estatal)
        : (this.estructura.resumen.distribucionV2.gTotal.estatal =
            this.estructura.resumen.distribucionV2.total.estatal)

      this.anio && this.anio < 2018
        ? (this.estructura.resumen.distribucionV1.gTotal.total = numberFormat(
            monto + this.estructura.resumen.distribucionV1.gTotal.estatal!,
          ))
        : (this.estructura.resumen.distribucionV2.gTotal.total = numberFormat(
            monto + this.estructura.resumen.distribucionV2.gTotal.estatal!,
          ))

      let gTotal =
        this.estructura.resumen.distribucionV2.gTotal.total &&
        this.estructura.resumen.distribucionV2.gTotal.total > 0
          ? this.estructura.resumen.distribucionV2.gTotal.total
          : 1

      if (this.anio && this.anio < 2018) {
        gTotal =
          this.estructura.resumen.distribucionV1.gTotal.total &&
          this.estructura.resumen.distribucionV1.gTotal.total > 0
            ? this.estructura.resumen.distribucionV1.gTotal.total
            : 1
      }

      this.anio && this.anio < 2018
        ? (this.estructura.resumen.distribucionV1.porcentaje.federal = this.calcularPorcentaje(
            this.estructura.resumen.distribucionV1.gTotal.federal,
            gTotal,
            this.estructura.resumen.porcDecimales,
          ))
        : (this.estructura.resumen.distribucionV2.porcentaje.federal = this.calcularPorcentaje(
            this.estructura.resumen.distribucionV2.gTotal.federal,
            gTotal,
            this.estructura.resumen.porcDecimales,
          ))

      this.anio && this.anio < 2018
        ? (this.estructura.resumen.distribucionV1.porcentaje.estatal = this.calcularPorcentaje(
            this.estructura.resumen.distribucionV1.gTotal.estatal!,
            gTotal,
            this.estructura.resumen.porcDecimales,
          ))
        : (this.estructura.resumen.distribucionV2.porcentaje.estatal = this.calcularPorcentaje(
            this.estructura.resumen.distribucionV2.gTotal.estatal!,
            gTotal,
            this.estructura.resumen.porcDecimales,
          ))

      this.estructura.resumen.porcentaje.federal =
        this.anio && this.anio < 2018
          ? this.calcularPorcentaje(
              this.estructura.resumen.distribucionV1.total.federal,
              this.estructura.resumen.distribucionV1.total.total,
              this.estructura.resumen.porcDecimales,
            )
          : this.calcularPorcentaje(
              this.estructura.resumen.distribucionV2.total.federal,
              this.estructura.resumen.distribucionV2.total.total,
              this.estructura.resumen.porcDecimales,
            )

      this.estructura.resumen.porcentaje.estatal =
        this.anio && this.anio < 2018
          ? this.calcularPorcentaje(
              this.estructura.resumen.distribucionV1.total.estatal!,
              this.estructura.resumen.distribucionV1.total.total,
              this.estructura.resumen.porcDecimales,
            )
          : this.calcularPorcentaje(
              this.estructura.resumen.distribucionV2.total.estatal!,
              this.estructura.resumen.distribucionV2.total.total,
              this.estructura.resumen.porcDecimales,
            )

      this.actualizarAportacionesComponente()
    },
    calcularPorcentaje(cantidad: number, tope: number, $decimales: number) {
      const $tope = tope > 0 ? tope : 1

      let porcentaje = (cantidad / $tope) * 100

      if ($decimales && $decimales > 0) {
        porcentaje = numeral(porcentaje).format('0.' + decimales($decimales))
        porcentaje = numeral(porcentaje).value()
      }
      return $decimales && $decimales > 0 ? porcentaje : parseInt(porcentaje)
    },
    actualizarAportacionesComponente() {
      this.estructura.desarrollo.componentes.pec = this.estructura.desarrollo.componentes.pec.map(
        ($componente) => {
          $componente.aporteFederal = numberFormat(
            (this.estructura.resumen.porcentaje.federal * $componente.total) / 100,
          )
          $componente.aporteEstatal = numberFormat(
            (this.estructura.resumen.porcentaje.estatal! * $componente.total) / 100,
          )

          if (
            numberFormat($componente.aporteFederal + $componente.aporteEstatal) !==
            numberFormat($componente.total)
          ) {
            $componente.aporteEstatal = numberFormat($componente.total - $componente.aporteFederal)
          }

          return $componente
        },
      )

      this.estructura.desarrollo.componentes.pem = this.estructura.desarrollo.componentes.pem.map(
        ($componente) => {
          $componente.aporteFederal = numberFormat(
            (this.estructura.resumen.porcentaje.federal * $componente.total) / 100,
          )
          $componente.aporteEstatal = numberFormat(
            (this.estructura.resumen.porcentaje.estatal * $componente.total) / 100,
          )

          if (
            numberFormat($componente.aporteFederal + $componente.aporteEstatal) !==
            numberFormat($componente.total)
          ) {
            $componente.aporteEstatal = numberFormat($componente.total - $componente.aporteFederal)
          }

          return $componente
        },
      )
    },
    obtenerFiscalizacion() {
      $axios
        .get('api/fiscalizacion' + '/' + (this.id !== null ? this.id : 0))
        .then((response) => {
          this.estructura.resumen.millar = response.data.millar
        })
        .catch(() => {
          console.log('Error...')
        })
    },
    actualizarObservacionResumen(data: string) {
      this.estructura.resumen.observaciones = data
    },
    actualizarResultado(data: string) {
      this.estructura.resultados.captura = data
      this.estructura.resultados.capturado = (data &&
        data != '<p class="fr-tag"><br></p>') as boolean
    },
    actualizarEstatusAnexos(estatus: boolean) {
      this.estructura.anexos.inicializado = estatus
      this.estructura.anexos.capturado = estatus
    },
    agregarAnexo(data: ParamAnexo) {
      const componente =
        data.vertiente === 1
          ? this.estructura.desarrollo.componentes.pec.find(
              (componente) => componente.id === data.idComponente,
            )
          : this.estructura.desarrollo.componentes.pem.find(
              (componente) => componente.id === data.idComponente,
            )

      if (!componente || !componente?.actividades || componente?.actividades?.length == 0) {
        return
      }

      const actividad = componente.actividades.find(
        (actividad) => actividad.id === data.idActividad,
      )
      if (!actividad) {
        return
      }
      actividad.anexos = data.anexos
      componente.actualizado = true
    },
    eliminarAnexo(data: RemoveAnexo) {
      const componente =
        data.vertiente === 1
          ? this.estructura.desarrollo.componentes.pec.find(
              (componente) => componente.id === data.idComponente,
            )
          : this.estructura.desarrollo.componentes.pem.find(
              (componente) => componente.id === data.idComponente,
            )

      if (!componente || !componente?.actividades || componente?.actividades?.length == 0) {
        return
      }

      const actividad = componente.actividades.find(
        (actividad) => actividad.id === data.idActividad,
      )

      if (!actividad || !actividad?.anexos || actividad?.anexos?.length == 0) {
        return
      }

      const index = actividad.anexos.findIndex((anexo) => anexo.id_anexo === data.idAnexo)

      if (index !== -1) {
        actividad.anexos.splice(index, 1)
        componente.actualizado = true
      }
    },
    obtenerPDF() {
      return new Promise((resolve, reject) => {
        $axios({
          url: 'api/pdf' + '/' + (this.id !== null ? this.id : 0),
          method: 'GET',
          responseType: 'arraybuffer',
        })
          .then((response) => {
            resolve(response.data)
          })
          .catch((error) => {
            console.log('Error...')
            reject(error)
          })
      })
    },
  },
})
