import { defineStore } from 'pinia'

import type { StateDashboard } from '@/types/config'
import type { Project } from '@/types/project'
import $axios from '@/util/axios'
import { baseURL } from '@/util'

export const useDashboardStore = defineStore('dashboard', {
  state: (): StateDashboard => {
    return {
      years: [],
      entities: {},
      projects: {},
      currentPeriod: { anio: 0, total: 0, pemc: 0, pemr: 0, pemi: 0 },
      currentEntities: [],
      currentProjects: [],
      currentProject: {} as Project,
    }
  },
  actions: {
    obtenerListadoAnios() {
      $axios
        .get(`${baseURL()}/api/anios-proyectos`)
        .then((response) => {
          this.years = response.data.anios
        })
        .catch(() => {
          console.log('¡Error al obtener el listado de años!')
        })
    },
    obtenerListadoEntidades(anio: number) {
      $axios
        .get(`${baseURL()}/api/entidades-proyectos/${anio}`)
        .then((response) => {
          this.entities[anio] = this.currentEntities = response.data.entidades
        })
        .catch(() => {
          console.log('¡Error al obtener el listado de años!')
        })
    },
    obtenerListadoProyectos(anio: number, edoId: number) {
      $axios
        .get(`${baseURL()}/api/listado-proyectos/${anio}/${edoId}`)
        .then((response) => {
          this.projects[anio] = this.currentProjects = response.data.proyectos
        })
        .catch(() => {
          console.log('¡Error al obtener el listado de proyectos por entidad!')
        })
    },
  },
})
