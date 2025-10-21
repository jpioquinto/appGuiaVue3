import type { Auth, StateConfig, Steps } from '@/types/config'
import { defineStore } from 'pinia'
import $axios from '@/util/axios'
import { baseURL } from '@/util'

export const useConfigStore = defineStore('config', {
  state: (): StateConfig => {
    const classLoading = (max: number = 2): string => {
      const clases: string[] = ['', 'is-bottom-to-top']
      const $posc: number = Math.floor(Math.random() * max)

      return clases[$posc] ? clases[$posc] : ''
    }
    return {
      acciones: {},
      sidebar: [] as Steps,
      nickname: 'user',
      token: localStorage.getItem('access_token') || null,
      layout: 'ContentLogin',
      customToolbar: {
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ align: [] }],
          ],
        },
        placeholder: 'Contenido aquí...',
        theme: 'snow',
      },
      configAxios: {
        interceptor: -1,
      },
      iconos: {},
      loader: {
        isLoading: false,
        classLoading: classLoading(),
      },
      isFullPage: true,
    }
  },
  getters: {
    getPasos(state: StateConfig) {
      return state.sidebar
    },
    findElementMenu(state: StateConfig) {
      return function (nombreComp: string) {
        console.log('buscando...' + nombreComp)
        const elemento = state.sidebar.find((elemento) => elemento.componente == nombreComp)
        return elemento
      }
    },
    getToken(state) {
      return state.token !== null
    },
  },
  actions: {
    asignarToken({ token, nickname, acciones }: Auth) {
      this.token = token
      this.nickname = nickname
      this.acciones = acciones
    },
    asignarLayout($layout: string) {
      this.layout = $layout
    },
    destruirToken() {
      if (this.getToken) {
        return new Promise((resolve, reject) => {
          $axios
            .post(`${baseURL()}/api/logout`)
            .then((response) => {
              localStorage.removeItem('access_token')
              this.token = null
              delete $axios.defaults.headers.common.Authorization

              resolve(response)
              /*setTimeout(function(){ location.reload(); }, 700);*/
            })
            .catch((error) => {
              localStorage.removeItem('access_token')
              this.token = null

              reject(error)
              /*setTimeout(function(){ location.reload(); }, 700);*/
            })
        })
      }
    },
    obtenerMenuLateral() {
      $axios
        .get(`${baseURL()}/api/pasos`)
        .then((response) => {
          this.sidebar = response.data
        })
        .catch(() => {
          console.log('Error al obtener el menu lateral...')
        })
    },
    habilitaInterceptor() {
      const me = this || {}
      this.configAxios.interceptor = $axios.interceptors.request.use(
        (config) => {
          me.loader.isLoading = true
          console.log(config)
          return config
        },
        (error) => {
          me.loader.isLoading = true
          return Promise.reject(error)
        },
      )

      $axios.interceptors.response.use(
        (response) => {
          me.loader.isLoading = false
          return response
        },
        function (error) {
          me.loader.isLoading = false
          return Promise.reject(error)
        },
      )
    },
    deshabilitaInterceptor() {
      $axios.interceptors.request.eject(this.configAxios.interceptor!)
    },
  },
})
