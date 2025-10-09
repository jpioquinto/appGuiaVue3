import type { Acquis, Component, Objective } from './component'
import type { StateProject } from './project'

export type ComponentCardProps = {
  indice: number
  anio: number
  componente: Component
}

export type ComponentModalProps = {
  vertiente: number
  activa: boolean
}

export type ObjectiveModalProps = {
  vertiente: Component['vertiente']
  componente: Component['id']
  objetivoActual?: Objective
  activa: boolean
}

export type ActivitiesComponentProps = {
  estatus: StateProject['estatus']
  anio: StateProject['anio']
  componente: Component
}

export type ObjectiveComponentProps = {
  indice: number
  ordencomponente: number
  punto: number
  orden: number
  objetivo: Objective
  componenteId: Component['id']
  vertiente: Component['vertiente']
  estatus: StateProject['estatus']
}

export type RegistryOfficesProps = {
  listado: Acquis['listado']
  oficinas: Acquis['oficinas']
  estatus: StateProject['estatus']
}
