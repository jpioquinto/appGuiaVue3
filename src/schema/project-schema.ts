import z from 'zod'

export const ProjectSchema = z.object({
  id: z.number(),
  vertiente: z.string(),
  descVertiente: z.optional(z.string().nullable()),
  diagnosticoId: z.number(),
  appDiag: z.number(),
  millar: z.number().nullable(),
  porcFed: z.number().nullable(),
  porcEst: z.number().nullable(),
  estatal: z.optional(z.boolean()),
  version: z.number(),
  anio: z.number(),
  estatus: z.number(),
})

export const ProjectsSchema = z.array(ProjectSchema)
