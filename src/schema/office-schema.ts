import { z } from 'zod'

export const OfficeDiagnosticSchema = z.object({
  detalle_oficinas_id: z.number(),
  detalle_diagnosticos_id: z.number(),
  oficina: z.string(),
  municipios: z.string(),
  color: z.string(),
  numero_oficina: z.number(),
  interconexion: z.number(),
  agregada: z.boolean(),
})

export const OfficesDiagnosticSchema = z.array(OfficeDiagnosticSchema)

export const TotalAcquisSchema = z.object({
  concepto: z.string(),
  existente: z.number(),
  digitalizado: z.number(),
  porcentaje: z.number(),
  librosLegajos: z.number(),
  numImagenes: z.number(),
})

export const AcquisSchema = z.object({
  id_oficina_reg: z.optional(z.number()),
  concepto: z.string(),
  acervo_existe: z.number(),
  acervo_digitalizado: z.number(),
  porc_digitalizado: z.number(),
  libros_legajos: z.number(),
  num_imagenes: z.number(),
})

export const AcquisCollectionsSchema = z.array(AcquisSchema)

export const OfficeAcquisSchema = z.object({
  actualizar: z.boolean(),
  nombre: z.string(),
  acervo: AcquisCollectionsSchema,
  total: TotalAcquisSchema,
  id: z.number(),
})

export const OfficesAcquisSchema = z.array(OfficeAcquisSchema)
