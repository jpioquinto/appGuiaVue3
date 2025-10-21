import { z } from 'zod'
import { ActivitiesSchema } from './activity-schema'
import { OfficesAcquisSchema, OfficesDiagnosticSchema } from './office-schema'

export const CatComponentSchema = z.object({
  deshabilitado: z.boolean(),
  componentes_id: z.number(),
  modelos_id: z.number(),
  nombre: z.string(),
  nombre_corto: z.string(),
  orden: z.number(),
  aporteFederal: z.optional(z.number().or(z.string())),
  aporteEstatal: z.optional(z.number().or(z.string())),
  total: z.optional(z.number().or(z.string())),
})

export const CatComponentsSchema = z.array(CatComponentSchema)

export const ObjectiveSchema = z.object({
  objetivo: z.string(),
  alcance: z.string(),
  componente: z.number(),
  vertiente: z.number(),
  index: z.optional(z.number()),
  orden: z.optional(z.number()),
})

export const ObjectivesSchema = z.array(ObjectiveSchema)

export const AcquisSchema = z.object({
  listado: OfficesDiagnosticSchema,
  oficinas: OfficesAcquisSchema,
})

export const ProgramaSchema = z.record(z.number(), z.array(z.string()))

export const ComponentSchema = z.object({
  id: z.number(),
  vertiente: z.number(),
  nombre: z.string(),
  orden: z.number(),
  situacion: z.string().nullable(),
  objetivos: ObjectivesSchema,
  actividades: ActivitiesSchema,
  programa: ProgramaSchema,
  estrategia: z.string().nullable(),
  aporteFederal: z.number(),
  aporteEstatal: z.number(),
  posicion: z.number(),
  total: z.number(),
  acervo: z.optional(AcquisSchema),
  actualizado: z.boolean(),
})

export const ComponentsSchema = z.array(ComponentSchema)
