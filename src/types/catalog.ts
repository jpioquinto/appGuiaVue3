import z from 'zod'

import { EntidadSchema, EntidadesSchema } from '@/schema/catalog-schema'

export type Entidad = z.infer<typeof EntidadSchema>

export type Entidades = z.infer<typeof EntidadesSchema>
