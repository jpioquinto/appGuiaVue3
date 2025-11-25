import z from 'zod'

export const ProjectSchema = z.object({
  id: z.number(),
  vertiente: z.string(),
  descEstatus: z.optional(z.string().nullable()),
  diagnosticoId: z.number(),
  appDiag: z.number(),
  millar: z.number().nullable(),
  porcFed: z.number().nullable(),
  porcEst: z.number().nullable(),
})

export const ProjectsSchema = z.array(ProjectSchema)
