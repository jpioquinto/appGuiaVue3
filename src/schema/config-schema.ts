import { z } from 'zod'

export const StepSchema = z.object({
  id_punto: z.number(),
  punto: z.string(),
  estatus: z.number(),
  orden: z.number(),
  componente: z.string(),
  cargado: z.boolean(),
  capturado: z.boolean(),
  seleccionado: z.boolean(),
})

export const StepsSchema = z.array(StepSchema)
