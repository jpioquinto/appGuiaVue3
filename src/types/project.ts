import type { CatComponents, Component, Components } from './component'
import type { Entregables, Municipios, SubComponentes, Unidades } from './activity'
import type { ChartSerie } from './partialProps'

type Diagnostico = {
  anio: null | number
  id: null | number
}

export type Inicializado = {
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

export type SituacionVertiente = {
  tabla: null | string
  totales: null | string
  series: null | ChartSerie[]
}

type Situacion = Inicializado & {
  pec: SituacionVertiente
  pem: SituacionVertiente
}

type Objetivo = Inicializado & {
  captura: null | string
}

export type CatalogComponents = {
  datos: CatComponents
}

export type VertCatalogComponents = {
  pec: CatalogComponents | null
  pem: CatalogComponents | null
}

export type ComponentsDev = {
  pec: Components
  pem: Components
}

type CatalogosDesarrollo = {
  subComponentes: Record<Component['id'], SubComponentes>
  entregables: Record<Component['id'], Entregables>
  unidades: Unidades
  municipios: Municipios
}

type Desarrollo = Inicializado & {
  remover: Component['id'][]
  componentes: ComponentsDev
  listadoOficinas: object
  listadoComponentes: VertCatalogComponents
  catalogos: CatalogosDesarrollo
}

type Programa = Inicializado & {
  meses: Array<number>
}

export type Distribucion = {
  leyenda?: null | string
  federal: number
  estatal: null | number
  total: number
}

export type FilasDistribucion = {
  total: Distribucion
  millar: Distribucion
  gTotal: Distribucion
  porcentaje: Distribucion
}

export type Resumen = Inicializado & {
  redistribuir: boolean
  calculado: boolean
  distribucionV1: FilasDistribucion
  distribucionV2: FilasDistribucion
  porcentaje: Distribucion
  listado: CatComponents
  observaciones: null | string
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

export type TuplaHomologo = {
  id: Component['id']
  nombre: Component['nombre']
}

export type ComponentHomologo = Record<Component['id'], TuplaHomologo>

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
  homologos: ComponentHomologo
}
