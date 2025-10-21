export default {
  inicializado: false,
  vertiente: null,
  version: 0,
  anio: null,
  estatus: 1,
  id: null,
  iva: 16,
  iconos: {},
  diagnostico: {
    anio: null,
    id: null,
  },
  estructura: {
    introduccion: {
      inicializado: false,
      capturado: false,
      presupuesto: 0,
      captura: null,
    },
    antecedentes: {
      inicializado: false,
      capturado: false,
      situacion: null,
      logros: null,
      anio: null,
      pec: {
        cartografia: [],
        oficinas: [],
        personal: [],
        predios: [],
      },
      pem: {
        oficinas: [],
        personal: [],
        ingreso: null,
        acervo: [],
      },
    },
    situacion: {
      inicializado: false,
      capturado: false,
      pec: {
        tabla: null,
        totales: null,
        series: null,
      },
      pem: {
        tabla: null,
        totales: null,
        series: null,
      },
    },
    objetivo: {
      inicializado: false,
      capturado: false,
      captura: null,
    },
    desarrollo: {
      inicializado: false,
      capturado: false,
      remover: [],
      componentes: {
        pec: [],
        pem: [],
      },
      listadoOficinas: [],
      listadoComponentes: {
        pec: null,
        pem: null,
      },
      catalogos: {
        subComponentes: [],
        entregables: [],
        unidades: [],
        municipios: [],
      },
    },
    programa: {
      meses: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      inicializado: false,
      capturado: false,
    },
    resumen: {
      inicializado: false,
      capturado: false,
      calculado: false,
      distribucionV1: {
        total: { leyenda: 'Subtotales', federal: 0, estatal: 0, total: 0 },
        millar: {
          leyenda: 'Más Uno al Millar para la Fiscalización',
          federal: 0,
          estatal: null,
          total: 0,
        },
        gTotal: { leyenda: 'Total incluido Uno al Millar', federal: 0, estatal: 0, total: 0 },
        porcentaje: { leyenda: 'Porcentajes', federal: 0, estatal: 0, total: 100 },
      },
      distribucionV2: {
        total: { leyenda: 'Total', federal: 0, estatal: 0, total: 0 },
        porcentaje: { leyenda: 'Porcentajes', federal: 0, estatal: 0, total: 100 },
        millar: {
          leyenda: 'Más Uno al Millar para la Fiscalización',
          federal: 0,
          estatal: null,
          total: 0,
        },
        gTotal: { leyenda: 'Total incluido Uno al Millar', federal: 0, estatal: 0, total: 0 },
      },
      porcentaje: {
        //porcentaje para ejecución del proyecto
        federal: 60,
        estatal: 40,
        total: 100,
      },
      listado: [],
      observaciones: null,
      millar: null,
      alMillar: 1,
      porcDecimales: 8,
    },
    resultados: {
      inicializado: false,
      capturado: false,
      captura: null,
    },
    anexos: {
      inicializado: false,
      capturado: false,
    },
  },
  homologos: {
    1: { id: 8, nombre: 'Marco Jurídico' },
    2: { id: 9, nombre: 'Procesos Catastrales / Registrales' },
    3: { id: 10, nombre: 'Tecnologías de la Información' },
    4: {
      id: 15,
      nombre: 'Vinculación RPP-Catastro / Participacion y Vinculación con otros Sectores',
    },
    5: { id: 12, nombre: 'Profesionalización de la Función Catastral / Registral' },
    6: { id: 11, nombre: 'Gestión de la Calidad' },
    7: { id: 13, nombre: 'Políticas Institucionales' },
  },
}
