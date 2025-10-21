import z from 'zod'
import {
  CatComponentSchema,
  CatComponentsSchema,
  ObjectiveSchema,
  ObjectivesSchema,
  ComponentSchema,
  ComponentsSchema,
  AcquisSchema,
} from '@/schema/component-schema'
import type { VertProject } from './project'
import type {
  OfficeDiagnosticSchema,
  OfficesDiagnosticSchema,
  OfficeAcquisSchema,
  OfficesAcquisSchema,
} from '@/schema/office-schema'
import type { Activities, Activity, Anexo, Anexos, SubComponente } from './activity'

export type OfficeDiagnostic = z.infer<typeof OfficeDiagnosticSchema>

export type OfficesDiagnostic = z.infer<typeof OfficesDiagnosticSchema>

export type OfficeAcquis = z.infer<typeof OfficeAcquisSchema>

export type OfficesAcquis = z.infer<typeof OfficesAcquisSchema>

export type Acquis = z.infer<typeof AcquisSchema>

export type CatComponent = z.infer<typeof CatComponentSchema>

export type CatComponents = z.infer<typeof CatComponentsSchema>

export type Objective = z.infer<typeof ObjectiveSchema>

export type Objectives = z.infer<typeof ObjectivesSchema>

export type Component = z.infer<typeof ComponentSchema>

export type Components = z.infer<typeof ComponentsSchema>

export type ComponentVert = VertProject & {
  componentes: Components
}

export type InitOffices = {
  data: OfficesDiagnostic
  id: Component['id']
}

export type ParamOffice = {
  id: OfficeDiagnostic['detalle_oficinas_id']
  componente_id: Component['id']
}

export type RemoveObjective = {
  componente: Component['id']
  vertiente: Component['vertiente']
  index: number
}

export type ParamActivity = {
  vertiente: Component['vertiente']
  actividad: Activity
  id: Component['id']
}

export type RemoveActivity = {
  actividad_id: Activity['id']
  componente_id: Component['id']
  vertiente: Component['vertiente']
}

export type ParamProgramar = {
  id: Component['id']
  idSubcomp: SubComponente['id_subcomponente']
  vertiente: number
  mes: string
}

export type ParamAnexo = {
  idActividad: Activity['id']
  idComponente: Component['id']
  vertiente: Component['vertiente']
  anexos: Anexos
}

export type RemoveAnexo = {
  idActividad: Activity['id']
  idComponente: Component['id']
  vertiente: Component['vertiente']
  anexos: Anexos
  idAnexo: Anexo['id_anexo']
}

export type AnexoExtra = Anexo & {
  idComponente: Component['id']
  vertiente: Component['vertiente']
}

export type ProgramActivities = Record<string, Activities>

export type ProgramComponent = {
  nombre: Component['nombre']
  vertiente: Component['vertiente']
  actividades: ProgramActivities
  programa: Component['programa']
}

export type ProgramComponents = Record<Component['id'], ProgramComponent>
