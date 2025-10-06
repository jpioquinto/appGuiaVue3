import type { Activity, Anexo, Anexos } from '@/types/activity'
import type { Component } from './component'
import type { StateProject } from './project'

export type AppurtenantModalProps = {
  anio: number
  anexos: Anexos
  componente_id: Component['id']
  vertiente: Component['vertiente']
  actividad_id: Activity['id']
  estatus: StateProject['estatus']
  nombre: Anexo['nombre']
  numActividad: number
  activa: boolean
}

export type ActivityModalProps = {
  vertiente: Component['vertiente']
  componente_id: Component['id']
  currentActivity: Activity
  agregar: boolean
  activa: boolean
}

export type ErrorActivity = {
  cantidad: string | null
  costo: string | null
}

export type DataMask = {
  cantidad: string
  costo: string
  iva: string
}
