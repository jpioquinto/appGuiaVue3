import { z } from 'zod'

export const AnexoSchema = z.object({
  ext: z.string(),
  nombre_anterior: z.string(),
  id_actividad: z.number(),
  id_anexo: z.number().or(z.string()),
  nombre: z.string(),
  archivo: z.object().nullable(),
  descripcion: z.string(),
  url: z.string(),
})

export const AnexosSchema = z.array(AnexoSchema)

export const ActivitySchema = z.object({
  anexos: AnexosSchema,
  id: z.string().or(z.number()),
  descSubcomp: z.string().nullable(),
  descAct: z.string().nullable(),
  descSubAct: z.string().nullable(),
  descEntregable: z.string().nullable(),
  descUnidad: z.string().nullable(),
  subcomp: z.number(),
  act: z.number(),
  subact: z.number().nullable(),
  desc: z.string(),
  entregable: z.number(),
  unidad: z.number(),
  munpios: z.object(),
  cantidad: z.number(),
  costo: z.number(),
  iva: z.number(),
  total: z.number(),
  conIVA: z.boolean(),
  tipoRecurso: z.number(),
  toggleText: z.boolean(),
  placeHolderDescAct: z.string(),
  placeHolderDesc: z.string(),
  placeHolderEnt: z.string(),
})

export const ActivitiesSchema = z.array(ActivitySchema)
