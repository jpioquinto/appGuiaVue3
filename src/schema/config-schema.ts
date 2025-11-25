import { exp } from '@amcharts/amcharts5/.internal/core/util/Ease'
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

export const PeriodProjectSchema = z.object({
  anio: z.number(),
  pemc: z.number(),
  pemr: z.number(),
  pemi: z.number(),
  total: z.number(),
})

export const PeriodProjectsSchema = z.array(PeriodProjectSchema)
