import type { Ref } from 'vue'
import type { SubComponente } from './activity'
import type { Component, OfficeAcquis } from './component'
import type { Distribucion, StateProject } from './project'

export type CheckboxProps = {
  mes: string
  programados: string[]
  idComponente: Component['id']
  idSubcomp: SubComponente['id_subcomponente']
  vertiente: Component['vertiente']
  estatus: StateProject['estatus']
  index: number
}

export type RowTotalsProps = {
  estatus?: StateProject['estatus']
  distribucion: Distribucion
  numDecimales: number
  fila: string
}

export type InputNumericProps = {
  cantidad: number
  numDecimal: number
  activar: boolean
  prefijo: string
  sufijo: string
  formato: boolean
}

export type TableOfficeProps = {
  nombre: OfficeAcquis['nombre']
  oficina: OfficeAcquis['acervo']
  total: OfficeAcquis['total']
  id: OfficeAcquis['id']
  actualizar: OfficeAcquis['actualizar']
  estatus: StateProject['estatus']
}

export type ChartSerie = {
  category: string
  puntaje: number
  estimacion: number
  modelo: number
}

export default interface Distribute {
  redistribuir: Ref<boolean>
  redistribuirMontos: (newValue: boolean) => void
}
