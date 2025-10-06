import z from 'zod'

import type {
  ActivitiesSchema,
  ActivitySchema,
  AnexoSchema,
  AnexosSchema,
  CatActividadesSchema,
  CatActividadSchema,
  CatSubActividadesSchema,
  CatSubActividadSchema,
  EntregableSchema,
  EntregablesSchema,
  MunicipioSchema,
  MunicipiosSchema,
  SubComponenteSchema,
  SubComponentesSchema,
  UnidadesSchema,
  UnidadSchema,
} from '@/schema/activity-schema'

export type CatSubActividad = z.infer<typeof CatSubActividadSchema>

export type CatSubActividades = z.infer<typeof CatSubActividadesSchema>

export type CatActividad = z.infer<typeof CatActividadSchema>

export type CatActividades = z.infer<typeof CatActividadesSchema>

export type SubComponente = z.infer<typeof SubComponenteSchema>

export type SubComponentes = z.infer<typeof SubComponentesSchema>

export type Entregable = z.infer<typeof EntregableSchema>

export type Entregables = z.infer<typeof EntregablesSchema>

export type Unidad = z.infer<typeof UnidadSchema>

export type Unidades = z.infer<typeof UnidadesSchema>

export type Municipio = z.infer<typeof MunicipioSchema>

export type Municipios = z.infer<typeof MunicipiosSchema>

export type Anexo = z.infer<typeof AnexoSchema>

export type Anexos = z.infer<typeof AnexosSchema>

export type Activity = z.infer<typeof ActivitySchema>

export type Activities = z.infer<typeof ActivitiesSchema>
