import { StepSchema, StepsSchema } from '@/schema/config-schema'
import { z } from 'zod'

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

export type StateConfig = {
  acciones: object
  sidebar: Steps
  nickname: string
  token: null | string
  layout: string
  customToolbar: CustomToolbar
  configAxios: ConfigAxios
  iconos: object
  loader: Loader
  isFullPage: boolean
}

export type Auth = {
  token: string
  nickname: string
  acciones: object
}
