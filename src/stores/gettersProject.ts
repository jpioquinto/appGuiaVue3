import type { Entregable, Entregables, SubComponente, SubComponentes } from '@/types/activity'
import type { Component } from '@/types/component'
import type { StateProject } from '@/types/project'

export default {
  estaCargado(state: StateProject) {
    return function (componente: string) {
      if (!state.estructura[componente as keyof typeof state.estructura]) {
        return false
      }
      return state.estructura[componente as keyof typeof state.estructura].inicializado
    }
  },
  removerComponente(state: StateProject) {
    return state.estructura.desarrollo.remover
  },
  obtenerIVA(state: StateProject) {
    return state.iva
  },
  obtenerAnio(state: StateProject): number | null {
    return state.anio
  },
  obtenerEstatus(state: StateProject) {
    return state.estatus
  },
  listadoComponentes(state: StateProject) {
    return function ($vertiente: number) {
      return $vertiente == 1
        ? state.estructura.desarrollo.listadoComponentes.pec
        : state.estructura.desarrollo.listadoComponentes.pem
    }
  },
  obtenerVertienteProyecto(state: StateProject) {
    return state.vertiente
  },
  obtenerTotalComponentesPEC(state: StateProject) {
    return state.estructura.desarrollo.componentes.pec
      ? state.estructura.desarrollo.componentes.pec.length
      : 0
  },
  obtenerTotalComponentesPEM(state: StateProject) {
    return state.estructura.desarrollo.componentes.pem
      ? state.estructura.desarrollo.componentes.pem.length
      : 0
  },
  obtenerSubcomponente(state: StateProject) {
    return function ($id: Component['id']) {
      if (state.estructura.desarrollo.catalogos.subComponentes.hasOwnProperty($id)) {
        return state.estructura.desarrollo.catalogos.subComponentes[$id]
      }

      return [] as SubComponentes
    }
  },
  obtenerEntregables(state: StateProject) {
    return function ($id: Component['id']) {
      if (state.estructura.desarrollo.catalogos.entregables.hasOwnProperty($id)) {
        return state.estructura.desarrollo.catalogos.entregables[$id]
      }

      return [] as Entregables
    }
  },
  obtenerUnidades(state: StateProject) {
    return state.estructura.desarrollo.catalogos.unidades
  },
  obtenerMunicipios(state: StateProject) {
    return state.estructura.desarrollo.catalogos.municipios
  },
  obtenerListaOficinas(state: StateProject) {
    return Array.isArray(state.estructura.desarrollo.listadoOficinas)
      ? state.estructura.desarrollo.listadoOficinas
      : []
  },
  obtenerDistribucion(state: StateProject) {
    if (state.anio && state.anio < 2018) {
      return state.estructura.resumen.distribucionV1
    }
    return state.estructura.resumen.distribucionV2
  },
  obtenerRedistribuirMontos(state: StateProject) {
    return state.estructura.resumen.redistribuir
  },
  obtenerAlMillar(state: StateProject) {
    return state.estructura.resumen.alMillar / 1000
  },
}
