import z from 'zod'
import {
  CatComponentSchema,
  CatComponentsSchema,
  ObjectiveSchema,
  ObjectivesSchema,
  ComponentSchema,
  ComponentsSchema,
} from '@/schema/component-schema'
import type { VertProject } from './project'
import type {
  OfficeDiagnosticSchema,
  OfficesDiagnosticSchema,
  OfficeAcquisSchema,
  OfficesAcquisSchema,
} from '@/schema/office-schema'

export type OfficeDiagnostic = z.infer<typeof OfficeDiagnosticSchema>

export type OfficesDiagnostic = z.infer<typeof OfficesDiagnosticSchema>

export type OfficeAcquis = z.infer<typeof OfficeAcquisSchema>

export type OfficesAcquis = z.infer<typeof OfficesAcquisSchema>

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
