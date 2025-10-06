import { z } from 'zod'

export const CatSubActividadSchema = z.object({
  id_subactividad: z.number(),
  vertiente: z.string().nullable(),
  subactividad: z.string().nullable(),
  estatus: z.number().nullable(),
  parametros_enlace_cat: z.number().nullable(),
  parametros_enlace_rpp: z.number().nullable(),
})

export const CatSubActividadesSchema = z.array(CatSubActividadSchema)

export const CatActividadSchema = z.object({
  id_actividad: z.number(),
  vertiente: z.optional(z.string()),
  id_subcomponente: z.number(),
  actividad: z.string(),
  estatus: z.number(),
  ponderacion: z.number().nullable(),
  diagnostico: z.string().nullable(),
  parametros_enlace_cat: z.number().nullable(),
  parametros_enlace_rpp: z.number().nullable(),
})

export const CatActividadesSchema = z.array(CatActividadSchema)

export const SubComponenteSchema = z.object({
  id_subcomponente: z.number(),
  componente: z.string(),
  subcomponente: z.string(),
  estatus: z.number(),
  criterios_enlace_cat: z.number().nullable(),
  criterios_enlace_rpp: z.number().nullable(),
  diagnostico: z.string(),
  actividades: z.optional(CatActividadesSchema),
})

export const SubComponentesSchema = z.array(SubComponenteSchema)

export const EntregableSchema = z.object({
  id_entregable: z.number(),
  id_componente: z.string(),
  entregable: z.string(),
  estatus: z.number(),
})

export const EntregablesSchema = z.array(EntregableSchema)

export const UnidadSchema = z.object({
  id_unidad: z.number(),
  unidad: z.string(),
  estatus: z.number(),
  contable: z.number(),
})

export const UnidadesSchema = z.array(UnidadSchema)

export const MunicipioSchema = z.object({
  municipio_id: z.number(),
  estado_id: z.number(),
  municipio: z.string(),
  coordenadas: z.string(),
})

export const MunicipiosSchema = z.array(MunicipioSchema)

export const AnexoSchema = z.object({
  ext: z.string(),
  nombre_anterior: z.string(),
  id_actividad: z.number().or(z.string()),
  id_anexo: z.number().or(z.string()),
  nombre: z.string(),
  archivo: z.file().nullable(),
  descripcion: z.string(),
  url: z.string(),
})

export const AnexosSchema = z.array(AnexoSchema)

export const ActivitySchema = z.object({
  anexos: z.optional(AnexosSchema),
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
  munpios: z.array(z.number()),
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
