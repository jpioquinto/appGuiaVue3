import type { Component, Objective } from './component'

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
