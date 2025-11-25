import z from 'zod'

export const EntidadSchema = z.object({
  id: z.number(),
  entidad: z.string(),
  escudo: z.string(),
  edoIso: z.string(),
  poblacion: z.number().nullable(),
  extTerritorial: z.number().nullable(),
  distUrbana: z.number().nullable(),
  distRural: z.number().nullable(),
  abreviatura: z.string().nullable(),
})

export const EntidadesSchema = z.array(EntidadSchema)
