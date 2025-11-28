import { z } from 'zod'

import {
  PeriodProjectSchema,
  PeriodProjectsSchema,
  StepSchema,
  StepsSchema,
} from '@/schema/config-schema'
import type { Entidad, Entidades } from './catalog'
import type { Project, Projects } from './project'

export type Step = z.infer<typeof StepSchema>

export type Steps = z.infer<typeof StepsSchema>

type Toolbar = {
  toolbar: object
}

type CustomToolbar = {
  modules: Toolbar
  placeholder: string
  theme: string
}

type ConfigAxios = {
  interceptor: number
}

type Loader = {
  isLoading: boolean
  classLoading: string
}

export type Accion = {
  id: number | null
  accion: string
  modulo: string | null
  clases: string | null
  icono: string | null
  orden: number | null
}

export type Acciones = Accion[]

export type StateConfig = {
  acciones: Record<number, Acciones>
  sidebar: Steps
  nickname: string
  token: null | string
  rol: null | string
  layout: string
  customToolbar: CustomToolbar
  configAxios: ConfigAxios
  iconos: object
  loader: Loader
  isFullPage: boolean
}

export type Auth = Pick<StateConfig, 'nickname' | 'acciones' | 'token' | 'rol'>

export type PeriodProject = z.infer<typeof PeriodProjectSchema>

export type PeriodProjects = z.infer<typeof PeriodProjectsSchema>

export type StateDashboard = {
  years: PeriodProjects
  entities: Record<number, Entidades>
  projects: Record<Entidad['id'], Projects>
  currentPeriod: PeriodProject
  currentEntities: Entidades
  currentProjects: Projects
  currentProject: Project
}
