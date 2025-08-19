import { z } from 'zod'
import type { CatComponentsSchema } from '@/schema/component-schema'
import type { Component, Components } from './component'

type Diagnostico = {
  anio: null | number
  id: null | number
}

type Inicializado = {
  inicializado: boolean
  capturado: boolean
  captura?: null | string | number
}

type Introduccion = Inicializado & {
  presupuesto: number
}

type AntecedentePEC = {
  cartografia: object
  oficinas: object
  personal: object
  predios: object
}

type AntecedentePEM = {
  oficinas: object
  personal: object
  ingreso: null | number
  acervo: object
}

type Antecedente = Inicializado & {
  situacion: null | string
  logros: null | string
  anio: null | number
  pec: AntecedentePEC
  pem: AntecedentePEM
}

type SituacionVertiente = {
  tabla: null | string
  totales: null | string
  series: null | string
}

type Situacion = Inicializado & {
  pec: SituacionVertiente
  pem: SituacionVertiente
}

type Objetivo = Inicializado & {
  captura: null | string
}

type CatalogComponents = {
  datos: z.infer<typeof CatComponentsSchema>
}

type VertCatalogComponents = {
  pec: CatalogComponents | null
  pem: CatalogComponents | null
}

type ComponentesDesarrollo = {
  pec: Components
  pem: Components
}

type CatalogosDesarrollo = {
  subComponentes: object
  entregables: object
  unidades: object
  municipios: object
}

type Desarrollo = Inicializado & {
  remover: Component['id'][]
  componentes: ComponentesDesarrollo
  listadoOficinas: object
  listadoComponentes: VertCatalogComponents
  catalogos: CatalogosDesarrollo
}

type Programa = Inicializado & {
  meses: Array<number>
}

type Distribucion = {
  leyenda?: null | string
  federal: number
  estatal: null | number
  total: number
}

type FilasDistribucion = {
  total: Distribucion
  millar: Distribucion
  gTotal: Distribucion
  porcentaje: Distribucion
}

type Resumen = Inicializado & {
  calculado: boolean
  distribucionV1: FilasDistribucion
  distribucionV2: FilasDistribucion
  porcentaje: Distribucion
  listado: object
  observaciones: null | number
  millar: null | number
  alMillar: number
  porcDecimales: number
}

type Estructura = {
  introduccion: Introduccion
  antecedentes: Antecedente
  situacion: Situacion
  objetivo: Objetivo
  desarrollo: Desarrollo
  programa: Programa
  resumen: Resumen
  resultados: Inicializado
  anexos: Inicializado
}

export type Homologo = {
  id: number
  nombre: string
}

export type VertProject = {
  vertiente: null | number | string
}

export type StateProject = VertProject & {
  inicializado: boolean
  version: number
  anio: null | number
  estatus: number
  id: null | number
  iva: number
  iconos: object
  diagnostico: Diagnostico
  estructura: Estructura
  homologos: object
}
