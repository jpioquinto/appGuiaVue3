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

export const OfficeAcquisSchema = z.object({
  actualizar: z.boolean(),
  nombre: z.string(),
  acervo: OfficesDiagnosticSchema,
  total: TotalAcquisSchema,
  id: z.string(),
})

export const OfficesAcquisSchema = z.array(OfficeAcquisSchema)
